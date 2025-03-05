import React, { useState } from 'react';
import ChatList from './components/ChatList';
import ChatViewer from './components/ChatViewer';
import './styles/App.css';

function App() {
  const [selectedChatId, setSelectedChatId] = useState(null);

  const handleSelectChat = (chatId) => {
    setSelectedChatId(chatId);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Firebase 채팅 뷰어</h1>
      </header>
      <main className="App-main">
        <ChatList onSelectChat={handleSelectChat} selectedChatId={selectedChatId} />
        <ChatViewer selectedChatId={selectedChatId} />
      </main>
    </div>
  );
}

export default App;
