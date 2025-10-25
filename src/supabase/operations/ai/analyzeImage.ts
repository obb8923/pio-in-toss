import { supabase } from "../../supabase";
import { AnalyzeImageRequest, AnalyzeImageResponse } from "./type";

export const analyzeImage = async (imageBase64: string): Promise<AnalyzeImageResponse | null> => {
  /**
   * Supabase Edge Function을 호출하여 이미지를 AI로 분석합니다.
   * @param imageBase64 base64 인코딩된 이미지 데이터
   * @returns 분석 결과 또는 null (오류 발생 시)
   */
  try {
    console.log('AI 이미지 분석 요청 시작');

    const requestData: AnalyzeImageRequest = {
      imageBase64: imageBase64
    };

    const { data, error } = await supabase.functions.invoke('getAIResponseWithImage', {
      body: requestData
    });

    if (error) {
      console.error('AI 분석 Edge Function 호출 오류:', error);
      return {
        code: "error",
        error: "이미지 분석 중 서버 오류가 발생했습니다."
      };
    }

    if (!data) {
      console.error('AI 분석 결과가 없습니다.');
      return {
        code: "error",
        error: "이미지 분석 결과를 받을 수 없습니다."
      };
    }

    console.log('AI 이미지 분석 성공:', data);
    return data as AnalyzeImageResponse;

  } catch (err: any) {
    console.error('analyzeImage 함수 처리 중 예외 발생:', err);
    const errorMessage = err?.message || '이미지 분석 중 알 수 없는 오류가 발생했습니다.';
    return {
      code: "error",
      error: errorMessage
    };
  }
};
