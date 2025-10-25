/**
 * 식물 도감 분석 API - Backend
 *
 * Google Gemini AI를 사용하여 식물 사진을 분석하는 서비스입니다.
 *
 * 주요 기능:
 * - 이미지 업로드 (multipart/form-data)
 * - Gemini AI를 통한 식물 분석
 * - CORS 설정
 * - 에러 처리
 */

const express = require('express');
const cors = require('cors');
const Busboy = require('busboy');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// ============================================
// 상수 정의
// ============================================

/** 업로드 가능한 최대 파일 크기 (10MB) */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** 허용되는 이미지 MIME 타입 */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp'
]);

/** Busboy 파일 파싱 제한 */
const BUSBOY_LIMITS = {
  fileSize: MAX_FILE_SIZE_BYTES,
  files: 1,
  fields: 20,
  parts: 25,
};

/** Gemini AI 모델 */
const GEMINI_MODEL = 'gemini-2.0-flash-exp';

/** AI 프롬프트: 식물 분석 지침 */
const PLANT_PROMPT = `너는 식물 도감 역할을 맡은 식물 전문가야.  
사용자가 올린 식물 사진을 분석해서 아래 JSON 형식으로 결과를 반환해줘.  

- 사진에 여러 식물이 있을 경우, 사진의 중앙에서 가장 가까운 식물을 우선 분석해줘.  
- 반드시 다음 항목들을 포함해줘:  
  - 식물 이름(name)  
  - 식물 형태(type) 및 대응 코드(type_code)  
  - 설명(description): 간단한 설명, 학명, 과, 속, 종, 추가 설명 순서로 쉼표 또는 괄호로 구분된 하나의 문장으로 작성  
  - 활동성 곡선(activity_curve): 1월부터 12월까지 각 달의 활동성을 0~1 범위로 표현한 배열 (인덱스 0=1월, 1=2월, ..., 11=12월)  
  - 활동성 노트(activity_notes): 활동성 곡선에 대한 간단한 설명  

- 'type' 값은 반드시 아래 7가지 중 하나를 정확히 사용하고, 해당하는 'type_code'도 정확히 매칭해줘:  
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

반드시 JSON 형식으로만 응답해줘.`;

// ============================================
// 커스텀 에러 클래스
// ============================================

class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = 'HttpError';
  }
}

// ============================================
// CORS 설정
// ============================================

function getAllowedOrigins() {
  return [
    'https://pio.apps.tossmini.com',
    'https://pio.private-apps.tossmini.com',
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

// JSON body parser 추가
app.use(express.json({ limit: '10mb' }));

// ============================================
// AI 식물 분석 함수
// ============================================

/**
 * Gemini AI를 사용하여 식물을 분석합니다.
 *
 * @param {Buffer} imageBuffer - 업로드된 이미지 데이터
 * @returns {Promise<Object>} 식물 분석 결과 JSON
 */
async function analyzePlant(imageBuffer) {
  // 1. API 키 확인
  const apiKey = process.env.AI_API_KEY;

  if (!apiKey) {
    console.error('FATAL: AI_API_KEY is not configured');
    throw new Error('AI_API_KEY not configured');
  }

  // 2. Gemini AI 클라이언트 초기화
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

  // 3. 요청 데이터 구성
  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg',
      data: imageBuffer.toString('base64'),
    },
  };

  // 4. AI 분석 요청
  const result = await model.generateContent([PLANT_PROMPT, imagePart]);
  const response = await result.response;

  // 5. 응답 텍스트 추출
  const resultText = response.text();

  // 6. JSON 파싱
  try {
    // 코드 블록 제거 (```json ``` 등)
    let cleanedText = resultText.trim();
    cleanedText = cleanedText.replace(/^```json\s*\n?/i, '');
    cleanedText = cleanedText.replace(/^```\s*\n?/i, '');
    cleanedText = cleanedText.replace(/\n?```\s*$/i, '');
    cleanedText = cleanedText.trim();

    return JSON.parse(cleanedText);
  } catch (parseError) {
    console.error('JSON 파싱 오류:', parseError);
    console.error('원본 텍스트:', resultText);
    throw new Error('AI 응답을 파싱할 수 없습니다.');
  }
}

// ============================================
// 이미지 업로드 처리 함수
// ============================================

/**
 * multipart/form-data 요청에서 이미지 파일을 추출합니다.
 *
 * @param {Request} req - Express 요청 객체
 * @returns {Promise<Buffer|null>} 이미지 버퍼 또는 null
 */
function receiveImage(req) {
  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: req.headers,
      limits: BUSBOY_LIMITS,
    });

    let fileBuffer = null;
    let hasFile = false;

    // 파일 업로드 이벤트
    busboy.on('file', (_fieldname, file, fileInfo) => {
      hasFile = true;

      // MIME 타입 검증
      const mimeType = fileInfo.mimeType || fileInfo.mime || 'application/octet-stream';

      if (!ALLOWED_MIME_TYPES.has(mimeType)) {
        file.resume();
        reject(new HttpError(415, 'Unsupported file type. Please upload a JPEG, PNG, or WEBP image.'));
        return;
      }

      // 파일 데이터 수집
      const chunks = [];

      file.on('data', (chunk) => {
        chunks.push(chunk);
      });

      // 파일 크기 초과 시
      file.on('limit', () => {
        file.resume();
        reject(new HttpError(413, 'File too large. Maximum allowed size is 10MB.'));
      });

      // 파일 읽기 완료
      file.on('end', () => {
        fileBuffer = Buffer.concat(chunks);
      });
    });

    // 폼 필드 크기 초과
    busboy.on('field', (_name, _val, info) => {
      if (info && info.truncated) {
        reject(new HttpError(413, 'Form field too large.'));
      }
    });

    // 에러 처리
    busboy.on('error', (error) => {
      if (error.message === 'Unexpected end of form') {
        reject(new HttpError(400, 'Upload was interrupted. Please try again.'));
      } else {
        reject(error);
      }
    });

    // 제한 초과 이벤트
    busboy.on('partsLimit', () => {
      reject(new HttpError(413, 'Too many form parts.'));
    });

    busboy.on('filesLimit', () => {
      reject(new HttpError(413, 'Only one image can be uploaded at a time.'));
    });

    busboy.on('fieldsLimit', () => {
      reject(new HttpError(413, 'Too many form fields.'));
    });

    // 파싱 완료
    busboy.on('finish', () => {
      if (!hasFile || !fileBuffer || fileBuffer.length === 0) {
        resolve(null);
        return;
      }

      resolve(fileBuffer);
    });

    // 요청 바디를 Busboy로 파이핑
    try {
      if (req.rawBody instanceof Buffer) {
        busboy.end(req.rawBody);
      } else if (typeof req.rawBody === 'string') {
        busboy.end(Buffer.from(req.rawBody));
      } else {
        req.pipe(busboy);
      }
    } catch (error) {
      reject(error);
    }
  });
}

// ============================================
// API 엔드포인트
// ============================================

/**
 * POST /analyze
 * 식물 이미지를 업로드하고 AI 분석 결과를 반환합니다.
 *
 * 요청:
 * - Content-Type: multipart/form-data
 * - Body: image (파일)
 *
 * 응답:
 * - 성공: { code: "success", name: "...", type: "...", ... }
 * - 실패: { code: "error", error: "..." }
 */
app.post('/analyze', async (req, res) => {
  try {
    const contentType = req.headers['content-type'] || '';
    let fileBuffer = null;

    // JSON 형태의 Base64 데이터 처리
    if (contentType.toLowerCase().includes('application/json')) {
      const { image } = req.body;
      
      if (!image) {
        throw new HttpError(400, 'No image provided');
      }

      // Base64 데이터를 Buffer로 변환
      const base64Data = image.replace(/^data:image\/[a-z]+;base64,/, '');
      fileBuffer = Buffer.from(base64Data, 'base64');
    }
    // multipart/form-data 처리
    else if (contentType.toLowerCase().includes('multipart/form-data')) {
      fileBuffer = await receiveImage(req);
      
      if (!fileBuffer) {
        throw new HttpError(400, 'No image provided');
      }
    }
    else {
      throw new HttpError(400, 'Content-Type must be multipart/form-data or application/json.');
    }

    // AI 식물 분석
    const result = await analyzePlant(fileBuffer);

    // 성공 응답
    res.json(result);
  } catch (error) {
    // 5. 에러 로깅
    console.error('Analysis error:', {
      message: error && error.message,
      origin: req.headers.origin,
      timestamp: new Date().toISOString(),
    });

    // 6. 에러 응답
    const status = error instanceof HttpError && typeof error.status === 'number'
      ? error.status
      : 500;

    res.status(status).json({
      code: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * GET /
 * 서버 상태 확인용 헬스 체크 엔드포인트
 */
app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: '식물 분석 API 서버가 정상 작동 중입니다.' });
});

// ============================================
// 전역 에러 핸들러
// ============================================

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

// ============================================
// 서버 시작
// ============================================

const PORT = process.env.PORT || 8080;

if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`서버가 0.0.0.0:${PORT}에서 실행 중입니다.`);
  });
}

// ============================================
// Export
// ============================================

exports.plantAnalysis = app;

