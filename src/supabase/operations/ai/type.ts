// AI 분석 요청/응답 타입 정의

export interface AnalyzeImageRequest {
  imageBase64: string;
}

export interface AnalyzeImageSuccessResponse {
  code: "success";
  name: string;
  type: string;
  type_code: number;
  description: string;
  activity_curve: number[];
  activity_notes: string;
}

export interface AnalyzeImageErrorResponse {
  code: "error" | "not_plant" | "low_confidence";
  error: string;
}

export type AnalyzeImageResponse = AnalyzeImageSuccessResponse | AnalyzeImageErrorResponse;

// 식물 타입 코드 상수
export const PLANT_TYPE_CODES = {
  OTHER: 0,
  FLOWER: 1,
  SHRUB: 2,
  TREE: 3,
  CACTUS_SUCCULENT: 4,
  AQUATIC: 5,
  VINE: 6,
  GRASS: 7,
} as const;

export const PLANT_TYPE_NAMES = {
  [PLANT_TYPE_CODES.OTHER]: "기타",
  [PLANT_TYPE_CODES.FLOWER]: "꽃",
  [PLANT_TYPE_CODES.SHRUB]: "관목",
  [PLANT_TYPE_CODES.TREE]: "나무",
  [PLANT_TYPE_CODES.CACTUS_SUCCULENT]: "선인장/다육",
  [PLANT_TYPE_CODES.AQUATIC]: "수중식물",
  [PLANT_TYPE_CODES.VINE]: "덩굴식물",
  [PLANT_TYPE_CODES.GRASS]: "잔디류",
} as const;
