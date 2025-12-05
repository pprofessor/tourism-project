import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import { ambassadorService } from '../../services/ambassadorService';

interface FormData {
  // مرحله ۱: اطلاعات پایه
  city: string;
  country: string;
  languages: Array<{
    language: string;
    proficiency: number; // درصد تسلط
  }>;
  
  // مرحله ۲: خدمات
  services: string[];
  
  // مرحله ۳: نرخ خدمات
  pricing: {
    hourlyRate: number; // برای تور لیدری
    commissionRates: Record<string, number>; // درصد کمیسیون برای هر سرویس
  };
  
  // مرحله ۴: مدارک
  documents: {
    nationalCard?: File;
    passport?: File;
  };
  
  // مرحله ۵: توضیحات
  bio: string;
  experience: string;
  specialties: string[];
}

const BecomeAmbassadorForm: React.FC<{
  onSuccess?: () => void;
  onCancel?: () => void;
}> = ({ onSuccess, onCancel }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    city: '',
    country: 'ایران',
    languages: [{ language: 'fa', proficiency: 100 }],
    services: [],
    pricing: {
      hourlyRate: 50000,
      commissionRates: {}
    },
    documents: {},
    bio: '',
    experience: '',
    specialties: []
  });
  
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // لیست زبان‌های قابل انتخاب
  const availableLanguages = [
    { code: 'fa', name: 'فارسی' },
    { code: 'en', name: 'English' },
    { code: 'ar', name: 'العربیة' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'es', name: 'Español' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' },
  ];

  // لیست خدمات قابل ارائه
  const availableServices = [
    { 
      id: 'currency-exchange', 
      name: t('ambassador.services.currencyExchange'),
      pricingType: 'commission' 
    },
    { 
      id: 'local-tickets', 
      name: t('ambassador.services.localTickets'),
      pricingType: 'commission' 
    },
    { 
      id: 'tour-guide', 
      name: t('ambassador.services.tourGuide'),
      pricingType: 'hourly' 
    },
    { 
      id: 'hotel-booking', 
      name: t('ambassador.services.hotelBooking'),
      pricingType: 'commission' 
    },
    { 
      id: 'banking', 
      name: t('ambassador.services.banking'),
      pricingType: 'commission' 
    },
    { 
      id: 'translation', 
      name: t('ambassador.services.translation'),
      pricingType: 'hourly' 
    },
    { 
      id: 'transport', 
      name: t('ambassador.services.transport'),
      pricingType: 'commission' 
    },
    { 
      id: 'restaurant-reservation', 
      name: t('ambassador.services.restaurantReservation'),
      pricingType: 'commission' 
    },
    { 
      id: 'shopping-assistant', 
      name: t('ambassador.services.shoppingAssistant'),
      pricingType: 'commission' 
    },
    { 
      id: 'event-tickets', 
      name: t('ambassador.services.eventTickets'),
      pricingType: 'commission' 
    },
  ];

  // شهرهای پیشنهادی
  const suggestedCities = [
    'تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کیش', 'قشم',
    'استانبول', 'آنتالیا', 'دبی', 'ابوظبی', 'بانکوک', 'پاریس',
    'لندن', 'نیویورک', 'توکیو', 'سئول', 'شانگهای'
  ];

  // ============ HANDLERS ============
  
  const handleLanguageChange = (langCode: string, proficiency: number) => {
    const existingIndex = formData.languages.findIndex(l => l.language === langCode);
    
    if (existingIndex >= 0) {
      const newLanguages = [...formData.languages];
      newLanguages[existingIndex] = { language: langCode, proficiency };
      setFormData({ ...formData, languages: newLanguages });
    } else {
      setFormData({
        ...formData,
        languages: [...formData.languages, { language: langCode, proficiency }]
      });
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    const isSelected = formData.services.includes(serviceId);
    const newServices = isSelected
      ? formData.services.filter(id => id !== serviceId)
      : [...formData.services, serviceId];
    
    // برای خدمات commission-based، مقدار پیش‌فرض ۵٪ تنظیم کن
    const service = availableServices.find(s => s.id === serviceId);
    const newCommissionRates = { ...formData.pricing.commissionRates };
    
    if (service?.pricingType === 'commission' && !isSelected) {
      newCommissionRates[serviceId] = 5; // ۵٪ پیش‌فرض
    } else if (isSelected) {
      delete newCommissionRates[serviceId];
    }
    
    setFormData({
      ...formData,
      services: newServices,
      pricing: {
        ...formData.pricing,
        commissionRates: newCommissionRates
      }
    });
  };

  const handleCommissionChange = (serviceId: string, percentage: number) => {
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        commissionRates: {
          ...formData.pricing.commissionRates,
          [serviceId]: percentage
        }
      }
    });
  };

  const handleFileUpload = (type: 'nationalCard' | 'passport', file: File) => {
    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [type]: file
      }
    });
  };

  const handleSubmit = async () => {
    try {
      setUploading(true);
      setError(null);

      // آماده‌سازی داده‌ها برای API
      const ambassadorData = {
        city: formData.city,
        country: formData.country,
        languages: formData.languages.map(l => l.language),
        services: formData.services,
        hourlyRate: formData.pricing.hourlyRate,
        bio: `${formData.bio}\n\nسابقه فعالیت:\n${formData.experience}`,
        isAvailable: true,
        isVerified: false,
        responseTime: 30 // پیش‌فرض
      };

      await ambassadorService.registerAsAmbassador(ambassadorData);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || t('ambassador.registration.error'));
    } finally {
      setUploading(false);
    }
  };

  // ============ STEP RENDERS ============

  const renderStep1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">
        {t('ambassador.registration.step1.title')}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">{t('ambassador.registration.city')}</label>
          <div className="relative">
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({...formData, city: e.target.value})}
              className={`w-full p-3 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-800'
              }`}
              placeholder={t('ambassador.registration.cityPlaceholder')}
              list="cities"
            />
            <datalist id="cities">
              {suggestedCities.map(city => (
                <option key={city} value={city} />
              ))}
            </datalist>
          </div>
        </div>

        <div>
          <label className="block mb-2">{t('ambassador.registration.country')}</label>
          <select
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
            className={`w-full p-3 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
          >
            <option value="ایران">ایران</option>
            <option value="ترکیه">ترکیه</option>
            <option value="امارات">امارات</option>
            <option value="تایلند">تایلند</option>
            <option value="فرانسه">فرانسه</option>
            <option value="انگلستان">انگلستان</option>
            <option value="آمریکا">آمریکا</option>
            <option value="ژاپن">ژاپن</option>
            <option value="کره جنوبی">کره جنوبی</option>
            <option value="چین">چین</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-3">{t('ambassador.registration.languages')}</label>
        <div className="space-y-3">
          {availableLanguages.map(lang => {
            const currentLang = formData.languages.find(l => l.language === lang.code);
            const proficiency = currentLang?.proficiency || 0;
            
            return (
              <div key={lang.code} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={proficiency > 0}
                    onChange={(e) => handleLanguageChange(
                      lang.code, 
                      e.target.checked ? 100 : 0
                    )}
                    className="w-5 h-5 rounded"
                  />
                  <span>{lang.name}</span>
                </div>
                
                {proficiency > 0 && (
                  <div className="flex items-center space-x-3 w-48">
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="10"
                      value={proficiency}
                      onChange={(e) => handleLanguageChange(
                        lang.code, 
                        parseInt(e.target.value)
                      )}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{proficiency}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">
        {t('ambassador.registration.step2.title')}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {t('ambassador.registration.servicesDescription')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableServices.map(service => {
          const isSelected = formData.services.includes(service.id);
          
          return (
            <div
              key={service.id}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                isSelected
                  ? theme === 'dark'
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-blue-500 bg-blue-50'
                  : theme === 'dark'
                    ? 'border-gray-700 bg-gray-800'
                    : 'border-gray-200 bg-gray-50'
              }`}
              onClick={() => handleServiceToggle(service.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                    isSelected
                      ? 'bg-blue-500 border-blue-500'
                      : 'border-gray-400'
                  }`}>
                    {isSelected && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </div>
                  <span className="font-medium">{service.name}</span>
                </div>
                
                <span className={`text-sm px-2 py-1 rounded ${
                  service.pricingType === 'hourly'
                    ? theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                    : theme === 'dark' ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800'
                }`}>
                  {service.pricingType === 'hourly' 
                    ? t('ambassador.registration.hourly') 
                    : t('ambassador.registration.commission')}
                </span>
              </div>
              
              {/* برای خدمات commission-based، درصد وارد کن */}
              {isSelected && service.pricingType === 'commission' && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <label className="block mb-2 text-sm">
                    {t('ambassador.registration.commissionRate')}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={formData.pricing.commissionRates[service.id] || 5}
                      onChange={(e) => handleCommissionChange(
                        service.id, 
                        parseFloat(e.target.value)
                      )}
                      className="flex-1"
                    />
                    <span className="w-16 text-right font-bold">
                      {formData.pricing.commissionRates[service.id] || 5}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">
        {t('ambassador.registration.step3.title')}
      </h3>
      
      {/* نرخ ساعتی برای خدمات hourly-based */}
      <div className={`p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <h4 className="font-semibold mb-4">
          {t('ambassador.registration.hourlyServices')}
        </h4>
        
        <div className="space-y-4">
          {availableServices
            .filter(service => 
              service.pricingType === 'hourly' && 
              formData.services.includes(service.id)
            )
            .map(service => (
              <div key={service.id} className="flex items-center justify-between">
                <span>{service.name}</span>
                <div className="flex items-center space-x-3">
                  <input
                    type="number"
                    value={formData.pricing.hourlyRate}
                    onChange={(e) => setFormData({
                      ...formData,
                      pricing: {
                        ...formData.pricing,
                        hourlyRate: parseInt(e.target.value) || 0
                      }
                    })}
                    className={`w-32 p-2 rounded border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-800'
                    }`}
                  />
                  <span>{t('common.currency')} / {t('ambassador.registration.perHour')}</span>
                </div>
              </div>
            ))}
          
          {availableServices.filter(s => 
            s.pricingType === 'hourly' && formData.services.includes(s.id)
          ).length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              {t('ambassador.registration.noHourlyServices')}
            </p>
          )}
        </div>
      </div>
      
      {/* کمیسیون‌ها برای خدمات commission-based */}
      <div className={`p-4 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <h4 className="font-semibold mb-4">
          {t('ambassador.registration.commissionServices')}
        </h4>
        
        <div className="space-y-4">
          {availableServices
            .filter(service => 
              service.pricingType === 'commission' && 
              formData.services.includes(service.id)
            )
            .map(service => (
              <div key={service.id} className="flex items-center justify-between">
                <span>{service.name}</span>
                <div className="flex items-center space-x-3">
                  <span className="font-bold">
                    {formData.pricing.commissionRates[service.id] || 5}%
                  </span>
                  <span>{t('ambassador.registration.ofTransaction')}</span>
                </div>
              </div>
            ))}
          
          {availableServices.filter(s => 
            s.pricingType === 'commission' && formData.services.includes(s.id)
          ).length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              {t('ambassador.registration.noCommissionServices')}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">
        {t('ambassador.registration.step4.title')}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {t('ambassador.registration.documentsDescription')}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* کارت ملی */}
        <div className={`p-4 rounded-lg border-2 ${
          formData.documents.nationalCard
            ? theme === 'dark' ? 'border-green-500 bg-green-900/10' : 'border-green-500 bg-green-50'
            : theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
        }`}>
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🪪</div>
            <h4 className="font-semibold">{t('ambassador.registration.nationalCard')}</h4>
          </div>
          
          <input
            type="file"
            id="nationalCard"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload('nationalCard', file);
            }}
            className="hidden"
          />
          
          {formData.documents.nationalCard ? (
            <div className="text-center">
              <p className="text-green-600 dark:text-green-400 mb-2">
                ✓ {formData.documents.nationalCard.name}
              </p>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  documents: { ...formData.documents, nationalCard: undefined }
                })}
                className="text-red-500 text-sm"
              >
                {t('common.remove')}
              </button>
            </div>
          ) : (
            <label
              htmlFor="nationalCard"
              className={`block text-center py-8 rounded-lg cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="text-3xl mb-2">📤</div>
              <p>{t('ambassador.registration.uploadNationalCard')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                JPG, PNG یا PDF (حداکثر ۵MB)
              </p>
            </label>
          )}
        </div>
        
        {/* گذرنامه */}
        <div className={`p-4 rounded-lg border-2 ${
          formData.documents.passport
            ? theme === 'dark' ? 'border-green-500 bg-green-900/10' : 'border-green-500 bg-green-50'
            : theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
        }`}>
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🧾</div>
            <h4 className="font-semibold">{t('ambassador.registration.passport')}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('ambassador.registration.passportOptional')}
            </p>
          </div>
          
          <input
            type="file"
            id="passport"
            accept="image/*,.pdf"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileUpload('passport', file);
            }}
            className="hidden"
          />
          
          {formData.documents.passport ? (
            <div className="text-center">
              <p className="text-green-600 dark:text-green-400 mb-2">
                ✓ {formData.documents.passport.name}
              </p>
              <button
                type="button"
                onClick={() => setFormData({
                  ...formData,
                  documents: { ...formData.documents, passport: undefined }
                })}
                className="text-red-500 text-sm"
              >
                {t('common.remove')}
              </button>
            </div>
          ) : (
            <label
              htmlFor="passport"
              className={`block text-center py-8 rounded-lg cursor-pointer ${
                theme === 'dark' 
                  ? 'bg-gray-700 hover:bg-gray-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="text-3xl mb-2">📤</div>
              <p>{t('ambassador.registration.uploadPassport')}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                JPG, PNG یا PDF (حداکثر ۵MB)
              </p>
            </label>
          )}
        </div>
      </div>
      
      <div className={`p-4 rounded-lg ${
        theme === 'dark' ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-200'
      } border`}>
        <div className="flex items-start space-x-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <p className="font-semibold">{t('ambassador.registration.privacyNote')}</p>
            <p className="text-sm mt-1">
              {t('ambassador.registration.privacyDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">
        {t('ambassador.registration.step5.title')}
      </h3>
      
      <div className="space-y-4">
        <div>
          <label className="block mb-2">
            {t('ambassador.registration.bio')}
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              ({t('ambassador.registration.bioDescription')})
            </span>
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({...formData, bio: e.target.value})}
            rows={4}
            className={`w-full p-3 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            placeholder={t('ambassador.registration.bioPlaceholder')}
          />
        </div>
        
        <div>
          <label className="block mb-2">
            {t('ambassador.registration.experience')}
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              ({t('ambassador.registration.experienceDescription')})
            </span>
          </label>
          <textarea
            value={formData.experience}
            onChange={(e) => setFormData({...formData, experience: e.target.value})}
            rows={6}
            className={`w-full p-3 rounded-lg border ${
              theme === 'dark' 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-800'
            }`}
            placeholder={t('ambassador.registration.experiencePlaceholder')}
          />
        </div>
        
        <div>
          <label className="block mb-2">{t('ambassador.registration.specialties')}</label>
          <div className="flex flex-wrap gap-2">
            {[
              'گردشگری تاریخی', 'گردشگری طبیعی', 'گردشگری ماجراجویی',
              'گردشگری غذایی', 'گردشگری خرید', 'گردشگری فرهنگی',
              'تورهای خانوادگی', 'تورهای تجاری', 'تورهای لوکس'
            ].map(specialty => {
              const isSelected = formData.specialties.includes(specialty);
              
              return (
                <button
                  key={specialty}
                  type="button"
                  onClick={() => {
                    const newSpecialties = isSelected
                      ? formData.specialties.filter(s => s !== specialty)
                      : [...formData.specialties, specialty];
                    setFormData({...formData, specialties: newSpecialties});
                  }}
                  className={`px-3 py-1 rounded-full text-sm ${
                    isSelected
                      ? theme === 'dark'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-500 text-white'
                      : theme === 'dark'
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {specialty} {isSelected ? '✓' : '+'}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold mb-4">
        {t('ambassador.registration.step6.title')}
      </h3>
      
      {/* خلاصه اطلاعات */}
      <div className={`p-6 rounded-lg ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
      }`}>
        <h4 className="font-semibold mb-4 text-lg">
          {t('ambassador.registration.summary')}
        </h4>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t('ambassador.registration.city')}
              </p>
              <p className="font-medium">{formData.city}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {t('ambassador.registration.country')}
              </p>
              <p className="font-medium">{formData.country}</p>
            </div>
          </div>
          
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('ambassador.registration.languages')}
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.languages.map(lang => {
                const langInfo = availableLanguages.find(l => l.code === lang.language);
                return (
                  <span
                    key={lang.language}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark' ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {langInfo?.name} ({lang.proficiency}%)
                  </span>
                );
              })}
            </div>
          </div>
          
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('ambassador.registration.services')}
            </p>
            <div className="flex flex-wrap gap-2 mt-1">
              {formData.services.map(serviceId => {
                const service = availableServices.find(s => s.id === serviceId);
                return (
                  <span
                    key={serviceId}
                    className={`px-3 py-1 rounded-full text-sm ${
                      theme === 'dark' ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {service?.name}
                    {service?.pricingType === 'hourly' 
                      ? ` - ${formData.pricing.hourlyRate.toLocaleString()} ${t('common.currency')}/h`
                      : ` - ${formData.pricing.commissionRates[serviceId] || 5}%`
                    }
                  </span>
                );
              })}
            </div>
          </div>
          
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {t('ambassador.registration.documents')}
            </p>
            <div className="flex space-x-4 mt-1">
              {formData.documents.nationalCard && (
                <span className="text-green-600 dark:text-green-400">
                  ✓ {t('ambassador.registration.nationalCard')}
                </span>
              )}
              {formData.documents.passport && (
                <span className="text-green-600 dark:text-green-400">
                  ✓ {t('ambassador.registration.passport')}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* شرایط و قوانین */}
      <div className={`p-4 rounded-lg border ${
        theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-gray-50'
      }`}>
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="terms"
            className="mt-1"
          />
          <label htmlFor="terms" className="text-sm">
            {t('ambassador.registration.terms1')}{' '}
            <a href="#" className="text-blue-500 hover:underline">
              {t('ambassador.registration.termsLink')}
            </a>{' '}
            {t('ambassador.registration.terms2')}
          </label>
        </div>
      </div>
      
      {error && (
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
        }`}>
          {error}
        </div>
      )}
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      case 5: return renderStep5();
      case 6: return renderStep6();
      default: return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.city.trim() !== '' && formData.languages.length > 0;
      case 2: return formData.services.length > 0;
      case 3: return true; // همیشه valid
      case 4: return !!formData.documents.nationalCard;
      case 5: return formData.bio.trim() !== '' && formData.experience.trim() !== '';
      case 6: return true; // در step 6 بررسی می‌شود
      default: return false;
    }
  };

  return (
    <div className={`rounded-xl max-w-4xl mx-auto ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
    } shadow-xl`}>
      {/* Header */}
      <div className={`p-6 border-b ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {t('ambassador.registration.title')}
          </h2>
          {onCancel && (
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {t('common.cancel')}
            </button>
          )}
        </div>
        
        {/* Progress Steps */}
        <div className="mt-6">
          <div className="flex justify-between relative">
            {/* Progress Line */}
            <div className={`absolute top-4 left-0 right-0 h-1 z-0 ${
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
            }`}></div>
            <div 
              className="absolute top-4 left-0 h-1 z-10 bg-blue-500 transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
            ></div>
            
            {/* Step Circles */}
            {[1, 2, 3, 4, 5, 6].map(step => (
              <div key={step} className="relative z-20">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step <= currentStep
                    ? 'bg-blue-500 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-gray-400'
                      : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs mt-1">
                  {t(`ambassador.registration.step${step}.short`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {renderCurrentStep()}
      </div>
      
      {/* Footer - Navigation */}
      <div className={`p-6 border-t ${
        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={currentStep === 1 || uploading}
           