# Stage 1: Build with Maven
FROM maven:3.9-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src

# ❌ อย่าใช้ -DskipTests
RUN mvn clean package

# Stage 2: Run with JRE
FROM eclipse-temurin:17-jre
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

RUN mkdir -p /app/uploads/images

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
