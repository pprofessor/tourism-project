import React, { useState, useMemo } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'payment' | 'reservation' | 'technical' | 'account';
  isActive: boolean;
}

const FAQSection: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // داده‌های نمونه سوالات متداول
  const faqItems: FAQItem[] = useMemo(() => [
    {
      id: '1',
      question: 'چگونه می‌توانم تور رزرو کنم؟',
      answer: 'برای رزرو تور، ابتدا به صفحه تورها مراجعه کنید. تور مورد نظر خود را انتخاب کرده و تاریخ و تعداد مسافران را مشخص کنید. سپس با کلیک روی دکمه "رزرو" مراحل پرداخت را تکمیل نمایید.',
      category: 'reservation',
      isActive: true
    },
    {
      id: '2',
      question: 'روش‌های پرداخت چه هستند؟',
      answer: 'ما از درگاه‌های امن بانکی سامان، ملت و پارسیان پشتیبانی می‌کنیم. همچنین امکان پرداخت با کارت‌های عضو شتاب فراهم است.',
      category: 'payment',
      isActive: true
    },
    {
      id: '3',
      question: 'آیا امکان کنسلی رزرو وجود دارد؟',
      answer: 'بله، با توجه به قوانین هتل و شرکت حمل و نقل، امکان کنسلی با کسر درصدی از مبلغ وجود دارد. برای اطلاعات بیشتر به صفحه قوانین کنسلی مراجعه کنید.',
      category: 'reservation',
      isActive: true
    },
    {
      id: '4',
      question: 'چگونه رمز عبور خود را بازیابی کنم؟',
      answer: 'در صفحه ورود، روی گزینه "فراموشی رمز عبور" کلیک کنید. کد بازیابی به شماره موبایل شما ارسال خواهد شد.',
      category: 'account',
      isActive: true
    },
    {
      id: '5',
      question: 'مدارک لازم برای سفر خارجی چیست؟',
      answer: 'پاسپورت معتبر، ویزا (در صورت نیاز)، بلیط رفت و برگشت و مدارک هویتی. برای اطلاعات دقیق‌تر با پشتیبانی تماس بگیرید.',
      category: 'general',
      isActive: true
    },
    {
      id: '6',
      question: 'چگونه می‌توانم صورتحساب خود را دریافت کنم؟',
      answer: 'به صفحه پروفایل خود مراجعه کرده و در بخش "تاریخچه پرداخت‌ها" می‌توانید صورتحساب خود را دانلود کنید.',
      category: 'payment',
      isActive: true
    },
    {
      id: '7',
      question: 'آیا سایت از امنیت کافی برخوردار است؟',
      answer: 'بله، ما از استانداردهای امنیتی SSL و پروتکل‌های رمزنگاری پیشرفته استفاده می‌کنیم. تمام پرداخت‌ها از طریق درگاه‌های امن بانکی انجام می‌شود.',
      category: 'technical',
      isActive: true
    },
    {
      id: '8',
      question: 'چگونه می‌توانم تور خود را ویرایش کنم؟',
      answer: 'تا ۲۴ ساعت پس از رزرو امکان ویرایش تاریخ و مسافران وجود دارد. برای این کار به بخش "سرویس‌های من" در پروفایل مراجعه کنید.',
      category: 'reservation',
      isActive: true
    }
  ], []);

  // دسته‌بندی‌ها
  const categories = useMemo(() => [
  { id: 'all', label: t('support.faq.allCategories'), count: faqItems.length },
  { id: 'reservation', label: t('support.faq.reservation'), count: faqItems.filter(item => item.category === 'reservation').length },
  { id: 'payment', label: t('support.faq.payment'), count: faqItems.filter(item => item.category === 'payment').length },
  { id: 'account', label: t('support.faq.account'), count: faqItems.filter(item => item.category === 'account').length },
  { id: 'technical', label: t('support.faq.technical'), count: faqItems.filter(item => item.category === 'technical').length },
  { id: 'general', label: t('support.faq.general'), count: faqItems.filter(item => item.category === 'general').length }
], [faqItems, t]);

  // فیلتر سوالات بر اساس جستجو و دسته‌بندی
  const filteredItems = useMemo(() => {
    return faqItems.filter(item => {
      const matchesSearch = item.question.includes(searchTerm) || item.answer.includes(searchTerm);
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory && item.isActive;
    });
  }, [faqItems, searchTerm, selectedCategory]);

  // toggle باز و بسته کردن آکاردیون
  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  // کامپوننت آکاردیون برای هر سوال
  const FAQAccordion: React.FC<{ item: FAQItem }> = ({ item }) => {
    const isOpen = openItems.has(item.id);

    return (
      <div className={`border rounded-lg transition-all duration-300 ${
        theme === 'dark' 
          ? 'border-gray-600 bg-gray-700' 
          : 'border-gray-200 bg-white'
      } ${isOpen ? 'ring-2 ring-blue-500' : ''}`}>
        <button
          onClick={() => toggleItem(item.id)}
          className={`w-full text-right p-4 flex justify-between items-center transition-colors duration-300 ${
            theme === 'dark' 
              ? 'hover:bg-gray-600' 
              : 'hover:bg-gray-50'
          }`}
          aria-expanded={isOpen}
        >
          <span className={`font-medium transition-colors duration-300 ${
            theme === 'dark' ? 'text-white' : 'text-gray-800'
          }`}>
            {item.question}
          </span>
          <span 
            className={`transform transition-transform duration-300 text-xl ${
              isOpen ? 'rotate-180' : ''
            } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
            aria-hidden="true"
          >
            ▼
          </span>
        </button>
        
        {isOpen && (
          <div 
            className={`px-4 pb-4 transition-colors duration-300 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
            }`}
          >
            <p className="leading-relaxed">{item.answer}</p>
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-600">
              <span className={`text-sm ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                آیا این پاسخ مفید بود؟
              </span>
              <div className="flex space-x-2 space-x-reverse">
                <button className={`px-3 py-1 rounded text-sm transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-green-100 hover:bg-green-200 text-green-800'
                }`}>
                  ✓ بله
                </button>
                <button className={`px-3 py-1 rounded text-sm transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-red-100 hover:bg-red-200 text-red-800'
                }`}>
                  ✕ خیر
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* هدر و جستجو */}
      <div className="mb-8">
        <h2 className={`text-2xl font-bold mb-4 ...`}>
  {t('support.faq.title')}
</h2>
        
        {/* جستجو */}
        <div className="mb-6">
          <input
            type="text"
            placeholder={t('support.faq.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-3 rounded-lg border transition-colors duration-300 ${
              theme === 'dark' 
                ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
            }`}
          />
        </div>

        {/* فیلتر دسته‌بندی */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : theme === 'dark'
                  ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.label} ({category.count})
            </button>
          ))}
        </div>
      </div>

      {/* نتایج */}
      <div className="mb-4">
        <p className={`transition-colors duration-300 ${
          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {filteredItems.length} {t('support.faq.resultsCount')}
        </p>
      </div>

      {/* لیست سوالات */}
      <div className="space-y-4">
  {filteredItems.length > 0 ? (
    filteredItems.map(item => (
      <FAQAccordion key={item.id} item={item} />
    ))
  ) : (
    <div className={`text-center py-12 rounded-lg transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
    }`}>
      <div className="text-4xl mb-4">🔍</div>
      <h3 className="text-lg font-semibold mb-2">{t('support.faq.noResults')}</h3>
      <p>{t('support.faq.noResultsMessage')}</p>
    </div>
  )}
</div>

      {/* راهنمای اضافی */}
      <div className={`mt-8 p-6 rounded-lg transition-colors duration-300 ${
  theme === 'dark' ? 'bg-gray-700' : 'bg-blue-50'
}`}>
  <h3 className={`text-lg font-semibold mb-2 transition-colors duration-300 ${
    theme === 'dark' ? 'text-white' : 'text-gray-800'
  }`}>
    {t('support.faq.needMoreHelp')}
  </h3>
  <p className={`mb-4 transition-colors duration-300 ${
    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  }`}>
    {t('support.faq.needMoreHelpMessage')}
  </p>
  <div className="flex space-x-4 space-x-reverse">
    <button className={`px-6 py-2 rounded-lg transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
        : 'bg-blue-600 hover:bg-blue-700 text-white'
    }`}>
      {t('support.faq.createTicket')}
    </button>
    <button className={`px-6 py-2 rounded-lg border transition-colors duration-300 ${
      theme === 'dark' 
        ? 'border-gray-500 text-gray-300 hover:bg-gray-600' 
        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
    }`}>
      {t('support.faq.callSupport')}
    </button>
  </div>
</div>
    </div>
  );
};

export default FAQSection;