import React, { useState, useEffect } from 'react';
import { getChatSessions } from '../firebase/chatService';
import '../styles/ChatList.css';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadChatSessions = async () => {
      try {
        setLoading(true);
        const sessions = await getChatSessions();
        setChatSessions(sessions);
        setError(null);
      } catch (err) {
        console.error('채팅 세션 로딩 오류:', err);
        setError('채팅 세션을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadChatSessions();
  }, []);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const sessions = await getChatSessions();
      setChatSessions(sessions);
      setError(null);
    } catch (err) {
      console.error('채팅 세션 새로고침 오류:', err);
      setError('채팅 세션을 새로고침하는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="chat-list loading-state">
        <p>채팅 세션을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chat-list error-state">
        <p>{error}</p>
        <button onClick={handleRefresh}>다시 시도</button>
      </div>
    );
  }

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h2>채팅 세션</h2>
        <button onClick={handleRefresh} className="refresh-button">
          새로고침
        </button>
      </div>
      
      {chatSessions.length === 0 ? (
        <p className="no-chats">채팅 세션이 없습니다.</p>
      ) : (
        <ul className="sessions-list">
          {chatSessions.map((session) => (
            <li 
              key={session.id}
              className={`session-item ${selectedChatId === session.id ? 'selected' : ''}`}
              onClick={() => onSelectChat(session.id)}
            >
              <div className="session-info">
                <span className="session-id">{session.id}</span>
                <span className="session-date">
                  {session.createdAt ? new Date(session.createdAt.seconds * 1000).toLocaleString() : '날짜 없음'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ChatList;
