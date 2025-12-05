/**
 * توابع کمکی برای مدیریت تم (دارک/لایت)
 */

/**
 * ایجاد کلاس شرطی بر اساس تم
 * @param darkClass کلاس برای تم دارک
 * @param lightClass کلاس برای تم لایت
 * @param theme تم فعلی ('dark' یا 'light')
 */
export const themeClass = (
  darkClass: string,
  lightClass: string,
  theme: string
): string => {
  return theme === 'dark' ? darkClass : lightClass;
};

/**
 * ایجاد کلاس‌های متن بر اساس تم
 */
export const textThemeClass = (theme: string): string => {
  return themeClass('text-white', 'text-gray-800', theme);
};

/**
 * ایجاد کلاس‌های پس‌زمینه بر اساس تم
 */
export const bgThemeClass = (theme: string): string => {
  return themeClass('bg-gray-800', 'bg-white', theme);
};

/**
 * ایجاد کلاس‌های border بر اساس تم
 */
export const borderThemeClass = (theme: string): string => {
  return themeClass('border-gray-700', 'border-gray-300', theme);
};
