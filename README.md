🏔️ تورینو (Turino) - پلتفرم رزرو آنلاین تور و هتل
<div align="center">
https://img.shields.io/badge/version-1.0.0-blue.svg
https://img.shields.io/badge/Spring%2520Boot-3.5.7-brightgreen.svg
https://img.shields.io/badge/React-19.0.0-61dafb.svg
https://img.shields.io/badge/PostgreSQL-15.0-336791.svg

پلتفرم جامع رزرو آنلاین تور، هتل و بلیط با قابلیت‌های پیشرفته

مشکلات • قابلیت‌ها • نصب و راه‌اندازی


📖 فهرست مطالب
معرفی پروژه

فهرست فنی

قابلیت‌ها

نصب و راه‌اندازی

معماری سیستم

مستندات API

توسعه


🎯 معرفی پروژه
تورینو یک پلتفرم کامل برای رزرو آنلاین خدمات گردشگری شامل تور، هتل و بلیط است. این سیستم با معماری مدرن و قابلیت‌های پیشرفته توسعه یافته است.

اهداف اصلی:
ارائه تجربه کاربری یکپارچه برای رزرو آنلاین

پشتیبانی از چندین زبان (فارسی، انگلیسی، عربی، ترکی)

مدیریت کامل کاربران و پروفایل

سیستم پرداخت امن و یکپارچه

پنل مدیریت پیشرفته

🛠️ فهرست فنی
Frontend
تکنولوژی	نسخه	توضیحات
React	19.2.0	Framework اصلی
TypeScript	5.9.3	نوع‌بندی استاتیک
Vite	7.2.2	Build tool و dev server
Tailwind CSS	3.4.0	CSS framework
React i18next	16.2.0	بین‌المللی‌سازی
Backend
تکنولوژی	نسخه	توضیحات
Spring Boot	3.5.7	Framework اصلی
Java	25	زبان برنامه‌نویسی
PostgreSQL	15	پایگاه داده اصلی
Hibernate/JPA	6.5+	ORM
JWT	0.11.5	احراز هویت
Admin Panel
تکنولوژی	نسخه	توضیحات
React	18+	Framework اصلی
Material-UI	7.3.4	کامپوننت‌های UI
TypeScript	-	نوع‌بندی استاتیک
DevOps & Infrastructure
تکنولوژی	کاربرد
Docker	Containerization
Nginx	Reverse proxy
PostgreSQL	دیتابیس اصلی
Redis	کشینگ (غیرفعال موقت)
✨ قابلیت‌ها
🔐 سیستم احراز هویت
✅ ثبت‌نام با شماره موبایل

✅ ورود با کد تأیید (OTP)

✅ ورود با رمز عبور

✅ مدیریت پروفایل کاربر

✅ JWT-based authentication

🌍 بین‌المللی‌سازی (i18n)
✅ پشتیبانی از ۴ زبان: فارسی، انگلیسی، عربی، ترکی

✅ RTL/LTR پویا

✅ ترجمه‌های کامل

🎨 رابط کاربری
✅ طراحی واکنش‌گرا (Responsive)

✅ تم دارک/لایت

✅ کامپوننت‌های مدرن

✅ تجربه کاربری بهینه

👤 مدیریت کاربران
✅ پروفایل کاربری کامل

✅ آپلود تصویر پروفایل

✅ مدیریت اطلاعات شخصی

✅ تاریخچه رزروها

🏨 سیستم رزرو
✅ نمایش هتل‌ها

✅ کارت هتل با اطلاعات کامل

✅ سیستم جستجو و فیلتر

✅ مدیریت اتاق‌ها

💳 درگاه پرداخت
✅ کامپوننت پرداخت

✅ تاریخچه تراکنش‌ها

✅ امنیت بالا

📊 پنل مدیریت
✅ مدیریت کاربران

✅ مدیریت هتل‌ها

✅ مدیریت رسانه

✅ آمار و گزارشات

🚀 نصب و راه‌اندازی
پیش‌نیازها
Java 25+

Node.js 18+

PostgreSQL 15+

Maven 3.6+

1. کلون کردن پروژه
bash
git clone https://github.com/pprofessor/tourism-project.git
cd tourism-project
2. راه‌اندازی دیتابیس
sql
-- ایجاد دیتابیس
CREATE DATABASE tourism_db;

-- ایجاد کاربر (اختیاری)
CREATE USER tourism_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE tourism_db TO tourism_user;
3. پیکربندی Backend
فایل: BackEnd/src/main/resources/application.properties

properties
spring.datasource.url=jdbc:postgresql://localhost:5432/tourism_db
spring.datasource.username=postgres
spring.datasource.password=your_password

app.media.upload-dir=/path/to/upload/directory
app.cors.allowed-origins=http://localhost:3000,http://localhost:4000
4. اجرای Backend
bash
cd BackEnd
mvn clean install
mvn spring-boot:run
سرور روی http://localhost:8080 اجرا می‌شود.

5. اجرای Frontend
bash
cd FrontEnd
npm install
npm run dev
اپلیکیشن روی http://localhost:3000 اجرا می‌شود.

6. اجرای Admin Panel
bash
cd Admin-Panel
npm install
npm start
پنل مدیریت روی http://localhost:4000 اجرا می‌شود.

🏗️ معماری سیستم
نمودار معماری
text
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend        │    │   Admin Panel   │
│   (React)       │◄──►│   (Spring Boot)  │◄──►│   (React)       │
│   localhost:3000│    │   localhost:8080 │    │   localhost:4000│
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                        ┌──────────────────┐
                        │   PostgreSQL     │
                        │   localhost:5432 │
                        └──────────────────┘
ساختار پوشه‌ها
text
tourism-project/
├── FrontEnd/                 # اپلیکیشن اصلی کاربران
│   ├── src/
│   │   ├── components/      # کامپوننت‌های React
│   │   ├── pages/           # صفحات اصلی
│   │   ├── services/        # سرویس‌های API
│   │   └── context/         # Contextهای全局
├── BackEnd/                  # سرور اصلی
│   ├── src/main/java/
│   │   └── com/tourism/app/
│   │       ├── controller/  # کنترلرهای REST
│   │       ├── model/       # مدل‌های دیتابیس
│   │       ├── repository/  # interfaces دیتابیس
│   │       └── config/      # تنظیمات
├── Admin-Panel/             # پنل مدیریت
│   └── src/
│       ├── components/      # کامپوننت‌های مدیریت
│       └── services/        # سرویس‌های API
└── Media/                   # فایل‌های رسانه
    ├── Images/
    ├── Videos/
    └── Audios/
📡 مستندات API
احراز هویت
ارسال کد تأیید
http
POST /api/auth/send-verification
Content-Type: application/json

{
  "mobile": "9123456789"
}
تأیید کد
http
POST /api/auth/verify-code
Content-Type: application/json

{
  "mobile": "9123456789",
  "code": "123456"
}
ورود با رمز عبور
http
POST /api/auth/login-password
Content-Type: application/json

{
  "mobile": "9123456789",
  "password": "user_password"
}
مدیریت کاربران
دریافت اطلاعات کاربر
http
GET /api/users/{id}
Authorization: Bearer {token}
آپدیت پروفایل
http
PUT /api/users/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "firstName": "نام",
  "lastName": "نام خانوادگی",
  "email": "email@example.com"
}
مدیریت هتل‌ها
دریافت لیست هتل‌ها
http
GET /api/hotels
جستجوی هتل
http
GET /api/hotels/search?city=tehran&minPrice=100000&maxPrice=500000
دریافت اطلاعات هتل
http
GET /api/hotels/{id}
کدهای وضعیت
کد	توضیح
200	موفقیت‌آمیز
201	ایجاد شده
400	درخواست نامعتبر
401	عدم احراز هویت
403	دسترسی غیرمجاز
404	پیدا نشد
500	خطای سرور
💻 توسعه
ساختار کد Frontend
کامپوننت‌های اصلی:
LoginModal.tsx - مودال ورود/ثبت‌نام

Header.tsx - هدر با ناوبری

Profile.tsx - صفحه پروفایل کاربر

HotelCard.tsx - کارت نمایش هتل

PaymentGateway.tsx - درگاه پرداخت

Contextهای مهم:
ThemeContext - مدیریت تم دارک/لایت

CartContext - مدیریت سبد خرید

ساختار کد Backend
Entityهای اصلی:
java
@Entity
public class User {
    private Long id;
    private String phone;
    private String mobile;
    private String firstName;
    private String lastName;
    // ... other fields
}

@Entity
public class Hotel {
    private Long id;
    private String name;
    private String city;
    private Double basePrice;
    // ... other fields
}
کنترلرهای اصلی:
AuthController - مدیریت احراز هویت

UserController - مدیریت کاربران

HotelController - مدیریت هتل‌ها

PaymentController - مدیریت پرداخت

اضافه کردن قابلیت جدید
1. ایجاد Entity جدید
java
@Entity
public class Booking {
    @Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne
    private User user;
    
    @ManyToOne
    private Hotel hotel;
    
    private LocalDateTime checkIn;
    private LocalDateTime checkOut;
}
2. ایجاد Repository
java
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
}
3. ایجاد Controller
java
@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    
    @Autowired
    private BookingRepository bookingRepository;
    
    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingRepository.save(booking);
    }
}
📄 مجوز
این پروژه تحت مجوز MIT License منتشر شده است.

👥 توسعه‌دهندگان
پروفسور (@pprofessor) - توسعه اصلی

📞 پشتیبانی
ایمیل: support@turino.com

گیتهاب: Issues Page

مستندات: Wiki

با ❤️ ساخته شده برای تجربه بهتر گردشگری


