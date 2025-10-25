# 学习平台应用

这是一个基于React和FastAPI的学习平台应用，包含前端界面和后端API服务。

## 功能特点

- 交互式学习内容
- 实时聊天AI助手
- 章节检查点问题
- 学习进度跟踪

## 项目结构

```
/
├── src/                # 前端源代码
│   ├── components/     # React组件
│   ├── pages/          # 页面组件
│   ├── hooks/          # React钩子
│   └── utils/          # 工具函数
├── backend/            # FastAPI后端代码
│   ├── main.py         # 主应用入口
│   └── requirements.txt # Python依赖
├── public/             # 静态资源
└── dist/               # 构建输出目录
```

## 技术栈

### 前端
- React 18
- TypeScript
- Tailwind CSS
- shadcn/ui 组件库
- React Router
- React Query

### 后端
- FastAPI
- Uvicorn
- HTTPX
- Python 3.11+

## 开始使用

### 前端开发

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```
前端开发服务器将在 http://localhost:8080 运行。

3. 构建前端：
```bash
npm run build
```

### 后端开发

1. 进入后端目录：
```bash
cd backend
```

2. 安装Python依赖：
```bash
pip install -r requirements.txt
```

3. 配置环境变量：
   复制`.env.example`文件并重命名为`.env`，然后填写必要的环境变量。

4. 启动后端服务器：
```bash
uvicorn main:app --reload
```
后端服务器将在 http://localhost:8000 运行。

## API端点

- `POST /api/chat` - 发送消息到AI助手
- `POST /api/chat/new` - 创建新的聊天会话
- `POST /api/checkpoint` - 获取章节检查点问题

## API文档

启动后端服务器后，可以在以下地址访问自动生成的API文档：
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## 部署

### 使用Docker部署后端

```bash
cd backend
docker build -t learning-platform-backend .
docker run -p 8000:8000 --env-file .env learning-platform-backend
```

### 前后端集成部署

1. 构建前端：`npm run build`
2. 将构建输出（`dist`目录）复制到后端目录
3. 启动后端服务器，它将同时提供API和前端静态文件