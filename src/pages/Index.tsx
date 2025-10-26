// 只修改相关部分，其余代码保持不变

// 在ChatInterface组件调用部分
<ChatInterface 
  key={chatKey} 
  title="ChatBot Assistant" 
  onNewChat={handleNewChat}
  currentSection={activeSection}
  sectionContent={currentSectionContent}
  lastCheckpointQuestion={lastCheckpointQuestion || undefined}
  userChoices={userChoices}
/>