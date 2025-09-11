# Stage 1: Build with Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Run with JRE
FROM eclipse-temurin:17-jre
WORKDIR /app

# คัดลอกไฟล์ .jar ใดก็ได้ในโฟลเดอร์ target/ (มีแค่ไฟล์เดียวแน่นอน)
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]