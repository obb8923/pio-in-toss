import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
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

// 임시 분석 함수 (실제 백엔드 API로 교체 예정)
const analyzeImage = async (imageBase64: string): Promise<AnalyzeImageResponse> => {
  // 실제 백엔드 API 호출로 교체할 예정
  return new Promise((resolve) => {
    setTimeout(() => {
      // 임시 더미 데이터
      resolve({
        code: "success",
        name: "몬스테라",
        type_code: "indoor",
        description: "몬스테라는 아름다운 잎사귀를 가진 인기 있는 실내 식물입니다. 공기 정화 효과가 뛰어나며 관리가 쉬워 초보자에게도 추천됩니다.",
        activity_notes: "봄과 여름에 활발하게 자라며, 겨울에는 성장이 둔화됩니다. 충분한 간접광을 제공하고 토양이 마르면 물을 주세요.",
        activity_curve: [0.2, 0.3, 0.6, 0.8, 0.9, 0.9, 0.8, 0.7, 0.5, 0.3, 0.2, 0.1]
      });
    }, 2000); // 2초 지연
  });
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
      onError?.(errorResult.error);
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
