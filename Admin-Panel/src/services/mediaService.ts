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
    console.log('📡 درحال دریافت فایل‌ها از:', `${API_BASE_URL}/files`);
    
    const response = await fetch(`${API_BASE_URL}/files`);
    
    console.log('📊 وضعیت پاسخ:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`خطا در دریافت فایل‌ها: ${response.status}`);
    }

    const filesData = await response.json();
    console.log('📁 داده‌های خام از API:', filesData);
    
    // تبدیل به فرمت MediaFile
    const mediaFiles: MediaFile[] = filesData.map((file: any) => {
      const fileType = getFileTypeFromName(file.name);
      
      // ساخت URL کامل
      const fileUrl = `http://localhost:8083${file.url}`;
      
      console.log('🔗 URL فایل:', fileUrl);
      
      // تست دسترسی به تصویر
      if (fileType === 'image') {
        const testImg = new Image();
        testImg.onload = () => console.log('✅ تصویر قابل دسترس:', fileUrl);
        testImg.onerror = () => console.log('❌ خطا در بارگذاری تصویر:', fileUrl);
        testImg.src = fileUrl;
      }

      const mediaFile = {
        id: file.name,
        name: file.name,
        url: fileUrl,
        type: fileType,
        size: parseInt(file.size),
        uploadedAt: file.uploadedAt,
      };
      
      return mediaFile;
    });

    return {
      success: true,
      message: 'فایل‌ها با موفقیت دریافت شدند',
      data: mediaFiles
    };
  } catch (error) {
    console.error('❌ Error in getFiles:', error);
    return {
      success: false,
      message: 'خطا در دریافت فایل‌ها'
    };
  }
},

   // حذف فایل  تابع  
  async deleteFile(fileName: string): Promise<MediaResponse> {
    try {
      console.log('🗑️ درحال حذف فایل:', fileName);
      
      const response = await fetch(`${API_BASE_URL}/delete/${fileName}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 وضعیت پاسخ حذف:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error('خطا در حذف فایل');
      }

      return {
        success: true,
        message: 'فایل با موفقیت حذف شد'
      };
    } catch (error) {
      console.error('❌ Error in deleteFile:', error);
      return {
        success: false,
        message: 'خطا در حذف فایل'
      };
    }
  },

  // تغییر نام فایل
async renameFile(oldFileName: string, newFileName: string): Promise<MediaResponse> {
  try {
    console.log('✏️ درحال تغییر نام فایل:', oldFileName, '→', newFileName);
    
    const response = await fetch(`${API_BASE_URL}/rename/${oldFileName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newFileName }),
    });

    console.log('📊 وضعیت پاسخ تغییر نام:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || 'خطا در تغییر نام فایل');
    }

    const result = await response.json();
    
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