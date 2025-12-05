/**
 * توابع فرمت‌دهی مشترک در پروژه
 */

/**
 * فرمت تاریخ به فارسی
 */
export const formatDate = (dateString: string): string => {
  try {
    return new Date(dateString).toLocaleDateString('fa-IR');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * فرمت عدد به فارسی با جداکننده هزارگان
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('fa-IR').format(num);
};

/**
 * فرمت قیمت به ریال
 */
export const formatPrice = (price: number): string => {
  return `${formatNumber(price)} ریال`;
};

/**
 * فرمت شماره تلفن برای کشورهای مختلف
 */
export const formatPhoneNumber = (phone: string, countryCode: string = '98'): string => {
  const cleanPhone = phone.replace(/[^\d]/g, '');
  
  // فرمت براساس کشور
  switch (countryCode) {
    case '98': // ایران
      if (cleanPhone.length === 10) {
        return `۰${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
      }
      break;
      
    case '964': // عراق
      if (cleanPhone.length === 10) {
        return `+${countryCode} ${cleanPhone.slice(0, 3)} ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
      }
      break;
      
    case '90': // ترکیه
      if (cleanPhone.length === 10) {
        return `+${countryCode} (${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)} ${cleanPhone.slice(6)}`;
      }
      break;
  }
  
  // فرمت پیش‌فرض
  return `+${countryCode} ${cleanPhone}`;
};
