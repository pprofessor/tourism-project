# در پوشه اصلی پروژه این دستور رو اجرا کن:
cat > README.md << 'EOF'
# 🏝️ Tourism Management System

یک پلتفرم کامل برای مدیریت تورهای گردشگری شامل پنل کاربری، ادمین و API

## 🏗️ ساختار پروژه

tourism-project/
├── 📁 BackEnd/ # Spring Boot API (Java 17)
├── 📁 FrontEnd/ # React User Interface
├── 📁 Admin-Panel/ # React Admin Dashboard
└── 🐳 docker-compose.yml

text## 🚀 راه‌اندازی سریع

```bash
# کلون کردن پروژه
git clone <repository-url>
cd tourism-project

# اجرای کامل پروژه با Docker
docker-compose up -d

🌐 دسترسی به سرویس‌ها
Frontend: http://localhost:3000

Backend API: http://localhost:8080

Admin Panel: http://localhost:3001

H2 Database Console: http://localhost:8080/h2-console

🔧 توسعه
پیش‌نیازها
Docker & Docker Compose

JDK 17 (برای توسعه بک‌اند)

Node.js 18 (برای توسعه فرانت‌اند)

اجرای جداگانه سرویس‌ها
bash
# Backend
cd BackEnd
./mvnw spring-boot:run

# Frontend  
cd FrontEnd
npm start

# Admin Panel
cd Admin-Panel
npm start

📚 API Documentation

Authentication
POST /api/auth/login
{
  "username": "admin",
  "password": "password"
}

Tours Management
text
GET    /api/tours          # لیست تورها
POST   /api/tours          # ایجاد تور جدید
GET    /api/tours/{id}     # دریافت اطلاعات تور
PUT    /api/tours/{id}     # بروزرسانی تور
DELETE /api/tours/{id}     # حذف تور

🛠️ تکنولوژی‌ها

Backend
Java 17, Spring Boot 3.5.7
Spring Security, JWT
H2 Database, JPA/Hibernate
Maven

Frontend
React 19, TypeScript
Tailwind CSS, Emotion
React Router
Admin Panel
React 19, TypeScript
React Admin
TanStack React Query

📦 Docker

# ساخت images
docker-compose build

# اجرای سرویس‌ها
docker-compose up -d

# توقف سرویس‌ها
docker-compose down

# مشاهده لاگ‌ها
docker-compose logs

👥 توسعه‌دهندگان
[ُSeyyed Hamed Hoseyni] - توسعه و معماری

📄 لایسنس
MIT License
EOF



