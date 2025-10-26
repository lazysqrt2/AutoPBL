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

interface Option {
  id: string;
  text: string;
}

interface CheckpointQuestion {
  question: string;
  options: Option[];
  correctAnswerId: string;
}

interface AutoMessage {
  id: string;
  content: string;
}

interface ChatInterfaceProps {
  title?: string;
  onNewChat?: () => void;
  apiEndpoint?: string;
  currentSection?: string;
  sectionContent?: string;
  lastCheckpointQuestion?: CheckpointQuestion;
  userChoices?: Record<string, any>;
  sessionId?: string;
  autoMessages?: AutoMessage[];
  onAutoMessageProcessed?: (messageId: string) => void;
}

const ChatInterface = ({ 
  title = "Chat", 
  onNewChat, 
  apiEndpoint = "/api/chat",
  currentSection,
  sectionContent,
  lastCheckpointQuestion,
  userChoices = {},
  sessionId: propSessionId,
  autoMessages = [],
  onAutoMessageProcessed
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(() => {
    // 使用props中的sessionId，如果没有则生成一个新的
    return propSessionId || Date.now().toString() + Math.random().toString(36).substring(2, 9);
  });
  const [apiStatus, setApiStatus] = useState<"unknown" | "connected" | "error">("unknown");
  const [processingAutoMessage, setProcessingAutoMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 当props中的sessionId变化时，更新本地的sessionId
  useEffect(() => {
    if (propSessionId) {
      setSessionId(propSessionId);
    }
  }, [propSessionId]);

  // 自动滚动到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 检查API连接状态
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const response = await fetch("/api/health");
        if (response.ok) {
          setApiStatus("connected");
          console.log("API connection successful");
        } else {
          setApiStatus("error");
          console.error("API health check failed:", await response.text());
        }
      } catch (error) {
        setApiStatus("error");
        console.error("API connection error:", error);
      }
    };

    checkApiConnection();
  }, []);

  // 处理自动消息
  useEffect(() => {
    const processAutoMessages = async () => {
      if (autoMessages.length > 0 && !isLoading && !processingAutoMessage) {
        setProcessingAutoMessage(true);
        const nextMessage = autoMessages[0];
        
        // 发送自动消息
        await sendMessageToAPI(nextMessage.content);
        
        // 通知父组件消息已处理
        if (onAutoMessageProcessed) {
          onAutoMessageProcessed(nextMessage.id);
        }
        
        setProcessingAutoMessage(false);
      }
    };
    
    processAutoMessages();
  }, [autoMessages, isLoading, processingAutoMessage]);

  // 清空聊天历史并创建新会话
  const clearChatHistory = async () => {
    try {
      // 创建新的会话ID，如果props中没有提供的话
      const newSessionId = propSessionId || Date.now().toString() + Math.random().toString(36).substring(2, 9);
      
      try {
        // 调用API通知后端创建新会话
        const response = await fetch(`${apiEndpoint}/new`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId: newSessionId }),
        });
        
        if (!response.ok) {
          console.warn("API call to create new session failed, continuing with local session");
          console.warn("Status:", response.status);
          console.warn("Response:", await response.text());
        } else {
          console.log("New session created successfully");
        }
      } catch (error) {
        console.warn("Error calling API to create new session:", error);
        // 继续使用本地会话ID
      }
      
      // 清空消息历史
      setMessages([]);
      // 更新会话ID（如果props中没有提供的话）
      if (!propSessionId) {
        setSessionId(newSessionId);
      }
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

  // 发送消息到API
  const sendMessageToAPI = async (content: string) => {
    try {
      console.log(`Sending message to ${apiEndpoint}:`, content);
      
      // 准备发送到API的数据，包括上下文信息
      const requestData = {
        message: content,
        sessionId: sessionId,
        currentSection: currentSection || "",
        sectionContent: sectionContent || "",
        lastCheckpointQuestion: lastCheckpointQuestion || null,
        userChoices: userChoices
      };
      
      console.log("Sending context data:", JSON.stringify(requestData, null, 2));
      
      // 调用API
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      
      console.log("API response status:", response.status);
      
      let responseText: string;
      
      if (response.ok) {
        const data = await response.json();
        console.log("API response data:", data);
        responseText = data.response || "I'm not sure how to respond to that.";
        setApiStatus("connected"); // 更新API状态为已连接
      } else {
        const errorData = await response.text();
        console.warn("API call failed with status", response.status, "and data:", errorData);
        // 如果API调用失败，使用本地回退逻辑
        responseText = generateFallbackResponse(content);
        setApiStatus("error"); // 更新API状态为错误
        showError(`API error: ${response.status}. Using fallback response.`);
      }
      
      // 添加AI回复到聊天记录
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: responseText,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      return responseText;
    } catch (error) {
      console.error("Error sending message:", error);
      showError("Failed to send message. Please check your connection and try again.");
      
      // 使用本地回退逻辑
      const fallbackResponse = generateFallbackResponse(content);
      
      // 添加回退回复
      const fallbackMessage: Message = {
        id: Date.now().toString(),
        content: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      setApiStatus("error"); // 更新API状态为错误
      return fallbackResponse;
    }
  };

  // 发送消息
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
    const userContent = inputValue;
    setInputValue("");
    setIsLoading(true);
    
    try {
      await sendMessageToAPI(userContent);
    } finally {
      setIsLoading(false);
    }
  };

  // 本地回退响应生成器
  const generateFallbackResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // 如果消息包含检查点问题的错误答案
    if (message.includes('answered a checkpoint question incorrectly') || 
        message.includes('why my answer was wrong')) {
      return "I see you're having trouble with a checkpoint question. Let me help you understand the concept better. The key is to focus on the core principles discussed in this section. Would you like me to explain the specific topic in more detail?";
    }
    
    // 如果有当前章节信息，使用它来生成更相关的回复
    if (currentSection) {
      if (currentSection.startsWith("1")) {
        return "I'm here to help you understand the basics of spam classification. This section introduces the project background and key concepts. What specific part would you like me to explain further?";
      } else if (currentSection.startsWith("2")) {
        return "This section covers data processing for spam classification. We need to clean and prepare text data before we can use it for machine learning. Would you like to know more about specific preprocessing steps?";
      } else if (currentSection.startsWith("3")) {
        return "Text vectorization is crucial for converting text into a format that machine learning algorithms can understand. The three main techniques we cover are Bag of Words, TF-IDF, and Word Embeddings. Which one would you like to explore further?";
      } else if (currentSection.startsWith("4")) {
        return "In this section, we're looking at building and training machine learning models for spam classification. Naive Bayes is particularly effective for text classification. What aspect of model training would you like to discuss?";
      }
    }
    
    // 通用回复
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! How can I help you with your spam classification project today?";
    }
    
    if (message.includes('vector') || message.includes('vectorization')) {
      return "Text vectorization is the process of converting text into numerical vectors that machine learning algorithms can understand. The three main techniques are Bag of Words, TF-IDF, and Word Embeddings.";
    }
    
    if (message.includes('preprocessing') || message.includes('data processing')) {
      return "Text preprocessing involves cleaning and normalizing text data through steps like lowercasing, tokenization, removing punctuation and stop words, and stemming/lemmatization.";
    }
    
    if (message.includes('model') || message.includes('algorithm')) {
      return "For spam classification, common algorithms include Naive Bayes, SVM, Logistic Regression, Random Forest, and Neural Networks. Naive Bayes is particularly effective for text classification.";
    }
    
    return "I'm here to help you learn about spam classification. Feel free to ask about text preprocessing, vectorization techniques, or machine learning models!";
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
      <div className="flex justify-between items-center mb-2">
        <div className="text-blue-500 font-medium">{title}</div>
        <div className={`text-xs px-2 py-1 rounded-full ${
          apiStatus === "connected" ? "bg-green-100 text-green-700" : 
          apiStatus === "error" ? "bg-red-100 text-red-700" : 
          "bg-gray-100 text-gray-700"
        }`}>
          {apiStatus === "connected" ? "API Connected" : 
           apiStatus === "error" ? "API Error" : 
           "API Status Unknown"}
        </div>
      </div>
      
      {/* 消息历史区域 */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">
            Ask a question about text vectorization or spam classification.
            {currentSection && (
              <p className="mt-2 text-xs text-blue-500">
                Currently viewing: Section {currentSection}
              </p>
            )}
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
        
        {(isLoading || processingAutoMessage) && (
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
          disabled={isLoading || processingAutoMessage}
        />
        <Button 
          className="absolute right-1 top-1 bg-blue-500 hover:bg-blue-600 h-8 px-3"
          onClick={sendMessage}
          disabled={isLoading || processingAutoMessage || !inputValue.trim()}
        >
          Send
        </Button>
      </div>
      
      {/* 新会话按钮 */}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={clearChatHistory}
        className="mt-2"
        disabled={isLoading || processingAutoMessage}
      >
        New Chat
      </Button>
    </div>
  );
};

export default ChatInterface;