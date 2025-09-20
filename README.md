```
# 🛠 Project Devop - Setup Guide

คู่มือการติดตั้งและรันโปรเจค **Devop**

---

## 1️ โคลนโปรเจค
เปิด Terminal แล้วรันคำสั่ง:

git clone https://github.com/5000-Bath/project-Devop.git
git checkout Dev_V1

จากนั้นเข้าไปยัง **root ของโปรเจค** จะพบไฟล์ `docker-compose.yml` (อยู่ชั้นนอกสุด)

---

## 2️ รันโปรเจคด้วย Docker 
รันคำสั่ง:

docker-compose up --build -d

เมื่อรันสำเร็จ จะเห็น Service ดังนี้:

✔ 🖥 backend                             Built
✔ 🖥 frontend-admin                      Built
✔ 🖥 frontend-user                       Built
✔ 🐬 Container foodstore-db              Started
✔ 🐬 Container phpmyadmin                Started
✔ 🖥 Container firstapp-backend          Started
✔ 🖥 Container foodstore-admin-frontend  Started
✔ 🖥 Container foodstore-user-frontend   Started

---

## 3️ การตั้งค่า Database (MySQL)

| Component        | Port  | User       | Password       | URL                     |
|-----------------|-------|-----------|----------------|------------------------|
| MySQL Database  | 3306  | shopuser  | shoppassword   | -                      |
| PhpMyAdmin      | 8081  | -         | -              | http://localhost:8081  |

---

## 4️ Backend

| Feature          | Port  | URL                     |
|-----------------|-------|------------------------|
| API Server      | 8080  | http://localhost:8080/api |

ตัวอย่างการทดสอบ API GET:

GET http://localhost:8080/users

ตัวอย่าง Response:

[
  {
    "id": 1,
    "username": "user01",
    "name": "user",
    "lastname": "demo",
    "email": "user@demo.com",
    "phone": "123456789",
    "address": "bangkok,thailand",
    "birthDate": null,
    "profileImageUrl": null,
    "createdAt": "2025-09-10T12:34:13"
  }
]

---

## 5️ Frontend User 

| Feature | Port  | URL                     |
|---------|-------|------------------------|
| User App | 3000  | http://localhost:3000  |

---

## 6️ Frontend Admin 

| Feature    | Port  | URL                     |
|------------|-------|------------------------|
| Admin App  | 3001  | http://localhost:3001  |

---

## 7️ ตรวจสอบ Log ของแต่ละ Service 📜
เปิด Terminal แยก แล้วรันคำสั่ง:

docker-compose logs <service_name>

ตัวอย่าง:

docker-compose logs foodstore-admin-frontend

---

## 8️ ปิด Service 🔴
เมื่อใช้งานเสร็จ ให้รันคำสั่ง:

docker-compose down

---

Tip: แนะนำให้เปิด Terminal แยกสำหรับแต่ละ Service เพื่อดู Log และ Debug ได้ง่าย
```
