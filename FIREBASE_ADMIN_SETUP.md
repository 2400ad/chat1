# Firebase Admin SDK 설정 가이드

이 문서는 Firebase Admin SDK를 사용하여 서버 측에서 Firebase에 접근하기 위한 설정 방법을 안내합니다.

## 서비스 계정 키 생성하기

1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속합니다.
2. 프로젝트를 선택합니다 (chat-app-f36fe).
3. 왼쪽 메뉴에서 "프로젝트 설정"을 클릭합니다.
4. "서비스 계정" 탭을 선택합니다.
5. "새 비공개 키 생성"을 클릭합니다.
6. JSON 파일이 다운로드됩니다. 이 파일은 매우 중요한 보안 정보를 포함하고 있으므로 안전하게 보관하세요.

## Netlify에 환경 변수 설정하기

1. [Netlify 대시보드](https://app.netlify.com/)에 접속합니다.
2. 해당 사이트를 선택합니다.
3. "Site settings" > "Build & deploy" > "Environment" > "Environment variables"로 이동합니다.
4. 다음 환경 변수를 추가합니다:

```
FIREBASE_PROJECT_ID=<서비스 계정 JSON의 project_id 값>
FIREBASE_PRIVATE_KEY_ID=<서비스 계정 JSON의 private_key_id 값>
FIREBASE_PRIVATE_KEY=<서비스 계정 JSON의 private_key 값>
FIREBASE_CLIENT_EMAIL=<서비스 계정 JSON의 client_email 값>
FIREBASE_CLIENT_ID=<서비스 계정 JSON의 client_id 값>
FIREBASE_CLIENT_CERT_URL=<서비스 계정 JSON의 client_x509_cert_url 값>
FIREBASE_DATABASE_URL=https://chat-app-f36fe-default-rtdb.asia-southeast1.firebasedatabase.app
```

**중요**: `FIREBASE_PRIVATE_KEY` 값을 입력할 때 JSON 파일의 값을 그대로 복사해야 합니다. 이 값은 보통 `"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` 형식입니다.

## 로컬 개발 환경 설정하기

로컬에서 Netlify Functions를 테스트하려면:

1. 프로젝트 루트에 `.env` 파일을 생성합니다.
2. 다음 내용을 추가합니다:

```
FIREBASE_PROJECT_ID=<서비스 계정 JSON의 project_id 값>
FIREBASE_PRIVATE_KEY_ID=<서비스 계정 JSON의 private_key_id 값>
FIREBASE_PRIVATE_KEY="<서비스 계정 JSON의 private_key 값>"
FIREBASE_CLIENT_EMAIL=<서비스 계정 JSON의 client_email 값>
FIREBASE_CLIENT_ID=<서비스 계정 JSON의 client_id 값>
FIREBASE_CLIENT_CERT_URL=<서비스 계정 JSON의 client_x509_cert_url 값>
FIREBASE_DATABASE_URL=https://chat-app-f36fe-default-rtdb.asia-southeast1.firebasedatabase.app
```

3. 다음 명령어로 로컬 개발 서버를 실행합니다:

```
npm install
npm run dev
```

## 보안 주의사항

- 서비스 계정 키는 절대로 공개 저장소에 커밋하지 마세요.
- `.env` 파일은 `.gitignore`에 추가하여 Git에 포함되지 않도록 하세요.
- 서비스 계정에는 최소한의 권한만 부여하세요.
