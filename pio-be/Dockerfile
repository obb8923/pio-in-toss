# Node.js 18 이미지 사용
FROM node:18-slim

# 작업 디렉토리 설정
WORKDIR /app

# 패키지 파일 복사 및 의존성 설치
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 소스 코드 복사
COPY index.js ./

# 포트 설정
ENV PORT=8080
EXPOSE 8080

# 애플리케이션 실행
CMD ["node", "index.js"]
