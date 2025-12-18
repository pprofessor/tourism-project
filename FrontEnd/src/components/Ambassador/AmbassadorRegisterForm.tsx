import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ambassadorService } from "../../services/ambassadorService";
import "./AmbassadorRegisterForm.css";

// ============ PROPS INTERFACE ============
export interface AmbassadorRegisterFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
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

// Available languages with flags
const AVAILABLE_LANGUAGES = [
  { code: "fa", name: "فارسی", flag: "🇮🇷" },
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "tr", name: "Türkçe", flag: "🇹🇷" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "es", name: "Español", flag: "🇪🇸" },
];

// Available services
const AVAILABLE_SERVICES = [
  { id: "currency_exchange", name: "صرافی و تبدیل ارز", icon: "💰" },
  { id: "administrative", name: "خدمات اداری و کنسولی", icon: "🏛️" },
  { id: "hotel_booking", name: "رزرو هتل", icon: "🏨" },
  { id: "bank_account", name: "خدمات افتتاح حساب بانکی", icon: "🏦" },
  { id: "translation", name: "مترجمی همراه", icon: "🗣️" },
  { id: "restaurant", name: "رزرو رستوران", icon: "🍽️" },
  { id: "concert", name: "بلیط کنسرت و رویدادها", icon: "🎭" },
  { id: "education", name: "خدمات تحصیلی", icon: "🎓" },
  { id: "medical", name: "خدمات مراکز درمانی", icon: "🏥" },
  { id: "entertainment", name: "بلیط مراکز تفریحی", icon: "🎡" },
  { id: "car_rental", name: "اجاره خودرو", icon: "🚗" },
  { id: "shopping", name: "مشاوره خرید", icon: "🛍️" },
];

// ============ VALIDATION SCHEMA ============
const createValidationSchema = (currentStep: number) => {
  const baseSchema: any = {};

  if (currentStep === 1) {
    baseSchema.country = yup.string().required("کشور را انتخاب کنید");
    baseSchema.city = yup.string().required("شهر را انتخاب کنید");
    baseSchema.address = yup
      .string()
      .required("آدرس را وارد کنید")
      .min(10, "آدرس باید حداقل ۱۰ کاراکتر باشد");
  }

  if (currentStep === 2) {
    baseSchema.languages = yup
      .object()
      .test(
        "at-least-one-language",
        "حداقل یک زبان را انتخاب کنید",
        (value) => value && Object.keys(value).length > 0
      );
  }

  if (currentStep === 3) {
    baseSchema.services = yup.array().min(1, "حداقل یک خدمت را انتخاب کنید");
    baseSchema.workExperience = yup
      .string()
      .required("سوابق کاری را وارد کنید")
      .min(50, "سوابق کاری باید حداقل ۵۰ کاراکتر باشد");
  }

  if (currentStep === 4) {
    baseSchema.videoSelfieUrl = yup
      .string()
      .required("ویدئوی سلفی را آپلود کنید");
  }

  if (currentStep === 5) {
    baseSchema.agreementAccepted = yup
      .boolean()
      .oneOf([true], "باید قوانین را بپذیرید");
  }

  return yup.object().shape(baseSchema);
};

// ============ MAIN COMPONENT ============
const AmbassadorRegisterForm = ({
  onSuccess,
  onCancel,
  className = "",
}: AmbassadorRegisterFormProps = {}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const validationSchema = createValidationSchema(currentStep);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(validationSchema) as any,
    mode: "onChange",
    defaultValues: {
      country: "",
      city: "",
      address: "",
      languages: {},
      services: [],
      bio: "",
      workExperience: "",
      agreementAccepted: false,
    },
  });

  // Load user's existing registration
  useEffect(() => {
    loadUserRegistration();
    loadCountries();
  }, []);

  const loadUserRegistration = async () => {
    try {
      const status = await ambassadorService.getMyRegistration();
      if (status.hasRegistration && status.ambassador) {
        const ambassador = status.ambassador;
        setValue("country", ambassador.country || "");
        setValue("city", ambassador.city || "");
        setValue("address", ambassador.address || "");

        if (ambassador.languages) {
          const langObj: { [key: string]: number } = {};
          ambassador.languages.forEach((lang) => {
            const [code, proficiency] = lang.split(":");
            if (code && proficiency) {
              langObj[code] = parseInt(proficiency);
            }
          });
          setValue("languages", langObj);
        }

        setValue("services", ambassador.services || []);
        setValue("workExperience", ambassador.workExperience || "");
        setValue("agreementAccepted", ambassador.agreementAccepted || false);

        if (status.currentStep) {
          setCurrentStep(status.currentStep);
        }
      }
    } catch (error) {
      console.error("Failed to load registration:", error);
    }
  };

  const loadCountries = async () => {
    try {
      const data = await ambassadorService.getCountries();
      setCountries(data);
    } catch (error) {
      console.error("Failed to load countries:", error);
    }
  };

  const handleCountryChange = async (countryId: number) => {
    setSelectedCountryId(countryId);
    setValue("city", "");

    try {
      const majorCities = await ambassadorService.getMajorCitiesByCountry(
        countryId
      );
      setCities(majorCities);
    } catch (error) {
      console.error("Failed to load cities:", error);
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
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(mapRef.current).setView([35.6892, 51.389], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map);

    let marker: L.Marker | null = null;

    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setValue("latitude", lat);
      setValue("longitude", lng);

      if (marker) {
        map.removeLayer(marker);
      }

      marker = L.marker([lat, lng]).addTo(map);
    });

    mapInstanceRef.current = map;
  };

  // Handle step navigation
  const nextStep = async (data?: Partial<FormData>) => {
    if (currentStep < 5) {
      if (data) {
        await saveDraft(data);
      }
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  // Save draft to backend
  const saveDraft = async (formData: Partial<FormData>) => {
    try {
      setIsSubmitting(true);
      const draftData = {
        country: formData.country || "",
        city: formData.city || "",
        address: formData.address || "",
        languages: formData.languages || {},
        services: formData.services || [],
        bio: formData.bio || "",
        workExperience: formData.workExperience || "",
        videoSelfieUrl: formData.videoSelfieUrl || "",
        agreementAccepted: formData.agreementAccepted || false,
        currentStep,
        registrationStatus: "DRAFT" as const,
        latitude: formData.latitude,
        longitude: formData.longitude,
      };

      const result = await ambassadorService.saveDraft(draftData);
      setSaveMessage(result.message);

      setTimeout(() => setSaveMessage(""), 3000);

      localStorage.setItem(
        "ambassador_draft",
        JSON.stringify({
          step: currentStep,
          data: formData,
          savedAt: new Date().toISOString(),
        })
      );
    } catch (error: any) {
      console.error("Failed to save draft:", error);
      setSaveMessage(`خطا در ذخیره: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit final registration
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);

      const finalData = {
        country: data.country,
        city: data.city,
        address: data.address,
        languages: data.languages,
        services: data.services,
        bio: data.bio,
        workExperience: data.workExperience,
        videoSelfieUrl: data.videoSelfieUrl || "",
        agreementAccepted: data.agreementAccepted,
        currentStep: 5,
        registrationStatus: "PENDING_REVIEW" as const,
        latitude: data.latitude,
        longitude: data.longitude,
      };

      await ambassadorService.submitRegistration(finalData);

      localStorage.removeItem("ambassador_draft");

      // Call onSuccess callback
      if (onSuccess) {
        onSuccess();
      } else {
        alert(
          "ثبت‌نام شما با موفقیت انجام شد! پس از بررسی و تأیید، اعلان دریافت خواهید کرد."
        );
      }

      reset();
      setCurrentStep(1);
    } catch (error: any) {
      console.error("Failed to submit registration:", error);
      alert(`خطا در ثبت‌نام: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle language selection
  const toggleLanguage = (langCode: string) => {
    const currentLanguages = watch("languages") || {};
    const newLanguages = { ...currentLanguages };

    if (newLanguages[langCode]) {
      delete newLanguages[langCode];
    } else {
      newLanguages[langCode] = 50;
    }

    setValue("languages", newLanguages);
  };

  const updateLanguageProficiency = (langCode: string, proficiency: number) => {
    const currentLanguages = watch("languages") || {};
    setValue("languages", {
      ...currentLanguages,
      [langCode]: proficiency,
    });
  };

  // Handle service selection
  const toggleService = (serviceId: string) => {
    const currentServices = watch("services") || [];
    const newServices = currentServices.includes(serviceId)
      ? currentServices.filter((id) => id !== serviceId)
      : [...currentServices, serviceId];

    setValue("services", newServices);
  };

  // Handle video upload
  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      alert("لطفاً یک فایل ویدئویی انتخاب کنید");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("حجم فایل نباید بیشتر از ۵۰ مگابایت باشد");
      return;
    }

    const videoUrl = URL.createObjectURL(file);
    setValue("videoSelfieUrl", videoUrl);

    setTimeout(() => {
      setValue("videoSelfieUrl", "https://example.com/uploaded-video.mp4");
      alert("ویدئو با موفقیت آپلود شد");
    }, 2000);
  };

  // Render step 1: Location
  const renderStep1 = () => {
    return (
      <div className="step-container">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center">
            1
          </span>
          محل فعالیت خود را مشخص کنید
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              کشور *
            </label>
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => {
                    field.onChange(e);
                    const countryId = countries.find(
                      (c) => c.name === e.target.value
                    )?.id;
                    if (countryId) handleCountryChange(countryId);
                  }}
                >
                  <option value="">کشور را انتخاب کنید</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.name}>
                      {country.nameFa || country.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.country && (
              <p className="text-red-500 text-sm">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              شهر *
            </label>
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={!selectedCountryId}
                >
                  <option value="">شهر را انتخاب کنید</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.name}>
                      {city.nameFa || city.name}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.city && (
              <p className="text-red-500 text-sm">{errors.city.message}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            آدرس دقیق *
          </label>
          <Controller
            name="address"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="آدرس کامل محل فعالیت خود را وارد کنید"
              />
            )}
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            موقعیت روی نقشه (اختیاری)
          </label>
          <div
            ref={mapRef}
            className="w-full h-64 rounded-lg border border-gray-300 overflow-hidden"
          />
        </div>
      </div>
    );
  };

  // Render step 2: Languages
  const renderStep2 = () => {
    const selectedLanguages = watch("languages") || {};

    return (
      <div className="step-container">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center">
            2
          </span>
          زبان‌هایی که مسلط هستید را انتخاب کنید
        </h2>

        <div className="mb-4">
          <p className="text-gray-600 mb-4">
            <span className="text-red-500">*</span> حداقل یک زبان را انتخاب کنید
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {AVAILABLE_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguages[lang.code];
              const proficiency = selectedLanguages[lang.code] || 50;

              return (
                <div
                  key={lang.code}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                    isSelected
                      ? "border-blue-500 shadow-lg scale-105"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{lang.flag}</span>
                        <span className="font-medium">{lang.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleLanguage(lang.code)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {isSelected ? "✓" : "+"}
                      </button>
                    </div>

                    {isSelected && (
                      <div className="mt-4">
                        <label className="block text-sm text-gray-600 mb-2">
                          درصد تسلط: {proficiency}%
                        </label>
                        <input
                          type="range"
                          min="10"
                          max="100"
                          step="10"
                          value={proficiency}
                          onChange={(e) =>
                            updateLanguageProficiency(
                              lang.code,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {errors.languages && (
            <p className="text-red-500 text-sm mt-4">
              {errors.languages && (
                <p className="text-red-500 text-sm mt-4">
                  {String(errors.languages.message)}
                </p>
              )}{" "}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render step 3: Services & Bio
  const renderStep3 = () => {
    const workExperience = watch("workExperience") || "";

    return (
      <div className="step-container">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center">
            3
          </span>
          خدمات و سوابق کاری
        </h2>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">خدماتی که ارائه می‌دهید:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_SERVICES.map((service) => {
              const isSelected = watch("services")?.includes(service.id);
              return (
                <div
                  key={service.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                        isSelected
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {service.icon}
                    </div>
                    <div className="font-medium">{service.name}</div>
                  </div>
                </div>
              );
            })}
          </div>
          {errors.services && (
            <p className="text-red-500 text-sm mt-2">
              {errors.services.message}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            سوابق کاری و تجربه *
          </label>
          <Controller
            name="workExperience"
            control={control}
            render={({ field }) => (
              <textarea
                {...field}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="تجربیات کاری، مهارت‌ها و سوابق مرتبط با گردشگری را شرح دهید..."
              />
            )}
          />
          {errors.workExperience && (
            <p className="text-red-500 text-sm mt-2">
              {errors.workExperience.message}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render step 4: Documents
  const renderStep4 = () => {
    const videoUrl = watch("videoSelfieUrl");

    return (
      <div className="step-container">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center">
            4
          </span>
          مدارک و تأیید هویت
        </h2>

        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4">ویدئوی سلفی تأیید هویت *</h3>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
            {videoUrl ? (
              <div className="space-y-4">
                <video
                  src={videoUrl}
                  controls
                  className="w-full max-w-md mx-auto rounded-lg shadow-md"
                />
                <div className="flex gap-4 justify-center">
                  <button
                    type="button"
                    onClick={() => setValue("videoSelfieUrl", "")}
                    className="px-4 py-2 bg-red-100 text-red-700 rounded-lg"
                  >
                    حذف ویدئو
                  </button>
                  <label className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg cursor-pointer">
                    تغییر ویدئو
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
                <div className="text-5xl mb-4">📹</div>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <div className="text-lg font-medium text-gray-700 mb-2">
                  برای آپلود ویدئو کلیک کنید
                </div>
              </label>
            )}
          </div>

          {errors.videoSelfieUrl && (
            <p className="text-red-500 text-sm mt-2">
              {errors.videoSelfieUrl.message}
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render step 5: Agreement
  const renderStep5 = () => {
    return (
      <div className="step-container">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center">
            5
          </span>
          قوانین و مقررات همکاری
        </h2>

        <div className="border border-gray-200 rounded-xl p-6 max-h-96 overflow-y-auto mb-6">
          <div className="space-y-4 text-gray-700">
            <p>
              با کلیک بر روی دکمه تأیید، تمامی قوانین و مقررات پلتفرم تورینو را
              می‌پذیرید.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Controller
            name="agreementAccepted"
            control={control}
            render={({ field }) => (
              <input
                type="checkbox"
                id="agreement"
                checked={field.value}
                onChange={field.onChange}
                className="w-5 h-5 mt-1"
              />
            )}
          />
          <label htmlFor="agreement" className="text-gray-700">
            قوانین و مقررات فوق را می‌پذیرم
          </label>
        </div>

        {errors.agreementAccepted && (
          <p className="text-red-500 text-sm mt-2">
            {errors.agreementAccepted.message}
          </p>
        )}
      </div>
    );
  };

  // Render progress bar
  const renderProgressBar = () => {
    const steps = [
      { number: 1, title: "موقعیت" },
      { number: 2, title: "زبان‌ها" },
      { number: 3, title: "خدمات" },
      { number: 4, title: "مدارک" },
      { number: 5, title: "قوانین" },
    ];

    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium mb-2 ${
                  step.number === currentStep
                    ? "bg-blue-600 text-white"
                    : step.number < currentStep
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number < currentStep ? "✓" : step.number}
              </div>
              <span className="text-sm">{step.title}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`max-w-4xl mx-auto p-4 md:p-6 ${className}`}>
      <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            👋 فرم ثبت‌نام سفیر تورینو
          </h1>
        </div>

        {renderProgressBar()}

        {saveMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
            {saveMessage}
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

          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <div>
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                >
                  انصراف
                </button>
              )}
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
                className={`px-6 py-3 rounded-lg font-medium ${
                  currentStep === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                ← مرحله قبل
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !isValid}
                className={`px-8 py-3 rounded-lg font-medium ${
                  isSubmitting || !isValid
                    ? "bg-blue-400 text-white cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {isSubmitting
                  ? "در حال پردازش..."
                  : currentStep === 5
                  ? "تأیید و ارسال نهایی"
                  : "ذخیره و ادامه →"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AmbassadorRegisterForm;
