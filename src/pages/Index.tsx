import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, ChevronDown, ChevronRight, ArrowLeft } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>("vectorization");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showCheck, setShowCheck] = useState(false);
  const [selectedVectorMethod, setSelectedVectorMethod] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>("3.2");
  const [expandedNavSection, setExpandedNavSection] = useState<string>("3");

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  const handleAnswerSubmit = () => {
    setShowCheck(true);
  };

  const toggleNavSection = (section: string) => {
    if (expandedNavSection === section) {
      setExpandedNavSection("");
    } else {
      setExpandedNavSection(section);
    }
  };

  const handleNavItemClick = (section: string) => {
    setActiveSection(section);
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
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "1.1" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("1.1")}
                >
                  1.1 Project background
                </div>
                <div 
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "1.2" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("1.2")}
                >
                  1.2 Concept & Theory
                </div>
                <div 
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "1.3" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("1.3")}
                >
                  1.3 Target
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
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "2.1" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("2.1")}
                >
                  2.1 Background
                </div>
                <div 
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "2.2" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("2.2")}
                >
                  2.2 Data Collection and Observation
                </div>
                <div 
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "2.3" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("2.3")}
                >
                  2.3 Data processing
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
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "3.1" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("3.1")}
                >
                  3.1 Background
                </div>
                <div 
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "3.2" ? "text-blue-500 font-medium" : ""}`}
                  onClick={() => handleNavItemClick("3.2")}
                >
                  3.2 Concept & Theory
                </div>
                <div 
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "3.3" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("3.3")}
                >
                  3.3 Implementation
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
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "4.1" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("4.1")}
                >
                  4.1 Background
                </div>
                <div 
                  className={`cursor-pointer hover:text-blue-500 ${activeSection === "4.2" ? "text-blue-500" : ""}`}
                  onClick={() => handleNavItemClick("4.2")}
                >
                  4.2 Concept & Theory
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
          <div className="mb-8">
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
          </div>
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-72 bg-white border-l border-gray-200 p-4">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button className="bg-blue-500 hover:bg-blue-600 text-xs">New Chat</Button>
          <Button variant="outline" className="text-xs">Convert document to vector</Button>
          <Button variant="outline" className="text-xs">History</Button>
        </div>

        <div className="border border-gray-200 rounded-md mb-4">
          <div className="flex items-center p-2 border-b border-gray-200 bg-gray-50">
            <span className="text-gray-500 mr-2">🔍</span>
            <span className="text-sm">Query</span>
            <span className="text-sm text-gray-500 mx-1">or</span>
            <span className="text-sm text-blue-500">even entire documents</span>
          </div>
          <div className="p-4 bg-blue-100 text-center">
            <p className="text-blue-600 font-medium">Explanation</p>
            <ChevronDown className="inline-block text-blue-500" size={16} />
          </div>
        </div>

        <p className="text-sm text-blue-500 text-right mb-6">How can this be done?</p>

        <div className="text-sm space-y-4">
          <p>Good question! You can convert entire documents into vectors using methods:</p>
          
          <div>
            <p className="font-medium">Bag of Words (BOW):</p>
            <p className="text-gray-600">Counts how often each word appears in a document</p>
          </div>
          
          <div>
            <p className="font-medium">Term Frequency-Inverse Document Frequency (TF-IDF):</p>
            <p className="text-gray-600">Weighs word counts by their importance across all documents</p>
          </div>
          
          <div>
            <p className="font-medium">Word Embeddings:</p>
            <p className="text-gray-600">Uses models like Word2Vec to capture semantic meaning in dense vectors</p>
          </div>
          
          <p>These methods will be detailed in the next steps. Would you like to learn about any of them now?</p>
        </div>

        <div className="mt-6 text-blue-500 font-medium">TF-IDF</div>
        
        <div className="mt-4 text-gray-500 text-sm">Generating answers...</div>
        
        <div className="mt-6 relative">
          <input 
            type="text" 
            placeholder="Input your question..." 
            className="w-full p-2 pr-12 border border-gray-300 rounded-md"
          />
          <Button className="absolute right-1 top-1 bg-blue-500 hover:bg-blue-600 h-8 px-3">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;