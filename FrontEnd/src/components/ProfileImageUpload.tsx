// ProfileImageUpload.tsx - کد کامل اصلاح شده
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UserData {
  id?: number;
  profileImage?: string;
}

interface ProfileImageUploadProps {
  userData: UserData;
  onImageUpdate: (imageUrl: string) => void;
}

const ProfileImageUpload: React.FC<ProfileImageUploadProps> = ({ userData, onImageUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tempPreview, setTempPreview] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('🔍 فایل انتخاب شد:', file.name);

    // 1. اول پیش‌نمایش رو نمایش می‌دیم
    const reader = new FileReader();
    reader.onloadend = () => {
      console.log('🎯 پیش‌نمایش ایجاد شد');
      setTempPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setLoading(true);
    setMessage(t('profileImage.uploading'));

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userData.id?.toString() || '');

      console.log('📤 شروع آپلود به سرور...');

      const response = await fetch('http://localhost:8083/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      });

      console.log('📥 پاسخ سرور دریافت شد:', response.status);

      const result = await response.json();
      console.log('📊 نتیجه آپلود:', result);

      if (result.success) {
        console.log('✅ آپلود موفق، آدرس تصویر:', result.imageUrl);
        onImageUpdate(result.imageUrl);
        setMessage(t('profileImage.uploadSuccess'));
        // پیش‌نمایش رو نگه می‌داریم تا کاربر نتیجه رو ببینه
      } else {
        console.log('❌ خطا در آپلود:', result.message);
        setMessage(result.message || t('profileImage.uploadError'));
        // پیش‌نمایش رو نگه می‌داریم تا کاربر دوباره تلاش کنه
      }
    } catch (error) {
      console.log('💥 خطای شبکه:', error);
      setMessage(t('profileImage.serverError'));
      // پیش‌نمایش رو نگه می‌داریم
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div 
        onClick={handleImageClick}
        className="relative cursor-pointer group"
      >
        <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
          {tempPreview ? (
            <img 
              src={tempPreview}
              alt={t('profileImage.previewAlt')}
              className="w-full h-full object-cover"
            />
          ) : userData.profileImage ? (
            <img 
              src={userData.profileImage.includes('http') ? userData.profileImage : `http://localhost:8083${userData.profileImage}`}
              alt={t('profileImage.profileAlt')}
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>

        {/* loading indicator */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <button
        onClick={handleImageClick}
        disabled={loading}
        className="mt-3 text-sm text-blue-600 hover:text-blue-700 transition font-medium disabled:opacity-50"
      >
        {loading ? t('profileImage.uploading') : t('profileImage.changePhoto')}
      </button>

      {message && (
        <div className={`mt-2 text-xs ${
          message.includes(t('profileImage.uploadSuccess')) ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}

      <div className="mt-1 text-xs text-gray-500">
        {t('profileImage.status')}: {tempPreview ? t('profileImage.previewActive') : t('profileImage.noPreview')}
      </div>
    </div>
  );
};

export default ProfileImageUpload;