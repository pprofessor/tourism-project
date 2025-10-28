import React, { useState, useEffect } from 'react';
import LoginModal from './LoginModal';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGoodbye, setShowGoodbye] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const savedLoginStatus = localStorage.getItem('isLoggedIn');
    const savedUserData = localStorage.getItem('userData');
    
    if (savedLoginStatus === 'true' && savedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const handleLoginSuccess = (userData: any) => {
    console.log('کاربر با موفقیت وارد شد:', userData);
    setIsLoggedIn(true);
    setUserData(userData);
    setIsLoginModalOpen(false);
    
    // نمایش پاپ‌آپ خوش آمدید
    setShowWelcome(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 2000);
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    setShowGoodbye(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setUserData(null);
      setIsProfileMenuOpen(false);
      setShowGoodbye(false);
      localStorage.removeItem('userData');
      localStorage.removeItem('isLoggedIn');
    }, 3000);
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* لوگو */}
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">ت</span>
              </div>
              <span className="mr-3 text-xl font-bold text-gray-800">تورینو</span>
            </div>

            {/* منوی دسکتاپ */}
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              <a href="#tours" className="text-gray-700 hover:text-blue-600 transition font-medium">
                رزرو تور
              </a>
              <a href="#hotels" className="text-gray-700 hover:text-blue-600 transition font-medium">
                رزرو هتل
              </a>
              <a href="#tickets" className="text-gray-700 hover:text-blue-600 transition font-medium">
                بلیط
              </a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition font-medium">
                خدمات سفر
              </a>
            </nav>

            {/* دکمه ورود/پروفایل */}
            <div className="hidden md:flex items-center">
              {isLoggedIn ? (
  <div className="relative">
    <button 
      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
      className="flex items-center space-x-2 space-x-reverse border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium"
    >
      {/* آیکن پروفایل */}
      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
        <img 
          src={userData?.profileImage || "/api/placeholder/32/32"} 
          alt="پروفایل"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E";
          }}
        />
      </div>
      <span>پروفایل</span>
    </button>

                  {/* منوی پروفایل */}
                  {isProfileMenuOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 z-50">
                      {/* امتیاز کاربر */}
                      <div className="p-4 border-b border-gray-200 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm text-gray-600">امتیاز شما</div>
                            <div className="text-lg font-bold text-gray-800">۱,۲۵۰</div>
                          </div>
                        </div>
                      </div>

                      {/* آیتم‌های منو */}
                      <div className="p-2">
                        <Link 
            to="/profile" 
            onClick={() => setIsProfileMenuOpen(false)}
            className="w-full text-right px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center justify-between"
          >
            <span>پروفایل</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </Link>
                        
                        <button className="w-full text-right px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
                          <span>سرویس‌ها</span>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </button>
                        
                        <button className="w-full text-right px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition flex items-center justify-between">
                          <span>پشتیبانی</span>
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </button>
                        
                        <button 
                          onClick={handleLogout}
                          className="w-full text-right px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center justify-between"
                        >
                          <span>خروج</span>
                          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={() => setIsLoginModalOpen(true)}
                  className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium"
                >
                  ورود
                </button>
              )}
            </div>

            {/* منوی موبایل */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="منو"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* منوی موبایل */}
          {isMenuOpen && (
            <div className="md:hidden bg-white py-4 border-t">
              <div className="flex flex-col space-y-4">
                <a 
                  href="#tours" 
                  className="text-gray-700 hover:text-blue-600 transition font-medium text-right"
                  onClick={() => setIsMenuOpen(false)}
                >
                  رزرو تور
                </a>
                <a 
                  href="#hotels" 
                  className="text-gray-700 hover:text-blue-600 transition font-medium text-right"
                  onClick={() => setIsMenuOpen(false)}
                >
                  رزرو هتل
                </a>
                <a 
                  href="#tickets" 
                  className="text-gray-700 hover:text-blue-600 transition font-medium text-right"
                  onClick={() => setIsMenuOpen(false)}
                >
                  بلیط
                </a>
                <a 
                  href="#services" 
                  className="text-gray-700 hover:text-blue-600 transition font-medium text-right"
                  onClick={() => setIsMenuOpen(false)}
                >
                  خدمات سفر
                </a>
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  {isLoggedIn ? (
  <Link 
    to="/profile"
    onClick={() => setIsMenuOpen(false)}
    className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium text-center"
  >
    پروفایل
  </Link>
                  ) : (
                    <button 
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium"
                    >
                      ورود
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* پاپ‌آپ خوش آمدید */}
      {showWelcome && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
          خوش آمدید! 🎉
        </div>
      )}

      {/* پاپ‌آپ خداحافظی */}
      {showGoodbye && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-black bg-opacity-50 absolute inset-0"></div>
          <div className="bg-white text-gray-800 px-8 py-6 rounded-2xl shadow-2xl z-10 transform animate-scale-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              
              <p className="text-gray-600">امیدوارم به زودی برگردی! 👋</p>
            </div>
          </div>
        </div>
      )}

      {/* کامپوننت مودال ورود */}
      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default Header;