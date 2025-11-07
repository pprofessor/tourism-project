import React, { useState, useEffect } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import {
  NavigateBefore,
  NavigateNext,
  PlayArrow,
  Pause,
  FiberManualRecord,
} from "@mui/icons-material";

interface Slide {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  targetUrl: string;
  transitionDuration: number;
  navigationStyle: "dots" | "arrows" | "both" | "minimal";
}

interface EnhancedSliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  showControls?: boolean;
}

const EnhancedSlider: React.FC<EnhancedSliderProps> = ({
  slides,
  autoPlay = true,
  showControls = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    if (isPlaying && slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, slides[currentSlide]?.transitionDuration * 1000 || 5000);

      return () => clearInterval(interval);
    }
  }, [isPlaying, currentSlide, slides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (slides.length === 0) {
    return (
      <Box
        sx={{
          height: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>هیچ اسلایدی برای نمایش وجود ندارد</Typography>
      </Box>
    );
  }

  const currentSlideData = slides[currentSlide];
  const navigationStyle = currentSlideData?.navigationStyle || "both";

  return (
    <Box sx={{ position: "relative", height: 500, overflow: "hidden" }}>
      {/* اسلاید فعلی */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${currentSlideData.imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "opacity 0.5s ease",
        }}
      >
        {/* Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* محتوای اسلاید */}
          <Box sx={{ textAlign: "center", color: "white", maxWidth: "80%" }}>
            <Typography variant="h3" component="h2" gutterBottom>
              {currentSlideData.title}
            </Typography>
            <Typography variant="h6" component="p" sx={{ mb: 3 }}>
              {currentSlideData.description}
            </Typography>
            {currentSlideData.targetUrl && (
              <a
                href={currentSlideData.targetUrl}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-semibold transition-colors duration-300"
              >
                بیشتر بدانید
              </a>
            )}
          </Box>
        </Box>
      </Box>

      {/* کنترل‌ها */}
      {showControls && (
        <>
          {/* فلش‌های نویگیشن */}
          {(navigationStyle === "arrows" || navigationStyle === "both") && (
            <>
              <IconButton
                sx={{
                  position: "absolute",
                  left: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  "&:hover": { backgroundColor: "white" },
                }}
                onClick={prevSlide}
              >
                <NavigateBefore />
              </IconButton>

              <IconButton
                sx={{
                  position: "absolute",
                  right: 16,
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(255,255,255,0.8)",
                  "&:hover": { backgroundColor: "white" },
                }}
                onClick={nextSlide}
              >
                <NavigateNext />
              </IconButton>
            </>
          )}

          {/* دکمه‌های پلی/پاز */}
          <IconButton
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              backgroundColor: "rgba(255,255,255,0.8)",
              "&:hover": { backgroundColor: "white" },
            }}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>

          {/* نقطه‌های نویگیشن */}
          {(navigationStyle === "dots" || navigationStyle === "both") && (
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                gap: 1,
              }}
            >
              {slides.map((_, index) => (
                <IconButton
                  key={index}
                  size="small"
                  onClick={() => goToSlide(index)}
                  sx={{
                    color: index === currentSlide ? "primary.main" : "grey.400",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  <FiberManualRecord sx={{ fontSize: 12 }} />
                </IconButton>
              ))}
            </Box>
          )}

          {/* شماره اسلاید */}
          <Typography
            variant="body2"
            sx={{
              position: "absolute",
              bottom: 16,
              right: 16,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.5)",
              px: 1,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            {currentSlide + 1} / {slides.length}
          </Typography>
        </>
      )}
    </Box>
  );
};

export default EnhancedSlider;
