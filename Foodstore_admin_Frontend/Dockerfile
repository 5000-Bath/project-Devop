# ใช้ Node รุ่นใหม่
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# ติดตั้ง dependencies (รวม devDependencies สำหรับ dev server)
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
