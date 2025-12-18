import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ambassadorService } from '../../services/ambassadorService';
import './AmbassadorRegisterForm.css';

// ============ PROPS INTERFACE ============
export interface AmbassadorRegisterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  userId?: number; // دریافت userId از parent component
}

// ============ TYPES ============
interface FormData {
  country: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  languages: { [key: string]: number };
  services: string[];
  bio: string;
  workExperience: string;
  videoSelfieUrl?: string;
  agreementAccepted: boolean;
}

// Type برای داده‌های ثبت‌نام
interface AmbassadorRegistrationData {
  userId?: number;
  country: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  languages: { [key: string]: number };
  services: string[];
  bio: string;
  workExperience: string;
  videoSelfieUrl?: string;
  agreementAccepted: boolean;
  currentStep: number;
  registrationStatus: 'DRAFT' | 'PENDING_REVIEW';
}

// ============ LANGUAGE DATA ============
const AVAILABLE_LANGUAGES = [
  { code: 'fa', nameKey: 'languages.persian', flag: '🇮🇷', nativeName: 'فارسی' },
  { code: 'en', nameKey: 'languages.english', flag: '🇺🇸', nativeName: 'ENGLISH' },
  { code: 'ar', nameKey: 'languages.arabic', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'tr', nameKey: 'languages.turkish', flag: '🇹🇷', nativeName: 'TÜRKÇE' },
  { code: 'ru', nameKey: 'languages.russian', flag: '🇷🇺', nativeName: 'РУССКИЙ' },
  { code: 'fr', nameKey: 'languages.french', flag: '🇫🇷', nativeName: 'FRANÇAIS' },
  { code: 'de', nameKey: 'languages.german', flag: '🇩🇪', nativeName: 'DEUTSCH' },
  { code: 'es', nameKey: 'languages.spanish', flag: '🇪🇸', nativeName: 'ESPAÑOL' },
  { code: 'zh', nameKey: 'languages.chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ja', nameKey: 'languages.japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', nameKey: 'languages.korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'hi', nameKey: 'languages.hindi', flag: '🇮🇳', nativeName: 'हिन्दी' },
];

// ============ SERVICE DATA ============
const AVAILABLE_SERVICES = [
  { id: 'currency_exchange', nameKey: 'services.currency_exchange', icon: '💰' },
  { id: 'administrative', nameKey: 'services.administrative', icon: '🏛️' },
  { id: 'hotel_booking', nameKey: 'services.hotel_booking', icon: '🏨' },
  { id: 'bank_account', nameKey: 'services.bank_account', icon: '🏦' },
  { id: 'translation', nameKey: 'services.translation', icon: '🗣️' },
  { id: 'restaurant', nameKey: 'services.restaurant', icon: '🍽️' },
  { id: 'concert', nameKey: 'services.concert', icon: '🎭' },
  { id: 'education', nameKey: 'services.education', icon: '🎓' },
  { id: 'medical', nameKey: 'services.medical', icon: '🏥' },
  { id: 'entertainment', nameKey: 'services.entertainment', icon: '🎡' },
  { id: 'car_rental', nameKey: 'services.car_rental', icon: '🚗' },
  { id: 'shopping', nameKey: 'services.shopping', icon: '🛍️' },
  { id: 'airport_transfer', nameKey: 'services.airport_transfer', icon: '✈️' },
  { id: 'tour_guide', nameKey: 'services.tour_guide', icon: '🗺️' },
  { id: 'photography', nameKey: 'services.photography', icon: '📸' },
  { id: 'event_planning', nameKey: 'services.event_planning', icon: '📅' },
  { id: 'real_estate', nameKey: 'services.real_estate', icon: '🏠' },
  { id: 'legal_assistance', nameKey: 'services.legal_assistance', icon: '⚖️' },
  { id: 'fitness_training', nameKey: 'services.fitness_training', icon: '💪' },
  { id: 'cooking_classes', nameKey: 'services.cooking_classes', icon: '👨‍🍳' },
  { id: 'local_transport', nameKey: 'services.local_transport', icon: '🚌' },
  { id: 'sim_card', nameKey: 'services.sim_card', icon: '📱' },
  { id: 'shopping_assistant', nameKey: 'services.shopping_assistant', icon: '🛒' },
  { id: 'personal_driver', nameKey: 'services.personal_driver', icon: '🚙' },
  { id: 'childcare', nameKey: 'services.childcare', icon: '👶' },
  { id: 'pet_care', nameKey: 'services.pet_care', icon: '🐕' },
  { id: 'beauty_services', nameKey: 'services.beauty_services', icon: '💅' },
  { id: 'sports_tickets', nameKey: 'services.sports_tickets', icon: '⚽' },
  { id: 'museum_tours', nameKey: 'services.museum_tours', icon: '🏛️' },
  { id: 'food_tours', nameKey: 'services.food_tours', icon: '🍜' },
];

// ============ VALIDATION SCHEMA ============
const createValidationSchema = (currentStep: number) => {
  const baseSchema: any = {};

  if (currentStep === 1) {
    baseSchema.country = yup.string().required('validation.country_required');
    baseSchema.city = yup.string().required('validation.city_required');
    baseSchema.address = yup.string().required('validation.address_required').min(10, 'validation.address_min_length');
  }

  if (currentStep === 2) {
    baseSchema.languages = yup.object().test(
      'at-least-one-language',
      'validation.at_least_one_language',
      (value) => value && Object.keys(value).length > 0
    );
  }

  if (currentStep === 3) {
    baseSchema.services = yup.array().min(1, 'validation.at_least_one_service');
  }

  if (currentStep === 4) {
    baseSchema.videoSelfieUrl = yup.string().required('validation.video_selfie_required');
  }

  if (currentStep === 5) {
    baseSchema.agreementAccepted = yup.boolean().oneOf([true], 'validation.agreement_required');
  }

  return yup.object().shape(baseSchema);
};

// ============ MAIN COMPONENT ============
const AmbassadorRegisterForm = ({
  onSuccess,
  onCancel,
  className = "",
  userId // دریافت userId از props
}: AmbassadorRegisterFormProps) => {
  const { t, i18n } = useTranslation();

  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  const validationSchema = createValidationSchema(currentStep);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
    trigger,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as any,
    mode: 'onChange',
    defaultValues: {
      country: '',
      city: '',
      address: '',
      languages: {},
      services: [],
      bio: '',
      workExperience: '',
      agreementAccepted: false,
    },
  });

  // Load user data and registration
  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadUserRegistration(), loadCountries()]);
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const loadUserRegistration = async () => {
    try {
      const status = await ambassadorService.getMyRegistration();

      if (status.hasRegistration && status.ambassador) {
        const ambassador = status.ambassador;
        setValue('country', ambassador.country || '');
        setValue('city', ambassador.city || '');
        setValue('address', ambassador.address || '');

        if (ambassador.languages) {
          const langObj: { [key: string]: number } = {};
          ambassador.languages.forEach(lang => {
            const [code, proficiency] = lang.split(':');
            if (code && proficiency) {
              langObj[code] = parseInt(proficiency);
            }
          });
          setValue('languages', langObj);
        }

        setValue('services', ambassador.services || []);
        setValue('workExperience', ambassador.workExperience || '');
        setValue('agreementAccepted', ambassador.agreementAccepted || false);

        if (status.currentStep) {
          setCurrentStep(status.currentStep);
        }
      }
    } catch (error) {
      console.error('Failed to load registration:', error);
    }
  };

  const loadCountries = async () => {
    try {
      const data = await ambassadorService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error('Failed to load countries:', error);
    }
  };

  const handleCountryChange = async (countryId: number) => {
    setSelectedCountryId(countryId);
    setValue('city', '');

    try {
      const majorCities = await ambassadorService.getMajorCitiesByCountry(countryId);
      setCities(majorCities);
    } catch (error) {
      console.error('Failed to load cities:', error);
      setCities([]);
    }
  };

  // Initialize map
  useEffect(() => {
    if (currentStep === 1 && !mapInstanceRef.current && mapRef.current) {
      initMap();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentStep]);

  const initMap = () => {
    if (!mapRef.current) return;

    // Fix leaflet icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const map = L.map(mapRef.current).setView([35.6892, 51.3890], 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(map);

    let marker: L.Marker | null = null;

    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setValue('latitude', lat);
      setValue('longitude', lng);

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lng]).addTo(map);
    });

    mapInstanceRef.current = map;
  };

  // Handle step navigation
  const nextStep = async (data?: Partial<FormData>) => {
    // اعتبارسنجی مرحله فعلی
    const isValidStep = await trigger();
    if (!isValidStep) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep < 5) {
      if (data) {
        await saveDraft(data);
      }
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Save draft to backend
  const saveDraft = async (formData: Partial<FormData>) => {
    try {
      setIsSubmitting(true);

      // بررسی userId - اگر وجود نداشت خطا نشان بده
      if (!userId) {
        throw new Error('لطفاً ابتدا وارد حساب کاربری خود شوید');
      }

      // ساخت داده‌های کامل برای ارسال
      const draftData: AmbassadorRegistrationData = {
        userId: userId, // استفاده از userId واقعی
        country: formData.country || '',
        city: formData.city || '',
        address: formData.address || '',
        latitude: formData.latitude,
        longitude: formData.longitude,
        languages: formData.languages || {},
        services: formData.services || [],
        bio: formData.bio || '',
        workExperience: formData.workExperience || '',
        videoSelfieUrl: formData.videoSelfieUrl || '',
        agreementAccepted: formData.agreementAccepted || false,
        currentStep,
        registrationStatus: 'DRAFT',
      };

      console.log('Saving draft data:', draftData); // برای دیباگ

      const result = await ambassadorService.saveDraft(draftData);
      setSaveMessage(t(result.message || 'messages.draft_saved'));

      setTimeout(() => setSaveMessage(''), 3000);

      localStorage.setItem('ambassador_draft', JSON.stringify({
        step: currentStep,
        data: formData,
        savedAt: new Date().toISOString(),
      }));
    } catch (error: any) {
      console.error('Failed to save draft:', error);
      const errorMessage = error.message || 'خطا در ذخیره پیش‌نویس';
      setSaveMessage(t('errors.save_failed', { error: errorMessage }));

      // اگر خطای userId باشد، کاربر را راهنمایی کنیم
      if (error.message.includes('لطفاً ابتدا وارد حساب کاربری')) {
        alert('برای ثبت‌نام به عنوان سفیر، ابتدا باید وارد حساب کاربری خود شوید.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit final registration
  const onSubmit = async (data: FormData) => {
    try {
      // بررسی کامل بودن همه مراحل
      if (currentStep < 5) {
        alert(t('errors.complete_all_steps'));
        return;
      }

      // بررسی userId - اگر وجود نداشت خطا نشان بده
      if (!userId) {
        alert('برای ثبت‌نام نهایی، ابتدا باید وارد حساب کاربری خود شوید.');
        return;
      }

      setIsSubmitting(true);

      const finalData: AmbassadorRegistrationData = {
        userId: userId, // استفاده از userId واقعی
        country: data.country,
        city: data.city,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        languages: data.languages,
        services: data.services,
        bio: data.bio,
        workExperience: data.workExperience,
        videoSelfieUrl: data.videoSelfieUrl || '',
        agreementAccepted: data.agreementAccepted,
        currentStep: 5,
        registrationStatus: 'PENDING_REVIEW',
      };

      console.log('Submitting final data:', finalData); // برای دیباگ

      await ambassadorService.submitRegistration(finalData);

      localStorage.removeItem('ambassador_draft');

      if (onSuccess) {
        onSuccess();
      } else {
        alert(t('messages.registration_success'));
      }

      reset();
      setCurrentStep(1);

    } catch (error: any) {
      console.error('Failed to submit registration:', error);
      alert(t('errors.submission_failed', { error: error.message }));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle language selection
  const toggleLanguage = (langCode: string) => {
    const currentLanguages = watch('languages') || {};
    const newLanguages = { ...currentLanguages };

    if (newLanguages[langCode]) {
      delete newLanguages[langCode];
    } else {
      newLanguages[langCode] = 50;
    }

    setValue('languages', newLanguages);
  };

  const updateLanguageProficiency = (langCode: string, proficiency: number) => {
    const currentLanguages = watch('languages') || {};
    setValue('languages', {
      ...currentLanguages,
      [langCode]: proficiency,
    });
  };

  // Handle service selection
  const toggleService = (serviceId: string) => {
    const currentServices = watch('services') || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];

    setValue('services', newServices);
  };

  // Handle video upload
  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert(t('errors.invalid_video_file'));
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert(t('errors.file_too_large'));
      return;
    }

    // نمایش پیش‌نمایش موقت
    const videoUrl = URL.createObjectURL(file);
    setValue('videoSelfieUrl', videoUrl);

    // در اپلیکیشن واقعی، آپلود به سرور
    try {
      // شبیه‌سازی آپلود
      await new Promise(resolve => setTimeout(resolve, 2000));

      // URL واقعی از سرور - در اینجا از blob URL استفاده می‌کنیم
      // در پروژه واقعی باید فایل را به سرور آپلود کنید
      alert(t('messages.video_uploaded'));
    } catch (error) {
      alert(t('errors.upload_failed'));
    }
  };

  // Get flag background style - کاملاً اصلاح شده
  const getFlagBackgroundStyle = (countryCode: string) => {
    const flagCodes: { [key: string]: string } = {
      'fa': 'ir', 'en': 'us', 'ar': 'sa', 'tr': 'tr',
      'ru': 'ru', 'fr': 'fr', 'de': 'de', 'es': 'es',
      'zh': 'cn', 'ja': 'jp', 'ko': 'kr', 'hi': 'in'
    };

    const code = flagCodes[countryCode] || 'us';
    return {
      backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.9)), url('https://flagcdn.com/w320/${code}.png')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundBlendMode: 'lighten',
    };
  };

  // ============ STEP RENDERING FUNCTIONS ============

  // Render step 1: Location
  const renderStep1 = () => {
    return (
      <div className="step-container">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-8 h-8 rounded-full flex items-center justify-center">1</span>
          {t('steps.location.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Country */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('form.country')} *
            </label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                  onChange={(e) => {
                    field.onChange(e);
                    const countryId = countries.find(c => c.name === e.target.value)?.id;
                    if (countryId) handleCountryChange(countryId);
                  }}
                >
                  <option value="">{t('form.select_country')}</option>
                  {countries.map(country => (
                    <option key={country.id} value={country.name}>
                      {i18n.language === 'fa' ? (country.nameFa || country.name) : country.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{String(errors.country.message)}</p>
            )}
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('form.city')} *
            </label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 transition-colors"
                  disabled={!selectedCountryId}
                >
                  <option value="">{t('form.select_city')}</option>
                  {cities.map(city => (
                    <option key={city.id} value={city.name}>
                      {i18n.language === 'fa' ? (city.nameFa || city.name) : city.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{String(errors.city.message)}</p>
            )}
          </div>
        </div>

        {/* Address */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('form.address')} *
          </label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                placeholder={t('form.address_placeholder')}
              />
            )}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{String(errors.address.message)}</p>
          )}
        </div>

        {/* Map */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('form.map_location')}
            <span className="text-gray-500 dark:text-gray-400 text-xs mr-2"> ({t('form.map_instruction')})</span>
          </label>
          <div
            ref={mapRef}
            className="w-full h-64 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden shadow-md"
          />
        </div>
      </div>
    );
  };

  // Render step 2: Languages
  const renderStep2 = () => {
    const selectedLanguages = watch('languages') || {};

    return (
      <div className="step-container">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-8 h-8 rounded-full flex items-center justify-center">2</span>
          {t('steps.languages.title')}
        </h2>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            <span className="text-red-500">*</span> {t('validation.at_least_one_language')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {AVAILABLE_LANGUAGES.map(lang => {
              const isSelected = !!selectedLanguages[lang.code];
              const proficiency = selectedLanguages[lang.code] || 50;

              return (
                <div
                  key={lang.code}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-lg min-h-[140px] language-card ${isSelected
                      ? 'border-blue-500 dark:border-blue-400 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  style={isSelected ? getFlagBackgroundStyle(lang.code) : {}}
                >
                  <div className={`p-4 h-full ${isSelected ? 'bg-white/10 dark:bg-gray-900/10' : 'bg-white dark:bg-gray-800'}`}>
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{lang.flag}</span>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-gray-100 text-lg">{lang.nativeName}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{t(lang.nameKey)}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleLanguage(lang.code)}
                            className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                          />
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
                          <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {t('form.proficiency')}: <span className="font-bold text-blue-600 dark:text-blue-400">{proficiency}%</span>
                          </label>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={proficiency}
                            onChange={(e) => updateLanguageProficiency(lang.code, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer range-slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{t('form.beginner')}</span>
                            <span>{t('form.native')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {errors.languages && (
            <p className="text-red-500 text-sm mt-4">{String(errors.languages.message)}</p>
          )}
        </div>

        {/* Selected languages summary */}
        {Object.keys(selectedLanguages).length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
            <h3 className="font-medium text-blue-800 dark:text-blue-300 mb-3">
              <span className="flex items-center gap-2">
                <span className="text-lg">🌐</span>
                {t('form.selected_languages')} ({Object.keys(selectedLanguages).length})
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {Object.entries(selectedLanguages).map(([code, proficiency]) => {
                const lang = AVAILABLE_LANGUAGES.find(l => l.code === code);
                return lang ? (
                  <div
                    key={code}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-full shadow-sm border border-blue-100 dark:border-blue-800"
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium text-gray-900 dark:text-gray-100">{lang.nativeName}</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">({proficiency}%)</span>
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render step 3: Services & Bio
  const renderStep3 = () => {
    const selectedServices = watch('services') || [];
    const workExperience = watch('workExperience') || '';

    return (
      <div className="step-container">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-8 h-8 rounded-full flex items-center justify-center">3</span>
          {t('steps.services.title')}
        </h2>

        {/* Services */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {t('form.select_services')} *
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedServices.length} {t('form.selected_services_count')}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {AVAILABLE_SERVICES.map(service => {
              const isSelected = selectedServices.includes(service.id);
              return (
                <div
                  key={service.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:shadow-md ${isSelected
                      ? 'border-blue-500 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                    }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform ${isSelected ? 'scale-110' : ''} ${isSelected
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}>
                      {service.icon}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">{t(service.nameKey)}</div>
                      <div className={`text-xs mt-1 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {isSelected ? t('form.selected') : t('form.click_to_select')}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.services && (
            <p className="text-red-500 text-sm mt-2">{String(errors.services.message)}</p>
          )}
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('form.bio')} ({t('form.optional')})
          </label>
          <Controller
            name="bio"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                placeholder={t('form.bio_placeholder')}
              />
            )}
          />
        </div>

        {/* Work Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('form.work_experience')} ({t('form.optional')})
          </label>
          <Controller
            name="workExperience"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={5}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
                placeholder={t('form.work_experience_placeholder')}
              />
            )}
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {workExperience.length} {t('form.characters')}
            </div>
            <div className="text-xs text-gray-400 dark:text-gray-500">
              {t('form.recommended_min_chars')}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render step 4: Documents
  const renderStep4 = () => {
    const videoUrl = watch('videoSelfieUrl');

    return (
      <div className="step-container">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-8 h-8 rounded-full flex items-center justify-center">4</span>
          {t('steps.documents.title')}
        </h2>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
            {t('form.video_selfie')} *
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('form.video_selfie_description')}
          </p>

          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 transition-colors hover:border-blue-300 dark:hover:border-blue-600">
            {videoUrl ? (
              <div className="space-y-4">
                <div className="relative">
                  <video
                    src={videoUrl}
                    controls
                    className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                  // حذف poster مشکل‌ساز
                  />
                </div>
                <div className="flex gap-4 justify-center flex-wrap">
                  <button
                    type="button"
                    onClick={() => setValue('videoSelfieUrl', '')}
                    className="px-5 py-2.5 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-700 dark:text-red-400 rounded-lg hover:shadow-md transition-all flex items-center gap-2"
                  >
                    <span>🗑️</span>
                    {t('form.delete_video')}
                  </button>
                  <label className="px-5 py-2.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-400 rounded-lg hover:shadow-md transition-all flex items-center gap-2 cursor-pointer">
                    <span>🔄</span>
                    {t('form.change_video')}
                    <input
                      type="file"
                      accept="video/*"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer block">
                <div className="text-6xl mb-4 text-gray-300 dark:text-gray-600">📹</div>
                <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {t('form.click_to_upload_video')}
                </div>
                <div className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  {t('form.video_formats')}
                </div>
                <div className="inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <span className="text-xl">📁</span>
                  <span className="font-medium">{t('form.select_video')}</span>
                </div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {errors.videoSelfieUrl && (
            <p className="text-red-500 text-sm mt-2">{String(errors.videoSelfieUrl.message)}</p>
          )}
        </div>
      </div>
    );
  };

  // Render step 5: Agreement
  const renderStep5 = () => {
    return (
      <div className="step-container">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800 dark:text-gray-100">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 w-8 h-8 rounded-full flex items-center justify-center">5</span>
          {t('steps.agreement.title')}
        </h2>

        <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6 max-h-96 overflow-y-auto mb-6 bg-white dark:bg-gray-800 shadow-inner">
          <h3 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">
            {t('agreement.title')}
          </h3>

          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                {t('agreement.section1.title')}
              </h4>
              <ul className="list-disc pr-6 space-y-2">
                <li>{t('agreement.section1.item1')}</li>
                <li>{t('agreement.section1.item2')}</li>
                <li>{t('agreement.section1.item3')}</li>
                <li>{t('agreement.section1.item4')}</li>
                <li>{t('agreement.section1.item5')}</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                {t('agreement.section2.title')}
              </h4>
              <ul className="list-disc pr-6 space-y-2">
                <li>{t('agreement.section2.item1')}</li>
                <li>{t('agreement.section2.item2')}</li>
                <li>{t('agreement.section2.item3')}</li>
                <li>{t('agreement.section2.item4')}</li>
                <li>{t('agreement.section2.item5')}</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                {t('agreement.section3.title')}
              </h4>
              <ul className="list-disc pr-6 space-y-2">
                <li>{t('agreement.section3.item1')}</li>
                <li>{t('agreement.section3.item2')}</li>
                <li>{t('agreement.section3.item3')}</li>
                <li>{t('agreement.section3.item4')}</li>
                <li>{t('agreement.section3.item5')}</li>
              </ul>
            </section>

            <section>
              <h4 className="font-semibold text-lg mb-3 text-gray-900 dark:text-gray-100">
                {t('agreement.section4.title')}
              </h4>
              <p className="mb-2">{t('agreement.section4.description')}</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>{t('agreement.section4.item1')}</li>
                <li>{t('agreement.section4.item2')}</li>
                <li>{t('agreement.section4.item3')}</li>
              </ul>
            </section>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                <strong>⚠️ {t('agreement.important_note')}:</strong> {t('agreement.important_note_description')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <Controller
            name="agreementAccepted"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                id="agreement"
                checked={!!field.value}
                onChange={field.onChange}
                className="w-5 h-5 mt-1 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              />
            )}
          />
          <label htmlFor="agreement" className="text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <span className="font-medium">{t('form.agreement_acceptance')}</span>
            <span className="block text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('form.agreement_acceptance_description')}
            </span>
          </label>
        </div>

        {errors.agreementAccepted && (
          <p className="text-red-500 text-sm mt-2">{String(errors.agreementAccepted.message)}</p>
        )}
      </div>
    );
  };

  // Render progress bar
  const renderProgressBar = () => {
    const steps = [
      { number: 1, titleKey: 'steps.location.title' },
      { number: 2, titleKey: 'steps.languages.title' },
      { number: 3, titleKey: 'steps.services.title' },
      { number: 4, titleKey: 'steps.documents.title' },
      { number: 5, titleKey: 'steps.agreement.title' },
    ];

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4 relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 z-0">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center relative z-10">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-medium mb-2 transition-all duration-300 ${step.number === currentStep
                    ? 'bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg scale-110'
                    : step.number < currentStep
                      ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-md'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
              >
                {step.number < currentStep ? (
                  <span className="text-lg">✓</span>
                ) : (
                  <span className="font-bold">{step.number}</span>
                )}
              </div>
              <span className={`text-sm font-medium ${step.number === currentStep ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                {t(step.titleKey)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className={`max-w-6xl mx-auto p-4 md:p-6 ${className}`}>
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 p-8 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-6xl mx-auto p-4 md:p-6 ${className}`} ref={formContainerRef}>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">👋 {t('form.title')}</h1>
              <p className="text-blue-100 dark:text-blue-200">
                {t('form.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 dark:bg-black/20 px-4 py-2 rounded-full">
              <div className={`w-3 h-3 rounded-full ${isSubmitting ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
              <span className="text-sm font-medium">
                {isSubmitting ? t('form.status_processing') : t('form.status_ready')}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          {renderProgressBar()}

          {saveMessage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400">✓</span>
                </div>
                <span className="text-green-800 dark:text-green-300 font-medium">{saveMessage}</span>
              </div>
            </div>
          )}

          <form
            onSubmit={handleSubmit(
              currentStep === 5 ? onSubmit : (data) => nextStep(data)
            )}
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}

            <div className="flex justify-between mt-10 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-700 dark:text-red-400 rounded-xl font-medium hover:shadow-md transition-all flex items-center gap-2"
                  >
                    <span>←</span>
                    {t('buttons.cancel')}
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                {/* Previous button - hidden on step 1 */}
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 ${isSubmitting
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 hover:shadow-md'
                      }`}
                  >
                    <span>→</span>
                    {t('buttons.previous')}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className={`px-8 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${isSubmitting || !isValid
                      ? 'bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 text-white opacity-70 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white hover:shadow-lg hover:scale-105'
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('buttons.processing')}
                    </>
                  ) : currentStep === 5 ? (
                    <>
                      <span className="text-lg">🚀</span>
                      {t('buttons.submit_final')}
                    </>
                  ) : (
                    <>
                      {t('buttons.next_step')}
                      <span>←</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AmbassadorRegisterForm;