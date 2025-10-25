import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { analyzeImage } from '../supabase/operations/ai/analyzeImage';
import { AnalyzeImageResponse } from '../supabase/operations/ai/type';

interface UseImageAnalysisOptions {
  imageBase64: string;
  onError?: (error: string) => void;
}

interface UseImageAnalysisReturn {
  isAnalyzing: boolean;
  analysisResult: AnalyzeImageResponse | null;
  performAnalysis: () => Promise<void>;
}

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
