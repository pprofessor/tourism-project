const API_BASE = "http://localhost:8080/api";

export interface SliderSettings {
  sliderHeight?: string;
  autoPlay?: boolean;
  slideInterval?: number;
  navigationType?: string;
  transitionType?: string;
  transitionDuration?: number;
}

export const sliderSettingsService = {
  // دریافت تنظیمات از API
  async getSettings(): Promise<SliderSettings> {
    try {
      const response = await fetch(`${API_BASE}/slider/settings`);

      if (!response.ok) {
        throw new Error(`Failed to fetch settings: ${response.status}`);
      }

      const settings = await response.json();
      console.log("✅ Settings loaded from API:", settings);
      return settings;
    } catch (error) {
      console.error("❌ Error fetching slider settings from API:", error);
      // Fallback به localStorage اگر API در دسترس نبود
      const storedSettings = localStorage.getItem("sliderSettings");
      if (storedSettings) {
        console.log("✅ Settings loaded from localStorage (fallback)");
        return JSON.parse(storedSettings);
      }
      return this.getDefaultSettings();
    }
  },

  // ذخیره تنظیمات در API
  async saveSettings(settings: SliderSettings): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/slider/settings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`Failed to save settings: ${response.status}`);
      }

      const savedSettings = await response.json();
      console.log("✅ Settings saved to API:", savedSettings);
      return true;
    } catch (error) {
      console.error("❌ Error saving slider settings to API:", error);
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
