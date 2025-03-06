// Netlify 서버리스 함수: Firebase에서 특정 채팅의 메시지 가져오기
const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

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
    // URL 파라미터에서 chatId 가져오기
    const chatId = event.queryStringParameters?.chatId;
    
    if (!chatId) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'chatId 파라미터가 필요합니다.' })
      };
    }
    
    console.log(`채팅 ID ${chatId}의 메시지 가져오기 시작`);
    
    // Firestore에서 메시지 가져오기
    const messagesCollection = firestore.collection('chats').doc(chatId).collection('messages');
    const snapshot = await messagesCollection.orderBy('timestamp', 'asc').get();
    
    const messages = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      
      // 타임스탬프 처리
      const timestamp = data.timestamp ? data.timestamp.toDate() : new Date();
      
      messages.push({
        id: doc.id,
        ...data,
        timestamp: timestamp.toISOString()
      });
    });
    
    console.log(`${messages.length}개의 메시지를 찾았습니다.`);
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ messages })
    };
  } catch (error) {
    console.error('메시지 가져오기 오류:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '메시지를 가져오는 중 오류가 발생했습니다.',
        message: error.message
      })
    };
  }
};
