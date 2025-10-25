import {
  AI_API_KEY,
} from '@env';

export const config = {
  ai: {
    apiKey: AI_API_KEY,
  },
  // 다른 백엔드 API 설정을 여기에 추가할 수 있습니다
  api: {
    baseUrl: process.env.API_BASE_URL || 'https://your-api.com',
    timeout: 10000,
  },
};

export default config;
