import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { showError, showSuccess } from "@/utils/toast";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  title?: string;
  onNewChat?: () => void;
}

const ChatInterface = ({ title = "Chat", onNewChat }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    // 生成一个随机的会话ID
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 清空聊天历史并创建新会话
  const clearChatHistory = async () => {
    try {
      // 创建新的会话ID
      const newSessionId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      
      // 调用API通知后端创建新会话
      const response = await fetch("/api/chat/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: newSessionId }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create new chat session");
      }
      
      // 清空消息历史
      setMessages([]);
      // 更新会话ID
      setSessionId(newSessionId);
      showSuccess("New chat session started");
      
      // 如果有父组件的回调，则调用
      if (onNewChat) {
        onNewChat();
      }
    } catch (error) {
      console.error("Error creating new chat session:", error);
      showError("Failed to create new chat session. Please try again.");
    }
  };

  // 发送消息到API并处理响应
  const sendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // 创建用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };
    
    // 添加用户消息到聊天记录
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      // 调用API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          message: userMessage.content,
          sessionId: sessionId // 发送会话ID以便后端关联对话
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get response");
      }
      
      const data = await response.json();
      
      // 添加AI回复到聊天记录
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: data.response || "Sorry, I couldn't process your request.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      showError("Failed to get response. Please try again.");
      
      // 添加错误消息
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Sorry, there was an error processing your request. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理按Enter键发送消息
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {title && (
        <div className="text-blue-500 font-medium mb-2">{title}</div>
      )}
      
      {/* 消息历史区域 */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">
            Ask a question about text vectorization or spam classification.
          </div>
        ) : (
          messages.map((message) => (
            <Card 
              key={message.id} 
              className={`p-3 ${message.isUser ? 'bg-blue-50' : 'bg-white'}`}
            >
              <div className="text-sm">
                {message.content}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </Card>
          ))
        )}
        
        {isLoading && (
          <div className="flex items-center text-gray-500 text-sm">
            <Loader2 className="animate-spin mr-2" size={16} />
            Generating response...
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* 输入区域 */}
      <div className="relative">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Input your question..."
          className="pr-12"
        />
        <Button 
          className="absolute right-1 top-1 bg-blue-500 hover:bg-blue-600 h-8 px-3"
          onClick={sendMessage}
          disabled={isLoading || !inputValue.trim()}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatInterface;