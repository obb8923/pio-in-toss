import {
  AI_API_KEY,
  SUPABASE_URL,
  SUPABASE_REF,
  SUPABASE_ANON_KEY,
  SUPABASE_WEB_CLIENT_KEY,
  SUPABASE_IOS_CLIENT_KEY,
} from '@env';

export const config = {
  ai: {
    apiKey: AI_API_KEY,
  },
  supabase: {
    url: SUPABASE_URL,
    ref: SUPABASE_REF,
    anonKey: SUPABASE_ANON_KEY,
    webClientKey: SUPABASE_WEB_CLIENT_KEY,
    iosClientKey: SUPABASE_IOS_CLIENT_KEY,
  },
};

export default config;
