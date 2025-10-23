require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use(express.static(path.join(__dirname, 'dist')));

// 聊天API路由
app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 从环境变量获取API密钥和URL
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1/chat/completions';

    if (!apiKey) {
      console.error("Server configuration error: API Key is missing.");
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // 构造请求体
    const apiRequestBody = {
      model: "gpt-3.5-turbo", // 或者其他支持的模型
      messages: [
        { 
          role: "system", 
          content: "You are an expert in project-based learning. You specialize in teaching AI and deep learning through projects. " +
                   "Task: The learner wants to discuss some content in the tutorial with you. You will be given the framework of the tutorial, " +
                   "a summary of the learner's current progress, and the content they have questions about. " +
                   "Requirements: " +
                   "1. Be engaging, helpful, and ready to answer questions as long as they relate to the tutorial. Do not give away " +
                   "the full answer to a complex question right away. Guide the learner to think first. Progressively provide more " +
                   "assistance if the learner has trouble figuring out the problem on their own. " +
                   "2. If the learner deviates too much from the tutorial, remind them to stay on track. " +
                   "3. Encourage the learner when needed, such as when they have trouble fixing a bug. " +
                   "4. All math formulas should be written in LaTex format and surrounded by dollar signs ($ or $$). " +
                   "5. All hyperlinks should be written in markdown format like this: [link text](link URL)."
        },
        { role: "user", content: message }
      ]
    };

    // 调用API
    const apiResponse = await axios.post(baseUrl, apiRequestBody, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    // 处理响应
    const aiMessage = apiResponse.data.choices[0]?.message?.content || "Sorry, I could not get a response.";
    
    // 返回响应
    res.json({ response: aiMessage });

  } catch (error) {
    console.error("API调用错误:", error.response?.data || error.message);
    res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.response?.data || error.message
    });
  }
});

// 新建聊天会话API
app.post('/api/chat/new', (req, res) => {
  const { sessionId } = req.body;
  
  if (!sessionId) {
    return res.status(400).json({ error: 'Session ID is required' });
  }
  
  // 这里可以添加会话管理逻辑，例如在数据库中创建新会话
  console.log(`Creating new chat session with ID: ${sessionId}`);
  
  res.json({ 
    success: true,
    sessionId,
    message: "New chat session created successfully" 
  });
});

// 检查点问题API
app.post('/api/checkpoint', (req, res) => {
  const { sectionId } = req.body;
  
  if (!sectionId) {
    return res.status(400).json({ error: 'Section ID is required' });
  }
  
  // 获取对应章节的问题
  const questionData = getQuestionForSection(sectionId);
  
  res.json(questionData);
});

// 获取章节问题的辅助函数
function getQuestionForSection(sectionId) {
  // 预定义的问题库
  const questions = {
    "1.1": {
      question: "What is the main purpose of spam classification in the context of this project?",
      options: [
        { id: "a", text: "To categorize emails by their sender" },
        { id: "b", text: "To filter unwanted messages from legitimate ones" },
        { id: "c", text: "To analyze the writing style of different authors" },
        { id: "d", text: "To compress text data for efficient storage" }
      ],
      correctAnswerId: "b"
    },
    "1.2": {
      question: "Which of the following is NOT one of the key steps in the spam classification process?",
      options: [
        { id: "a", text: "Data Collection" },
        { id: "b", text: "Text Preprocessing" },
        { id: "c", text: "Feature Extraction" },
        { id: "d", text: "Image Recognition" }
      ],
      correctAnswerId: "d"
    },
    // ... 其他问题 ...
  };
  
  // 如果找不到对应章节的问题，返回默认问题
  if (!questions[sectionId]) {
    return {
      question: "What are the three main text vectorization techniques discussed in this course?",
      options: [
        { id: "a", text: "Bag of Words, TF-IDF, Word Embeddings" },
        { id: "b", text: "Word2Vec, GloVe, FastText" },
        { id: "c", text: "Tokenization, Stemming, Lemmatization" },
        { id: "d", text: "CNN, RNN, Transformer" }
      ],
      correctAnswerId: "a"
    };
  }
  
  return questions[sectionId];
}

// 捕获所有其他路由，返回前端应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});