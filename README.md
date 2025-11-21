# Welcome to My Foodstore
#  Project Devop – Setup Guide  
คู่มือการติดตั้งและรันโปรเจกต์ **Devop**

---

##  1. โคลนโปรเจค  
เปิด Terminal แล้วรัน:

```bash
git clone https://github.com/5000-Bath/project-Devop.git
git checkout Dev_V1
````

จากนั้นเข้าไปยัง **root folder ของโปรเจค**
จะพบไฟล์ `docker-compose.yml` (อยู่ชั้นนอกสุด)

---

##  2. รันโปรเจคด้วย Docker

รันคำสั่ง:

```bash
docker-compose up --build -d
```

เมื่อรันสำเร็จ จะเห็น Services ดังนี้:

```text
✔ backend                           Built
✔ frontend-admin                    Built
✔ frontend-user                     Built
✔ foodstore-db (MySQL)              Started
✔ phpmyadmin                        Started
✔ firstapp-backend                  Started
✔ foodstore-admin-frontend          Started
✔ foodstore-user-frontend           Started
```

---

##  3. การตั้งค่า Database (MySQL)

| Component      | Port | User     | Password     | URL                                            |
| -------------- | ---- | -------- | ------------ | ---------------------------------------------- |
| MySQL Database | 3306 | shopuser | shoppassword | –                                              |
| PhpMyAdmin     | 8081 | –        | –            | [http://localhost:8081](http://localhost:8081) |

---

##  4. Backend

| Feature    | Port | URL                                                    |
| ---------- | ---- | ------------------------------------------------------ |
| API Server | 8080 | [http://localhost:8080/api](http://localhost:8080/api) |

### 🔍 ตัวอย่างการทดสอบ API

```http
GET http://localhost:8080/users
```

ตัวอย่าง Response:

```json
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
```

---

## 🧑‍💻 5. Frontend — User

| Feature  | Port | URL                                            |
| -------- | ---- | ---------------------------------------------- |
| User App | 3000 | [http://localhost:3000](http://localhost:3000) |

---

## 🛠️ 6. Frontend — Admin

| Feature   | Port | URL                                            |
| --------- | ---- | ---------------------------------------------- |
| Admin App | 3001 | [http://localhost:3001](http://localhost:3001) |

---

## 📜 7. ตรวจสอบ Log ของแต่ละ Service

เปิด Terminal แล้วรัน:

```bash
docker-compose logs <service_name>
```

ตัวอย่าง:

```bash
docker-compose logs foodstore-admin-frontend
```

---

## 🔴 8. ปิด Service

เมื่อใช้งานเสร็จให้รัน:

```bash
docker-compose down
```

---

### 💡 Tip

แนะนำให้เปิด Terminal แยกสำหรับแต่ละ Service เพื่อดู Log และ Debug ได้ง่ายขึ้น


