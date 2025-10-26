// 在renderContent函数中的case "1.1"部分
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