# Stage 1: Build with Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Run with JRE
FROM eclipse-temurin:17-jre
WORKDIR /app

# คัดลอกไฟล์ .jar
COPY --from=builder /app/target/*.jar app.jar

# ✅ สร้างโฟลเดอร์สำหรับอัปโหลดไฟล์ — สำคัญมาก!
RUN mkdir -p /app/uploads/images

# เปิดพอร์ต
EXPOSE 8080

# รันแอป
ENTRYPOINT ["java", "-jar", "app.jar"]