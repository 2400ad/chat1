import React, { useState, useEffect, useRef } from 'react';
import { subscribeToMessages, subscribeToRealtimeMessages } from '../firebase/chatService';
import ChatMessage from './ChatMessage';
import '../styles/ChatViewer.css';

const ChatViewer = ({ selectedChatId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // 메시지 목록이 업데이트될 때 자동 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedChatId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    console.log(`선택된 채팅 ID: ${selectedChatId}`);

    // Firestore에서 메시지 구독
    const unsubscribeFirestore = subscribeToMessages(selectedChatId, (firestoreMessages) => {
      if (firestoreMessages.length > 0) {
        setMessages(firestoreMessages);
        setLoading(false);
      } else {
        // Firestore에 메시지가 없으면 Realtime Database에서 시도
        console.log("Firestore에 메시지가 없어 Realtime Database에서 시도합니다.");
      }
    });

    // Realtime Database에서 메시지 구독 (백업)
    const unsubscribeRealtime = subscribeToRealtimeMessages(selectedChatId, (realtimeMessages) => {
      if (realtimeMessages.length > 0 && messages.length === 0) {
        setMessages(realtimeMessages);
      }
      setLoading(false);
    });

    return () => {
      // 구독 해제
      unsubscribeFirestore();
      unsubscribeRealtime();
    };
  }, [selectedChatId]);

  if (!selectedChatId) {
    return (
      <div className="chat-viewer empty-state">
        <p>채팅을 선택해주세요.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="chat-viewer loading-state">
        <p>메시지를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="chat-viewer">
      <div className="chat-header">
        <h2>채팅 ID: {selectedChatId}</h2>
      </div>
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="no-messages">메시지가 없습니다.</p>
        ) : (
          messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatViewer;
