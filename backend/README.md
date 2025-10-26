# 学习平台后端 API

这是一个基于FastAPI的后端服务，为学习平台提供API支持。

## 功能

- 聊天API集成（与OpenAI/Claude API通信）
- 会话管理
- 章节检查点问题API

## 技术栈

- FastAPI
- Uvicorn
- HTTPX
- Python 3.11+

## 开始使用

### 环境要求

- Python 3.11+
- pip

### 安装依赖

```bash
pip install -r requirements.txt
```

### 配置环境变量

复制 `.env.example`文件并重命名为 `.env`，然后填写必要的环境变量：

```
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1/chat/completions
PORT=8000
```

### 启动服务器

```bash
python main.py
```

服务器将在 http://localhost:8000 上运行。

## API端点

- `POST /api/chat` - 发送消息到AI助手
- `POST /api/chat/new` - 创建新的聊天会话
- `POST /api/checkpoint` - 获取章节检查点问题
