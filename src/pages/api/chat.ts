// 这个文件在实际部署时需要替换为真实的API端点
// 目前仅作为模拟API的示例

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    
    // 模拟API响应延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Processing message for session ${sessionId}: ${message}`);
    
    let response = "";
    
    // 简单的关键词匹配逻辑
    if (message.toLowerCase().includes("vector") || message.toLowerCase().includes("vectorization")) {
      response = "Text vectorization is the process of converting text into numerical vectors that can be used by machine learning algorithms. The three main approaches are Bag of Words (BOW), TF-IDF, and Word Embeddings.";
    } else if (message.toLowerCase().includes("tf-idf")) {
      response = "TF-IDF (Term Frequency-Inverse Document Frequency) is a numerical statistic that reflects how important a word is to a document in a collection. It weighs terms based on how frequently they appear in a document and how rarely they appear across all documents.";
    } else if (message.toLowerCase().includes("bag of words") || message.toLowerCase().includes("bow")) {
      response = "Bag of Words (BOW) is a simple text vectorization method that counts the frequency of each word in a document, disregarding grammar and word order but keeping track of multiplicity.";
    } else if (message.toLowerCase().includes("word embedding") || message.toLowerCase().includes("word2vec") || message.toLowerCase().includes("glove")) {
      response = "Word Embeddings are dense vector representations of words that capture semantic relationships. Popular techniques include Word2Vec, GloVe, and FastText. These methods create vectors where similar words are closer in the vector space.";
    } else {
      response = "I'm here to help with your questions about text vectorization and spam classification. What would you like to know?";
    }
    
    return new Response(JSON.stringify({ response, sessionId }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200
    });
  } catch (error) {
    console.error('Error processing chat request:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}