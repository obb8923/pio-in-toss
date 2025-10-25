#!/bin/bash

# 식물 분석 API 테스트 스크립트

API_URL="${API_URL:-http://localhost:8080}"

echo "=================================="
echo "식물 분석 API 테스트"
echo "=================================="
echo ""

# 1. 헬스체크
echo "[1] 헬스체크 테스트"
echo "GET $API_URL/"
echo ""
curl -s "$API_URL/" | jq '.' || curl -s "$API_URL/"
echo -e "\n"

# 2. 이미지 분석
if [ -n "$1" ]; then
  IMAGE_PATH="$1"
  
  if [ ! -f "$IMAGE_PATH" ]; then
    echo "오류: 이미지 파일을 찾을 수 없습니다: $IMAGE_PATH"
    exit 1
  fi
  
  echo "[2] 식물 이미지 분석 테스트"
  echo "POST $API_URL/analyze"
  echo "이미지: $IMAGE_PATH"
  echo ""
  
  curl -X POST \
    -F "image=@$IMAGE_PATH" \
    "$API_URL/analyze" | jq '.' || curl -X POST -F "image=@$IMAGE_PATH" "$API_URL/analyze"
  echo -e "\n"
else
  echo "[2] 식물 이미지 분석 테스트"
  echo "이미지 파일 경로를 인자로 제공하세요."
  echo "사용법: $0 <image_path>"
  echo "예시: $0 plant.jpg"
  echo ""
fi

echo "=================================="
echo "테스트 완료"
echo "=================================="
