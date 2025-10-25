// PIO - Plant Identification & Overview
// Google Gemini AI를 사용하여 식물 이미지를 분석하고 식물 정보를 제공하는 서비스입니다.
// 주요 기능: Base64 이미지 분석, Gemini AI를 통한 식물 식별, 식물 정보 및 활동 곡선 제공, CORS 설정, 에러 처리

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// === 상수 정의 ===

// JSON 페이로드 최대 크기 (15MB - base64 인코딩으로 인한 오버헤드 고려)
const MAX_JSON_SIZE = '15mb';

// Gemini AI 모델 설정
const GEMINI_CONFIG = {
  model: 'gemini-2.0-flash-exp',
  temperature: 0.3,              // 일관된 응답을 위해 낮게 설정
  topK: 32,
  topP: 0.9,
};

// AI 프롬프트: 식물 분석 지침
const PLANT_ANALYSIS_PROMPT = `너는 식물 도감 역할을 맡은 식물 전문가야.
사용자가 올린 식물 사진을 분석해서 아래 JSON 형식으로 결과를 반환해줘.

- 사진에 여러 식물이 있을 경우, 사진의 중앙에서 가장 가까운 식물을 우선 분석해줘.
- 반드시 다음 항목들을 포함해줘:
  - 식물 이름(name)
  - 식물 형태(type) 및 대응 코드(type_code)
  - 설명(description): 간단한 설명, 학명, 과, 속, 종, 추가 설명 순서로 쉼표 또는 괄호로 구분된 하나의 문장으로 작성
  - 활동성 곡선(activity_curve): 1월부터 12월까지 각 달의 활동성을 0~1 범위로 표현한 배열 (인덱스 0=1월, 1=2월, ..., 11=12월)
  - 활동성 노트(activity_notes): 활동성 곡선에 대한 간단한 설명

- 'type' 값은 반드시 아래 8가지 중 하나를 정확히 사용하고, 해당하는 'type_code'도 정확히 매칭해줘:
  - 기타 (0)
  - 꽃 (1)
  - 관목 (2)
  - 나무 (3)
  - 선인장/다육 (4)
  - 수중식물 (5)
  - 덩굴식물 (6)
  - 잔디류 (7)

식물일 경우 예시 응답:
{
  "code": "success",
  "name": "달맞이꽃",
  "type": "꽃",
  "type_code": 1,
  "description": "달맞이꽃은 해질 무렵 노란 꽃이 피는 초본식물이며, 학명은 Oenothera biennis, 과는 물레나물과(Onagraceae), 속은 Oenothera, 종은 biennis입니다. 주로 6~7월에 개화하고 9~10월에 결실합니다.",
  "activity_curve": [0.0, 0.0, 0.2, 0.5, 0.8, 1.0, 0.9, 0.6, 0.3, 0.1, 0.0, 0.0],
  "activity_notes": "6~7월 개화, 9~10월 결실 후 한해살이 종료"
}

식물이 아닐 경우 예시 응답:
{
  "code": "not_plant",
  "error": "식물 사진이 아닙니다. 다시 시도해주세요."
}

판단이 불확실한 경우 예시 응답:
{
  "code": "low_confidence",
  "error": "식물로 보이나 정확한 종류를 식별하기 어렵습니다. 다른 각도의 사진을 시도해보세요."
}

기타 문제 발생 시 예시 응답:
{
  "code": "error",
  "error": "이미지 처리에 문제가 있습니다. 다시 시도해주세요."
}

중요:
- 반드시 위 JSON 형식으로만 응답해줘
- 마크다운 코드 블록을 사용하지 말고 순수 JSON만 반환해줘
- activity_curve는 정확히 12개의 값을 가진 배열이어야 해 (0~1 범위)
- type_code는 반드시 0~7 중 하나의 숫자여야 해`;

// 식물 타입 코드 검증 (0~7)
const VALID_TYPE_CODES = new Set([0, 1, 2, 3, 4, 5, 6, 7]);

// 식물 타입 이름 매핑
const PLANT_TYPE_NAMES = {
  0: '기타',
  1: '꽃',
  2: '관목',
  3: '나무',
  4: '선인장/다육',
  5: '수중식물',
  6: '덩굴식물',
  7: '잔디류'
};

// === 커스텀 에러 클래스 ===

// HTTP 상태 코드를 포함하는 에러 클래스
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

// === CORS 설정 ===

// 허용할 Origin 목록
function getAllowedOrigins() {
  return [
    'https://pio.apps.tossmini.com',
    'https://pio.private-apps.tossmini.com',
    'http://localhost:5173',
    'http://172.1.1.1:5173'
  ];
}

app.use(
  cors({
    origin: getAllowedOrigins(),
    credentials: true,
    allowedHeaders: ['Content-Type'],
    methods: ['GET', 'POST', 'OPTIONS'],
  }),
);

// JSON body parser 설정
app.use(express.json({ limit: MAX_JSON_SIZE }));

// === 유틸리티 함수 ===

// Base64 이미지 데이터에서 실제 base64 부분만 추출
function extractBase64(dataUri) {
  if (!dataUri) {
    throw new HttpError(400, 'Image data is required');
  }

  // data:image/jpeg;base64, 형식에서 base64 부분만 추출
  if (dataUri.includes(',')) {
    return dataUri.split(',')[1];
  }

  return dataUri;
}

// JSON 응답 파싱 및 검증
function parseAIResponse(text) {
  // 마크다운 코드 블록 제거 (```json ... ``` 형태)
  let cleaned = text.trim();
  
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
  }

  try {
    const result = JSON.parse(cleaned);
    
    // 필수 필드 검증
    if (!result.code) {
      throw new Error('Missing required field: code');
    }

    // success 응답인 경우 추가 검증
    if (result.code === 'success') {
      if (!result.name || result.type_code === undefined || !result.type || !result.description) {
        throw new Error('Success response missing required fields');
      }

      // type_code 검증 (0~7 숫자)
      const typeCode = Number(result.type_code);
      if (!VALID_TYPE_CODES.has(typeCode)) {
        console.warn(`Invalid plant type_code: ${result.type_code}, defaulting to 0 (기타)`);
        result.type_code = 0;
        result.type = '기타';
      } else {
        result.type_code = typeCode;
      }

      // activity_curve 검증 (12개 값, 0~1 범위)
      if (!Array.isArray(result.activity_curve) || result.activity_curve.length !== 12) {
        console.warn('Invalid activity_curve, generating default (12 months)');
        result.activity_curve = [0.3, 0.3, 0.4, 0.6, 0.8, 0.9, 0.9, 0.8, 0.6, 0.4, 0.3, 0.3];
      }

      // 각 값이 0~1 범위인지 확인
      result.activity_curve = result.activity_curve.map(val => {
        const num = Number(val);
        return Math.max(0, Math.min(1, num));
      });

      // activity_notes 검증
      if (!result.activity_notes) {
        console.warn('Missing activity_notes, using default');
        result.activity_notes = '연중 활동';
      }
    }

    return result;
  } catch (error) {
    console.error('JSON parsing error:', error.message);
    console.error('Raw response:', text);
    throw new HttpError(500, 'Failed to parse AI response');
  }
}

// === AI 식물 분석 함수 ===

// Gemini AI를 사용하여 식물 이미지를 분석합니다.
// 응답 형식:
// - success: { code, name, type, type_code, description, activity_curve, activity_notes }
//   - type_code: 0~7 (기타, 꽃, 관목, 나무, 선인장/다육, 수중식물, 덩굴식물, 잔디류)
//   - activity_curve: 12개 값 (1월~12월, 0~1 범위)
// - not_plant: { code: "not_plant", error: "message" }
// - low_confidence: { code: "low_confidence", error: "message" }
async function analyzePlant(imageBase64) {
  // 1. API 키 확인 (AI_API_KEY 또는 GEMINI_API_KEY)
  const apiKey = process.env.AI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.error('FATAL: AI_API_KEY is not configured');
    throw new HttpError(500, 'Server configuration error');
  }

  // 2. Gemini AI 클라이언트 초기화
  const ai = new GoogleGenerativeAI(apiKey);

  // 3. 요청 데이터 구성
  const contents = [
    {
      role: 'user',
      parts: [
        { text: PLANT_ANALYSIS_PROMPT },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64,
          },
        },
      ],
    },
  ];

  const config = {
    temperature: GEMINI_CONFIG.temperature,
    topK: GEMINI_CONFIG.topK,
    topP: GEMINI_CONFIG.topP,
  };

  try {
    // 4. AI 분석 요청
    const model = ai.getGenerativeModel({ 
      model: GEMINI_CONFIG.model,
      generationConfig: config,
    });
    
    const response = await model.generateContent(contents);

    // 5. 응답 텍스트 추출
    const aiResponse = await response.response;
    const resultText = aiResponse.text();

    if (!resultText) {
      throw new Error('Empty response from AI');
    }

    // 6. JSON 파싱 및 검증
    const parsedResult = parseAIResponse(resultText);

    return parsedResult;

  } catch (error) {
    console.error('AI analysis error:', error.message);
    
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError(500, 'Failed to analyze image');
  }
}

// === API 엔드포인트 ===

// POST /analyze - 식물 이미지를 분석합니다.
// 요청: Content-Type: application/json, Body: { image: "data:image/jpeg;base64,..." }
// 응답: { code: "success", name, type, type_code, description, activity_curve, activity_notes }
//   - type: 식물 형태 이름 (예: "꽃", "나무")
//   - type_code: 0~7 숫자
//   - activity_curve: 12개 월별 활동성 값 (0~1 범위)
app.post('/analyze', async (req, res) => {
  try {
    // 1. 요청 검증
    const { image } = req.body;

    if (!image) {
      throw new HttpError(400, 'Image data is required');
    }

    // 2. Base64 데이터 추출
    const base64Data = extractBase64(image);

    // 3. 이미지 크기 간단 검증 (base64는 대략 원본의 1.33배)
    const estimatedBytes = (base64Data.length * 3) / 4;
    const maxBytes = 10 * 1024 * 1024; // 10MB

    if (estimatedBytes > maxBytes) {
      throw new HttpError(413, 'Image too large. Maximum size is 10MB');
    }

    // 4. AI 분석 실행
    const result = await analyzePlant(base64Data);

    // 5. 성공 응답
    res.json(result);

  } catch (error) {
    // 6. 에러 로깅
    console.error('Analysis error:', {
      message: error && error.message,
      origin: req.headers.origin,
      timestamp: new Date().toISOString(),
    });

    // 7. 에러 응답
    const status = error instanceof HttpError && typeof error.status === 'number'
      ? error.status
      : 500;

    res.status(status).json({
      code: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /health - 서버 상태 확인용 헬스 체크 엔드포인트
app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok',
    service: 'PIO - Plant Identification & Overview',
    timestamp: new Date().toISOString()
  });
});

// GET / - 루트 경로, 서비스 정보 제공
app.get('/', (_req, res) => {
  res.json({
    service: 'PIO - Plant Identification & Overview',
    version: '1.0.0',
    endpoints: {
      analyze: 'POST /analyze - Analyze plant images',
      health: 'GET /health - Health check',
    },
  });
});

// === 전역 에러 핸들러 ===

// Express 전역 에러 핸들러
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);

  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    code: 'error',
    error: err instanceof Error ? err.message : 'Unknown error',
  });
});

// === Export ===

// Google Cloud Functions용
module.exports.helloHttp = app;

// 로컬 개발 또는 다른 환경용
module.exports.app = app;

// 로컬 서버 실행 (직접 실행 시)
if (require.main === module) {
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`🌿 PIO Backend Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
  });
}

