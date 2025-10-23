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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // 获取检查点问题
  const fetchQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sectionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }

      const data = await response.json();
      setQuestion(data.question);
      setOptions(data.options);
      setCorrectAnswerId(data.correctAnswerId);
      setSelectedOption("");
      setIsCorrect(null);
      setIsSubmitted(false);
      
      // 重置完成状态
      if (onComplete) {
        onComplete(false);
      }
    } catch (error) {
      console.error("Error fetching checkpoint question:", error);
      showError("Failed to load question. Please try again.");
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