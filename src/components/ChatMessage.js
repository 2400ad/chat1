import React from 'react';
import '../styles/ChatMessage.css';

const ChatMessage = ({ message }) => {
  // 타임스탬프를 읽기 쉬운 형식으로 변환
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    let date;
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (timestamp.seconds) {
      // Firestore 타임스탬프 처리
      date = new Date(timestamp.seconds * 1000);
    } else {
      return '';
    }
    
    return date.toLocaleString();
  };

  return (
    <div className={`chat-message ${message.sender === 'user' ? 'user-message' : 'llm-message'}`}>
      <div className="message-header">
        <span className="sender">{message.sender === 'user' ? '사용자' : 'AI'}</span>
        <span className="timestamp">{formatTimestamp(message.timestamp)}</span>
      </div>
      <div className="message-content">
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;
