# ---------- Stage 1: Build ----------
    FROM node:20-alpine AS build
    WORKDIR /app
    
    # ติดตั้ง deps แบบ cache-friendly
    COPY package*.json ./
    RUN npm ci
    
    # คัดลอกซอร์สและ build (Vite จะปล่อยผลลัพธ์ไว้ใน dist/)
    COPY . .
    RUN npm run build
    
    # ---------- Stage 2: Serve with Nginx ----------
    FROM nginx:1.27-alpine
    # คัดลอกไฟล์ build ไปยังโฟลเดอร์เว็บของ nginx
    COPY --from=build /app/dist /usr/share/nginx/html
    # ใส่คอนฟิก SPA
    COPY nginx.conf /etc/nginx/conf.d/default.conf
    
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
    