// 这个文件在实际部署时需要替换为真实的API端点
// 目前仅作为模拟API的示例

export async function POST(req: Request) {
  try {
    const { sectionId } = await req.json();
    
    // 模拟API响应延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 根据章节ID返回相应的检查点问题
    const questionData = getQuestionForSection(sectionId);
    
    return new Response(JSON.stringify(questionData), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error processing checkpoint request:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// 根据章节ID获取相应的检查点问题
function getQuestionForSection(sectionId: string) {
  // 预定义的问题库
  const questions = {
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
  if (!questions[sectionId as keyof typeof questions]) {
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
  
  return questions[sectionId as keyof typeof questions];
}