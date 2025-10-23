import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, RefreshCw, Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface Option {
  id: string;
  text: string;
}

interface QuestionData {
  question: string;
  options: Option[];
  correctAnswerId: string;
}

interface CheckpointQuestionProps {
  sectionId: string;
  onComplete?: (completed: boolean) => void;
}

const CheckpointQuestion = ({ sectionId, onComplete }: CheckpointQuestionProps) => {
  const [question, setQuestion] = useState<string>("");
  const [options, setOptions] = useState<Option[]>([]);
  const [correctAnswerId, setCorrectAnswerId] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // 获取检查点问题
  const fetchQuestion = async () => {
    setIsLoading(true);
    
    try {
      // 尝试从API获取问题
      const response = await fetch("/api/checkpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sectionId }),
      });

      let questionData: QuestionData;
      
      if (response.ok) {
        // 如果API调用成功，使用API返回的数据
        questionData = await response.json();
      } else {
        // 如果API调用失败，使用本地数据
        console.warn("API call failed, using local fallback data");
        questionData = getLocalQuestionData(sectionId);
      }
      
      // 设置问题数据
      setQuestion(questionData.question);
      setOptions(questionData.options);
      setCorrectAnswerId(questionData.correctAnswerId);
      
      // 重置状态
      setSelectedOption("");
      setIsCorrect(null);
      setIsSubmitted(false);
      
      // 重置完成状态
      if (onComplete) {
        onComplete(false);
      }
    } catch (error) {
      console.error("Error fetching checkpoint question:", error);
      
      // 使用本地数据作为回退
      const fallbackData = getLocalQuestionData(sectionId);
      setQuestion(fallbackData.question);
      setOptions(fallbackData.options);
      setCorrectAnswerId(fallbackData.correctAnswerId);
      
      // 显示错误提示但不影响用户体验
      console.warn("Using local fallback data due to API error");
    } finally {
      setIsLoading(false);
    }
  };

  // 组件加载时获取问题
  useEffect(() => {
    fetchQuestion();
  }, [sectionId]);

  // 提交答案
  const handleSubmit = () => {
    if (!selectedOption) return;
    
    const correct = selectedOption === correctAnswerId;
    setIsCorrect(correct);
    setIsSubmitted(true);
    
    if (correct) {
      showSuccess("Correct answer! You can now proceed to the next section.");
      // 通知父组件问题已完成
      if (onComplete) {
        onComplete(true);
      }
    } else {
      showError("Incorrect. Try again!");
      // 通知父组件问题未完成
      if (onComplete) {
        onComplete(false);
      }
    }
  };

  // 刷新问题
  const handleRefresh = () => {
    fetchQuestion();
  };

  // 获取本地问题数据（作为API的回退）
  const getLocalQuestionData = (sectionId: string): QuestionData => {
    // 预定义的问题库
    const questions: Record<string, QuestionData> = {
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
      "1.3": {
        question: "By the end of this project, what will you have built?",
        options: [
          { id: "a", text: "A language translation system" },
          { id: "b", text: "A spam classification system" },
          { id: "c", text: "A text summarization tool" },
          { id: "d", text: "A sentiment analysis model" }
        ],
        correctAnswerId: "b"
      },
      "2.1": {
        question: "Why is data processing crucial in an NLP pipeline?",
        options: [
          { id: "a", text: "It makes the text more readable for humans" },
          { id: "b", text: "It prepares text data for machine learning algorithms" },
          { id: "c", text: "It increases the size of the dataset" },
          { id: "d", text: "It translates text into different languages" }
        ],
        correctAnswerId: "b"
      },
      "2.2": {
        question: "Which of the following is a characteristic of spam messages based on the sample data?",
        options: [
          { id: "a", text: "They are always written in all caps" },
          { id: "b", text: "They often contain personal information" },
          { id: "c", text: "They frequently mention urgency or offers" },
          { id: "d", text: "They are always shorter than ham messages" }
        ],
        correctAnswerId: "c"
      },
      "2.3": {
        question: "Which of the following is NOT a typical text preprocessing step?",
        options: [
          { id: "a", text: "Lowercasing" },
          { id: "b", text: "Tokenization" },
          { id: "c", text: "Encryption" },
          { id: "d", text: "Removing Stop Words" }
        ],
        correctAnswerId: "c"
      },
      "3.1": {
        question: "Why is text vectorization necessary in NLP?",
        options: [
          { id: "a", text: "To make text more readable" },
          { id: "b", text: "To convert text into a format that machine learning algorithms can understand" },
          { id: "c", text: "To reduce the size of the text data" },
          { id: "d", text: "To translate text into different languages" }
        ],
        correctAnswerId: "b"
      },
      "3.2": {
        question: "Which of the following is NOT one of the three main text vectorization techniques discussed?",
        options: [
          { id: "a", text: "Bag of Words (BOW)" },
          { id: "b", text: "TF-IDF" },
          { id: "c", text: "Word Embeddings" },
          { id: "d", text: "Binary Encoding" }
        ],
        correctAnswerId: "d"
      },
      "3.3": {
        question: "What does the Bag of Words model disregard when representing text?",
        options: [
          { id: "a", text: "Word frequency" },
          { id: "b", text: "Grammar and word order" },
          { id: "c", text: "The presence of words" },
          { id: "d", text: "All of the above" }
        ],
        correctAnswerId: "b"
      },
      "4.1": {
        question: "Which of the following algorithms is particularly effective for text classification?",
        options: [
          { id: "a", text: "K-means clustering" },
          { id: "b", text: "Principal Component Analysis (PCA)" },
          { id: "c", text: "Naive Bayes" },
          { id: "d", text: "Linear Regression" }
        ],
        correctAnswerId: "c"
      },
      "4.2": {
        question: "Which of the following is NOT a common metric for evaluating classification models?",
        options: [
          { id: "a", text: "Accuracy" },
          { id: "b", text: "Precision" },
          { id: "c", text: "Mean Squared Error (MSE)" },
          { id: "d", text: "F1-score" }
        ],
        correctAnswerId: "c"
      }
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
  };

  if (isLoading && !question) {
    return (
      <Card className="p-6 mt-8">
        <div className="flex items-center justify-center">
          <Loader2 className="animate-spin mr-2" size={20} />
          <p>Loading checkpoint question...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-8 relative">
      <div className="absolute top-4 right-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefresh}
          disabled={isLoading}
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </Button>
      </div>
      
      <h3 className="text-lg font-medium mb-4">Checkpoint Question</h3>
      
      <p className="mb-4">{question}</p>
      
      <RadioGroup 
        value={selectedOption} 
        onValueChange={setSelectedOption}
        className="space-y-2 mb-4"
      >
        {options.map((option) => (
          <div 
            key={option.id} 
            className={`flex items-center space-x-2 p-2 rounded-md ${
              isSubmitted && option.id === correctAnswerId ? "bg-green-50" : ""
            } ${
              isSubmitted && option.id === selectedOption && option.id !== correctAnswerId ? "bg-red-50" : ""
            }`}
          >
            <RadioGroupItem value={option.id} id={option.id} />
            <Label htmlFor={option.id} className="flex-1">
              {option.text}
            </Label>
            {isSubmitted && option.id === correctAnswerId && (
              <Check className="text-green-500" size={18} />
            )}
          </div>
        ))}
      </RadioGroup>
      
      <Button 
        onClick={handleSubmit} 
        disabled={!selectedOption || isSubmitted}
        className="bg-blue-500 hover:bg-blue-600"
      >
        Submit Answer
      </Button>
      
      {isSubmitted && (
        <div className={`mt-4 p-3 rounded-md ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          <p className="font-medium">
            {isCorrect ? "Correct!" : "Incorrect!"}
          </p>
          <p className="text-sm mt-1">
            {isCorrect 
              ? "Great job! You've understood this concept well." 
              : `The correct answer is: ${options.find(o => o.id === correctAnswerId)?.text}`
            }
          </p>
          {isCorrect && (
            <p className="text-sm mt-1 font-medium">
              You can now proceed to the next section.
            </p>
          )}
          {!isCorrect && (
            <p className="text-sm mt-1">
              Please try again or review the material before proceeding.
            </p>
          )}
        </div>
      )}
    </Card>
  );
};

export default CheckpointQuestion;