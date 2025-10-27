import { useState, useEffect } from 'react';
import { AnalyzeImageResponse } from '../types/analysis';
interface UseImageAnalysisOptions {
  imageBase64: string;
  onError?: (error: string) => void;
}

interface UseImageAnalysisReturn {
  isAnalyzing: boolean;
  analysisResult: AnalyzeImageResponse | null;
  performAnalysis: () => Promise<void>;
}

// 실제 백엔드 API 호출 함수
const analyzeImage = async (imageBase64: string): Promise<AnalyzeImageResponse> => {
  const BE_ENDPOINT_URL = 'https://pio-957741045904.asia-northeast3.run.app';
  try {
    // 이미지 데이터가 data:image/jpeg;base64, 형식인지 확인
    const base64Data = imageBase64.startsWith('data:') 
      ? imageBase64 
      : `data:image/jpeg;base64,${imageBase64}`;
    
    const response = await fetch(`${BE_ENDPOINT_URL}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Data
      }),
    });
    
    if (!response.ok) {
      throw new Error(`API 호출 실패: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('API 호출 중 오류:', error);
    throw error;
  }
};

export const useImageAnalysis = ({
  imageBase64,
  onError,
}: UseImageAnalysisOptions): UseImageAnalysisReturn => {
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState<AnalyzeImageResponse | null>(null);

  const performAnalysis = async () => {
    if (!imageBase64) {
      const errorMsg = '이미지 데이터가 없습니다.';
      onError?.(errorMsg);
      return;
    }

    try {
      setIsAnalyzing(true);
      const result = await analyzeImage(imageBase64);
      setAnalysisResult(result);
    } catch (error) {
      console.error('분석 중 오류 발생:', error);
      const errorResult: AnalyzeImageResponse = {
        code: "error",
        error: "이미지 분석 중 오류가 발생했습니다."
      };
      setAnalysisResult(errorResult);
      onError?.(errorResult.error || "이미지 분석 중 오류가 발생했습니다.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (imageBase64) {
      performAnalysis();
    }
  }, [imageBase64]);

  return {
    isAnalyzing,
    analysisResult,
    performAnalysis,
  };
};
