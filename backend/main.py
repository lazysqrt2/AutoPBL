from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import httpx
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import json
from typing import Optional, Dict, Any, List
import uvicorn
from datetime import datetime

# 加载环境变量
load_dotenv()

app = FastAPI(title="Learning Platform API")

# 配置CORS - 确保允许前端域名
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080", "*"],  # 允许前端开发服务器的域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 定义请求模型
class ChatMessage(BaseModel):
    message: str
    sessionId: Optional[str] = None
    currentSection: Optional[str] = None
    sectionContent: Optional[str] = None
    lastCheckpointQuestion: Optional[Dict[str, Any]] = None
    userChoices: Optional[Dict[str, Any]] = {}

class SessionRequest(BaseModel):
    sessionId: str

class CheckpointRequest(BaseModel):
    sectionId: str

class SummaryRequest(BaseModel):
    sessionId: str
    sectionId: str
    sectionContent: str
    checkpointQuestion: Dict[str, Any]
    userAnswer: Optional[str] = None
    isCorrect: Optional[bool] = None

# 存储会话历史的字典
# 格式: {session_id: [{"role": "user", "content": "..."}, {"role": "assistant", "content": "..."}]}
session_histories = {}

# 存储章节总结的字典
# 格式: {session_id: {section_id: "summary text"}}
section_summaries = {}

# 聊天API路由
@app.post("/api/chat")
async def chat(request: ChatMessage):
    if not request.message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    # 从环境变量获取API密钥和URL
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1/chat/completions")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="Server configuration error: API Key is missing")
    
    # 获取会话ID，如果没有则创建一个新的
    session_id = request.sessionId or f"session_{datetime.now().timestamp()}"
    
    # 获取当前会话的历史记录，如果没有则创建一个新的
    if session_id not in session_histories:
        session_histories[session_id] = []
    
    # 打印调试信息
    print(f"Using API Key: {api_key[:5]}...{api_key[-5:] if len(api_key) > 10 else ''}")
    print(f"Using Base URL: {base_url}")
    print(f"Received message: {request.message}")
    print(f"Current Section: {request.currentSection}")
    print(f"User Choices: {request.userChoices}")
    print(f"Session ID: {session_id}")
    print(f"Current session history length: {len(session_histories[session_id])}")
    
    # 构建系统提示，包含当前章节内容和上下文
    system_content = "You are an expert in project-based learning. You specialize in teaching AI and deep learning through projects. "
    
    # 添加当前章节信息
    if request.currentSection and request.sectionContent:
        system_content += f"\nCurrent section: {request.currentSection}\n"
        system_content += f"Section content: {request.sectionContent}\n"
    
    # 添加章节总结（如果有）
    if session_id in section_summaries and request.currentSection in section_summaries.get(session_id, {}):
        system_content += f"\nSection summary: {section_summaries[session_id][request.currentSection]}\n"
    
    # 添加最近的检查点问题
    if request.lastCheckpointQuestion:
        question = request.lastCheckpointQuestion.get("question", "")
        options = request.lastCheckpointQuestion.get("options", [])
        correct_answer_id = request.lastCheckpointQuestion.get("correctAnswerId", "")
        
        if question and options and correct_answer_id:
            system_content += "\nRecent checkpoint question:\n"
            system_content += f"Question: {question}\n"
            system_content += "Options:\n"
            
            for option in options:
                option_id = option.get("id", "")
                option_text = option.get("text", "")
                if option_id and option_text:
                    is_correct = option_id == correct_answer_id
                    system_content += f"- {option_id}: {option_text} {'(correct)' if is_correct else ''}\n"
    
    # 添加用户之前的选择
    if request.userChoices and len(request.userChoices) > 0:
        system_content += "\nUser's previous choices:\n"
        for key, value in request.userChoices.items():
            system_content += f"- {key}: {value}\n"
    
    # 添加指导要求
    system_content += """
Task: The learner wants to discuss some content in the tutorial with you. You will be given the framework of the tutorial, 
a summary of the learner's current progress, and the content they have questions about.

Requirements:
1. Be engaging, helpful, and ready to answer questions as long as they relate to the tutorial. Do not give away 
   the full answer to a complex question right away. Guide the learner to think first. Progressively provide more 
   assistance if the learner has trouble figuring out the problem on their own.
2. If the learner deviates too much from the tutorial, remind them to stay on track.
3. Encourage the learner when needed, such as when they have trouble fixing a bug.
4. All math formulas should be written in LaTex format and surrounded by dollar signs ($ or $$).
5. All hyperlinks should be written in markdown format like this: [link text](link URL).
6. Reference the current section content and checkpoint questions when relevant to provide more personalized help.
7. If the user asks about their previous choices or answers, provide helpful feedback based on that information.
8. Remember the conversation history and refer back to previous questions and answers when appropriate.
9. If there's a section summary available, use it to provide more targeted and relevant responses.
"""
    
    # 添加用户消息到会话历史
    session_histories[session_id].append({"role": "user", "content": request.message})
    
    # 构造请求体，包含系统提示和会话历史
    messages = [{"role": "system", "content": system_content}]
    
    # 添加历史消息，但限制数量以避免超过API限制
    # 保留最近的10条消息
    history_limit = 10
    recent_history = session_histories[session_id][-history_limit:] if len(session_histories[session_id]) > history_limit else session_histories[session_id]
    messages.extend(recent_history)
    
    api_request_body = {
        "model": "gpt-3.5-turbo",  # 或者其他支持的模型
        "messages": messages
    }
    
    try:
        # 调用API
        async with httpx.AsyncClient() as client:
            print(f"Sending request to: {base_url}")
            print(f"System content: {system_content}")
            print(f"Total messages sent: {len(messages)}")
            response = await client.post(
                base_url,
                json=api_request_body,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                },
                timeout=30.0  # 设置超时时间
            )
            
            print(f"Response status: {response.status_code}")
            
            response.raise_for_status()  # 如果响应状态码不是2xx，则抛出异常
            
            data = response.json()
            print(f"Response data: {data}")
            
            ai_message = data["choices"][0]["message"]["content"] if "choices" in data and len(data["choices"]) > 0 else "Sorry, I could not get a response."
            
            # 添加AI回复到会话历史
            session_histories[session_id].append({"role": "assistant", "content": ai_message})
            
            return {"response": ai_message}
    
    except httpx.HTTPStatusError as e:
        print(f"HTTP Status Error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"API call failed: {e.response.text}")
    except httpx.RequestError as e:
        print(f"Request Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"API call failed: {str(e)}")
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# 新建聊天会话API
@app.post("/api/chat/new")
async def new_chat(request: SessionRequest):
    if not request.sessionId:
        raise HTTPException(status_code=400, detail="Session ID is required")
    
    # 清除会话历史
    if request.sessionId in session_histories:
        session_histories[request.sessionId] = []
    
    print(f"Creating new chat session with ID: {request.sessionId}")
    
    return {
        "success": True,
        "sessionId": request.sessionId,
        "message": "New chat session created successfully"
    }

# 获取会话历史API
@app.get("/api/chat/history/{session_id}")
async def get_chat_history(session_id: str):
    if session_id not in session_histories:
        return {"messages": []}
    
    return {"messages": session_histories[session_id]}

# 检查点问题API
@app.post("/api/checkpoint")
async def checkpoint(request: CheckpointRequest):
    if not request.sectionId:
        raise HTTPException(status_code=400, detail="Section ID is required")
    
    # 获取对应章节的问题
    question_data = get_question_for_section(request.sectionId)
    
    return question_data

# 章节总结API
@app.post("/api/summary")
async def create_summary(request: SummaryRequest):
    if not request.sessionId or not request.sectionId or not request.sectionContent or not request.checkpointQuestion:
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    # 从环境变量获取API密钥和URL
    api_key = os.getenv("OPENAI_API_KEY")
    base_url = os.getenv("OPENAI_BASE_URL", "https://api.openai.com/v1/chat/completions")
    
    if not api_key:
        raise HTTPException(status_code=500, detail="Server configuration error: API Key is missing")
    
    # 构建提示，要求AI总结章节内容和检查点问题
    prompt = f"""
Please summarize the following section content and checkpoint question. 
This summary will be used to provide context for future conversations with the user.

Section ID: {request.sectionId}

Section Content:
{request.sectionContent}

Checkpoint Question:
{request.checkpointQuestion['question']}

Options:
"""
    
    for option in request.checkpointQuestion['options']:
        is_correct = option['id'] == request.checkpointQuestion['correctAnswerId']
        prompt += f"- {option['id']}: {option['text']} {'(correct)' if is_correct else ''}\n"
    
    if request.userAnswer:
        prompt += f"\nUser's answer: {request.userAnswer}\n"
        if request.isCorrect is not None:
            prompt += f"User's answer was {'correct' if request.isCorrect else 'incorrect'}.\n"
    
    prompt += """
Please provide a concise summary (around 3-5 sentences) that captures:
1. The key concepts from the section
2. The main point of the checkpoint question
3. How the checkpoint question relates to the section content

The summary should be informative enough to provide context for future discussions, but brief enough to be easily referenced.
"""
    
    # 构造请求体
    api_request_body = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "system", "content": "You are an expert educational content summarizer."},
            {"role": "user", "content": prompt}
        ]
    }
    
    try:
        # 调用API
        async with httpx.AsyncClient() as client:
            response = await client.post(
                base_url,
                json=api_request_body,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                },
                timeout=30.0
            )
            
            response.raise_for_status()
            
            data = response.json()
            summary = data["choices"][0]["message"]["content"] if "choices" in data and len(data["choices"]) > 0 else "No summary available."
            
            # 存储总结
            if request.sessionId not in section_summaries:
                section_summaries[request.sessionId] = {}
            
            section_summaries[request.sessionId][request.sectionId] = summary
            
            # 将总结作为系统消息添加到会话历史中
            if request.sessionId not in session_histories:
                session_histories[request.sessionId] = []
            
            system_message = {
                "role": "system", 
                "content": f"Section {request.sectionId} Summary: {summary}"
            }
            
            # 添加系统消息到会话历史
            session_histories[request.sessionId].append(system_message)
            
            return {
                "success": True,
                "summary": summary,
                "message": f"Summary created for section {request.sectionId}"
            }
    
    except httpx.HTTPStatusError as e:
        print(f"HTTP Status Error: {e.response.status_code} - {e.response.text}")
        raise HTTPException(status_code=e.response.status_code, detail=f"API call failed: {e.response.text}")
    except httpx.RequestError as e:
        print(f"Request Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"API call failed: {str(e)}")
    except Exception as e:
        print(f"Unexpected Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

# 获取章节问题的辅助函数
def get_question_for_section(section_id: str) -> Dict[str, Any]:
    # 预定义的问题库
    questions = {
        "1.1": {
            "question": "What is the main purpose of spam classification in the context of this project?",
            "options": [
                {"id": "a", "text": "To categorize emails by their sender"},
                {"id": "b", "text": "To filter unwanted messages from legitimate ones"},
                {"id": "c", "text": "To analyze the writing style of different authors"},
                {"id": "d", "text": "To compress text data for efficient storage"}
            ],
            "correctAnswerId": "b"
        },
        "1.2": {
            "question": "Which of the following is NOT one of the key steps in the spam classification process?",
            "options": [
                {"id": "a", "text": "Data Collection"},
                {"id": "b", "text": "Text Preprocessing"},
                {"id": "c", "text": "Feature Extraction"},
                {"id": "d", "text": "Image Recognition"}
            ],
            "correctAnswerId": "d"
        },
        "1.3": {
            "question": "By the end of this project, what will you have built?",
            "options": [
                {"id": "a", "text": "A language translation system"},
                {"id": "b", "text": "A spam classification system"},
                {"id": "c", "text": "A text summarization tool"},
                {"id": "d", "text": "A sentiment analysis model"}
            ],
            "correctAnswerId": "b"
        },
        "2.1": {
            "question": "Why is data processing crucial in an NLP pipeline?",
            "options": [
                {"id": "a", "text": "It makes the text more readable for humans"},
                {"id": "b", "text": "It prepares text data for machine learning algorithms"},
                {"id": "c", "text": "It increases the size of the dataset"},
                {"id": "d", "text": "It translates text into different languages"}
            ],
            "correctAnswerId": "b"
        },
        "2.2": {
            "question": "Which of the following is a characteristic of spam messages based on the sample data?",
            "options": [
                {"id": "a", "text": "They are always written in all caps"},
                {"id": "b", "text": "They often contain personal information"},
                {"id": "c", "text": "They frequently mention urgency or offers"},
                {"id": "d", "text": "They are always shorter than ham messages"}
            ],
            "correctAnswerId": "c"
        },
        "2.3": {
            "question": "Which of the following is NOT a typical text preprocessing step?",
            "options": [
                {"id": "a", "text": "Lowercasing"},
                {"id": "b", "text": "Tokenization"},
                {"id": "c", "text": "Encryption"},
                {"id": "d", "text": "Removing Stop Words"}
            ],
            "correctAnswerId": "c"
        },
        "3.1": {
            "question": "Why is text vectorization necessary in NLP?",
            "options": [
                {"id": "a", "text": "To make text more readable"},
                {"id": "b", "text": "To convert text into a format that machine learning algorithms can understand"},
                {"id": "c", "text": "To reduce the size of the text data"},
                {"id": "d", "text": "To translate text into different languages"}
            ],
            "correctAnswerId": "b"
        },
        "3.2": {
            "question": "Which of the following is NOT one of the three main text vectorization techniques discussed?",
            "options": [
                {"id": "a", "text": "Bag of Words (BOW)"},
                {"id": "b", "text": "TF-IDF"},
                {"id": "c", "text": "Word Embeddings"},
                {"id": "d", "text": "Binary Encoding"}
            ],
            "correctAnswerId": "d"
        },
        "3.3": {
            "question": "What does the Bag of Words model disregard when representing text?",
            "options": [
                {"id": "a", "text": "Word frequency"},
                {"id": "b", "text": "Grammar and word order"},
                {"id": "c", "text": "The presence of words"},
                {"id": "d", "text": "All of the above"}
            ],
            "correctAnswerId": "b"
        },
        "4.1": {
            "question": "Which of the following algorithms is particularly effective for text classification?",
            "options": [
                {"id": "a", "text": "K-means clustering"},
                {"id": "b", "text": "Principal Component Analysis (PCA)"},
                {"id": "c", "text": "Naive Bayes"},
                {"id": "d", "text": "Linear Regression"}
            ],
            "correctAnswerId": "c"
        },
        "4.2": {
            "question": "Which of the following is NOT a common metric for evaluating classification models?",
            "options": [
                {"id": "a", "text": "Accuracy"},
                {"id": "b", "text": "Precision"},
                {"id": "c", "text": "Mean Squared Error (MSE)"},
                {"id": "d", "text": "F1-score"}
            ],
            "correctAnswerId": "c"
        }
    }
    
    # 如果找不到对应章节的问题，返回默认问题
    if section_id not in questions:
        return {
            "question": "What are the three main text vectorization techniques discussed in this course?",
            "options": [
                {"id": "a", "text": "Bag of Words, TF-IDF, Word Embeddings"},
                {"id": "b", "text": "Word2Vec, GloVe, FastText"},
                {"id": "c", "text": "Tokenization, Stemming, Lemmatization"},
                {"id": "d", "text": "CNN, RNN, Transformer"}
            ],
            "correctAnswerId": "a"
        }
    
    return questions[section_id]

# 添加健康检查端点
@app.get("/api/health")
async def health_check():
    return {"status": "ok", "message": "API is running"}

# 配置静态文件服务（前端构建文件）
@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # 如果请求的是API路径，则不处理
    if full_path.startswith("api/"):
        raise HTTPException(status_code=404, detail="Not Found")
    
    # 尝试提供请求的文件
    file_path = os.path.join("dist", full_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    
    # 如果文件不存在，返回index.html（用于SPA路由）
    return FileResponse("dist/index.html")

# 主入口点
if __name__ == "__main__":
    # 获取端口，默认为8000
    port = int(os.getenv("PORT", 8000))
    
    # 启动服务器
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)