# Stage 1: Build Next.js
FROM node:18-alpine as builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run with Nginx
FROM nginx:alpine

# 앱 소스 복사
COPY --from=builder /app/.next /usr/share/nginx/html/.next
COPY --from=builder /app/public /usr/share/nginx/html
COPY --from=builder /app/nginx.conf /etc/nginx/nginx.conf

# API 서버가 3000번 포트에서 실행 중이라고 가정
EXPOSE 80
