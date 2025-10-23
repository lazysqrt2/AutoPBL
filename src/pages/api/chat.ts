// 这个文件提供聊天API的功能
// 在实际部署时需要替换为真实的API端点

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    
    console.log(`Processing message for session ${sessionId}: ${message}`);
    
    // 模拟API响应延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 根据用户消息生成回复
    const responseText = generateResponse(message);
    
    return new Response(JSON.stringify({ 
      response: responseText, 
      sessionId 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to process request' 
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

// 根据用户消息生成回复
function generateResponse(userMessage: string): string {
  // 将用户消息转换为小写以便匹配
  const message = userMessage.toLowerCase();
  
  // 关于文本向量化的问题
  if (message.includes('vector') || message.includes('vectorization') || message.includes('vectorize')) {
    if (message.includes('what') || message.includes('explain') || message.includes('definition')) {
      return "Text vectorization is the process of converting text into numerical vectors that machine learning algorithms can understand. It's a crucial step in NLP because computers work with numbers, not text directly.";
    }
    if (message.includes('why') || message.includes('purpose') || message.includes('important')) {
      return "Text vectorization is important because machine learning algorithms require numerical input. By converting text to vectors, we capture semantic meaning in a format computers can process, which significantly impacts model performance.";
    }
    if (message.includes('technique') || message.includes('method') || message.includes('approach')) {
      return "The three main text vectorization techniques are: 1) Bag of Words (BOW), which counts word frequencies but ignores grammar and word order; 2) TF-IDF, which weighs terms by their importance across documents; and 3) Word Embeddings like Word2Vec, which capture semantic relationships between words.";
    }
    if (message.includes('bow') || message.includes('bag of words')) {
      return "Bag of Words (BOW) is a simple vectorization technique that represents text as the count of each word, disregarding grammar and word order. It creates a vocabulary of all unique words and represents each document as a vector of word frequencies.";
    }
    if (message.includes('tf-idf') || message.includes('tfidf')) {
      return "TF-IDF (Term Frequency-Inverse Document Frequency) is a vectorization technique that weighs the frequency of a word in a document against its frequency across all documents. It gives higher weight to terms that are frequent in a specific document but rare across the corpus.";
    }
    if (message.includes('embedding') || message.includes('word2vec') || message.includes('glove')) {
      return "Word embeddings are dense vector representations of words that capture semantic relationships. Unlike BOW or TF-IDF, embeddings place similar words closer in vector space. Popular techniques include Word2Vec, GloVe, and FastText, which can capture context and word relationships.";
    }
  }
  
  // 关于数据处理的问题
  if (message.includes('data processing') || message.includes('preprocessing')) {
    if (message.includes('what') || message.includes('explain') || message.includes('definition')) {
      return "Text preprocessing involves cleaning and normalizing text data to make it suitable for analysis. This typically includes steps like lowercasing, tokenization, removing punctuation, removing stop words, and stemming/lemmatization.";
    }
    if (message.includes('why') || message.includes('purpose') || message.includes('important')) {
      return "Data processing is crucial in NLP because it removes noise, standardizes text format, reduces dimensionality, improves model performance, and helps extract meaningful features from text.";
    }
    if (message.includes('step') || message.includes('how')) {
      return "The main text preprocessing steps include: 1) Lowercasing to ensure consistency, 2) Tokenization to split text into words, 3) Removing punctuation that doesn't add meaning, 4) Removing stop words like 'the', 'is', 'and', and 5) Stemming/lemmatization to reduce words to their root form.";
    }
  }
  
  // 关于模型训练的问题
  if (message.includes('model') || message.includes('algorithm') || message.includes('training')) {
    if (message.includes('what') || message.includes('type') || message.includes('kind')) {
      return "Common classification algorithms for spam detection include Naive Bayes (particularly effective for text), Support Vector Machines (SVM), Logistic Regression, Random Forest, and Neural Networks. Each has its strengths depending on the dataset and requirements.";
    }
    if (message.includes('naive bayes') || message.includes('bayes')) {
      return "Naive Bayes is a probabilistic classifier based on Bayes' theorem with an assumption of independence between features. It's particularly effective for text classification because it performs well with high-dimensional data and requires relatively little training data.";
    }
    if (message.includes('evaluate') || message.includes('metric') || message.includes('measure')) {
      return "Common metrics for evaluating classification models include Accuracy (proportion of correct predictions), Precision (proportion of true positives among predicted positives), Recall (proportion of true positives among actual positives), F1-score (harmonic mean of precision and recall), and ROC-AUC.";
    }
  }
  
  // 关于项目的一般问题
  if (message.includes('project') || message.includes('course') || message.includes('tutorial')) {
    if (message.includes('about') || message.includes('what')) {
      return "This project is about building a spam classification system using machine learning and NLP techniques. You'll learn about text preprocessing, vectorization techniques, and machine learning models for text classification.";
    }
    if (message.includes('goal') || message.includes('aim') || message.includes('purpose')) {
      return "The goal of this project is to build a spam classification system that can accurately identify spam messages. By the end, you'll understand the text processing pipeline and various machine learning techniques used in NLP.";
    }
  }
  
  // 关于检查点问题的问题
  if (message.includes('checkpoint') || message.includes('question') || message.includes('quiz')) {
    return "The checkpoint questions test your understanding of key concepts in each section. They help reinforce your learning and ensure you've grasped the important points before moving on. Answer them correctly to unlock the next section.";
  }
  
  // 默认回复
  return "I'm here to help you learn about spam classification, text preprocessing, vectorization, and machine learning models. Feel free to ask specific questions about any of these topics, and I'll do my best to assist you!";
}