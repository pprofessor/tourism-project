import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProfileForm from '../components/ProfileForm';
import ProfileImageUpload from '../components/ProfileImageUpload';
import PaymentHistory from '../components/PaymentHistory';
import UserServices from '../components/UserServices'; // ✅ اضافه شد

const Profile = () => {
  // اطلاعات کاربر از localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const [user, setUser] = useState(userData);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'payments', 'services'

  const handleProfileUpdate = (updatedData: any) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const handleImageUpdate = (imageUrl: string) => {
    const updatedUser = { ...user, profileImage: imageUrl };
    setUser(updatedUser);
    localStorage.setItem('userData', JSON.stringify(updatedUser));
  };

  const getUserTypeLabel = (userType: string) => {
    switch (userType) {
      case 'GUEST': return 'کاربر مهمان';
      case 'VERIFIED': return 'کاربر احراز هویت شده';
      case 'AMBASSADOR': return 'سفیر';
      default: return 'کاربر مهمان';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* هدر صفحه پروفایل */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse mb-4 md:mb-0">
                <ProfileImageUpload 
                  userData={user} 
                  onImageUpdate={handleImageUpdate}
                />
                <div>
                  <h2 className="text-xl font-semibold text-gray-800">
                    {user.firstName && user.lastName 
                      ? `${user.firstName} ${user.lastName}`
                      : user.mobile || 'کاربر مهمان'
                    }
                  </h2>
                  <p className="text-gray-600">
                    {getUserTypeLabel(user.userType || 'GUEST')}
                  </p>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="text-gray-600">شماره موبایل</p>
                <p className="text-gray-800 font-semibold">{user.mobile || '-'}</p>
              </div>
            </div>
          </div>

          {/* تب‌های navigation */}
          <div className="bg-white rounded-2xl shadow-lg p-2 mb-6">
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex-1 py-3 px-4 rounded-lg text-center transition ${
                  activeTab === 'profile'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                👤 اطلاعات پروفایل
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`flex-1 py-3 px-4 rounded-lg text-center transition ${
                  activeTab === 'payments'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                💳 تاریخچه پرداخت‌ها
              </button>
              <button
                onClick={() => setActiveTab('services')}
                className={`flex-1 py-3 px-4 rounded-lg text-center transition ${
                  activeTab === 'services'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🛎️ سرویس‌های من
              </button>
            </div>
          </div>

          {/* محتوای تب‌ها */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* ستون سمت راست - فرم اطلاعات هویتی */}
              <div className="lg:col-span-2">
                <ProfileForm 
                  userData={user} 
                  onUpdate={handleProfileUpdate}
                />
              </div>

              {/* ستون سمت چپ - آمار و اطلاعات */}
              <div className="space-y-6">
                {/* آمار کاربر */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">آمار شما</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">تعداد رزروها</span>
                      <span className="text-gray-800 font-semibold">۴</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">کاربران معرفی شده</span>
                      <span className="text-gray-800 font-semibold">۰</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">امتیاز</span>
                      <span className="text-gray-800 font-semibold">۱,۲۵۰</span>
                    </div>
                  </div>
                </div>

                {/* سطح کاربری */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">سطح کاربری</h3>
                  <div className="flex items-center space-x-3 space-x-reverse">
                    <div className={`w-3 h-3 rounded-full ${
                      user.userType === 'GUEST' ? 'bg-yellow-400' :
                      user.userType === 'VERIFIED' ? 'bg-green-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-gray-700">
                      {getUserTypeLabel(user.userType || 'GUEST')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {user.userType === 'GUEST' && 'لطفا اطلاعات هویتی خود را تکمیل کنید'}
                    {user.userType === 'VERIFIED' && 'اطلاعات شما با موفقیت تایید شد'}
                    {user.userType === 'AMBASSADOR' && 'شما به عنوان سفیر انتخاب شده‌اید'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="grid grid-cols-1 gap-6">
              <PaymentHistory userId={user.id} />
            </div>
          )}

          {activeTab === 'services' && (
            <div className="grid grid-cols-1 gap-6">
              <UserServices userId={user.id} />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;