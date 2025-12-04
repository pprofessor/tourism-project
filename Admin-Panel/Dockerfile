# استفاده از image پایه Node.js
FROM node:18-alpine

# تنظیم دایرکتوری کار
WORKDIR /app

# کپی package files
COPY package*.json ./

# نصب dependencies
RUN npm install

# کپی سورس کد
COPY . .

# ساخت برنامه
RUN npm run build

# نصب serve برای سرو کردن فایل‌های build شده
RUN npm install -g serve

# پورت اکسپوز کن
EXPOSE 3001

# دستور اجرا
CMD ["serve", "-s", "build", "-l", "3001"]