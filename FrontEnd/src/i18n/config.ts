// در فایل src/i18n/config.ts این کد رو جایگزین کن:

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// زبان‌های پشتیبانی شده
export const supportedLanguages = {
  fa: { code: 'fa', name: 'فارسی', dir: 'rtl' },
  en: { code: 'en', name: 'English', dir: 'ltr' },
  ar: { code: 'ar', name: 'العربية', dir: 'rtl' },
  tr: { code: 'tr', name: 'Türkçe', dir: 'ltr' }
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fa',
    supportedLngs: Object.keys(supportedLanguages),
    debug: process.env.NODE_ENV === 'development',
    
    // بهینه‌سازی performance
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    
    // کشینگ برای performance بهتر
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      excludeCacheFor: ['cimode']
    },

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/common.json', // مسیر درست
    },

    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    }
  });

export default i18n;