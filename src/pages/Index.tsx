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
          {renderContent()}
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