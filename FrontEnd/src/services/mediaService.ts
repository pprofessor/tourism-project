const API_BASE_URL = 'http://localhost:8083/api/media';

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video' | 'audio' | 'document';
  size: number;
  uploadedAt: string;
}

export interface MediaResponse {
  success: boolean;
  message: string;
  data?: any;
}

export const mediaService = {
  // آپلود فایل
  async uploadFile(file: File): Promise<MediaResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        // توجه: برای FormData نباید Content-Type ست شود
      });

      if (!response.ok) {
        throw new Error('خطا در آپلود فایل');
      }

      const result = await response.json();
      
      return {
        success: true,
        message: 'فایل با موفقیت آپلود شد',
        data: result
      };
    } catch (error) {
      console.error('Error in uploadFile:', error);
      return {
        success: false,
        message: 'خطا در آپلود فایل'
      };
    }
  },

  // دریافت لیست فایل‌ها
  async getFiles(): Promise<MediaResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/files`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('خطا در دریافت فایل‌ها');
      }

      const files = await response.json();
      
      // تبدیل به فرمت MediaFile
      const mediaFiles: MediaFile[] = files.map((file: any) => {
        const fileType = getFileTypeFromName(file.name);
        
        return {
          id: file.name,
          name: file.name,
          url: `http://localhost:8083${file.url}`,
          type: fileType,
          size: parseInt(file.size),
          uploadedAt: file.uploadedAt,
        };
      });

      return {
        success: true,
        message: 'فایل‌ها با موفقیت دریافت شدند',
        data: mediaFiles
      };
    } catch (error) {
      console.error('Error in getFiles:', error);
      return {
        success: false,
        message: 'خطا در دریافت فایل‌ها'
      };
    }
  },

  // حذف فایل
  async deleteFile(fileName: string): Promise<MediaResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${fileName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('خطا در حذف فایل');
      }

      return {
        success: true,
        message: 'فایل با موفقیت حذف شد'
      };
    } catch (error) {
      console.error('Error in deleteFile:', error);
      return {
        success: false,
        message: 'خطا در حذف فایل'
      };
    }
  },
};

// تابع کمکی برای تشخیص نوع فایل
function getFileTypeFromName(fileName: string): MediaFile['type'] {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
  const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm'];
  const audioExtensions = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
  
  if (imageExtensions.includes(extension || '')) {
    return 'image';
  }
  if (videoExtensions.includes(extension || '')) {
    return 'video';
  }
  if (audioExtensions.includes(extension || '')) {
    return 'audio';
  }
  return 'document';
}