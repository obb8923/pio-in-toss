import {
  AI_API_KEY,
  BE_ENDPOINT_URL,
} from '@env';

export const config = {
  ai: {
    apiKey: AI_API_KEY,
  },
  api: {
    baseUrl: BE_ENDPOINT_URL || 'http://localhost:8080',
    timeout: 10000,
  },
};

export default config;
