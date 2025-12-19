import { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ambassadorService } from '../../services/ambassadorService';
import './AmbassadorRegisterForm.css';

// ============ PROPS INTERFACE ============
export interface AmbassadorRegisterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
  userId?: number;
}

// ============ FORM DATA TYPES ============
interface FormData {
  country: string;
  city: string;
  address: string;
  latitude?: number;
  longitude?: number;
  languages: { [key: string]: number };
  services: string[];
  bio: string;
  videoSelfieUrl?: string;
  agreementAccepted: boolean;
}

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
  videoSelfieUrl?: string;
  agreementAccepted: boolean;
  currentStep: number;
  registrationStatus: 'DRAFT' | 'PENDING_REVIEW';
}

// ============ LANGUAGE DATA ============
const AVAILABLE_LANGUAGES = [
  { code: 'fa', flag: '🇮🇷', nativeName: 'فارسی' },
  { code: 'en', flag: '🇺🇸', nativeName: 'ENGLISH' },
  { code: 'ar', flag: '🇸🇦', nativeName: 'العربية' },
  { code: 'tr', flag: '🇹🇷', nativeName: 'TÜRKÇE' },
  { code: 'ru', flag: '🇷🇺', nativeName: 'РУССКИЙ' },
  { code: 'fr', flag: '🇫🇷', nativeName: 'FRANÇAIS' },
  { code: 'de', flag: '🇩🇪', nativeName: 'DEUTSCH' },
  { code: 'es', flag: '🇪🇸', nativeName: 'ESPAÑOL' },
  { code: 'zh', flag: '🇨🇳', nativeName: '中文' },
  { code: 'ja', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'ko', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'hi', flag: '🇮🇳', nativeName: 'हिन्दी' },
];


// ============ SERVICE DATA ============
const AVAILABLE_SERVICES = [
  { id: 'currency_exchange', icon: '💰', nameKey: 'services.currency_exchange' },
  { id: 'administrative', icon: '🏛️', nameKey: 'services.administrative' },
  { id: 'hotel_booking', icon: '🏨', nameKey: 'services.hotel_booking' },
  { id: 'bank_account', icon: '🏦', nameKey: 'services.bank_account' },
  { id: 'translation', icon: '🗣️', nameKey: 'services.translation' },
  { id: 'restaurant', icon: '🍽️', nameKey: 'services.restaurant' },
  { id: 'concert', icon: '🎭', nameKey: 'services.concert' },
  { id: 'education', icon: '🎓', nameKey: 'services.education' },
  { id: 'medical', icon: '🏥', nameKey: 'services.medical' },
  { id: 'entertainment', icon: '🎡', nameKey: 'services.entertainment' },
  { id: 'car_rental', icon: '🚗', nameKey: 'services.car_rental' },
  { id: 'shopping', icon: '🛍️', nameKey: 'services.shopping' },
  { id: 'airport_transfer', icon: '✈️', nameKey: 'services.airport_transfer' },
  { id: 'tour_guide', icon: '🗺️', nameKey: 'services.tour_guide' },
  { id: 'photography', icon: '📸', nameKey: 'services.photography' },
  { id: 'event_planning', icon: '📅', nameKey: 'services.event_planning' },
  { id: 'real_estate', icon: '🏠', nameKey: 'services.real_estate' },
  { id: 'legal_assistance', icon: '⚖️', nameKey: 'services.legal_assistance' },
  { id: 'fitness_training', icon: '💪', nameKey: 'services.fitness_training' },
  { id: 'cooking_classes', icon: '👨‍🍳', nameKey: 'services.cooking_classes' },
  { id: 'local_transport', icon: '🚌', nameKey: 'services.local_transport' },
  { id: 'sim_card', icon: '📱', nameKey: 'services.sim_card' },
  { id: 'shopping_assistant', icon: '🛒', nameKey: 'services.shopping_assistant' },
  { id: 'personal_driver', icon: '🚙', nameKey: 'services.personal_driver' },
  { id: 'childcare', icon: '👶', nameKey: 'services.childcare' },
  { id: 'pet_care', icon: '🐕', nameKey: 'services.pet_care' },
  { id: 'beauty_services', icon: '💅', nameKey: 'services.beauty_services' },
  { id: 'sports_tickets', icon: '⚽', nameKey: 'services.sports_tickets' },
  { id: 'museum_tours', icon: '🏛️', nameKey: 'services.museum_tours' },
  { id: 'food_tours', icon: '🍜', nameKey: 'services.food_tours' },
];

// ============ VALIDATION SCHEMA ============
const createValidationSchema = (currentStep: number) => {
  const baseSchema: any = {};

  if (currentStep === 1) {
    baseSchema.country = yup.string().required('validation.country_required');
    baseSchema.city = yup.string().required('validation.city_required');
    baseSchema.address = yup.string()
      .required('validation.address_required')
      .min(10, 'validation.address_min_length');
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

  if (currentStep === 5) {
    baseSchema.agreementAccepted = yup.boolean()
      .oneOf([true], 'validation.agreement_required');
  }

  return yup.object().shape(baseSchema);
};

// ============ MAIN COMPONENT ============
const AmbassadorRegisterForm = ({
  onSuccess,
  onCancel,
  className = "",
  userId
}: AmbassadorRegisterFormProps) => {
  const { t, i18n } = useTranslation();

  // ============ STATE MANAGEMENT ============
  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasPendingRegistration, setHasPendingRegistration] = useState(false);
  const [videoUploadSuccess, setVideoUploadSuccess] = useState(false);
  const [showMap, setShowMap] = useState(true);
  // Refs برای مدیریت DOM
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // ============ FORM CONFIGURATION ============
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
      agreementAccepted: false,
    },
  });

  // ============ INITIALIZATION EFFECT ============
  useEffect(() => {
    const initializeComponent = async () => {
      setIsLoading(true);
      try {
        const [registrationStatus] = await Promise.all([
          checkExistingRegistration(),
          loadCountries()
        ]);

        // اگر کاربر ثبت‌نام در انتظار تایید دارد، آن را نمایش نده
        if (!registrationStatus) {
          await loadUserRegistration();
        }
      } catch (error) {
        console.error('Initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeComponent();
  }, []);

  // ============ CHECK EXISTING REGISTRATION ============
  const checkExistingRegistration = async (): Promise<boolean> => {
    try {
      const status = await ambassadorService.getMyRegistration();
      if (status.hasRegistration && status.ambassador?.registrationStep === 5) {
        setHasPendingRegistration(true);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking registration:', error);
      return false;
    }
  };

  // ============ DATA LOADING FUNCTIONS ============
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
        setValue('bio', ambassador.bio || '');
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

  // ============ MAP FUNCTIONS ============
  const loadLeaflet = async (): Promise<any> => {
    if (typeof window === 'undefined') return null;

    try {
      const module = await import('leaflet');
      const L = module.default || module;

      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      return L;
    } catch (error) {
      console.error('Failed to load Leaflet:', error);
      return null;
    }
  };

  useEffect(() => {
    let mapInstance: any = null;
    let isMounted = true;

    const initializeMap = async () => {
      if (currentStep !== 1 || !mapRef.current || !isMounted) return;

      try {
        const L = await loadLeaflet();
        if (!L || !mapRef.current || !isMounted) return;

        // بررسی اگر نقشه از قبل وجود دارد، ابتدا آن را پاک کن
        if (mapInstanceRef.current) {
          try {
            mapInstanceRef.current.remove();
          } catch (e) {
            console.log('Map already removed or in cleanup state');
          }
          mapInstanceRef.current = null;
        }

        // مطمئن شو container خالی است
        if (mapRef.current) {
          mapRef.current.innerHTML = '';
        }

        const map = L.map(mapRef.current, {
          center: [35.6892, 51.3890],
          zoom: 12,
          zoomControl: true,
          attributionControl: false,
          preferCanvas: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
        }).addTo(map);

        let marker: any = null;

        map.on('click', (e: any) => {
          if (!isMounted) return;

          const { lat, lng } = e.latlng;
          setValue('latitude', lat);
          setValue('longitude', lng);

          if (marker) {
            map.removeLayer(marker);
          }

          marker = L.marker([lat, lng], {
            draggable: true,
          }).addTo(map);

          marker.on('dragend', () => {
            if (marker && isMounted) {
              const position = marker.getLatLng();
              setValue('latitude', position.lat);
              setValue('longitude', position.lng);
            }
          });
        });

        mapInstanceRef.current = map;
        mapInstance = map;

        setTimeout(() => {
          if (map && isMounted) {
            map.invalidateSize();
          }
        }, 300);

      } catch (error) {
        console.error('Map initialization failed:', error);
        if (mapRef.current && isMounted) {
          mapRef.current.innerHTML = `
          <div class="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 p-6 text-center rounded-xl">
            <div class="text-5xl mb-4">🗺️</div>
            <h3 class="font-semibold text-lg mb-2">${t('messages.map_unavailable')}</h3>
            <p class="text-sm">${t('messages.manual_location_entry')}</p>
          </div>
        `;
        }
      }
    };

    const timer = setTimeout(() => {
      if (isMounted) {
        initializeMap();
      }
    }, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);

      // استفاده از try-catch برای جلوگیری از خطای "Map container is being reused"
      try {
        if (mapInstance) {
          mapInstance.remove();
          mapInstance = null;
        }

        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      } catch (error) {
      }

      // همچنین container را خالی کن
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, [currentStep]);

  // ============ STEP NAVIGATION ============
  const nextStep = async (data?: Partial<FormData>) => {
    // اعتبارسنجی مرحله فعلی
    const isValidStep = await trigger();
    if (!isValidStep) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep < 5) {
      try {
        if (data) {
          await saveDraft(data);
        }
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        // اگر خطای 401 بود، کاربر را به صفحه لاگین هدایت کن
        if (error.message.includes('401') || error.message.includes('User not found')) {
          alert(t('errors.login_required'));
          // یا:
          // window.location.href = '/login';
        } else {
          console.error('Error in nextStep:', error);
        }
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ============ API COMMUNICATION ============
  const saveDraft = async (formData: Partial<FormData>) => {
    try {
      setIsSubmitting(true);

      if (!userId) {
        throw new Error(t('errors.login_required'));
      }

      const draftData: AmbassadorRegistrationData = {
        userId: userId,
        country: formData.country || '',
        city: formData.city || '',
        address: formData.address || '',
        latitude: formData.latitude,
        longitude: formData.longitude,
        languages: formData.languages || {},
        services: formData.services || [],
        bio: formData.bio || '',
        videoSelfieUrl: formData.videoSelfieUrl || '',
        agreementAccepted: formData.agreementAccepted || false,
        currentStep,
        registrationStatus: 'DRAFT',
      };

      await ambassadorService.saveDraft(draftData);

      localStorage.setItem('ambassador_draft', JSON.stringify({
        step: currentStep,
        data: formData,
        savedAt: new Date().toISOString(),
      }));
    } catch (error: any) {
      console.error('Failed to save draft:', error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (currentStep < 5) {
        alert(t('errors.complete_all_steps'));
        return;
      }

      if (!userId) {
        alert(t('errors.login_required'));
        return;
      }

      setIsSubmitting(true);

      const finalData: AmbassadorRegistrationData = {
        userId: userId,
        country: data.country,
        city: data.city,
        address: data.address,
        latitude: data.latitude,
        longitude: data.longitude,
        languages: data.languages,
        services: data.services,
        bio: data.bio,
        videoSelfieUrl: data.videoSelfieUrl || '',
        agreementAccepted: data.agreementAccepted,
        currentStep: 5,
        registrationStatus: 'PENDING_REVIEW',
      };

      await ambassadorService.submitRegistration(finalData);

      localStorage.removeItem('ambassador_draft');
      setHasPendingRegistration(true);

      if (onSuccess) {
        onSuccess();
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

  // ============ UI HANDLERS ============
  const toggleLanguage = useCallback((langCode: string) => {
    const currentLanguages = watch('languages') || {};
    const newLanguages = { ...currentLanguages };
    if (newLanguages[langCode]) {
      delete newLanguages[langCode];
      console.log('Removed language:', langCode);
    } else {
      newLanguages[langCode] = 50;
    }

    setValue('languages', newLanguages, { shouldValidate: true });
  }, [watch, setValue]);

  const updateLanguageProficiency = useCallback((langCode: string, proficiency: number) => {
    const currentLanguages = watch('languages') || {};
    setValue('languages', {
      ...currentLanguages,
      [langCode]: proficiency,
    }, { shouldValidate: true });
  }, [watch, setValue]);

  const toggleService = useCallback((serviceId: string) => {
    const currentServices = watch('services') || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter(id => id !== serviceId)
      : [...currentServices, serviceId];

    setValue('services', newServices, { shouldValidate: true });
  }, [watch, setValue]);

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

    try {
      setIsSubmitting(true);

      // شبیه‌سازی آپلود ویدیو
      await new Promise(resolve => setTimeout(resolve, 1500));

      const videoUrl = URL.createObjectURL(file);
      setValue('videoSelfieUrl', videoUrl);
      setVideoUploadSuccess(true);

      // پنهان کردن تیک سبز بعد از 3 ثانیه
      setTimeout(() => {
        setVideoUploadSuccess(false);
      }, 3000);

    } catch (error) {
      alert(t('errors.upload_failed'));
      setVideoUploadSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ FLAG BACKGROUND STYLE FUNCTION ============
  const flagCodes: { [key: string]: string } = {
    'fa': 'ir', 'en': 'us', 'ar': 'sa', 'tr': 'tr',
    'ru': 'ru', 'fr': 'fr', 'de': 'de', 'es': 'es',
    'zh': 'cn', 'ja': 'jp', 'ko': 'kr', 'hi': 'in'
  };


  const getFlagBackgroundStyle = (countryCode: string, isSelected: boolean) => {

    const code = flagCodes[countryCode] || 'us';
    const isDarkMode = document.documentElement.classList.contains('dark');

    // برای تمام حالت‌ها background یکسان اما opacity متفاوت
    const baseBackground = {
      backgroundImage: `url('https://flagcdn.com/w640/${code}.png')`,
      backgroundSize: 'cover', // تغییر از cover به contain یا 100%
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };

    if (isSelected) {
      // وقتی زبان انتخاب شده - overlay خیلی کم
      if (isDarkMode) {
        return {
          ...baseBackground,
          backgroundSize: '100% 100%', // پر کردن کامل کادر
          backgroundColor: 'rgba(15, 23, 42, 0.2)',
          backgroundBlendMode: 'overlay',
        };
      }

      return {
        ...baseBackground,
        backgroundSize: '100% 100%', // پر کردن کامل کادر
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        backgroundBlendMode: 'soft-light',
      };
    }

    // وقتی زبان انتخاب نشده
    if (isDarkMode) {
      return {
        ...baseBackground,
        backgroundSize: '100% 100%', // پر کردن کامل کادر
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        backgroundBlendMode: 'overlay',
      };
    }

    return {
      ...baseBackground,
      backgroundSize: '100% 100%', // پر کردن کامل کادر
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      backgroundBlendMode: 'soft-light',
    };
  };

  // ============ RENDER FUNCTIONS ============

  // اگر کاربر ثبت‌نام در انتظار تایید دارد، نمایش پیام
  if (hasPendingRegistration) {
    return (
      <div className={`max-w-4xl mx-auto p-6 ${className}`}>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 text-center border border-blue-100 dark:border-blue-800">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center">
            <span className="text-3xl text-white">⏳</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            {t('messages.registration_pending_title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {t('messages.registration_pending_description')}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              {t('buttons.refresh')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // رندر مرحله 1: موقعیت
  const renderStep1 = () => {
    return (
      <div className="step-container animate-fadeIn">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
              1
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t('steps.location.title')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* انتخاب کشور */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('form.country')} *
              </label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 appearance-none"
                    onChange={(e) => {
                      field.onChange(e);
                      const countryId = countries.find(c => c.name === e.target.value)?.id;
                      if (countryId) handleCountryChange(countryId);
                    }}
                  >
                    <option value="" className="text-gray-400">
                      {t('form.select_country')}
                    </option>
                    {countries.map(country => (
                      <option key={country.id} value={country.name} className="text-gray-900 dark:text-gray-100">
                        {i18n.language === 'fa' ? (country.nameFa || country.name) : country.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span>⚠️</span>
                  {t(String(errors.country.message))}
                </p>
              )}
            </div>

            {/* انتخاب شهر */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('form.city')} *
              </label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 disabled:opacity-50 transition-all duration-200 appearance-none"
                    disabled={!selectedCountryId}
                  >
                    <option value="" className="text-gray-400">
                      {t('form.select_city')}
                    </option>
                    {cities.map(city => (
                      <option key={city.id} value={city.name} className="text-gray-900 dark:text-gray-100">
                        {i18n.language === 'fa' ? (city.nameFa || city.name) : city.name}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <span>⚠️</span>
                  {t(String(errors.city.message))}
                </p>
              )}
            </div>
          </div>

          {/* آدرس */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('form.address')} *
            </label>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={3}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 resize-none"
                  placeholder={t('form.address_placeholder')}
                />
              )}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-2">
                <span>⚠️</span>
                {t(String(errors.address.message))}
              </p>
            )}
          </div>

          {/* نقشه (فقط در صورت نمایش) */}
          {showMap && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('form.map_location')} <span className="text-gray-500 dark:text-gray-400 text-sm">
                    ({t('form.optional')})
                  </span>
                </label>
                {watch('latitude') && watch('longitude') && (
                  <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 px-3 py-1.5 rounded-full">
                    ✓ {t('form.location_selected')}
                  </span>
                )}
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-4">
                <div
                  ref={mapRef}
                  className="w-full h-72 rounded-xl overflow-hidden shadow-inner"
                  style={{ minHeight: '288px' }}
                />

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>{t('form.click_to_set_location')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>{t('form.drag_to_move')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // رندر مرحله 2: زبان‌ها
  const renderStep2 = () => {
    const selectedLanguages = watch('languages') || {};

    return (
      <div className="step-container animate-fadeIn">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
              2
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t('steps.languages.title')}
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-center">
              <span className="text-red-500">*</span> {t('validation.at_least_one_language')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {AVAILABLE_LANGUAGES.map(lang => {
                const isSelected = !!selectedLanguages[lang.code];
                const proficiency = selectedLanguages[lang.code] || 50;

                return (
                  <div
                    key={lang.code}
                    className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer h-[140px] ${isSelected
                      ? 'border-blue-500 dark:border-blue-400 shadow-lg'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    onClick={() => toggleLanguage(lang.code)}
                  >
                    {/* Background div - پرچم */}
                    <div
                      className="absolute inset-0 transition-all duration-500"
                      style={{
                        backgroundImage: `url('https://flagcdn.com/w640/${flagCodes[lang.code] || 'us'}.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}
                    />

                    {/* Overlay gradient برای خوانایی بهتر متن */}
                    <div
                      className={`absolute inset-0 transition-all duration-300 ${isSelected
                        ? 'bg-gradient-to-b from-transparent via-white/20 to-white/40 dark:from-transparent dark:via-gray-900/20 dark:to-gray-900/40'
                        : 'bg-gradient-to-b from-white/70 via-white/80 to-white/90 dark:from-gray-900/70 dark:via-gray-900/80 dark:to-gray-900/90'
                        }`}
                    />

                    {/* محتوای اصلی */}
                    <div className="relative z-10 p-5 flex flex-col items-center text-center h-full justify-center">
                      <div className="text-3xl mb-3">{lang.flag}</div>
                      <div className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">
                        {lang.nativeName}
                      </div>

                      {isSelected && (
                        <div className="w-full mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {t('form.proficiency')}:
                            </span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              {proficiency}%
                            </span>
                          </div>
                          <input
                            type="range"
                            min="10"
                            max="100"
                            step="10"
                            value={proficiency}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateLanguageProficiency(lang.code, parseInt(e.target.value));
                            }}
                            onClick={(e) => e.stopPropagation()}
                            onMouseDown={(e) => e.stopPropagation()}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                          />
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                            <span>{t('form.beginner')}</span>
                            <span>{t('form.native')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.languages && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  {t(String(errors.languages.message))}
                </p>
              </div>
            )}
          </div>

          {/* خلاصه زبان‌های انتخاب شده */}
          {Object.keys(selectedLanguages).length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-4 flex items-center gap-2">
                <span className="text-xl">🌐</span>
                {t('form.selected_languages')} ({Object.keys(selectedLanguages).length})
              </h3>
              <div className="flex flex-wrap gap-3">
                {Object.entries(selectedLanguages).map(([code, proficiency]) => {
                  const lang = AVAILABLE_LANGUAGES.find(l => l.code === code);
                  return lang ? (
                    <div
                      key={code}
                      className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-full shadow-sm border border-blue-100 dark:border-blue-800"
                    >
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {lang.nativeName}
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        ({proficiency}%)
                      </span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // رندر مرحله 3: خدمات و بیوگرافی
  const renderStep3 = () => {
    const selectedServices = watch('services') || [];

    return (
      <div className="step-container animate-fadeIn">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
              3
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t('steps.services.title')}
            </h2>
          </div>

          {/* انتخاب خدمات */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {t('form.select_services')} *
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
                {selectedServices.length} {t('form.selected')}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {AVAILABLE_SERVICES.map(service => {
                const isSelected = selectedServices.includes(service.id);
                return (
                  <div
                    key={service.id}
                    className={`p-5 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${isSelected
                      ? 'border-blue-500 dark:border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                      }`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform ${isSelected ? 'scale-110 bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                        }`}>
                        {service.icon}
                      </div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {t(service.nameKey)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {errors.services && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
                <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                  <span>⚠️</span>
                  {t(String(errors.services.message))}
                </p>
              </div>
            )}
          </div>

          {/* بیوگرافی (ادغام شده و اختیاری) */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t('form.bio_and_experience')} <span className="text-gray-500 dark:text-gray-400 text-sm">
                ({t('form.optional')})
              </span>
            </label>
            <Controller
              name="bio"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={6}
                  className="w-full p-4 border border-gray-300 dark:border-gray-600 rounded-2xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200 resize-none"
                  placeholder={t('form.bio_placeholder_combined')}
                />
              )}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {watch('bio')?.length || 0} {t('form.characters')}
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                {t('form.recommended_500_2000')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // رندر مرحله 4: مدارک
  const renderStep4 = () => {
    const videoUrl = watch('videoSelfieUrl');

    return (
      <div className="step-container animate-fadeIn">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
              4
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t('steps.documents.title')}
            </h2>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium mb-3 text-gray-900 dark:text-gray-100">
              {t('form.video_selfie')} <span className="text-gray-500 dark:text-gray-400 text-sm">
                ({t('form.optional')})
              </span>
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t('form.video_selfie_description')}
            </p>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 transition-colors hover:border-blue-300 dark:hover:border-blue-600">
              {videoUrl ? (
                <div className="space-y-4">
                  <div className="relative">
                    <video
                      src={videoUrl}
                      controls
                      className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                    />
                    {/* تیک سبز برای موفقیت‌آمیز بودن آپلود */}
                    {videoUploadSuccess && (
                      <div className="absolute top-2 right-2 w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center animate-bounce">
                        <span className="text-white text-xl">✓</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <button
                      type="button"
                      onClick={() => {
                        setValue('videoSelfieUrl', '');
                        setVideoUploadSuccess(false);
                      }}
                      className="px-5 py-2.5 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 text-red-700 dark:text-red-400 rounded-xl hover:shadow-md transition-all flex items-center gap-2"
                    >
                      <span>🗑️</span>
                      {t('form.delete_video')}
                    </button>
                    <label className="px-5 py-2.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 text-blue-700 dark:text-blue-400 rounded-xl hover:shadow-md transition-all flex items-center gap-2 cursor-pointer relative">
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
          </div>
        </div>
      </div>
    );
  };

  // رندر مرحله 5: توافق‌نامه
  const renderStep5 = () => {
    return (
      <div className="step-container animate-fadeIn">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold">
              5
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              {t('steps.agreement.title')}
            </h2>
          </div>

          <div className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6 max-h-96 overflow-y-auto mb-8 bg-white dark:bg-gray-800 shadow-inner">
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

              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <p className="text-yellow-800 dark:text-yellow-300 text-sm">
                  <strong>⚠️ {t('agreement.important_note')}:</strong> {t('agreement.important_note_description')}
                </p>
              </div>
            </div>
          </div>

          {/* چک‌باکس توافق‌نامه با طراحی بهبود یافته */}
          <div className="flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <div className="flex items-center gap-4">
              <Controller
                name="agreementAccepted"
                control={control}
                render={({ field }) => (
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!field.value}
                      onChange={field.onChange}
                      className="sr-only peer"
                    />
                    <div className={`w-12 h-6 bg-gray-200 dark:bg-gray-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-600 peer-checked:to-indigo-600`}></div>
                  </label>
                )}
              />
              <span className="font-medium text-gray-900 dark:text-gray-100 cursor-pointer select-none">
                {t('form.agreement_acceptance')}
              </span>
            </div>
          </div>

          {errors.agreementAccepted && (
            <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <span>⚠️</span>
                {t(String(errors.agreementAccepted.message))}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // نمایش وضعیت لودینگ
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
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800">
        {/* هدر فرم */}
        <div className="p-6 md:p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/3 translate-y-1/3"></div>
          </div>

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-2xl backdrop-blur-sm">
                    ⭐
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{t('form.registration_title')}</h1>
                    <p className="text-blue-100 dark:text-blue-200 mt-2">
                      {t('form.registration_subtitle')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 dark:bg-black/20 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold">{t('form.step')} {currentStep} {t('form.of')} 5</div>
                  <div className="text-sm text-blue-100 dark:text-blue-200 mt-1">
                    {currentStep === 1 && t('steps.location.subtitle')}
                    {currentStep === 2 && t('steps.languages.subtitle')}
                    {currentStep === 3 && t('steps.services.subtitle')}
                    {currentStep === 4 && t('steps.documents.subtitle')}
                    {currentStep === 5 && t('steps.agreement.subtitle')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* بدنه فرم */}
        <div className="bg-white dark:bg-gray-900 p-6 md:p-8 max-h-[80vh] overflow-y-auto">
          <form
            onSubmit={handleSubmit(
              currentStep === 5 ? onSubmit : (data) => nextStep(data)
            )}
            className="space-y-8"
          >
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
            {currentStep === 5 && renderStep5()}

            {/* دکمه‌های ناوبری */}
            <div className="flex justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div>
                {onCancel && (
                  <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3.5 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 text-red-700 dark:text-red-400 rounded-xl font-medium hover:shadow-md transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                  >
                    <span>←</span>
                    {t('buttons.cancel')}
                  </button>
                )}
              </div>

              <div className="flex gap-4">
                {/* دکمه قبلی */}
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className={`px-6 py-3.5 rounded-xl font-medium transition-all flex items-center gap-2 ${isSubmitting
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 hover:shadow-md hover:scale-105 active:scale-95'
                      }`}
                  >
                    <span>→</span>
                    {t('buttons.previous')}
                  </button>
                )}

                {/* دکمه بعدی/ثبت نهایی */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className={`px-8 py-3.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${isSubmitting || !isValid
                    ? 'bg-gradient-to-r from-blue-400 to-indigo-400 dark:from-blue-600 dark:to-indigo-600 text-white opacity-70 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white hover:shadow-lg hover:scale-105 active:scale-95'
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