# 学习平台应用

这是一个基于React和FastAPI的学习平台应用，包含前端界面和后端API服务。

## 功能特点

- 交互式学习内容
- 实时聊天AI助手
- 章节检查点问题
- 学习进度跟踪

## 技术栈

- 前端：React, TypeScript, Tailwind CSS, shadcn/ui
- 后端：FastAPI (Python)
- API集成：OpenAI/Claude API

## 项目结构

```
/
├── src/                # 前端源代码
├── backend/            # FastAPI后端代码
├── public/             # 静态资源
└── dist/               # 构建输出目录
```

## 开始使用

### 前端

#### 环境要求

- Node.js 16+
- npm 或 yarn

#### 安装依赖

```bash
npm install
```

#### 开发模式

```bash
npm run dev
```

#### 构建前端

```bash
npm run build
```

### 后端

#### 环境要求

- Python 3.11+
- pip

#### 安装依赖

```bash
cd backend
pip install -r requirements.txt
```

#### 配置环境变量

复制`backend/.env.example`文件并重命名为`.env`，然后填写必要的环境变量：

```
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1/chat/completions
PORT=8000
```

#### 启动后端服务器

```bash
cd backend
uvicorn main:app --reload
```

## API端点

- `POST /api/chat` - 发送消息到AI助手
- `POST /api/chat/new` - 创建新的聊天会话
- `POST /api/checkpoint` - 获取章节检查点问题

## 部署

### 使用Docker（后端）

```bash
cd backend
docker build -t learning-platform-backend .
docker run -p 8000:8000 --env-file .env learning-platform-backend
```

### 前后端集成部署

1. 构建前端：`npm run build`
2. 将构建输出（`dist`目录）复制到后端的静态文件目录
3. 启动后端服务器，它将同时提供API和前端静态文件

## 注意事项

- 确保在生产环境中安全地管理API密钥
- 对于高流量应用，考虑添加速率限制和缓存机制