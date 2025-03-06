import React, { useState, useEffect } from 'react';
import { getChatSessions } from '../firebase/chatService';
import '../styles/ChatList.css';

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [chatSessions, setChatSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 타임스탬프를 포맷팅하는 함수
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '날짜 없음';
    
    try {
      // Firestore 타임스탬프 객체인 경우
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1000).toLocaleString();
      }
      // Date 객체인 경우
      else if (timestamp instanceof Date) {
        return timestamp.toLocaleString();
      }
      // 숫자(밀리초)인 경우
      else if (typeof timestamp === 'number') {
        return new Date(timestamp).toLocaleString();
      }
      // 문자열인 경우
      else if (typeof timestamp === 'string') {
        return new Date(timestamp).toLocaleString();
      }
      // 기타 경우
      return '유효하지 않은 날짜';
    } catch (error) {
      console.error('날짜 포맷팅 오류:', error);
      return '날짜 오류';
    }
  };

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

  useEffect(() => {
    loadChatSessions();
    
    // 30초마다 자동 새로고침
    const refreshInterval = setInterval(() => {
      console.log('채팅 세션 자동 새로고침');
      loadChatSessions();
    }, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const handleRefresh = async () => {
    await loadChatSessions();
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
        <div className="no-chats">
          <p>채팅 세션이 없습니다.</p>
          <p className="hint">로컬 chat-app에서 채팅을 시작하면 여기에 표시됩니다.</p>
        </div>
      ) : (
        <ul className="sessions-list">
          {chatSessions.map((session) => (
            <li 
              key={session.id}
              className={`session-item ${selectedChatId === session.id ? 'selected' : ''}`}
              onClick={() => onSelectChat(session.id)}
            >
              <div className="session-info">
                <span className="session-title">{session.title || '새 채팅'}</span>
                <span className="session-date">
                  {formatTimestamp(session.createdAt)}
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
