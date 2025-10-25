import 'react-native-url-polyfill/auto'; // URL polyfill 필요
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { config } from '../config/env';

if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error('Supabase URL 또는 Anon Key가 설정되지 않았습니다.');
}

// AsyncStorage가 제대로 작동하는지 확인하고 fallback 제공
const createStorage = () => {
  // AsyncStorage가 사용 가능한지 확인
  if (AsyncStorage && typeof AsyncStorage.getItem === 'function') {
    return {
      getItem: async (key: string) => {
        try {
          return await AsyncStorage.getItem(key);
        } catch (error) {
          console.warn('AsyncStorage getItem error:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await AsyncStorage.setItem(key, value);
        } catch (error) {
          console.warn('AsyncStorage setItem error:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          await AsyncStorage.removeItem(key);
        } catch (error) {
          console.warn('AsyncStorage removeItem error:', error);
        }
      },
    };
  } else {
    // AsyncStorage가 사용 불가능한 경우 메모리 스토리지 사용
    console.warn('AsyncStorage is not available, using memory storage');
    const memoryStorage: { [key: string]: string } = {};
    return {
      getItem: async (key: string) => memoryStorage[key] || null,
      setItem: async (key: string, value: string) => {
        memoryStorage[key] = value;
      },
      removeItem: async (key: string) => {
        delete memoryStorage[key];
      },
    };
  }
};

const storage = createStorage();

export const supabase = createClient(config.supabase.url, config.supabase.anonKey, {
  auth: {
    storage: storage, // 커스텀 스토리지 래퍼 사용
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // React Native에서는 일반적으로 false로 설정합니다.
  },
}); 

// 선택 사항: 연결 상태 확인 (개발 중 유용)
// supabase.auth.getSession().then(({ data: { session } }) => {
//   if (session) {
//     console.log('Supabase 세션이 성공적으로 연결되었습니다.');
//   } else {
//     console.log('Supabase 세션 연결에 실패했거나 기존 세션이 없습니다.');
//   }
// }).catch(error => {
//   console.error('Supabase 세션 확인 중 오류 발생:', error);
// });