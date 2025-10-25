import requests
import os
from dotenv import load_dotenv
import json

# 加载环境变量
load_dotenv()

# 获取API密钥和URL
api_key = os.getenv("OPENAI_API_KEY")
base_url = os.getenv("OPENAI_BASE_URL")

def test_openai_api():
    """测试OpenAI API连接"""
    if not api_key:
        print("错误: 未找到OPENAI_API_KEY环境变量")
        return False
    
    print(f"使用API密钥: {api_key[:5]}...{api_key[-5:] if len(api_key) > 10 else ''}")
    print(f"使用基础URL: {base_url}")
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    data = {
        "model": "claude-3-7-sonnet-20250219",
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Hello, how are you?"}
        ]
    }
    
    try:
        print("正在发送请求到OpenAI API...")
        response = requests.post(base_url, headers=headers, json=data)
        
        print(f"响应状态码: {response.status_code}")
        
        if response.status_code == 200:
            #result = response.json()
            print(response)
            result = json.loads(response.text)
            message = result["choices"][0]["message"]["content"]
            print(f"API响应成功! 回复: {message}")
            return True
        else:
            print(f"API响应错误: {response.text}")
            return False
    
    except Exception as e:
        print(f"请求出错: {str(e)}")
        return False

def test_fastapi_endpoint():
    """测试FastAPI端点"""
    api_url = "http://localhost:8000/api/chat"
    
    data = {
        "message": "Hello, how are you?",
        "sessionId": "test-session-123"
    }
    
    try:
        print(f"正在发送请求到FastAPI端点: {api_url}")
        response = requests.post(api_url, json=data)
        
        print(f"响应状态码: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"FastAPI响应成功! 回复: {result}")
            return True
        else:
            print(f"FastAPI响应错误: {response.text}")
            return False
    
    except Exception as e:
        print(f"请求出错: {str(e)}")
        return False

if __name__ == "__main__":
    print("=== 测试OpenAI API连接 ===")
    openai_success = test_openai_api()
    
    print("\n=== 测试FastAPI端点 ===")
    fastapi_success = test_fastapi_endpoint()
    
    print("\n=== 测试结果摘要 ===")
    print(f"OpenAI API连接: {'成功' if openai_success else '失败'}")
    print(f"FastAPI端点: {'成功' if fastapi_success else '失败'}")