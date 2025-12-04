const API_BASE = "/api";

export interface SliderSettings {
  sliderHeight?: string;
  autoPlay?: boolean;
  slideInterval?: number;
  navigationType?: string;
  transitionType?: string;
  transitionDuration?: number;
}

export const sliderSettingsService = {
  async getSettings(): Promise<SliderSettings> {
    try {
      const response = await fetch(`${API_BASE}/slider/settings`);

      if (!response.ok) {
        throw new Error(`Failed to fetch settings: ${response.status}`);
      }

      const settings = await response.json();
      return settings;
    } catch (error) {
      const storedSettings = localStorage.getItem("sliderSettings");
      if (storedSettings) {
        return JSON.parse(storedSettings);
      }
      return this.getDefaultSettings();
    }
  },

  // ذخیره تنظیمات در localStorage و ارسال به API
  async saveSettings(settings: SliderSettings): Promise<boolean> {
    try {
      // در localStorage ذخیره کن
      localStorage.setItem("sliderSettings", JSON.stringify(settings));

      // سعی کن به API هم ارسال کنی (اگر endpoint وجود دارد)
      try {
        const response = await fetch(`${API_BASE}/slider/settings`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(settings),
        });

        if (response.ok) {
        }
      } catch (apiError) {}

      return true;
    } catch (error) {
      return false;
    }
  },

  // تنظیمات پیش‌فرض
  getDefaultSettings(): SliderSettings {
    return {
      sliderHeight: "600px",
      autoPlay: true,
      slideInterval: 5000,
      navigationType: "dots_arrows",
      transitionType: "fade",
      transitionDuration: 500,
    };
  },
};
