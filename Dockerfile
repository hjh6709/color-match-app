# 1. 공식 Node.js 이미지 사용
FROM node:18-alpine

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. package.json, package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 나머지 앱 소스 복사
COPY . .

# 6. Next.js 빌드
RUN npm run build

# 7. 애플리케이션 실행
EXPOSE 3000
CMD ["npm", "start"]
