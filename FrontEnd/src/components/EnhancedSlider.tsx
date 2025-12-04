import React, { useState, useEffect, useCallback } from "react";
import { Slide } from "../services/slideService";
import "./EnhancedSlider.css";

interface EnhancedSliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  height?: string;
  defaultInterval?: number;
  sliderSettings?: {
    sliderHeight?: string;
    autoPlay?: boolean;
    slideInterval?: number;
    navigationType?: string;
    transitionType?: string;
  };
}

const EnhancedSlider: React.FC<EnhancedSliderProps> = ({
  slides,
  autoPlay = true,
  height = "600px",
  defaultInterval = 5000,
  sliderSettings = {},
}) => {
  // فیلتر اسلایدهای فعال و مرتب‌سازی
  const activeSlides = slides
    .filter((slide) => slide.isActive !== false)
    .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  // اولویت‌بندی: فقط از تنظیمات پنل ادمین استفاده کن (چون در backend وجود ندارند)
  const finalSliderHeight = sliderSettings.sliderHeight || height;

  const finalAutoPlay =
    sliderSettings.autoPlay !== undefined ? sliderSettings.autoPlay : autoPlay;

  const finalSlideInterval = sliderSettings.slideInterval || defaultInterval;

  // استفاده از transitionType و navigationType از تنظیمات پنل ادمین
  const finalTransitionType = sliderSettings.transitionType;
  const finalNavigationType = sliderSettings.navigationType;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(finalAutoPlay);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // اتوپلی با استفاده از تنظیمات نهایی
  useEffect(() => {
    if (!isPlaying || activeSlides.length === 0) return;

    const interval = setInterval(() => {
      handleNextSlide();
    }, finalSlideInterval);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, activeSlides, finalSlideInterval]);

  // وقتی تنظیمات پنل ادمین تغییر کرد، stateها را آپدیت کن
  useEffect(() => {
    setIsPlaying(finalAutoPlay);
  }, [finalAutoPlay]);

  const handleNextSlide = useCallback(() => {
    if (isTransitioning || activeSlides.length === 0) return;

    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev < activeSlides.length - 1 ? prev + 1 : 0));

    setTimeout(
      () => setIsTransitioning(false),
      activeSlides[currentSlide]?.transitionDuration || 500
    );
  }, [isTransitioning, activeSlides, currentSlide]);

  const handlePrevSlide = useCallback(() => {
    if (isTransitioning || activeSlides.length === 0) return;

    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : activeSlides.length - 1));

    setTimeout(
      () => setIsTransitioning(false),
      activeSlides[currentSlide]?.transitionDuration || 500
    );
  }, [isTransitioning, activeSlides, currentSlide]);

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return;

    setIsTransitioning(true);
    setCurrentSlide(index);
    setTimeout(
      () => setIsTransitioning(false),
      activeSlides[currentSlide]?.transitionDuration || 500
    );
  };

  // دریافت کلاس transition - اول از تنظیمات پنل ادمین استفاده کن
  const getTransitionClass = () => {
    if (activeSlides.length === 0) return "";

    // اولویت با تنظیمات پنل ادمین، سپس تنظیمات اسلاید
    const transitionType =
      finalTransitionType || activeSlides[currentSlide]?.transitionType;

    switch (transitionType) {
      case "fade":
        return "transition-fade";
      case "slide":
        return "transition-slide";
      case "zoom":
        return "transition-zoom";
      case "flip":
        return "transition-flip";
      default:
        return "transition-fade";
    }
  };

  // رندر ناوبری - اول از تنظیمات پنل ادمین استفاده کن
  const renderNavigation = () => {
    if (activeSlides.length === 0) return null;

    // اولویت با تنظیمات پنل ادمین، سپس تنظیمات اسلاید
    const navigationType =
      finalNavigationType || activeSlides[currentSlide]?.navigationType;

    switch (navigationType) {
      case "dots":
        return (
          <div className="navigation-dots">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
                aria-label={`رفتن به اسلاید ${index + 1}`}
              />
            ))}
          </div>
        );

      case "arrows":
        return (
          <div className="navigation-arrows">
            <button
              className="arrow prev"
              onClick={handlePrevSlide}
              aria-label="اسلاید قبلی"
            >
              ‹
            </button>
            <button
              className="arrow next"
              onClick={handleNextSlide}
              aria-label="اسلاید بعدی"
            >
              ›
            </button>
          </div>
        );

      case "dots_arrows":
        return (
          <>
            <div className="navigation-arrows">
              <button className="arrow prev" onClick={handlePrevSlide}>
                ‹
              </button>
              <button className="arrow next" onClick={handleNextSlide}>
                ›
              </button>
            </div>
            <div className="navigation-dots">
              {activeSlides.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </>
        );

      case "custom":
        return (
          <div className="navigation-custom">
            {activeSlides[currentSlide]?.customNavigation
              ? "ناوبری سفارشی"
              : "ناوبری سفارشی"}
          </div>
        );

      default:
        return (
          <div className="navigation-dots">
            {activeSlides.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        );
    }
  };

  if (activeSlides.length === 0) {
    return (
      <div
        className="enhanced-slider empty"
        style={{ height: finalSliderHeight }}
      >
        <div className="empty-state">
          <p>هیچ اسلاید فعالی وجود ندارد</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`enhanced-slider ${getTransitionClass()}`}
      style={{ height: finalSliderHeight }}
    >
      <div className="slider-container">
        <div className="slides-wrapper">
          {activeSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${index === currentSlide ? "active" : ""}`}
              style={{
                transitionDuration: `${slide.transitionDuration || 500}ms`,
              }}
            >
              <img
                src={slide.image}
                alt={slide.altText || slide.title}
                className="slide-image"
                loading="lazy"
              />

              <div className="slide-overlay">
                <div className="slide-content">
                  {slide.showTitle && slide.title && (
                    <h2 className="slide-title">{slide.title}</h2>
                  )}

                  {slide.description && (
                    <p className="slide-description">{slide.description}</p>
                  )}

                  {slide.buttonText && slide.buttonLink && (
                    <button
                      className="slide-button"
                      onClick={() => {
                        const link = slide.buttonLink;
                        if (link.startsWith("http")) {
                          window.open(link, "_blank");
                        } else if (link.startsWith("#")) {
                          const element = document.querySelector(link);
                          element?.scrollIntoView({ behavior: "smooth" });
                        } else {
                          window.location.href = link;
                        }
                      }}
                    >
                      {slide.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* کنترل‌های پلی/پاز */}
        <div className="slider-controls">
          <button
            className={`control-btn ${isPlaying ? "pause" : "play"}`}
            onClick={() => setIsPlaying(!isPlaying)}
            aria-label={isPlaying ? "توقف اسلایدشو" : "شروع اسلایدشو"}
          >
            {isPlaying ? "❚❚" : "▶"}
          </button>

          <div className="slide-counter">
            {currentSlide + 1} / {activeSlides.length}
          </div>
        </div>

        {/* ناوبری */}
        {renderNavigation()}
      </div>
    </div>
  );
};

export default EnhancedSlider;
