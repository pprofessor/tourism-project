import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import { ambassadorService } from "../../services/ambassadorService";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe,
  Briefcase,
  DollarSign,
  FileText,
  User,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Star,
} from "lucide-react";

interface FormData {
  city: string;
  country: string;
  languages: Array<{
    language: string;
    proficiency: number;
  }>;
  services: string[];
  pricing: {
    hourlyRate: number;
    commissionRates: Record<string, number>;
  };
  documents: {
    nationalCard?: File;
    passport?: File;
  };
  bio: string;
  experience: string;
  specialties: string[];
}

const BecomeAmbassadorForm: React.FC<{
  onSuccess?: () => void;
  onCancel?: () => void;
}> = ({ onSuccess, onCancel }) => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    city: "",
    country: "ایران",
    languages: [{ language: i18n.language, proficiency: 100 }],
    services: [],
    pricing: {
      hourlyRate: 50000,
      commissionRates: {},
    },
    documents: {},
    bio: "",
    experience: "",
    specialties: [],
  });

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const isRTL = i18n.dir() === "rtl";

  const availableLanguages = [
    { code: "fa", name: "فارسی", flag: "🇮🇷" },
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربیة", flag: "🇸🇦" },
    { code: "tr", name: "Türkçe", flag: "🇹🇷" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "ru", name: "Русский", flag: "🇷🇺" },
    { code: "zh", name: "中文", flag: "🇨🇳" },
  ];
  const availableServices = [
    {
      id: "currency-exchange",
      name: t("ambassador.services.currencyExchange"),
      pricingType: "commission",
      icon: "💱",
    },
    {
      id: "consular-services",
      name: "خدمات اداری و کنسولی",
      pricingType: "fixed",
      icon: "🏛️",
    },
    {
      id: "tour-guide",
      name: t("ambassador.services.tourGuide"),
      pricingType: "hourly",
      icon: "🗺️",
    },
    {
      id: "hotel-booking",
      name: t("ambassador.services.hotelBooking"),
      pricingType: "fixed",
      icon: "🏨",
    },
    {
      id: "banking",
      name: t("ambassador.services.banking"),
      pricingType: "fixed",
      icon: "🏦",
    },
    {
      id: "translation",
      name: "مترجمی",
      pricingType: "hourly",
      icon: "🔤",
    },
    {
      id: "transport",
      name: t("ambassador.services.transport"),
      pricingType: "fixed",
      icon: "🚗",
    },
    {
      id: "restaurant-reservation",
      name: t("ambassador.services.restaurantReservation"),
      pricingType: "commission",
      icon: "🍽️",
    },
    {
      id: "shopping-assistant",
      name: t("ambassador.services.shoppingAssistant"),
      pricingType: "fixed",
      icon: "🛍️",
    },
    {
      id: "event-tickets",
      name: t("ambassador.services.eventTickets"),
      pricingType: "fixed",
      icon: "🎭",
    },
  ];

  const suggestedCities = [
    "تهران",
    "مشهد",
    "اصفهان",
    "شیراز",
    "تبریز",
    "کیش",
    "قشم",
    "استانبول",
    "آنتالیا",
    "دبی",
    "ابوظبی",
    "بانکوک",
    "پاریس",
    "لندن",
    "نیویورک",
    "توکیو",
    "سئول",
    "شانگهای",
  ];

  const stepTitles = [
    { title: t("ambassador.registration.step1.short"), icon: "🌐" },
    { title: t("ambassador.registration.step2.short"), icon: "💼" },
    { title: "تکمیلی", icon: "👤" },
    { title: t("ambassador.registration.step4.short"), icon: "📄" },
    { title: t("ambassador.registration.step5.short"), icon: "📋" },
    { title: t("ambassador.registration.step6.short"), icon: "✅" },
  ];
  // ============ HANDLERS ============

  const handleLanguageChange = (langCode: string, proficiency: number) => {
    const existingIndex = formData.languages.findIndex(
      (l) => l.language === langCode
    );

    if (existingIndex >= 0) {
      const newLanguages = [...formData.languages];
      newLanguages[existingIndex] = { language: langCode, proficiency };
      setFormData({ ...formData, languages: newLanguages });
    } else {
      setFormData({
        ...formData,
        languages: [...formData.languages, { language: langCode, proficiency }],
      });
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    const isSelected = formData.services.includes(serviceId);
    const newServices = isSelected
      ? formData.services.filter((id) => id !== serviceId)
      : [...formData.services, serviceId];

    const service = availableServices.find((s) => s.id === serviceId);
    const newCommissionRates = { ...formData.pricing.commissionRates };

    if (service?.pricingType === "commission" && !isSelected) {
      newCommissionRates[serviceId] = 5;
    } else if (isSelected) {
      delete newCommissionRates[serviceId];
    }

    setFormData({
      ...formData,
      services: newServices,
      pricing: {
        ...formData.pricing,
        commissionRates: newCommissionRates,
      },
    });
  };

  const handleCommissionChange = (serviceId: string, percentage: number) => {
    setFormData({
      ...formData,
      pricing: {
        ...formData.pricing,
        commissionRates: {
          ...formData.pricing.commissionRates,
          [serviceId]: percentage,
        },
      },
    });
  };

  const handleFileUpload = (type: "nationalCard" | "passport", file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setError(t("ambassador.errors.fileTooLarge"));
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (!validTypes.includes(file.type)) {
      setError(t("ambassador.errors.invalidFileType"));
      return;
    }

    setFormData({
      ...formData,
      documents: {
        ...formData.documents,
        [type]: file,
      },
    });
    setError(null);
  };

  const handleVideoUpload = (file: File) => {
    if (file.size > 100 * 1024 * 1024) {
      setError("حجم ویدئو نباید بیشتر از ۱۰۰ مگابایت باشد");
      return;
    }

    const validTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
    if (!validTypes.includes(file.type)) {
      setError("فرمت ویدئو باید MP4, MOV یا AVI باشد");
      return;
    }

    setVideoFile(file);
    const videoUrl = URL.createObjectURL(file);
    setVideoPreview(videoUrl);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!acceptedTerms) {
      setError(t("ambassador.errors.acceptTerms"));
      return;
    }

    try {
      setUploading(true);
      setError(null);

      // دریافت user ID از localStorage
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      const userId = userData.id;

      if (!userId) {
        setError("لطفاً ابتدا وارد حساب کاربری خود شوید");
        setUploading(false);
        return;
      }

      const ambassadorData = {
        city: formData.city,
        country: formData.country,
        languages: formData.languages.map((lang) => lang.language),
        services: formData.services,
        hourlyRate: formData.pricing.hourlyRate,
        commissionRates: formData.pricing.commissionRates,
        bio: formData.bio,
        experience: formData.experience,
        specialties: formData.specialties,
        isAvailable: true,
        isVerified: false,
        responseTime: 30,
        certificates: [],
        profileImage: null,
        whatsappNumber: null,
        telegramUsername: null,
        rating: 0,
        completedTasks: 0,
        userId: userId,
      } as any;

      if (formData.specialties.length > 0) {
        ambassadorData.bio += `\n\nتخصص‌ها:\n${formData.specialties.join(
          ", "
        )}`;
      }

      await ambassadorService.registerAsAmbassador(ambassadorData);
      onSuccess?.();
    } catch (err: any) {
      setError(
        err.message || t("ambassador.registration.error") || "خطا در ثبت‌نام"
      );
    } finally {
      setUploading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.city.trim() !== "" && formData.languages.length > 0;
      case 2:
        return formData.services.length > 0;
      case 3:
        return true;
      case 4:
        return (
          !!formData.documents.nationalCard || !!formData.documents.passport
        );
      case 5:
        return true;
      case 6:
        return acceptedTerms;
      default:
        return false;
    }
  };
  // ============ STEP RENDERS ============

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div
          className={`p-3 rounded-full ${
            isDark ? "bg-blue-900/30" : "bg-blue-100"
          }`}
        >
          <Globe className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("ambassador.registration.step1.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium">
            {t("ambassador.registration.city")} *
          </label>
          <div className="relative">
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className={`w-full p-3 rounded-xl border ${
                isDark
                  ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  : "bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              } transition-all duration-200`}
              placeholder={t("ambassador.registration.cityPlaceholder")}
              list="cities"
            />
            <datalist
              id="cities"
              className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg mt-1 shadow-lg"
            >
              {suggestedCities.map((city) => (
                <option
                  key={city}
                  value={city}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {city}
                </option>
              ))}
            </datalist>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t("ambassador.registration.cityHelp")}
          </p>
        </div>

        <div>
          <label className="block mb-2 font-medium">
            {t("ambassador.registration.country")} *
          </label>
          <select
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className={`w-full p-3 rounded-xl border ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                : "bg-white border-gray-300 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            } transition-all duration-200`}
          >
            <option value="ایران">🇮🇷 ایران</option>
            <option value="ترکیه">🇹🇷 ترکیه</option>
            <option value="امارات">🇦🇪 امارات</option>
            <option value="تایلند">🇹🇭 تایلند</option>
            <option value="فرانسه">🇫🇷 فرانسه</option>
            <option value="انگلستان">🇬🇧 انگلستان</option>
            <option value="آمریکا">🇺🇸 آمریکا</option>
            <option value="ژاپن">🇯🇵 ژاپن</option>
            <option value="کره جنوبی">🇰🇷 کره جنوبی</option>
            <option value="چین">🇨🇳 چین</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-3 font-medium">
          {t("ambassador.registration.languages")} *
          <span className="text-gray-500 dark:text-gray-400 text-sm font-normal ml-2">
            {t("ambassador.registration.languagesHelp")}
          </span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {availableLanguages.map((lang) => {
            const currentLang = formData.languages.find(
              (l) => l.language === lang.code
            );
            const proficiency = currentLang?.proficiency || 0;

            return (
              <div
                key={lang.code}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                  proficiency > 0
                    ? isDark
                      ? "border-blue-500 bg-blue-900/20"
                      : "border-blue-500 bg-blue-50"
                    : isDark
                    ? "border-gray-700 bg-gray-800 hover:bg-gray-700"
                    : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={(e) => {
                  if (
                    !(e.target as HTMLElement).closest('input[type="range"]')
                  ) {
                    handleLanguageChange(lang.code, proficiency > 0 ? 0 : 100);
                  }
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{lang.flag}</span>
                    <span className="font-medium">{lang.name}</span>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                      proficiency > 0
                        ? "bg-blue-500 border-blue-500"
                        : isDark
                        ? "border-gray-600"
                        : "border-gray-300"
                    }`}
                  >
                    {proficiency > 0 && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {proficiency > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{t("ambassador.registration.proficiency")}</span>
                      <span className="font-bold">{proficiency}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      step="10"
                      value={proficiency}
                      onChange={(e) =>
                        handleLanguageChange(
                          lang.code,
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>مبتدی</span>
                      <span>حرفه‌ای</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div
          className={`p-3 rounded-full ${
            isDark ? "bg-purple-900/30" : "bg-purple-100"
          }`}
        >
          <Briefcase className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("ambassador.registration.step2.subtitle")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableServices.map((service) => {
          const isSelected = formData.services.includes(service.id);

          return (
            <div
              key={service.id}
              className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                isSelected
                  ? isDark
                    ? "border-blue-500 bg-blue-900/20"
                    : "border-blue-500 bg-blue-50"
                  : isDark
                  ? "border-gray-700 bg-gray-800 hover:border-gray-600"
                  : "border-gray-300 bg-gray-50 hover:border-gray-400"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{service.icon}</span>
                  <span className="font-medium">{service.name}</span>
                </div>
                <div
                  className={`relative w-6 h-6 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-500 border-blue-500"
                      : isDark
                      ? "border-gray-600 bg-gray-700"
                      : "border-gray-300 bg-gray-200"
                  }`}
                  onClick={() => handleServiceToggle(service.id)}
                >
                  {isSelected && (
                    <CheckCircle className="w-4 h-4 text-white absolute" />
                  )}
                </div>
              </div>

              {isSelected && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                  {service.pricingType === "hourly" && (
                    <div>
                      <label className="block text-sm mb-2">
                        نرخ ساعتی (تومان)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={formData.pricing.hourlyRate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            pricing: {
                              ...formData.pricing,
                              hourlyRate: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                        className={`w-full p-2 rounded-lg border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-800"
                        }`}
                      />
                    </div>
                  )}

                  {service.pricingType === "commission" && (
                    <div>
                      <label className="block text-sm mb-2">درصد کمیسیون</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="range"
                          min="1"
                          max="20"
                          step="1"
                          value={
                            formData.pricing.commissionRates[service.id] || 5
                          }
                          onChange={(e) =>
                            handleCommissionChange(
                              service.id,
                              parseFloat(e.target.value)
                            )
                          }
                          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                        />
                        <span className="w-12 text-right font-bold text-blue-500">
                          {formData.pricing.commissionRates[service.id] || 5}%
                        </span>
                      </div>
                    </div>
                  )}

                  {service.pricingType === "fixed" && (
                    <div>
                      <label className="block text-sm mb-2">
                        قیمت ثابت (تومان)
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="مثلاً ۵۰۰۰۰"
                        className={`w-full p-2 rounded-lg border ${
                          isDark
                            ? "bg-gray-700 border-gray-600 text-white"
                            : "bg-white border-gray-300 text-gray-800"
                        }`}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div
          className={`p-3 rounded-full ${
            isDark ? "bg-pink-900/30" : "bg-pink-100"
          }`}
        >
          <User className="w-6 h-6 text-pink-500" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            اطلاعات تکمیلی و تخصص‌ها
          </p>
        </div>
      </div>

      <div>
        <label className="block mb-3 font-medium">
          تخصص‌های شما
          <span className="text-gray-500 dark:text-gray-400 text-sm font-normal ml-2">
            (انتخاب چند مورد)
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {[
            "راهنمای تور تاریخی",
            "راهنمای طبیعت‌گردی",
            "راهنمای ماجراجویی",
            "کارشناس غذاهای محلی",
            "متخصص خرید",
            "کارشناس فرهنگی",
            "تورلیدر خانوادگی",
            "تورلیدر تجاری",
            "تورلیدر لوکس",
            "اکوتوریسم",
            "توریسم سلامت",
            "توریسم ورزشی",
            "متصدی صرافی",
            "راهنمای شهری",
            "مترجم رسمی",
            "رزرواسیون هتل",
            "رزرواسیون رستوران",
            "تهیه بلیط",
            "خدمات بانکی",
            "خدمات کنسولی",
            "حمل و نقل",
          ].map((specialty) => {
            const isSelected = formData.specialties.includes(specialty);

            return (
              <button
                key={specialty}
                type="button"
                onClick={() => {
                  const newSpecialties = isSelected
                    ? formData.specialties.filter((s) => s !== specialty)
                    : [...formData.specialties, specialty];
                  setFormData({ ...formData, specialties: newSpecialties });
                }}
                className={`p-2 rounded-xl text-sm text-center transition-all duration-200 ${
                  isSelected
                    ? isDark
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : isDark
                    ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {specialty}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-2">
            بیوگرافی
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              (اختیاری - درباره خود و خدماتتان بنویسید)
            </span>
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={3}
            className={`w-full p-3 rounded-xl border ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
            } transition-all duration-200`}
            placeholder="اختیاری..."
          />
        </div>

        <div>
          <label className="block mb-2">
            سابقه کاری
            <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
              (اختیاری - تجربیات مرتبط خود را شرح دهید)
            </span>
          </label>
          <textarea
            value={formData.experience}
            onChange={(e) =>
              setFormData({ ...formData, experience: e.target.value })
            }
            rows={3}
            className={`w-full p-3 rounded-xl border ${
              isDark
                ? "bg-gray-800 border-gray-700 text-white focus:border-blue-500"
                : "bg-white border-gray-300 text-gray-800 focus:border-blue-500"
            } transition-all duration-200`}
            placeholder="اختیاری..."
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep4 = () => {
    const startRecording = async () => {
      try {
        // بررسی دسترسی
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setError("دوربین در این دستگاه پشتیبانی نمی‌شود");
          return;
        }

        // درخواست دسترسی به دوربین و میکروفون
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: true,
        });

        setIsRecording(true);

        // ایجاد MediaRecorder
        const mediaRecorder = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        // ذخیره chunks
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            chunks.push(event.data);
          }
        };

        // وقتی ضبط تمام شد
        mediaRecorder.onstop = () => {
          const videoBlob = new Blob(chunks, { type: "video/webm" });

          // ایجاد File object
          const videoFile = new File([videoBlob], `سلفی_${Date.now()}.webm`, {
            type: "video/webm",
          });

          // ذخیره ویدئو
          handleVideoUpload(videoFile);

          // توقف stream
          stream.getTracks().forEach((track) => track.stop());
          setIsRecording(false);
        };

        // شروع ضبط
        mediaRecorder.start();

        // توقف خودکار بعد از ۱ دقیقه
        setTimeout(() => {
          if (mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            setIsRecording(false);
          }
        }, 60000); // ۱ دقیقه

        // ذخیره recorder برای توقف دستی
        (window as any).currentRecorder = mediaRecorder;
      } catch (error: any) {
        console.error("خطا در دسترسی به دوربین:", error);
        setIsRecording(false);

        if (
          error.name === "NotFoundError" ||
          error.name === "DevicesNotFoundError"
        ) {
          setError("دوربین یافت نشد. لطفاً از آپلود فایل استفاده کنید.");
        } else if (
          error.name === "NotAllowedError" ||
          error.name === "PermissionDeniedError"
        ) {
          setError(
            "دسترسی به دوربین مجاز نیست. لطفاً تنظیمات مرورگر را بررسی کنید."
          );
        } else {
          setError("خطا در اتصال به دوربین: " + error.message);
        }
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
        className="space-y-6"
      >
        <div className="flex items-center space-x-3 mb-6">
          <div
            className={`p-3 rounded-full ${
              isDark ? "bg-yellow-900/30" : "bg-yellow-100"
            }`}
          >
            <FileText className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              بارگذاری مدارک شناسایی
            </p>
          </div>
        </div>

        <div
          className={`p-4 rounded-xl border ${
            isDark
              ? "border-blue-800 bg-blue-900/10"
              : "border-blue-200 bg-blue-50"
          }`}
        >
          <div className="flex items-start space-x-3">
            <div className="text-lg">ℹ️</div>
            <div>
              <p className="text-sm">
                مدارک شما تنها برای احراز هویت استفاده شده و در امنیت کامل
                نگهداری می‌شوند.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <DocumentUploadCard
            title="کارت ملی"
            description="تصویر واضح از کارت ملی (هر دو طرف)"
            required={true}
            file={formData.documents.nationalCard}
            onFileSelect={(file) => handleFileUpload("nationalCard", file)}
            onRemove={() =>
              setFormData({
                ...formData,
                documents: { ...formData.documents, nationalCard: undefined },
              })
            }
          />

          <DocumentUploadCard
            title="گذرنامه"
            description="صفحه اصلی گذرنامه"
            required={false}
            file={formData.documents.passport}
            onFileSelect={(file) => handleFileUpload("passport", file)}
            onRemove={() =>
              setFormData({
                ...formData,
                documents: { ...formData.documents, passport: undefined },
              })
            }
          />
        </div>

        <div
          className={`p-6 rounded-xl border-2 ${
            isDark
              ? "border-purple-700 bg-purple-900/10"
              : "border-purple-300 bg-purple-50"
          }`}
        >
          <h4 className="font-semibold mb-2 flex items-center">
            <span className="ml-2">🎥</span>
            <span>ویدئوی سلفی (حداکثر ۱ دقیقه)</span>
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            یک ویدئوی کوتاه از خودتان ضبط کنید یا از گالری آپلود کنید
          </p>

          {videoPreview ? (
            <div className="space-y-4">
              <video
                src={videoPreview}
                controls
                className="w-full rounded-lg"
              />
              <button
                onClick={() => {
                  setVideoPreview(null);
                  setVideoFile(null);
                }}
                className="text-red-500 hover:text-red-600 text-sm font-medium"
              >
                حذف ویدئو
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={startRecording}
                disabled={isRecording}
                className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center space-y-2 transition-all ${
                  isDark
                    ? "border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700"
                    : "border-gray-300 bg-gray-100 hover:border-gray-400 hover:bg-gray-200"
                }`}
              >
                <span className="text-3xl">🎬</span>
                <span className="font-medium">ضبط ویدئو</span>
                <span className="text-xs text-gray-500">با دوربین گوشی</span>
              </button>

              <label
                className={`p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center space-y-2 cursor-pointer transition-all ${
                  isDark
                    ? "border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-700"
                    : "border-gray-300 bg-gray-100 hover:border-gray-400 hover:bg-gray-200"
                }`}
              >
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleVideoUpload(file);
                    }
                  }}
                  className="hidden"
                />
                <span className="text-3xl">📁</span>
                <span className="font-medium">آپلود از گالری</span>
                <span className="text-xs text-gray-500">MP4, MOV, AVI</span>
              </label>
            </div>
          )}
        </div>
      </motion.div>
    );
  };
  const renderStep5 = () => (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div
          className={`p-3 rounded-full ${
            isDark ? "bg-indigo-900/30" : "bg-indigo-100"
          }`}
        >
          <CheckCircle className="w-6 h-6 text-indigo-500" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("ambassador.registration.step5.subtitle")}
          </p>
        </div>
      </div>

      <div
        className={`p-6 rounded-xl border ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"
        }`}
      >
        <h4 className="font-semibold mb-4 text-lg flex items-center">
          <span className="ml-2">📋</span>
          <span>{t("ambassador.registration.summary")}</span>
        </h4>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <SummaryItem
              label={t("ambassador.registration.city")}
              value={formData.city}
              icon="📍"
            />
            <SummaryItem
              label={t("ambassador.registration.country")}
              value={formData.country}
              icon="🌍"
            />
          </div>

          <SummaryItem
            label={t("ambassador.registration.languages")}
            value={
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.languages.map((lang) => {
                  const langInfo = availableLanguages.find(
                    (l) => l.code === lang.language
                  );
                  return (
                    <span
                      key={lang.language}
                      className={`px-3 py-1 rounded-full text-sm flex items-center space-x-1 ${
                        isDark
                          ? "bg-purple-900 text-purple-300"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      <span>{langInfo?.flag}</span>
                      <span>{langInfo?.name}</span>
                      <span className="text-xs">({lang.proficiency}%)</span>
                    </span>
                  );
                })}
              </div>
            }
            icon="🗣️"
          />

          <SummaryItem
            label={t("ambassador.registration.services")}
            value={
              <div className="flex flex-wrap gap-2 mt-1">
                {formData.services.map((serviceId) => {
                  const service = availableServices.find(
                    (s) => s.id === serviceId
                  );
                  return (
                    <span
                      key={serviceId}
                      className={`px-3 py-1 rounded-full text-sm flex items-center space-x-2 ${
                        isDark
                          ? "bg-blue-900 text-blue-300"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      <span>{service?.icon}</span>
                      <span>{service?.name}</span>
                      <span className="text-xs">
                        {service?.pricingType === "hourly"
                          ? ` - ${formData.pricing.hourlyRate.toLocaleString()} ${t(
                              "common.currency"
                            )}/h`
                          : service?.pricingType === "commission"
                          ? ` - ${
                              formData.pricing.commissionRates[serviceId] || 5
                            }%`
                          : " - قیمت ثابت"}
                      </span>
                    </span>
                  );
                })}
              </div>
            }
            icon="🛠️"
          />

          <SummaryItem
            label={t("ambassador.registration.documents")}
            value={
              <div className="flex flex-wrap gap-4 mt-1">
                {formData.documents.nationalCard && (
                  <span className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("ambassador.registration.nationalCard")}</span>
                  </span>
                )}
                {formData.documents.passport && (
                  <span className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>{t("ambassador.registration.passport")}</span>
                  </span>
                )}
                {videoFile && (
                  <span className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>ویدئوی سلفی</span>
                  </span>
                )}
              </div>
            }
            icon="📄"
          />

          <SummaryItem
            label={t("ambassador.registration.specialties")}
            value={
              formData.specialties.length > 0 ? (
                <div className="flex flex-wrap gap-2 mt-1">
                  {formData.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className={`px-3 py-1 rounded-full text-sm ${
                        isDark
                          ? "bg-pink-900 text-pink-300"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">
                  {t("ambassador.registration.noSpecialties")}
                </span>
              )
            }
            icon="⭐"
          />
        </div>
      </div>

      <div
        className={`p-4 rounded-xl border ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-300 bg-gray-50"
        }`}
      >
        <div className="flex items-start space-x-3">
          <div
            className={`mt-1 w-5 h-5 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
              acceptedTerms
                ? "bg-blue-500 border-blue-500"
                : isDark
                ? "border-gray-600 bg-gray-700"
                : "border-gray-400 bg-gray-300"
            }`}
            onClick={() => setAcceptedTerms(!acceptedTerms)}
          >
            {acceptedTerms && <CheckCircle className="w-3 h-3 text-white" />}
          </div>
          <div className="flex-1">
            <label
              className="text-sm cursor-pointer"
              onClick={() => setAcceptedTerms(!acceptedTerms)}
            >
              <span className="font-medium">
                {t("ambassador.registration.terms1")}{" "}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTermsModal(true);
                }}
                className="text-blue-500 hover:underline font-medium"
              >
                {t("ambassador.registration.termsLink")}
              </button>
              <span> {t("ambassador.registration.terms2")}</span>
            </label>
          </div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-center space-x-3 ${
            isDark
              ? "bg-red-900/30 border-red-700 text-red-200"
              : "bg-red-100 border-red-200 text-red-800"
          } border`}
        >
          <span className="text-xl">⚠️</span>
          <span>{error}</span>
        </motion.div>
      )}
    </motion.div>
  );

  const renderStep6 = () => (
    <motion.div
      initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: isRTL ? -50 : 50 }}
      className="space-y-6"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div
          className={`p-3 rounded-full ${
            isDark ? "bg-green-900/30" : "bg-green-100"
          }`}
        >
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t("ambassador.registration.step6.subtitle")}
          </p>
        </div>
      </div>

      <div
        className={`p-8 rounded-xl border text-center ${
          isDark
            ? "border-green-700 bg-green-900/20"
            : "border-green-300 bg-green-50"
        }`}
      >
        <div className="text-6xl mb-4">🎉</div>
        <h3 className="text-2xl font-bold mb-2">آماده ارسال!</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          اطلاعات شما کامل شد. برای تکمیل ثبت‌نام، دکمه زیر را بزنید.
        </p>
        <button
          onClick={handleSubmit}
          disabled={!acceptedTerms || uploading}
          className={`px-8 py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 mx-auto ${
            !acceptedTerms || uploading
              ? isDark
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-300 text-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/30"
          }`}
        >
          {uploading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t("common.submitting")}</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>{t("ambassador.registration.submit")}</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      case 6:
        return renderStep6();
      default:
        return null;
    }
  };
  // ============ HELPER COMPONENTS ============

  interface DocumentUploadCardProps {
    title: string;
    description: string;
    required: boolean;
    file?: File;
    onFileSelect: (file: File) => void;
    onRemove: () => void;
  }

  const DocumentUploadCard: React.FC<DocumentUploadCardProps> = ({
    title,
    description,
    required,
    file,
    onFileSelect,
    onRemove,
  }) => {
    const { t } = useTranslation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        onFileSelect(selectedFile);
      }
    };

    return (
      <div
        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
          file
            ? isDark
              ? "border-green-500 bg-green-900/10"
              : "border-green-500 bg-green-50"
            : isDark
            ? "border-gray-700 bg-gray-800 hover:border-gray-600"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        <div className="text-center mb-4">
          <div
            className={`text-3xl mb-2 ${
              file ? "text-green-500" : "text-gray-500"
            }`}
          >
            {file ? "✅" : "📄"}
          </div>
          <div className="flex items-center justify-center space-x-2">
            <h4 className="font-semibold">{title}</h4>
            {required && <span className="text-red-500 text-sm">*</span>}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {description}
          </p>
        </div>

        <input
          type="file"
          id={`file-${title}`}
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="text-center space-y-3">
            <div className="p-3 rounded-lg bg-white dark:bg-gray-900">
              <div className="flex items-center justify-center space-x-3">
                <span className="text-2xl">📄</span>
                <div className="text-left">
                  <p className="font-medium text-green-600 dark:text-green-400 truncate max-w-[180px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>

            {file.type.startsWith("image/") && (
              <div className="mt-3">
                <p className="text-sm mb-2">پیش‌نمایش:</p>
                <img
                  src={URL.createObjectURL(file)}
                  alt="پیش‌نمایش"
                  className="w-32 h-32 object-cover rounded-lg mx-auto border border-gray-300 dark:border-gray-700"
                />
              </div>
            )}

            <button
              type="button"
              onClick={onRemove}
              className="text-red-500 hover:text-red-600 text-sm font-medium"
            >
              {t("common.remove")}
            </button>
          </div>
        ) : (
          <label
            htmlFor={`file-${title}`}
            className={`block text-center py-4 rounded-lg cursor-pointer transition-all duration-200 ${
              isDark
                ? "bg-gray-700 hover:bg-gray-600 border-2 border-dashed border-gray-600 hover:border-gray-500"
                : "bg-gray-100 hover:bg-gray-200 border-2 border-dashed border-gray-300 hover:border-gray-400"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-2xl">📤</span>
              <div>
                <p className="font-medium">{t("common.upload")}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  JPG, PNG یا PDF (حداکثر ۵MB)
                </p>
              </div>
            </div>
          </label>
        )}
      </div>
    );
  };

  interface SummaryItemProps {
    label: string;
    value: React.ReactNode;
    icon: string;
  }

  const SummaryItem: React.FC<SummaryItemProps> = ({ label, value, icon }) => {
    return (
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <span className="text-lg">{icon}</span>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
          </span>
        </div>
        <div className={`pr-7 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
          {value}
        </div>
      </div>
    );
  };

  // ============ MAIN RETURN ============

  return (
    <div
      className={`rounded-2xl w-full mx-2 sm:mx-4 md:mx-auto md:max-w-5xl shadow-2xl overflow-hidden ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      {/* Header */}
      <div
        className={`p-4 md:p-6 border-b ${
          isDark
            ? "border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800"
            : "border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-2xl md:text-3xl font-bold flex items-center space-x-3">
              <div
                className={`p-2 rounded-xl ${
                  isDark ? "bg-blue-600" : "bg-blue-500"
                }`}
              >
                <Star className="w-6 h-6 text-white" />
              </div>
              <span>{t("ambassador.registration.title")}</span>
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
              {t("ambassador.registration.subtitle")}
            </p>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                isDark
                  ? "bg-gray-800 hover:bg-gray-700 border border-gray-700"
                  : "bg-gray-100 hover:bg-gray-200 border border-gray-200"
              }`}
            >
              <X className="w-4 h-4" />
              <span>{t("common.cancel")}</span>
            </button>
          )}
        </div>

        {/* Progress Steps */}
        <div className="mt-6 md:mt-8 px-2">
          <div className="flex justify-between relative">
            {/* Progress Line */}
            <div
              className={`absolute top-4 ${
                isRTL ? "right-2 left-2" : "left-2 right-2"
              } h-1 z-0 ${isDark ? "bg-gray-800" : "bg-gray-300"}`}
            ></div>
            <div
              className={`absolute top-4 h-1 z-10 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out ${
                isRTL ? "right-2" : "left-2"
              }`}
              style={{
                width: `calc(${((currentStep - 1) / 5) * 100}% - 1rem)`,
              }}
            ></div>

            {/* Step Circles */}
            {stepTitles.map((step, index) => {
              const stepNumber = index + 1;
              const isActive = stepNumber === currentStep;
              const isCompleted = stepNumber < currentStep;

              return (
                <div
                  key={stepNumber}
                  className="relative z-20 flex flex-col items-center"
                >
                  <button
                    onClick={() => setCurrentStep(stepNumber)}
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
                        : isCompleted
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                        : isDark
                        ? "bg-gray-800 text-gray-400 border border-gray-700"
                        : "bg-gray-100 text-gray-600 border border-gray-300"
                    }`}
                  >
                    {isCompleted ? (
                      <span className="text-sm md:text-base">✓</span>
                    ) : (
                      <span className="text-sm md:text-base">{step.icon}</span>
                    )}
                  </button>
                  <div className="absolute top-11 md:top-14 mt-2 text-center">
                    <div className="text-[10px] md:text-xs font-medium whitespace-nowrap">
                      {step.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 lg:p-8 max-h-[60vh] md:max-h-[70vh] overflow-y-auto">
        <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
      </div>

      {/* Footer - Navigation */}
      <div
        className={`p-4 md:p-6 border-t ${
          isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-3 sm:gap-4">
          <button
            onClick={() => setCurrentStep((prev) => prev - 1)}
            disabled={currentStep === 1 || uploading}
            className={`w-full sm:w-auto px-4 py-3 md:px-6 md:py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
              currentStep === 1 || uploading
                ? isDark
                  ? "bg-gray-800 text-gray-600 cursor-not-allowed"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isDark
                ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white border border-gray-700"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 border border-gray-300"
            }`}
          >
            {isRTL ? <span>→</span> : <span>←</span>}
            <span>{t("common.previous")}</span>
          </button>

          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              disabled={!isStepValid() || uploading}
              className={`w-full sm:w-auto px-4 py-3 md:px-6 md:py-3 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 ${
                !isStepValid() || uploading
                  ? isDark
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-gray-300 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/30"
              }`}
            >
              <span>{t("common.next")}</span>
              {isRTL ? <span>←</span> : <span>→</span>}
            </button>
          ) : null}
        </div>
      </div>

      {/* مودال نمایش قوانین */}
      {showTermsModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowTermsModal(false)}
        >
          <div
            className={`w-full max-w-2xl rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden ${
              isDark ? "bg-gray-900" : "bg-white"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`p-4 border-b flex items-center justify-between ${
                isDark ? "border-gray-800" : "border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold flex items-center">
                <span className="ml-2">📜</span>
                <span>قوانین و شرایط همکاری</span>
              </h3>
              <button
                onClick={() => setShowTermsModal(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">۱. تعهدات سفیر</h4>
                  <ul className="list-disc pr-4 space-y-1">
                    <li>ارائه اطلاعات صحیح و به‌روز در پروفایل</li>
                    <li>رعایت اصول اخلاقی و فرهنگی در تعامل با مسافران</li>
                    <li>پاسخگویی به موقع به درخواست‌های خدمات</li>
                    <li>رعایت قوانین و مقررات محلی و بین‌المللی</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">۲. حقوق سفیر</h4>
                  <ul className="list-disc pr-4 space-y-1">
                    <li>دریافت ۷۰٪ از مبلغ خدمات ارائه شده</li>
                    <li>پشتیبانی فنی و حقوقی از تیم تورینو</li>
                    <li>دسترسی به ابزارهای مدیریت و ارتباط با مسافران</li>
                    <li>بیمه مسئولیت مدنی در طول ارائه خدمات</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">۳. پرداخت‌ها</h4>
                  <p>
                    پرداخت‌ها به صورت هفتگی و از طریق درگاه‌های امن انجام
                    می‌شود.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">۴. حریم خصوصی</h4>
                  <p>
                    اطلاعات شخصی شما مطابق با قوانین حفاظت از داده‌ها محافظت
                    می‌شود.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setShowTermsModal(false)}
                  className={`w-full py-3 rounded-xl font-semibold ${
                    isDark
                      ? "bg-blue-700 hover:bg-blue-600 text-white"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  فهمیدم و موافقم
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BecomeAmbassadorForm;
