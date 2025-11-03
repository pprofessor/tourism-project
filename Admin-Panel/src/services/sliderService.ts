const API_BASE = 'http://localhost:8080/api';

/**
 * رابط اسلاید برای مدیریت اسلایدشو
 */
export interface Slide {
  id: number;
  image: string; // URL یا base64 تصویر
  title: string; // عنوان اسلاید
  description: string; // توضیحات اسلاید
  buttonText: string; // متن دکمه
  buttonLink: string; // لینک دکمه
  altText: string; // متن جایگزین تصویر
  seoTitle?: string; // عنوان سئو
  seoDescription?: string; // توضیحات سئو
  isActive: boolean; // وضعیت فعال/غیرفعال
  displayOrder: number; // ترتیب نمایش
  
  // تنظیمات پیشرفته اسلایدشو
  mediaSource?: 'UPLOAD' | 'MEDIA_LIBRARY'; // منبع تصویر
  transitionType?: 'fade' | 'slide' | 'zoom' | 'flip'; // نوع انتقال
  navigationType?: 'dots' | 'arrows' | 'dots_arrows' | 'custom'; // نوع ناوبری
  customNavigation?: string; // ناوبری سفارشی
  slideInterval?: number; // زمان تعویض اسلاید (میلی‌ثانیه)
  transitionDuration?: number; // مدت انیمیشن انتقال
}

/**
 * سرویس مدیریت اسلایدها
 */
class SliderService {
  
  /**
   * دریافت تمام اسلایدهای فعال
   */
  async getAllSlides(): Promise<Slide[]> {
    try {
      const response = await fetch(`${API_BASE}/slides/active`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch slides: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data || [];
    } catch (error) {
      console.error('Error fetching slides:', error);
      throw error;
    }
  }

  /**
   * ایجاد اسلاید جدید
   */
  async createSlide(slideData: Omit<Slide, 'id'>): Promise<Slide> {
    try {
      const response = await fetch(`${API_BASE}/slides`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error creating slide:', errorText);
        throw new Error(`Failed to create slide: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('Error creating slide:', error);
      throw error;
    }
  }

  /**
   * به‌روزرسانی اسلاید موجود
   */
  async updateSlide(id: string, slideData: Partial<Slide>): Promise<Slide> {
    try {
      const response = await fetch(`${API_BASE}/slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(slideData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update slide: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating slide:', error);
      throw error;
    }
  }

  /**
   * حذف اسلاید
   */
  async deleteSlide(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/slides/${id}`, { 
        method: 'DELETE' 
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete slide: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting slide:', error);
      throw error;
    }
  }

  /**
   * تغییر وضعیت فعال/غیرفعال اسلاید
   */
  async toggleSlideStatus(id: string, isActive: boolean): Promise<Slide> {
    try {
      const response = await fetch(`${API_BASE}/slides/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to toggle slide status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error toggling slide status:', error);
      throw error;
    }
  }

  /**
   * دریافت لیست فایل‌های مدیا
   */
  async getMediaFiles(): Promise<string[]> {
    try {
      const response = await fetch(`${API_BASE}/media/files`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch media files: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching media files:', error);
      return [];
    }
  }
}

// ایجاد نمونه از سرویس
export const sliderService = new SliderService();