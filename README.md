# Chat Viewer 애플리케이션

Firebase를 사용한 채팅 뷰어 애플리케이션입니다. 이 애플리케이션은 Firebase Firestore와 Realtime Database에 저장된 채팅 세션과 메시지를 표시합니다.

## 주요 기능

- 채팅 세션 목록 표시
- 채팅 메시지 실시간 표시
- 서버리스 함수를 통한 Firebase 접근 (Firebase 차단 환경 대응)

## 설치 및 실행

### 로컬 개발 환경

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (Netlify Functions 포함)
npm run dev

# 일반 React 개발 서버만 실행 (Functions 없음)
npm start
```

### 배포

```bash
# 빌드
npm run build

# Netlify 배포
netlify deploy --prod
```

## Firebase 차단 환경 대응 방법

이 애플리케이션은 Firebase가 차단된 환경에서도 작동할 수 있도록 서버리스 함수(Netlify Functions)를 사용합니다:

1. 클라이언트(브라우저)는 Firebase에 직접 접근하지 않고 Netlify Functions에 요청합니다.
2. Netlify Functions는 서버 측에서 Firebase Admin SDK를 사용하여 데이터를 가져옵니다.
3. 가져온 데이터를 클라이언트에 반환합니다.

이 방식을 사용하면 클라이언트 측에서 Firebase에 직접 접근할 필요가 없으므로, Firebase가 차단된 환경에서도 애플리케이션이 정상적으로 작동합니다.

## Firebase Admin SDK 설정

서버리스 함수에서 Firebase Admin SDK를 사용하기 위해서는 서비스 계정 키가 필요합니다. 자세한 설정 방법은 [FIREBASE_ADMIN_SETUP.md](./FIREBASE_ADMIN_SETUP.md) 파일을 참조하세요.

## 기술 스택

- React
- Firebase (Firestore, Realtime Database)
- Firebase Admin SDK
- Netlify Functions (서버리스)

## 폴더 구조

```
chat-viewer/
├── netlify/
│   └── functions/           # 서버리스 함수
│       ├── getChatSessions.js
│       └── getMessages.js
├── public/                  # 정적 파일
├── src/
│   ├── components/          # React 컴포넌트
│   ├── firebase/            # Firebase 관련 코드
│   ├── styles/              # CSS 파일
│   ├── App.js               # 메인 App 컴포넌트
│   └── index.js             # 진입점
├── .env                     # 환경 변수 (로컬 개발용)
├── netlify.toml             # Netlify 설정
└── package.json             # 의존성 및 스크립트
```

## 문제 해결

- **채팅 세션이 표시되지 않는 경우**: 
  1. 브라우저 콘솔에서 오류 메시지 확인
  2. 네트워크 탭에서 API 요청 확인
  3. Netlify Functions 로그 확인 (`netlify functions:invoke getChatSessions`)

- **Firebase 접근 오류**: 
  1. Firebase 서비스 계정 키 설정 확인
  2. Netlify 환경 변수 설정 확인
