import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTheme } from "../context/ThemeContext";
import { slideService } from "../services/slideService";

// انواع TypeScript برای type safety
interface Service {
  id: number;
  titleKey: string;
  descriptionKey: string;
  icon: React.ReactElement;
  color: string;
}

interface Slide {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const Home: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  // بارگذاری اسلایدها از API
  useEffect(() => {
    const loadSlides = async () => {
      try {
        const data = await slideService.getActiveSlides();
        setSlides(data);
      } catch (error) {
        console.error("Error loading slides:", error);
        // در صورت خطا از داده‌های پیش‌فرض استفاده کنید
      } finally {
        setLoading(false);
      }
    };

    loadSlides();
  }, []);

  // اتوماتیک تغییر اسلاید
  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000); // تغییر هر ۵ ثانیه

      return () => clearInterval(interval);
    }
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // پیکربندی خدمات
  const services: Service[] = useMemo(
    () => [
      {
        id: 1,
        titleKey: "home.services.tours.title",
        descriptionKey: "home.services.tours.description",
        icon: (
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        color: "from-blue-500 to-blue-600",
      },
      {
        id: 2,
        titleKey: "home.services.hotels.title",
        descriptionKey: "home.services.hotels.description",
        icon: (
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        ),
        color: "from-green-500 to-green-600",
      },
      {
        id: 3,
        titleKey: "home.services.tickets.title",
        descriptionKey: "home.services.tickets.description",
        icon: (
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        ),
        color: "from-purple-500 to-purple-600",
      },
      {
        id: 4,
        titleKey: "home.services.travelServices.title",
        descriptionKey: "home.services.travelServices.description",
        icon: (
          <svg
            className="w-12 h-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9"
            />
          </svg>
        ),
        color: "from-orange-500 to-orange-600",
      },
    ],
    []
  );

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <meta itemProp="name" content={t("home.meta.title")} />
      <meta itemProp="description" content={t("home.meta.description")} />

      <Header />

      {/* اسلایدشو پیشرفته */}
      <section className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
        {/* اسلایدها با انیمیشن‌های مختلف */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${slide.image})` }}
                role="img"
                aria-label={slide.title}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white px-4 max-w-4xl">
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 animate-fade-in-delay">
                      {slide.description}
                    </p>
                    <a
                      href={slide.buttonLink || "#tours"}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 animate-fade-in-delay-2 shadow-lg"
                    >
                      {slide.buttonText || "مشاهده بیشتر"}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* دکمه‌های ناوبری پیشرفته */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-lg"
          aria-label="اسلاید قبلی"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 shadow-lg"
          aria-label="اسلاید بعدی"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* نشانگرهای اسلاید - طرح‌های مختلف */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 rtl:space-x-reverse">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                index === currentSlide
                  ? "bg-white scale-125 shadow-lg"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              aria-label={`رفتن به اسلاید ${index + 1}`}
              aria-current={index === currentSlide ? "true" : "false"}
            />
          ))}
        </div>

        {/* شماره اسلاید */}
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
          {currentSlide + 1} / {slides.length}
        </div>
      </section>
      {/* بخش خدمات */}
      <section
        className="py-16"
        aria-labelledby="services-title"
        itemScope
        itemType="https://schema.org/Service"
      >
        <div className="container mx-auto px-4">
          <h2
            id="services-title"
            className={`text-3xl font-bold text-center mb-12 transition-colors duration-300 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {t("home.services.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group ${
                  theme === "dark" ? "bg-gray-800" : "bg-white"
                }`}
                itemScope
                itemType="https://schema.org/Service"
              >
                <div
                  className={`bg-gradient-to-r ${service.color} p-6 text-white`}
                >
                  <div className="flex justify-center mb-4">
                    <div
                      className="bg-white bg-opacity-20 p-3 rounded-full group-hover:scale-110 transition-transform"
                      aria-hidden="true"
                    >
                      {service.icon}
                    </div>
                  </div>
                  <h3
                    className="text-xl font-bold text-center mb-2"
                    itemProp="name"
                  >
                    {t(service.titleKey)}
                  </h3>
                </div>
                <div className="p-6">
                  <p
                    className={`text-center leading-relaxed transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                    itemProp="description"
                  >
                    {t(service.descriptionKey)}
                  </p>
                  <button
                    className={`w-full mt-4 py-2 rounded-lg transition font-medium ${
                      theme === "dark"
                        ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    aria-label={`${t("home.services.detailsButton")} ${t(
                      service.titleKey
                    )}`}
                  >
                    {t("home.services.detailsButton")}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default React.memo(Home);
