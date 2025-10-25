// 식물 분석 결과 타입 정의
export interface AnalyzeImageResponse {
  code: "success" | "error" | "not_plant" | "low_confidence";
  name?: string;
  type_code?: string;
  description?: string;
  activity_notes?: string;
  activity_curve?: number[];
  error?: string;
}

export const PLANT_TYPE_NAMES = {
  'herb': '허브',
  'tree': '나무',
  'flower': '꽃',
  'succulent': '다육식물',
  'vegetable': '채소',
  'fruit': '과일',
  'indoor': '실내식물',
  'outdoor': '야외식물',
} as const;
