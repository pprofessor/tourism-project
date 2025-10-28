import React, { useState, useEffect } from 'react';

interface UserData {
  id?: number;
  mobile?: string;
  role?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  passportNumber?: string;
  address?: string;
  userType?: string;
}

interface ProfileFormProps {
  userData: UserData;
  onUpdate: (data: any) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    nationalCode: '',
    passportNumber: '',
    address: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // پر کردن فرم با داده‌های کاربر
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        nationalCode: userData.nationalCode || '',
        passportNumber: userData.passportNumber || '',
        address: userData.address || ''
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // TODO: بعداً API call به بک‌اند اضافه می‌شود
      console.log('اطلاعات ارسالی:', formData);
      
      // شبیه‌سازی آپدیت
      setTimeout(() => {
        onUpdate(formData);
        setMessage('اطلاعات با موفقیت ذخیره شد');
        setLoading(false);
        checkUserLevel();
      }, 1000);
      
    } catch (error) {
      setMessage('خطا در ذخیره اطلاعات');
      setLoading(false);
    }
  };
  const checkUserLevel = async () => {
  try {
    // TODO: بعداً با API واقعی جایگزین می‌شود
    console.log('بررسی سطح کاربر...');
    
    // شبیه‌سازی ارتقاء سطح
    setTimeout(() => {
      console.log('سطح کاربر بررسی شد - امکان ارتقاء به VERIFIED');
    }, 500);
    
  } catch (error) {
    console.error('خطا در بررسی سطح کاربر:', error);
  }
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">اطلاعات هویتی</h3>
      
      {message && (
        <div className={`p-3 rounded-lg mb-4 ${
          message.includes('موفق') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* نام */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="نام خود را وارد کنید"
            />
          </div>

          {/* نام خانوادگی */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              نام خانوادگی
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="نام خانوادگی خود را وارد کنید"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* کد ملی */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              کد ملی
            </label>
            <input
              type="text"
              name="nationalCode"
              value={formData.nationalCode}
              onChange={handleInputChange}
              maxLength={10}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="کد ملی ۱۰ رقمی"
            />
          </div>

          {/* شماره پاسپورت */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              شماره پاسپورت
            </label>
            <input
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="شماره پاسپورت"
            />
          </div>
        </div>

        {/* آدرس */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            آدرس
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="آدرس کامل خود را وارد کنید"
          />
        </div>

        {/* دکمه ذخیره */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'در حال ذخیره...' : 'ذخیره اطلاعات'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;