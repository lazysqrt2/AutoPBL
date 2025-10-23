# 学习平台应用

这是一个基于React和Express的学习平台应用，包含前端界面和后端API服务。

## 功能特点

- 交互式学习内容
- 实时聊天AI助手
- 章节检查点问题
- 学习进度跟踪

## 技术栈

- 前端：React, TypeScript, Tailwind CSS, shadcn/ui
- 后端：Express.js
- API集成：OpenAI/Claude API

## 开始使用

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

复制`.env.example`文件并重命名为`.env`，然后填写必要的环境变量：

```
OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1/chat/completions
PORT=3001
```

### 开发模式

```bash
# 启动前端开发服务器
npm run dev

# 在另一个终端启动后端服务器
npm run server
```

### 生产模式

```bash
# 构建前端并启动服务器
npm run start
```

## API端点

- `POST /api/chat` - 发送消息到AI助手
- `POST /api/chat/new` - 创建新的聊天会话
- `POST /api/checkpoint` - 获取章节检查点问题

## 注意事项

- 确保在生产环境中安全地管理API密钥
- 对于高流量应用，考虑添加速率限制和缓存机制