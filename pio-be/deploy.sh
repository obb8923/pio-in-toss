#!/bin/bash

# Google Cloud Run 배포 스크립트

echo "=================================="
echo "Google Cloud Run 배포 스크립트"
echo "=================================="
echo ""

# 환경 변수 확인
if [ -z "$GEMINI_API_KEY" ]; then
  echo "오류: GEMINI_API_KEY 환경 변수가 설정되지 않았습니다."
  echo "다음 명령으로 설정하세요:"
  echo "export GEMINI_API_KEY=\"your_api_key_here\""
  exit 1
fi

# 프로젝트 ID 확인
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo "오류: Google Cloud 프로젝트가 설정되지 않았습니다."
  echo "다음 명령으로 설정하세요:"
  echo "gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo "프로젝트 ID: $PROJECT_ID"
echo ""

# 서비스 이름 및 리전 설정
SERVICE_NAME="${SERVICE_NAME:-pio-be}"
REGION="${REGION:-asia-northeast3}"

echo "서비스 이름: $SERVICE_NAME"
echo "리전: $REGION"
echo ""

# 배포 확인
read -p "배포를 시작하시겠습니까? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "배포가 취소되었습니다."
  exit 1
fi

echo ""
echo "배포를 시작합니다..."
echo ""

# Cloud Run 배포
gcloud run deploy "$SERVICE_NAME" \
  --source . \
  --platform managed \
  --region "$REGION" \
  --allow-unauthenticated \
  --set-env-vars "GEMINI_API_KEY=$GEMINI_API_KEY" \
  --memory 512Mi \
  --timeout 60s \
  --min-instances 0 \
  --max-instances 10

if [ $? -eq 0 ]; then
  echo ""
  echo "=================================="
  echo "배포가 성공적으로 완료되었습니다!"
  echo "=================================="
  echo ""
  
  # 서비스 URL 가져오기
  SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format="value(status.url)" 2>/dev/null)
  
  if [ -n "$SERVICE_URL" ]; then
    echo "서비스 URL: $SERVICE_URL"
    echo ""
    echo "API 테스트:"
    echo "curl $SERVICE_URL/"
    echo "curl -X POST -F \"image=@plant.jpg\" $SERVICE_URL/analyze"
    echo ""
  fi
else
  echo ""
  echo "=================================="
  echo "배포 중 오류가 발생했습니다."
  echo "=================================="
  echo ""
  exit 1
fi
