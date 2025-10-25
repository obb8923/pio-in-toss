# 식물 분석 API 서버 (PIO Backend)

Google Cloud Run에서 동작하는 식물 이미지 분석 API 서버입니다. Google Gemini AI를 활용하여 식물 사진을 분석하고 상세 정보를 제공합니다.

## 기능

- 식물 사진 업로드 및 분석
- 식물 이름, 유형, 설명 제공
- 월별 활동성 곡선 데이터 제공
- JSON 형식의 구조화된 응답
- CORS 정책 기반 보안 Origin 관리

## CORS 설정

보안을 위해 다음 도메인에서만 API 접근이 허용됩니다:

- `https://pio.apps.tossmini.com` - 실제 서비스 런칭용
- `https://pio.private-apps.tossmini.com` - 콘솔 QR 테스트용
- Origin이 없는 요청 (모바일 앱, Postman 등) - 허용

## 기술 스택

- **런타임**: Node.js 18+
- **프레임워크**: Express.js
- **AI 모델**: Google Gemini 2.0 Flash
- **언어**: JavaScript (ES6+)
- **배포**: Google Cloud Run

## 로컬 개발

### 사전 요구사항

- Node.js 18 이상
- npm
- Gemini API Key ([Google AI Studio](https://makersuite.google.com/app/apikey)에서 발급)

### 설치 및 실행

```bash
# 의존성 설치
npm install

# 환경 변수 설정
export GEMINI_API_KEY="your_api_key_here"

# 서버 실행
npm start
```

서버는 기본적으로 `http://localhost:8080`에서 실행됩니다.

## API 사용법

### 1. 헬스체크

```bash
GET /
```

**응답:**
```json
{
  "status": "ok",
  "message": "식물 분석 API 서버가 정상 작동 중입니다."
}
```

### 2. 식물 이미지 분석

```bash
POST /analyze
Content-Type: multipart/form-data
```

**파라미터:**
- `image`: 식물 이미지 파일 (JPEG, PNG, WEBP)

**요청 예시 (curl):**
```bash
curl -X POST \
  http://localhost:8080/analyze \
  -F "image=@plant.jpg"
```

**성공 응답 예시:**
```json
{
  "code": "success",
  "name": "달맞이꽃",
  "type": "꽃",
  "type_code": 1,
  "description": "달맞이꽃은 해질 무렵 노란 꽃이 피는 초본식물이며, 학명은 Oenothera biennis...",
  "activity_curve": [0.0, 0.0, 0.2, 0.5, 0.8, 1.0, 0.9, 0.6, 0.3, 0.1, 0.0, 0.0],
  "activity_notes": "6~7월 개화, 9~10월 결실 후 한해살이 종료"
}
```

**식물 유형 코드:**
- 0: 기타
- 1: 꽃
- 2: 관목
- 3: 나무
- 4: 선인장/다육
- 5: 수중식물
- 6: 덩굴식물
- 7: 잔디류

**오류 응답 예시:**
```json
{
  "code": "not_plant",
  "error": "식물 사진이 아닙니다. 다시 시도해주세요."
}
```

## Google Cloud Run 배포

### 간단한 배포

```bash
# Google Cloud 프로젝트 설정
gcloud config set project YOUR_PROJECT_ID

# Cloud Run에 배포
gcloud run deploy pio-be \
  --source . \
  --platform managed \
  --region asia-northeast3 \
  --allow-unauthenticated \
  --set-env-vars GEMINI_API_KEY="your_api_key_here" \
  --memory 512Mi \
  --timeout 60s
```

### 배포 스크립트 사용

```bash
# 실행 권한 부여
chmod +x deploy.sh

# 배포
export GEMINI_API_KEY="your_api_key"
./deploy.sh
```

## 로컬 Docker 테스트

```bash
# Docker 이미지 빌드
docker build -t pio-be .

# 컨테이너 실행
docker run -p 8080:8080 \
  -e GEMINI_API_KEY="your_api_key_here" \
  pio-be

# 테스트
curl http://localhost:8080/
```

## 테스트

```bash
# 헬스체크
curl http://localhost:8080/

# 식물 이미지 분석
curl -X POST \
  http://localhost:8080/analyze \
  -F "image=@plant.jpg"
```

## 문제 해결

### 1. CORS 오류
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```
**해결:** `index.js`의 `getAllowedOrigins()` 함수에 도메인 추가

### 2. API 키 오류
```
Error: GEMINI_API_KEY not configured
```
**해결:** 환경 변수를 올바르게 설정했는지 확인

### 3. 파일 크기 오류
```
File too large. Maximum allowed size is 10MB.
```
**해결:** 이미지 크기를 10MB 이하로 줄이거나 `MAX_FILE_SIZE_BYTES` 상수 수정

## 프로젝트 구조

```
pio-be/
├── index.js           # 메인 서버 코드
├── package.json       # 의존성 및 스크립트
├── Dockerfile         # Docker 이미지 빌드 설정
├── .dockerignore      # Docker 빌드 제외 파일
├── .gcloudignore      # Cloud Run 배포 제외 파일
├── deploy.sh          # 배포 자동화 스크립트
└── README.md          # 문서
```

## 라이선스

ISC
