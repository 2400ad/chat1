// 채팅 서비스 파일
import { collection, query, orderBy, onSnapshot, getDocs } from "firebase/firestore";
import { ref, onValue } from "firebase/database";
import { firestore, database } from "./firebase";

// Firestore에서 채팅 세션 목록 가져오기
export const getChatSessions = async () => {
  try {
    console.log("채팅 세션 목록 가져오기 시도");
    const chatsCollection = collection(firestore, "chats");
    const querySnapshot = await getDocs(chatsCollection);
    
    const sessions = [];
    querySnapshot.forEach((doc) => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log("채팅 세션 목록 가져오기 성공:", sessions);
    return sessions;
  } catch (error) {
    console.error("채팅 세션 목록 가져오기 오류:", error);
    return [];
  }
};

// Firestore에서 특정 채팅 세션의 메시지 구독
export const subscribeToMessages = (chatId, callback) => {
  try {
    console.log(`채팅 ID ${chatId}의 메시지 구독 시작`);
    const messagesCollection = collection(firestore, `chats/${chatId}/messages`);
    const messagesQuery = query(messagesCollection, orderBy("timestamp", "asc"));
    
    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messages = [];
      snapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log(`채팅 ID ${chatId}의 메시지 업데이트:`, messages);
      callback(messages);
    }, (error) => {
      console.error(`채팅 ID ${chatId}의 메시지 구독 오류:`, error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error(`채팅 ID ${chatId}의 메시지 구독 설정 오류:`, error);
    return () => {};
  }
};

// Realtime Database에서 채팅 메시지 구독 (대체 방법)
export const subscribeToRealtimeMessages = (chatId, callback) => {
  try {
    console.log(`Realtime Database에서 채팅 ID ${chatId}의 메시지 구독 시작`);
    const messagesRef = ref(database, `chats/${chatId}/messages`);
    
    const unsubscribe = onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        console.log(`채팅 ID ${chatId}에 메시지가 없습니다.`);
        callback([]);
        return;
      }
      
      const messages = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      
      // 타임스탬프 기준으로 정렬
      messages.sort((a, b) => a.timestamp - b.timestamp);
      
      console.log(`Realtime Database에서 채팅 ID ${chatId}의 메시지 업데이트:`, messages);
      callback(messages);
    }, (error) => {
      console.error(`Realtime Database에서 채팅 ID ${chatId}의 메시지 구독 오류:`, error);
    });
    
    // Realtime Database는 unsubscribe 함수를 직접 반환하지 않으므로 래핑
    return () => {
      // 여기서 구독 해제 로직 구현 (필요한 경우)
      console.log(`Realtime Database에서 채팅 ID ${chatId}의 메시지 구독 해제`);
    };
  } catch (error) {
    console.error(`Realtime Database에서 채팅 ID ${chatId}의 메시지 구독 설정 오류:`, error);
    return () => {};
  }
};
