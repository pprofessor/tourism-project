import React, { useRef, useState } from 'react';

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

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // اعتبارسنجی فایل
    if (!file.type.startsWith('image/')) {
      setMessage('لطفا یک فایل تصویر انتخاب کنید');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      setMessage('حجم فایل باید کمتر از ۵ مگابایت باشد');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userData.id?.toString() || '');

      const response = await fetch('http://localhost:8083/api/upload/profile-image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onImageUpdate(result.imageUrl);
        setMessage('عکس پروفایل با موفقیت آپلود شد');
      } else {
        setMessage(result.message || 'خطا در آپلود عکس');
      }
    } catch (error) {
      setMessage('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* عکس پروفایل */}
      <div 
        onClick={handleImageClick}
        className="relative cursor-pointer group"
      >
        <div className="w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
          {userData.profileImage ? (
            <img 
              src={`http://localhost:8083${userData.profileImage}`}
              alt="پروفایل"
              className="w-full h-full object-cover"
            />
          ) : (
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          )}
        </div>

        {/* overlay برای hover */}
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        {/* loading indicator */}
        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* input فایل مخفی */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* دکمه تغییر عکس */}
      <button
        onClick={handleImageClick}
        disabled={loading}
        className="mt-3 text-sm text-blue-600 hover:text-blue-700 transition font-medium disabled:opacity-50"
      >
        {loading ? 'در حال آپلود...' : 'تغییر عکس پروفایل'}
      </button>

      {/* پیغام */}
      {message && (
        <div className={`mt-2 text-xs ${
          message.includes('موفق') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default ProfileImageUpload;