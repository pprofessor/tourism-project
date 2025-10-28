# استفاده از image پایه جاوا
FROM eclipse-temurin:17-jdk-alpine

# تنظیم دایرکتوری کار
WORKDIR /app

# کپی فایل Maven wrapper
COPY mvnw .
COPY .mvn .mvn

# کپی فایل pom.xml
COPY pom.xml .

# کپی سورس کد
COPY src src

# ساخت برنامه
RUN ./mvnw clean package -DskipTests

# پورت اکسپوز کن
EXPOSE 8080

# دستور اجرا
ENTRYPOINT ["java", "-jar", "target/BackEnd-0.0.1-SNAPSHOT.jar"]