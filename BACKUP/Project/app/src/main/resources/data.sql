-- حذف داده‌های قدیمی اگر وجود دارن
DELETE FROM users;

-- اضافه کردن کاربران با فیلدهای جدید
INSERT INTO users (username, email, mobile, password, role, user_type, email_verified, referred_count) VALUES 
('admin', 'admin@tourism.com', '09123456789', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTV5UiC', 'ADMIN', 'VERIFIED_TOURIST', true, 0),
('user1', 'user1@email.com', '09123456780', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTV5UiC', 'USER', 'REGISTERED_TOURIST', false, 0),
('user2', 'user2@email.com', '09123456781', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTV5UiC', 'USER', 'REGISTERED_TOURIST', false, 0);