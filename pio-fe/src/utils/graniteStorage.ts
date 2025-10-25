import { storage } from '@granite-js/core';

// Granite Storage API 유틸리티 함수들

// 데이터 저장
export const storeData = async (key: string, value: any) => {
  try {
    const jsonValue = JSON.stringify(value);
    await storage.setItem(key, jsonValue);
    console.log(`데이터 저장 완료: ${key}`);
  } catch (error) {
    console.error('Granite Storage 저장 오류:', error);
  }
};

// 데이터 읽기
export const getData = async (key: string) => {
  try {
    const value = await storage.getItem(key);
    if (value !== null) {
      return JSON.parse(value);
    }
    return null;
  } catch (error) {
    console.error('Granite Storage 읽기 오류:', error);
    return null;
  }
};

// 데이터 삭제
export const removeData = async (key: string) => {
  try {
    await storage.removeItem(key);
    console.log(`데이터 삭제 완료: ${key}`);
  } catch (error) {
    console.error('Granite Storage 삭제 오류:', error);
  }
};

// 모든 데이터 삭제 (Granite Storage API에 clear 메서드가 있는지 확인 필요)
export const clearAllData = async () => {
  try {
    // Granite Storage API의 clear 메서드 사용 (있는 경우)
    if (typeof storage.clear === 'function') {
      await storage.clear();
      console.log('모든 데이터 삭제 완료');
    } else {
      console.warn('Granite Storage API에 clear 메서드가 없습니다.');
    }
  } catch (error) {
    console.error('모든 데이터 삭제 오류:', error);
  }
};

// 사용 예시:
// const saveUserInfo = async (userInfo) => {
//   await storeData('userInfo', userInfo);
// };
//
// const loadUserInfo = async () => {
//   const userInfo = await getData('userInfo');
//   return userInfo;
// };