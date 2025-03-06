// 채팅 서비스 파일
import { firestore, database } from "./firebase";

// API 기본 URL (개발/프로덕션 환경에 따라 다름)
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

// Netlify 서버리스 함수를 통해 채팅 세션 목록 가져오기
export const getChatSessions = async () => {
  try {
    console.log("서버리스 함수를 통해 채팅 세션 목록 가져오기 시도");
    
    const response = await fetch(`${API_BASE_URL}/getChatSessions`);
    
    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }
    
    const data = await response.json();
    console.log("서버리스 함수에서 채팅 세션 가져오기 성공:", data.sessions);
    
    if (data.sessions && data.sessions.length > 0) {
      return data.sessions;
    }
    
    return [];
  } catch (error) {
    console.error("채팅 세션 목록 가져오기 오류:", error);
    return [];
  }
};

// Netlify 서버리스 함수를 통해 특정 채팅 세션의 메시지 가져오기
export const getMessages = async (chatId) => {
  try {
    console.log(`서버리스 함수를 통해 채팅 ID ${chatId}의 메시지 가져오기 시도`);
    
    const response = await fetch(`${API_BASE_URL}/getMessages?chatId=${chatId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP 오류: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`서버리스 함수에서 메시지 가져오기 성공: ${data.messages.length}개`);
    
    return data.messages;
  } catch (error) {
    console.error("메시지 가져오기 오류:", error);
    return [];
  }
};

// Netlify 서버리스 함수를 통해 특정 채팅 세션의 메시지 구독 (폴링 방식)
export const subscribeToMessages = (chatId, callback) => {
  let intervalId = null;
  
  const fetchMessages = async () => {
    try {
      const messages = await getMessages(chatId);
      callback(messages);
    } catch (error) {
      console.error("메시지 구독 중 오류:", error);
    }
  };
  
  // 초기 데이터 로드
  fetchMessages();
  
  // 5초마다 새로운 메시지 확인 (폴링 방식)
  intervalId = setInterval(fetchMessages, 5000);
  
  // 구독 해제 함수 반환
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  };
};

// Realtime Database에서 메시지 구독 (백업 방식 - 폴링 구현)
export const subscribeToRealtimeMessages = (chatId, callback) => {
  try {
    console.log(`서버리스 함수를 통해 Realtime Database 메시지 구독 시도`);
    
    let intervalId = null;
    
    const fetchMessages = async () => {
      try {
        // 서버리스 함수를 통해 Realtime Database 메시지 가져오기
        const response = await fetch(`${API_BASE_URL}/getRealtimeMessages?chatId=${chatId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP 오류: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.messages && data.messages.length > 0) {
          callback(data.messages);
        }
      } catch (error) {
        console.error("Realtime Database 메시지 구독 중 오류:", error);
      }
    };
    
    // 초기 데이터 로드
    fetchMessages();
    
    // 5초마다 새로운 메시지 확인 (폴링 방식)
    intervalId = setInterval(fetchMessages, 5000);
    
    // 구독 해제 함수 반환
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  } catch (error) {
    console.error("Realtime Database 메시지 구독 설정 오류:", error);
    return () => {};
  }
};
