// Netlify 서버리스 함수: Firebase에서 채팅 세션 가져오기
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { getDatabase } = require('firebase-admin/database');

// Firebase Admin SDK 초기화
let app;
try {
  app = initializeApp({
    credential: require('firebase-admin').credential.cert({
      "type": "service_account",
      "project_id": process.env.FIREBASE_PROJECT_ID,
      "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
      "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      "client_email": process.env.FIREBASE_CLIENT_EMAIL,
      "client_id": process.env.FIREBASE_CLIENT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL
  });
} catch (error) {
  // 이미 초기화된 경우 기존 앱 사용
  console.log('Firebase 앱이 이미 초기화되어 있습니다.');
}

// Firestore 인스턴스 가져오기
const firestore = getFirestore();

exports.handler = async function(event, context) {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONS 요청 처리 (CORS preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: 'CORS preflight 요청 성공' })
    };
  }

  try {
    console.log('채팅 세션 가져오기 시작');
    
    // Firestore에서 채팅 세션 가져오기
    const chatsCollection = firestore.collection('chats');
    const snapshot = await chatsCollection.get();
    
    const sessions = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // 타임스탬프 처리
      const createdAt = data.createdAt ? data.createdAt.toDate() : new Date();
      const updatedAt = data.updatedAt ? data.updatedAt.toDate() : new Date();
      
      sessions.push({
        id: doc.id,
        ...data,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString()
      });
    });
    
    console.log(`${sessions.length}개의 채팅 세션을 찾았습니다.`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessions })
    };
  } catch (error) {
    console.error('채팅 세션 가져오기 오류:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '채팅 세션을 가져오는 중 오류가 발생했습니다.',
        message: error.message
      })
    };
  }
};
