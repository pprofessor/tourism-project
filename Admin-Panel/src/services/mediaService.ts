const API_BASE_URL = 'http://localhost:8080/api/media';

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  uploadedAt: string;
  category?: string;
}

export interface MediaResponse {
  success: boolean;
  message: string;
  data?: MediaFile[] | any;
  total?: number;
}

export interface RenameResponse {
  success: boolean;
  message: string;
  data?: {
    newName: string;
    newUrl: string;
    oldName: string;
  };
}


// کش برای بهبود عملکرد
const fileCache = new Map<string, MediaFile[]>();
const CACHE_DURATION = 60000; // 1 minute

export const mediaService = {
  // آپلود فایل
  async uploadFile(file: File): Promise<MediaResponse> {
    try {
      // اعتبارسنجی سایز فایل
      if (file.size > 50 * 1024 * 1024) {
        return {
          success: false,
          message: 'سایز فایل نباید بیشتر از 50MB باشد'
        };
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'خطا در آپلود فایل');
      }

      // پاکسازی کش
      fileCache.clear();

      return {
        success: true,
        message: 'فایل با موفقیت آپلود شد',
        data: [result]
      };
    } catch (error) {
      console.error('❌ Error in uploadFile:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'خطا در آپلود فایل'
      };
    }
  },

  // دریافت لیست فایل‌ها
  async getFiles(): Promise<MediaResponse> {
    try {
      const cacheKey = 'files';
      const cached = fileCache.get(cacheKey);
      
      if (cached) {
        console.log('📁 استفاده از داده‌های کش شده');
        return {
          success: true,
          message: 'فایل‌ها با موفقیت دریافت شدند',
          data: cached
        };
      }

      console.log('📡 درحال دریافت فایل‌ها از:', `${API_BASE_URL}/files`);
      
      const response = await fetch(`${API_BASE_URL}/files`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log('📊 وضعیت پاسخ:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`خطا در دریافت فایل‌ها: ${response.status}`);
      }

      const result = await response.json();
      console.log('📁 داده‌های دریافتی از API:', result);
      
      if (!result.success) {
        throw new Error(result.message || 'خطا در دریافت فایل‌ها');
      }

      // تبدیل به فرمت MediaFile
      const mediaFiles: MediaFile[] = result.data.map((file: any) => {
        const fileType = getFileTypeFromName(file.name);
        
        const mediaFile: MediaFile = {
          id: file.id || file.name,
          name: file.name,
          url: file.url,
          type: fileType,
          size: file.size,
          uploadedAt: file.uploadedAt,
          category: file.category
        };
        
        // تست دسترسی به تصویر
        if (fileType === 'image') {
          this.preloadImage(mediaFile.url).catch(() => {
            console.warn('⚠️ تصویر قابل دسترس نیست:', mediaFile.url);
          });
        }

        return mediaFile;
      });

      // ذخیره در کش
      fileCache.set(cacheKey, mediaFiles);
      setTimeout(() => fileCache.delete(cacheKey), CACHE_DURATION);

      return {
        success: true,
        message: 'فایل‌ها با موفقیت دریافت شدند',
        data: mediaFiles,
        total: result.total
      };
    } catch (error) {
      console.error('❌ Error in getFiles:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'خطا در دریافت فایل‌ها'
      };
    }
  },

  // پیش‌بارگذاری تصاویر
  async preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject();
      img.src = url;
    });
  },

  // حذف فایل
  async deleteFile(fileName: string): Promise<MediaResponse> {
    try {
      console.log('🗑️ درحال حذف فایل:', fileName);
      
      const response = await fetch(`${API_BASE_URL}/delete/${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 وضعیت پاسخ حذف:', response.status, response.statusText);

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'خطا در حذف فایل');
      }

      // پاکسازی کش
      fileCache.clear();

      return {
        success: true,
        message: 'فایل با موفقیت حذف شد'
      };
    } catch (error) {
      console.error('❌ Error in deleteFile:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'خطا در حذف فایل'
      };
    }
  },

  // تغییر نام فایل
  async renameFile(oldFileName: string, newFileName: string): Promise<MediaResponse> {
    try {
      console.log('✏️ درحال تغییر نام فایل:', oldFileName, '→', newFileName);
      
      const response = await fetch(`${API_BASE_URL}/rename/${encodeURIComponent(oldFileName)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newFileName }),
      });

      console.log('📊 وضعیت پاسخ تغییر نام:', response.status, response.statusText);

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'خطا در تغییر نام فایل');
      }

      // پاکسازی کش
      fileCache.clear();

      return {
        success: true,
        message: result.message,
        data: result
      };
    } catch (error) {
      console.error('❌ Error in renameFile:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'خطا در تغییر نام فایل'
      };
    }
  },
};

// تابع کمکی برای تشخیص نوع فایل
function getFileTypeFromName(fileName: string): MediaFile['type'] {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
  
  if (imageExtensions.includes(extension)) {
    return 'image';
  }
  if (videoExtensions.includes(extension)) {
    return 'video';
  }
  if (audioExtensions.includes(extension)) {
    return 'audio';
  }
  return 'document';
}