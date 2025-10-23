// pages/api/chat.ts

export const config = {
  runtime: 'edge', // 推荐使用 Edge Runtime 以获得更快的响应速度
};

// 在chat.ts文件中或创建一个新的test.ts文件
export function GET(req: Request) {
  return new Response(JSON.stringify({ status: 'API is working' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default async function handler(req: Request) {
  // 1. 检查请求方法是否为 POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // 2. 解析从前端发来的请求体
    const { message, sessionId } = await req.json();

    // 验证消息内容是否存在
    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. 从环境变量中安全地获取 API Key 和中转站地址
    // 这是至关重要的一步，永远不要将 API Key 硬编码在代码中！
    const apiKey = process.env.OPENAI_API_KEY;
    const baseUrl = process.env.OPENAI_BASE_URL; // 这里就是你的中转站地址

    if (!apiKey || !baseUrl) {
      console.error("Server configuration error: API Key or Base URL is missing.");
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 4. 构造发送给中转站 API 的请求体 (遵循 OpenAI 格式)
    const apiRequestBody = {
      model: "claude-3-7-sonnet-20250219", // 或者你中转站支持的其他模型
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
      ],
      // 如果你的中转站支持，可以添加 stream: true 来实现流式响应
    };

    // 5. 调用中转站 API
    const apiResponse = await fetch(baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(apiRequestBody),
    });

    // 6. 处理中转站的响应
    if (!apiResponse.ok) {
      // 如果中转站返回错误，将错误信息传递给前端（或记录日志）
      const errorBody = await apiResponse.text();
      console.error("API call failed:", errorBody);
      return new Response(JSON.stringify({ error: 'Failed to get response from AI service.' }), {
        status: apiResponse.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = await apiResponse.json();
    const aiMessage = data.choices[0]?.message?.content || "Sorry, I could not get a response.";

    // 7. 将 AI 的回复格式化成前端需要的格式并返回
    return new Response(JSON.stringify({ response: aiMessage }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}