# Chat-Viewer 프로젝트 수동 설정 지침

Firebase가 차단된 환경에서도 애플리케이션이 작동하도록 서버리스 함수를 구현했습니다. 아래 단계를 따라 설정을 완료해주세요.

## 1. Firebase 서비스 계정 키 생성

1. [Firebase 콘솔](https://console.firebase.google.com/)에 접속합니다.
2. 프로젝트 `chat-app-f36fe`를 선택합니다.
3. 왼쪽 메뉴에서 "프로젝트 설정"을 클릭합니다.
4. "서비스 계정" 탭을 선택합니다.
5. "새 비공개 키 생성"을 클릭합니다.
6. JSON 파일이 다운로드됩니다. 이 파일은 보안 정보를 포함하고 있으므로 안전하게 보관하세요.

## 2. 환경 변수 설정

### Netlify 배포를 위한 환경 변수 설정

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

### 로컬 개발을 위한 환경 변수 설정

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

## 3. 패키지 설치

프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 필요한 패키지를 설치합니다:

```bash
npm install firebase-admin netlify-cli --save
```

## 4. 로컬 테스트

로컬에서 서버리스 함수를 포함한 개발 서버를 실행합니다:

```bash
npm run dev
```

## 5. Netlify 배포

변경사항을 Netlify에 배포합니다:

```bash
# 빌드
npm run build

# Netlify CLI로 배포 (CLI가 설치된 경우)
netlify deploy --prod

# 또는 Netlify 대시보드를 통해 수동으로 배포
```

## 6. Firebase 보안 규칙 확인

Firebase 콘솔에서 Firestore 및 Realtime Database의 보안 규칙을 확인하여 Netlify Functions에서 접근할 수 있도록 설정되어 있는지 확인합니다.

## 참고 사항

- 서비스 계정 키는 절대로 공개 저장소에 커밋하지 마세요.
- `.env` 파일은 `.gitignore`에 추가하여 Git에 포함되지 않도록 하세요.
- 더 자세한 내용은 `FIREBASE_ADMIN_SETUP.md` 파일을 참조하세요.
