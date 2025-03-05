// Firebase 설정 파일
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// Firebase 구성 정보
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyByIUq4XM1FEAW53sIXMWHujFRRm4dgchU",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "chat-app-f36fe.firebaseapp.com",
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL || "https://chat-app-f36fe-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "chat-app-f36fe",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "chat-app-f36fe.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "529322077582",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:529322077582:web:c61c0e2d69c504631b08df"
};

// 환경 변수 디버깅
console.log("환경 변수 확인:", {
  NODE_ENV: process.env.NODE_ENV,
  FIREBASE_CONFIG: {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? "설정됨" : "설정되지 않음",
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? "설정됨" : "설정되지 않음",
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL ? "설정됨" : "설정되지 않음",
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? "설정됨" : "설정되지 않음",
  }
});

// Firebase 초기화
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);

console.log("Firebase 초기화 완료");

export { app, firestore, database };
