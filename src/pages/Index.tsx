import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown, ChevronRight, ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import ChatInterface from "@/components/ChatInterface";
import CheckpointQuestion from "@/components/CheckpointQuestion";
import ApiStatus from "@/components/ApiStatus";
import { showError, showSuccess } from "@/utils/toast";

// 定义章节结构
interface Section {
  id: string;
  title: string;
  parent: string;
  order: number;
  content?: string;
}

// 定义检查点问题结构
interface Option {
  id: string;
  text: string;
}

interface CheckpointQuestion {
  question: string;
  options: Option[];
  correctAnswerId: string;
}

const Index = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>("vectorization");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCheck, setShowCheck] = useState(false);
  const [selectedVectorMethod, setSelectedVectorMethod] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("1.1");
  const [expandedNavSection, setExpandedNavSection] = useState<string>("1");
  const [chatKey, setChatKey] = useState<number>(0); // 用于强制重新渲染聊天组件
  const [currentSectionContent, setCurrentSectionContent] = useState<string>("");
  const [lastCheckpointQuestion, setLastCheckpointQuestion] = useState<CheckpointQuestion | null>(null);
  const [userChoices, setUserChoices] = useState<Record<string, any>>({});
  const [sessionId, setSessionId] = useState<string>(() => {
    // 生成一个随机的会话ID
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
  });
  // 添加自动消息状态
  const [autoMessages, setAutoMessages] = useState<Array<{id: string, content: string}>>([]);
  
  // 章节完成状态
  const [completedSections, setCompletedSections] = useState<Record<string, boolean>>({
    "1.1": false,
    "1.2": false,
    "1.3": false,
    "2.1": false,
    "2.2": false,
    "2.3": false,
    "3.1": false,
    "3.2": false,
    "3.3": false,
    "4.1": false,
    "4.2": false
  });

  // 章节结构数据
  const sections: Section[] = [
    { id: "1", title: "Introduction", parent: "", order: 1 },
    { 
      id: "1.1", 
      title: "Project background", 
      parent: "1", 
      order: 1,
      content: "In this project, we will be building a spam classification system. Spam classification is a common application of Natural Language Processing (NLP) that helps filter unwanted messages from legitimate ones. Email providers, social media platforms, and messaging applications all use spam filters to protect users from unwanted or potentially harmful content. These systems analyze the content of messages to determine whether they are spam or not."
    },
    { 
      id: "1.2", 
      title: "Concept & Theory", 
      parent: "1", 
      order: 2,
      content: "Spam classification is a binary classification problem in machine learning. Given a message, the system needs to classify it as either spam or not spam (ham). The process involves several key steps: Data Collection, Text Preprocessing, Feature Extraction, Model Training, and Evaluation."
    },
    { 
      id: "1.3", 
      title: "Target", 
      parent: "1", 
      order: 3,
      content: "By the end of this project, you will have built a spam classification system that can accurately identify spam messages. You will also gain a deep understanding of the text processing pipeline and various machine learning techniques used in NLP."
    },
    { id: "2", title: "Data Processing", parent: "", order: 2 },
    { 
      id: "2.1", 
      title: "Background", 
      parent: "2", 
      order: 1,
      content: "Before we can train a machine learning model, we need to prepare our text data. Raw text cannot be directly used by machine learning algorithms, which require numerical input. Data processing is a crucial step in any NLP pipeline. It involves cleaning, normalizing, and transforming the text data to make it suitable for analysis."
    },
    { 
      id: "2.2", 
      title: "Data Collection and Observation", 
      parent: "2", 
      order: 2,
      content: "For this project, we will use a publicly available dataset of SMS messages labeled as spam or ham. Let's first take a look at some examples from the dataset to understand the nature of the data."
    },
    { 
      id: "2.3", 
      title: "Data processing", 
      parent: "2", 
      order: 3,
      content: "Now that we have our dataset, we need to preprocess the text data before we can use it for training our model. Text preprocessing typically involves several steps: Lowercasing, Tokenization, Removing Punctuation, Removing Stop Words, and Stemming/Lemmatization."
    },
    { id: "3", title: "Text Vectorization", parent: "", order: 3 },
    { 
      id: "3.1", 
      title: "Background", 
      parent: "3", 
      order: 1,
      content: "After preprocessing our text data, we need to convert it into a numerical format that machine learning algorithms can understand. This process is called text vectorization. Text vectorization transforms text into vectors (arrays of numbers) that represent the semantic meaning of the text. These vectors can then be used as features for machine learning models."
    },
    { 
      id: "3.2", 
      title: "Concept & Theory", 
      parent: "3", 
      order: 2,
      content: "Word Embeddings (e.g., Word2Vec, GloVe): Get introduced to advanced techniques that capture semantic relationships between words. Analyze the Strengths and Limitations: Evaluate each vectorization method to understand their suitability for different types of NLP tasks."
    },
    { 
      id: "3.3", 
      title: "Implementation", 
      parent: "3", 
      order: 3,
      content: "Now that we understand the theory behind text vectorization, let's look at how to implement these techniques in practice. The Bag of Words model represents text as a 'bag' of its words, disregarding grammar and word order but keeping track of word frequency. TF-IDF (Term Frequency-Inverse Document Frequency) weighs the frequency of a word in a document against its frequency across all documents."
    },
    { id: "4", title: "Building & training models", parent: "", order: 4 },
    { 
      id: "4.1", 
      title: "Background", 
      parent: "4", 
      order: 1,
      content: "After vectorizing our text data, we can now build and train machine learning models to classify messages as spam or ham. There are various algorithms that can be used for this task, including Naive Bayes, Support Vector Machines (SVM), Logistic Regression, Random Forest, and Neural Networks."
    },
    { 
      id: "4.2", 
      title: "Concept & Theory", 
      parent: "4", 
      order: 2,
      content: "When building a machine learning model for spam classification, we need to consider several factors such as model selection, training process, and evaluation metrics. The choice of model depends on various factors: The size and nature of the dataset, the complexity of the classification task, the computational resources available, and the interpretability requirements."
    }
  ];

  // 从本地存储加载完成状态
  useEffect(() => {
    const savedCompletedSections = localStorage.getItem('completedSections');
    if (savedCompletedSections) {
      setCompletedSections(JSON.parse(savedCompletedSections));
    }
    
    // 加载用户选择
    const savedUserChoices = localStorage.getItem('userChoices');
    if (savedUserChoices) {
      setUserChoices(JSON.parse(savedUserChoices));
    }
  }, []);

  // 保存完成状态到本地存储
  useEffect(() => {
    localStorage.setItem('completedSections', JSON.stringify(completedSections));
  }, [completedSections]);
  
  // 保存用户选择到本地存储
  useEffect(() => {
    localStorage.setItem('userChoices', JSON.stringify(userChoices));
  }, [userChoices]);
  
  // 当活动章节改变时，更新当前章节内容
  useEffect(() => {
    const section = sections.find(s => s.id === activeSection);
    if (section && section.content) {
      setCurrentSectionContent(section.content);
    } else {
      setCurrentSectionContent("");
    }
    
    // 获取当前章节的检查点问题
    fetchCheckpointQuestion(activeSection);
  }, [activeSection]);
  
  // 获取检查点问题
  const fetchCheckpointQuestion = async (sectionId: string) => {
    try {
      const response = await fetch("/api/checkpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sectionId }),
      });
      
      if (response.ok) {
        const questionData = await response.json();
        setLastCheckpointQuestion(questionData);
      } else {
        console.warn("Failed to fetch checkpoint question");
      }
    } catch (error) {
      console.error("Error fetching checkpoint question:", error);
    }
  };

  // 处理答错的函数
  const handleIncorrectAnswer = (question: string, options: Option[], selectedOption: string, correctOption: string) => {
    // 将当前章节重新锁住，除了1.1章节
    if (activeSection !== "1.1") {
      setCompletedSections(prev => ({
        ...prev,
        [activeSection]: false
      }));
    }
    
    // 记录用户的错误选择
    const updatedChoices = {
      ...userChoices,
      [`section_${activeSection}_lastIncorrectAnswer`]: selectedOption,
      [`section_${activeSection}_lastIncorrectTime`]: new Date().toISOString()
    };
    setUserChoices(updatedChoices);
    
    // 构建发送给chatbot的消息
    const helpMessage = `I just answered a checkpoint question incorrectly. 
Question: ${question}
My answer: ${selectedOption}
Correct answer: ${correctOption}

Can you explain why my answer was wrong and help me understand this concept better?`;

    // 发送自动消息到chatbot
    sendAutomaticMessageToChatbot(helpMessage);
  };

  // 添加一个函数来发送自动消息到chatbot
  const sendAutomaticMessageToChatbot = (message: string) => {
    // 创建一个新的消息ID
    const messageId = `auto_${Date.now()}`;
    
    // 将消息添加到自动消息队列
    setAutoMessages(prev => [...prev, { id: messageId, content: message }]);
    
    // 增加chatKey，强制重新渲染ChatInterface组件
    setChatKey(prevKey => prevKey + 1);
  };

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleAnswerSubmit = () => {
    setShowCheck(true);
    
    // 保存用户选择
    if (selectedVectorMethod) {
      const updatedChoices = {
        ...userChoices,
        [`section_${activeSection}_vectorMethod`]: selectedVectorMethod
      };
      setUserChoices(updatedChoices);
    }
  };

  const toggleNavSection = (section: string) => {
    if (expandedNavSection === section) {
      setExpandedNavSection("");
    } else {
      setExpandedNavSection(section);
    }
  };

  // 处理新聊天按钮点击
  const handleNewChat = async () => {
    try {
      // 生成新的会话ID
      const newSessionId = Date.now().toString() + Math.random().toString(36).substring(2, 9);
      setSessionId(newSessionId);
      
      // 增加key值，强制重新渲染ChatInterface组件
      setChatKey(prevKey => prevKey + 1);
      
      showSuccess("Started a new chat session");
    } catch (error) {
      console.error("Error starting new chat:", error);
      showError("Failed to start new chat");
    }
  };

  // 检查章节是否可访问
  const isSectionAccessible = (sectionId: string): boolean => {
    // 第一个章节总是可访问的
    if (sectionId === "1.1") return true;
    
    // 找到当前章节
    const currentSection = sections.find(s => s.id === sectionId);
    if (!currentSection) return false;
    
    // 如果是父章节，检查是否有子章节可访问
    if (!currentSection.parent) {
      return sections.some(s => s.parent === sectionId && isSectionAccessible(s.id));
    }
    
    // 找到前一个章节
    const sameParentSections = sections.filter(s => s.parent === currentSection.parent);
    const sortedSections = sameParentSections.sort((a, b) => a.order - b.order);
    const currentIndex = sortedSections.findIndex(s => s.id === sectionId);
    
    // 如果是父章节下的第一个子章节
    if (currentIndex === 0) {
      // 检查父章节的前一个父章节的最后一个子章节是否已完成
      const parentSection = sections.find(s => s.id === currentSection.parent);
      if (!parentSection) return false;
      
      const parentIndex = sections.filter(s => !s.parent).findIndex(s => s.id === parentSection.id);
      if (parentIndex === 0) return true; // 如果是第一个父章节，则可访问
      
      const prevParentId = sections.filter(s => !s.parent).sort((a, b) => a.order - b.order)[parentIndex - 1].id;
      const prevParentLastChild = sections.filter(s => s.parent === prevParentId).sort((a, b) => b.order - a.order)[0];
      
      return completedSections[prevParentLastChild.id];
    }
    
    // 否则，检查前一个章节是否已完成
    const prevSectionId = sortedSections[currentIndex - 1].id;
    return completedSections[prevSectionId];
  };

  // 处理章节点击
  const handleNavItemClick = (section: string) => {
    if (isSectionAccessible(section)) {
      setActiveSection(section);
    } else {
      showError("You need to complete the previous section first!");
    }
  };

  // 处理章节完成
  const handleSectionComplete = (sectionId: string, completed: boolean) => {
    setCompletedSections(prev => ({
      ...prev,
      [sectionId]: completed
    }));
    
    // 如果完成了章节，记录用户的选择
    if (completed) {
      const updatedChoices = {
        ...userChoices,
        [`section_${sectionId}_completed`]: true,
        [`section_${sectionId}_completedAt`]: new Date().toISOString()
      };
      setUserChoices(updatedChoices);
    }
  };

  // 获取下一个章节ID
  const getNextSectionId = (currentId: string): string | null => {
    const allSubSections = sections.filter(s => s.parent);
    const sortedSections = [...allSubSections].sort((a, b) => {
      const parentOrderA = sections.find(s => s.id === a.parent)?.order || 0;
      const parentOrderB = sections.find(s => s.id === b.parent)?.order || 0;
      
      if (parentOrderA !== parentOrderB) {
        return parentOrderA - parentOrderB;
      }
      
      return a.order - b.order;
    });
    
    const currentIndex = sortedSections.findIndex(s => s.id === currentId);
    if (currentIndex === -1 || currentIndex === sortedSections.length - 1) {
      return null;
    }
    
    return sortedSections[currentIndex + 1].id;
  };

  // 处理前往下一章节
  const handleNextSection = () => {
    const nextSectionId = getNextSectionId(activeSection);
    if (nextSectionId) {
      // 确保下一章节的父章节是展开的
      const nextSectionParent = sections.find(s => s.id === nextSectionId)?.parent || "";
      setExpandedNavSection(nextSectionParent);
      setActiveSection(nextSectionId);
      
      // 记录用户进度
      const updatedChoices = {
        ...userChoices,
        lastVisitedSection: nextSectionId,
        lastVisitedAt: new Date().toISOString()
      };
      setUserChoices(updatedChoices);
    }
  };

  // 渲染内容区域
  const renderContent = () => {
    switch (activeSection) {
      case "1.1":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Project Background</h2>
            <p className="text-gray-700 mb-4">
              In this project, we will be building a spam classification system. Spam classification is a common application of Natural Language Processing (NLP) that helps filter unwanted messages from legitimate ones.
            </p>
            <p className="text-gray-700 mb-4">
              Email providers, social media platforms, and messaging applications all use spam filters to protect users from unwanted or potentially harmful content. These systems analyze the content of messages to determine whether they are spam or not.
            </p>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Project Goals</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Build a spam classification system using machine learning</li>
                <li>Learn about text preprocessing and vectorization techniques</li>
                <li>Understand how to evaluate classification models</li>
                <li>Apply the knowledge to real-world data</li>
              </ul>
            </Card>
            
            <CheckpointQuestion 
              sectionId="1.1" 
              onComplete={(completed) => handleSectionComplete("1.1", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
              allowRetry={true} // 允许1.1章节重试
            />
            
            {completedSections["1.1"] && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNextSection}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next Section
                </Button>
              </div>
            )}
          </div>
        );
      case "1.2":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Concept & Theory</h2>
            <p className="text-gray-700 mb-4">
              Spam classification is a binary classification problem in machine learning. Given a message, the system needs to classify it as either spam or not spam (ham).
            </p>
            <p className="text-gray-700 mb-4">
              The process involves several key steps:
            </p>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Key Steps in Spam Classification</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>
                  <strong>Data Collection</strong>: Gathering a dataset of messages labeled as spam or ham.
                </li>
                <li>
                  <strong>Text Preprocessing</strong>: Cleaning and normalizing the text data.
                </li>
                <li>
                  <strong>Feature Extraction</strong>: Converting text into numerical features using vectorization techniques.
                </li>
                <li>
                  <strong>Model Training</strong>: Training a machine learning model on the vectorized data.
                </li>
                <li>
                  <strong>Evaluation</strong>: Assessing the model's performance using metrics like accuracy, precision, recall, and F1-score.
                </li>
              </ol>
            </Card>
            
            <CheckpointQuestion 
              sectionId="1.2" 
              onComplete={(completed) => handleSectionComplete("1.2", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
            
            {completedSections["1.2"] && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNextSection}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next Section
                </Button>
              </div>
            )}
          </div>
        );
      case "1.3":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Target</h2>
            <p className="text-gray-700 mb-4">
              By the end of this project, you will have built a spam classification system that can accurately identify spam messages. You will also gain a deep understanding of the text processing pipeline and various machine learning techniques used in NLP.
            </p>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Learning Objectives</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Understand the importance of text preprocessing in NLP tasks</li>
                <li>Learn different text vectorization techniques and their applications</li>
                <li>Gain experience with machine learning algorithms for text classification</li>
                <li>Develop skills in evaluating and improving model performance</li>
                <li>Apply these concepts to build a practical spam filter</li>
              </ul>
            </Card>
            
            <CheckpointQuestion 
              sectionId="1.3" 
              onComplete={(completed) => handleSectionComplete("1.3", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
            
            {completedSections["1.3"] && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNextSection}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next Section
                </Button>
              </div>
            )}
          </div>
        );
      case "2.1":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Data Processing Background</h2>
            <p className="text-gray-700 mb-4">
              Before we can train a machine learning model, we need to prepare our text data. Raw text cannot be directly used by machine learning algorithms, which require numerical input.
            </p>
            <p className="text-gray-700 mb-4">
              Data processing is a crucial step in any NLP pipeline. It involves cleaning, normalizing, and transforming the text data to make it suitable for analysis.
            </p>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Why Data Processing Matters</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Removes noise and irrelevant information from the text</li>
                <li>Standardizes the text format for consistent analysis</li>
                <li>Reduces the dimensionality of the data</li>
                <li>Improves the performance of machine learning models</li>
                <li>Helps in extracting meaningful features from the text</li>
              </ul>
            </Card>
            
            <CheckpointQuestion 
              sectionId="2.1" 
              onComplete={(completed) => handleSectionComplete("2.1", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
            
            {completedSections["2.1"] && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNextSection}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next Section
                </Button>
              </div>
            )}
          </div>
        );
      case "2.2":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Data Collection and Observation</h2>
            <p className="text-gray-700 mb-4">
              For this project, we will use a publicly available dataset of SMS messages labeled as spam or ham. Let's first take a look at some examples from the dataset to understand the nature of the data.
            </p>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Sample Data</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Label</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ham</td>
                      <td className="px-6 py-4 text-sm text-gray-500">I'll be there in 10 minutes. Wait for me.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Spam</td>
                      <td className="px-6 py-4 text-sm text-gray-500">URGENT! You have won a $1,000 gift card. Call now to claim your prize: 1-800-555-1234</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Ham</td>
                      <td className="px-6 py-4 text-sm text-gray-500">Don't forget to bring the documents for the meeting tomorrow.</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Spam</td>
                      <td className="px-6 py-4 text-sm text-gray-500">50% OFF on all products! Limited time offer. Shop now at www.example.com</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
            
            <CheckpointQuestion 
              sectionId="2.2" 
              onComplete={(completed) => handleSectionComplete("2.2", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
            
            {completedSections["2.2"] && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNextSection}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next Section
                </Button>
              </div>
            )}
          </div>
        );
      case "2.3":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Data Processing</h2>
            <p className="text-gray-700 mb-4">
              Now that we have our dataset, we need to preprocess the text data before we can use it for training our model. Text preprocessing typically involves several steps.
            </p>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Text Preprocessing Steps</h3>
              <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                <li>
                  <strong>Lowercasing</strong>: Converting all text to lowercase to ensure consistency.
                </li>
                <li>
                  <strong>Tokenization</strong>: Splitting the text into individual words or tokens.
                </li>
                <li>
                  <strong>Removing Punctuation</strong>: Eliminating punctuation marks that don't add meaning.
                </li>
                <li>
                  <strong>Removing Stop Words</strong>: Filtering out common words like "the", "is", "and" that don't carry much information.
                </li>
                <li>
                  <strong>Stemming/Lemmatization</strong>: Reducing words to their root form to handle different variations of the same word.
                </li>
              </ol>
            </Card>
            <p className="text-gray-700 mb-4">
              After preprocessing, our text data will be cleaner and more suitable for analysis. The next step is to convert this processed text into numerical features using vectorization techniques.
            </p>
            
            <CheckpointQuestion 
              sectionId="2.3" 
              onComplete={(completed) => handleSectionComplete("2.3", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
            
            {completedSections["2.3"] && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNextSection}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next Section
                </Button>
              </div>
            )}
          </div>
        );
      case "3.1":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Text Vectorization Background</h2>
            <p className="text-gray-700 mb-4">
              After preprocessing our text data, we need to convert it into a numerical format that machine learning algorithms can understand. This process is called text vectorization.
            </p>
            <p className="text-gray-700 mb-4">
              Text vectorization transforms text into vectors (arrays of numbers) that represent the semantic meaning of the text. These vectors can then be used as features for machine learning models.
            </p>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Why Vectorization is Necessary</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>Machine learning algorithms work with numerical data, not text</li>
                <li>Vectors capture the semantic meaning of text in a format computers can process</li>
                <li>Different vectorization techniques capture different aspects of text</li>
                <li>Proper vectorization significantly impacts model performance</li>
              </ul>
            </Card>
            
            <CheckpointQuestion 
              sectionId="3.1" 
              onComplete={(completed) => handleSectionComplete("3.1", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
            
            {completedSections["3.1"] && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNextSection}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next Section
                </Button>
              </div>
            )}
          </div>
        );
      case "3.2":
        return (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Text Vectorization Concept & Theory</h2>
            <p className="text-gray-700 mb-4">
              Word Embeddings (e.g., Word2Vec, GloVe): Get introduced to advanced techniques that 
              capture semantic relationships between words.
              Analyze the Strengths and Limitations: Evaluate each vectorization method to understand 
              their suitability for different types of NLP tasks.
            </p>

            <div className="mb-6">
              <p className="mb-2">What are the three text vectorization techniques we are going to explore?</p>
              <div className="flex items-center">
                <p className="text-sm font-medium mr-2">Your answer:</p>
                <p className="text-sm text-blue-500">Bag of Words, TF-IDF, Word Embeddings</p>
                {showCheck && <Check className="text-green-500 ml-2" size={20} />}
              </div>
            </div>

            <Card className="p-4 mb-6 relative" id="section-A">
              <div className="absolute top-2 right-2 bg-gray-700 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                A
              </div>
              <p className="mb-4">
                Great! Now we will first introduce the concept of vector and text vectorization. This part 
                will help you understand the <strong>three text vectorization techniques</strong>.
              </p>

              <div className="mb-4">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => toggleSection("vectorization")}
                >
                  {expandedSection === "vectorization" ? (
                    <ChevronDown className="text-gray-500 mr-1" size={16} />
                  ) : (
                    <ChevronRight className="text-gray-500 mr-1" size={16} />
                  )}
                  <h3 className="font-medium">What is Text Vectorization?</h3>
                </div>
                
                {expandedSection === "vectorization" && (
                  <div className="mt-2 pl-6 text-sm text-gray-700">
                    <p>
                      In natural language processing (NLP), computers need a way to understand and work 
                      with text. But machines don't "understand" language the way humans do. To make 
                      text understandable to a machine, we must transform it into a numerical format, because 
                      computers work with numbers. This process of converting text into numbers is called text 
                      vectorization.
                    </p>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <div 
                  className="flex items-center cursor-pointer" 
                  onClick={() => toggleSection("vector")}
                >
                  {expandedSection === "vector" ? (
                    <ChevronDown className="text-gray-500 mr-1" size={16} />
                  ) : (
                    <ChevronRight className="text-gray-500 mr-1" size={16} />
                  )}
                  <h3 className="font-medium">What is a Vector?</h3>
                </div>
                
                {expandedSection === "vector" && (
                  <div className="mt-2 pl-6 text-sm text-gray-700">
                    <p>
                      A vector is simply an array of numbers. In the context of text, we take words, 
                      sentences, or even entire documents and convert them into vectors. Each vector 
                      represents the text numerically so that the computer can process and analyze it.
                    </p>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-4 mb-6 relative" id="section-B">
              <div className="absolute top-2 right-2 bg-gray-700 text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">
                B
              </div>
              <p className="mb-4">How does converting text into vectors help computers process it?</p>

              <RadioGroup 
                value={selectedVectorMethod || ""} 
                onValueChange={setSelectedVectorMethod}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="shortlength" id="shortlength" />
                  <Label htmlFor="shortlength">Shortened Length</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="understandable" id="understandable" />
                  <Label htmlFor="understandable">Understandable format</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="redundancy" id="redundancy" />
                  <Label htmlFor="redundancy">Redundancy Removal</Label>
                </div>
              </RadioGroup>

              <Button 
                className="mt-4 bg-blue-500 hover:bg-blue-600" 
                onClick={handleAnswerSubmit}
              >
                Submit
              </Button>
            </Card>
            
            <CheckpointQuestion 
              sectionId="3.2" 
              onComplete={(completed) => handleSectionComplete("3.2", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
            
            {completedSections["3.2"] && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNextSection}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next Section
                </Button>
              </div>
            )}
          </div>
        );
      case "3.3":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Text Vectorization Implementation</h2>
            <p className="text-gray-700 mb-4">
              Now that we understand the theory behind text vectorization, let's look at how to implement these techniques in practice.
            </p>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Implementing Bag of Words (BOW)</h3>
              <p className="text-gray-700 mb-2">
                The Bag of Words model represents text as a "bag" of its words, disregarding grammar and word order but keeping track of word frequency.
              </p>
              <div className="bg-gray-100 p-3 rounded-md">
                <pre className="text-sm">
{`from sklearn.feature_extraction.text import CountVectorizer

# Create a CountVectorizer instance
vectorizer = CountVectorizer()

# Example messages
messages = [
    "Hello how are you",
    "I am fine thank you",
    "Hello thank you"
]

# Transform the messages into vectors
X = vectorizer.fit_transform(messages)

# Get the feature names (words)
feature_names = vectorizer.get_feature_names_out()

# Print the feature names and the vectors
print("Feature names:", feature_names)
print("Vectors:", X.toarray())`}
                </pre>
              </div>
            </Card>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Implementing TF-IDF</h3>
              <p className="text-gray-700 mb-2">
                TF-IDF (Term Frequency-Inverse Document Frequency) weighs the frequency of a word in a document against its frequency across all documents.
              </p>
              <div className="bg-gray-100 p-3 rounded-md">
                <pre className="text-sm">
{`from sklearn.feature_extraction.text import TfidfVectorizer

# Create a TfidfVectorizer instance
vectorizer = TfidfVectorizer()

# Example messages
messages = [
    "Hello how are you",
    "I am fine thank you",
    "Hello thank you"
]

# Transform the messages into vectors
X = vectorizer.fit_transform(messages)

# Get the feature names (words)
feature_names = vectorizer.get_feature_names_out()

# Print the feature names and the vectors
print("Feature names:", feature_names)
print("Vectors:", X.toarray())`}
                </pre>
              </div>
            </Card>
            
            <CheckpointQuestion 
              sectionId="3.3" 
              onComplete={(completed) => handleSectionComplete("3.3", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
            
            {completedSections["3.3"] && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNextSection}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next Section
                </Button>
              </div>
            )}
          </div>
        );
      case "4.1":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Building & Training Models Background</h2>
            <p className="text-gray-700 mb-4">
              After vectorizing our text data, we can now build and train machine learning models to classify messages as spam or ham. There are various algorithms that can be used for this task.
            </p>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Common Classification Algorithms</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>
                  <strong>Naive Bayes</strong>: A probabilistic classifier based on Bayes' theorem. It's particularly effective for text classification.
                </li>
                <li>
                  <strong>Support Vector Machines (SVM)</strong>: A powerful algorithm that finds the optimal hyperplane to separate classes.
                </li>
                <li>
                  <strong>Logistic Regression</strong>: A statistical model that uses a logistic function to model a binary dependent variable.
                </li>
                <li>
                  <strong>Random Forest</strong>: An ensemble learning method that constructs multiple decision trees and outputs the class that is the mode of the classes of the individual trees.
                </li>
                <li>
                  <strong>Neural Networks</strong>: Deep learning models that can capture complex patterns in the data.
                </li>
              </ul>
            </Card>
            
            <CheckpointQuestion 
              sectionId="4.1" 
              onComplete={(completed) => handleSectionComplete("4.1", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
            
            {completedSections["4.1"] && (
              <div className="mt-6 flex justify-end">
                <Button 
                  onClick={handleNextSection}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Next Section
                </Button>
              </div>
            )}
          </div>
        );
      case "4.2":
        return (
          <div>
            <h2 className="text-2xl font-bold mb-4">Building & Training Models Concept & Theory</h2>
            <p className="text-gray-700 mb-4">
              When building a machine learning model for spam classification, we need to consider several factors such as model selection, training process, and evaluation metrics.
            </p>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Model Selection</h3>
              <p className="text-gray-700 mb-2">
                The choice of model depends on various factors:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>The size and nature of the dataset</li>
                <li>The complexity of the classification task</li>
                <li>The computational resources available</li>
                <li>The interpretability requirements</li>
              </ul>
            </Card>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Training Process</h3>
              <p className="text-gray-700 mb-2">
                The training process typically involves:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-gray-700">
                <li>Splitting the data into training and testing sets</li>
                <li>Fitting the model on the training data</li>
                <li>Tuning hyperparameters using techniques like cross-validation</li>
                <li>Evaluating the model on the testing data</li>
              </ol>
            </Card>
            <Card className="p-4 mb-6">
              <h3 className="font-medium mb-2">Evaluation Metrics</h3>
              <p className="text-gray-700 mb-2">
                Common metrics for evaluating classification models:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                <li>
                  <strong>Accuracy</strong>: The proportion of correct predictions among the total number of predictions.
                </li>
                <li>
                  <strong>Precision</strong>: The proportion of true positive predictions among all positive predictions.
                </li>
                <li>
                  <strong>Recall</strong>: The proportion of true positive predictions among all actual positives.
                </li>
                <li>
                  <strong>F1-score</strong>: The harmonic mean of precision and recall.
                </li>
                <li>
                  <strong>ROC-AUC</strong>: The area under the Receiver Operating Characteristic curve.
                </li>
              </ul>
            </Card>
            
            <CheckpointQuestion 
              sectionId="4.2" 
              onComplete={(completed) => handleSectionComplete("4.2", completed)}
              sessionId={sessionId}
              sectionContent={currentSectionContent}
              onIncorrectAnswer={handleIncorrectAnswer}
            />
            
            {completedSections["4.2"] && (
              <div className="mt-6">
                <Card className="p-6 bg-green-50">
                  <h3 className="text-xl font-medium text-green-700 mb-2">Congratulations!</h3>
                  <p className="text-green-700">
                    You have completed all sections of this course on spam classification. You now have a solid understanding of text preprocessing, vectorization techniques, and machine learning models for text classification.
                  </p>
                </Card>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="text-center p-10">
            <p className="text-gray-500">Select a section from the navigation menu to view content.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <h1 className="font-bold text-xl mb-4">Spam Classification</h1>
        
        <div className="space-y-4">
          <div>
            <div 
              className="flex items-center text-sm mb-2 cursor-pointer" 
              onClick={() => toggleNavSection("1")}
            >
              <span className="mr-2">
                {expandedNavSection === "1" ? 
                  <ChevronDown size={14} /> : 
                  <ChevronRight size={14} />
                }
              </span>
              <span>Introduction</span>
            </div>
            {expandedNavSection === "1" && (
              <div className="pl-6 space-y-1 text-sm text-gray-600">
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "1.1" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("1.1")}
                >
                  <span className="mr-1">
                    {completedSections["1.1"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("1.1") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>1.1 Project background</span>
                </div>
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "1.2" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("1.2")}
                >
                  <span className="mr-1">
                    {completedSections["1.2"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("1.2") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>1.2 Concept & Theory</span>
                </div>
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "1.3" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("1.3")}
                >
                  <span className="mr-1">
                    {completedSections["1.3"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("1.3") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>1.3 Target</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <div 
              className="flex items-center text-sm mb-2 cursor-pointer" 
              onClick={() => toggleNavSection("2")}
            >
              <span className="mr-2">
                {expandedNavSection === "2" ? 
                  <ChevronDown size={14} /> : 
                  <ChevronRight size={14} />
                }
              </span>
              <span>Data Processing</span>
            </div>
            {expandedNavSection === "2" && (
              <div className="pl-6 space-y-1 text-sm text-gray-600">
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "2.1" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("2.1")}
                >
                  <span className="mr-1">
                    {completedSections["2.1"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("2.1") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>2.1 Background</span>
                </div>
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "2.2" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("2.2")}
                >
                  <span className="mr-1">
                    {completedSections["2.2"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("2.2") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>2.2 Data Collection and Observation</span>
                </div>
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "2.3" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("2.3")}
                >
                  <span className="mr-1">
                    {completedSections["2.3"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("2.3") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>2.3 Data processing</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <div 
              className="flex items-center text-sm mb-2 font-medium cursor-pointer" 
              onClick={() => toggleNavSection("3")}
            >
              <span className="mr-2">
                {expandedNavSection === "3" ? 
                  <ChevronDown size={14} /> : 
                  <ChevronRight size={14} />
                }
              </span>
              <span>Text Vectorization</span>
            </div>
            {expandedNavSection === "3" && (
              <div className="pl-6 space-y-1 text-sm text-gray-600">
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "3.1" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("3.1")}
                >
                  <span className="mr-1">
                    {completedSections["3.1"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("3.1") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>3.1 Background</span>
                </div>
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "3.2" ? "text-blue-500 font-medium" : ""}`}
                  onClick={() => handleNavItemClick("3.2")}
                >
                  <span className="mr-1">
                    {completedSections["3.2"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("3.2") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>3.2 Concept & Theory</span>
                </div>
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "3.3" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("3.3")}
                >
                  <span className="mr-1">
                    {completedSections["3.3"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("3.3") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>3.3 Implementation</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <div 
              className="flex items-center text-sm mb-2 cursor-pointer" 
              onClick={() => toggleNavSection("4")}
            >
              <span className="mr-2">
                {expandedNavSection === "4" ? 
                  <ChevronDown size={14} /> : 
                  <ChevronRight size={14} />
                }
              </span>
              <span>Building & training models</span>
            </div>
            {expandedNavSection === "4" && (
              <div className="pl-6 space-y-1 text-sm text-gray-600">
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "4.1" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("4.1")}
                >
                  <span className="mr-1">
                    {completedSections["4.1"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("4.1") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>4.1 Background</span>
                </div>
                <div 
                  className={`flex items-center cursor-pointer hover:text-blue-500 ${activeSection === "4.2" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("4.2")}
                >
                  <span className="mr-1">
                    {completedSections["4.2"] ? 
                      <CheckCircle2 size={12} className="text-green-500" /> : 
                      isSectionAccessible("4.2") ? null : <Lock size={12} />
                    }
                  </span>
                  <span>4.2 Concept & Theory</span>
                </div>
              </div>
            )}
          </div>

          <button className="text-blue-500 mt-4 flex items-center">
            <ArrowLeft size={14} className="mr-1" /> Return
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-3xl mx-auto">
          {/* API状态指示器 */}
          <ApiStatus />
          
          {renderContent()}
        </div>
      </div>

      {/* Right sidebar - 聊天界面 */}
      <div className="w-72 bg-white border-l border-gray-200 p-4 flex flex-col h-screen">
        <div className="mb-4">
          <Button 
            className="bg-blue-500 hover:bg-blue-600 text-xs w-full"
            onClick={handleNewChat}
          >
            New Chat
          </Button>
        </div>
        
        {/* 聊天界面 */}
        <div className="flex-1 flex flex-col">
          <ChatInterface 
            key={chatKey} 
            title="ChatBot Assistant" 
            onNewChat={handleNewChat}
            currentSection={activeSection}
            sectionContent={currentSectionContent}
            lastCheckpointQuestion={lastCheckpointQuestion || undefined}
            userChoices={userChoices}
            sessionId={sessionId}
            autoMessages={autoMessages}
            onAutoMessageProcessed={(messageId) => {
              // 从队列中移除已处理的消息
              setAutoMessages(prev => prev.filter(msg => msg.id !== messageId));
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;