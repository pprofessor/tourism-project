import React, { useState } from 'react';
import { authService, AuthResponse } from '../services/authService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (userData: any) => void;
}

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [currentStep, setCurrentStep] = useState<'mobile' | 'verification' | 'password'>('mobile');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    code: 'ir',
    name: 'ایران',
    flag: 'https://flagcdn.com/w20/ir.png',
    dialCode: '+98'
  });
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const countries: Country[] = [
    { code: 'ir', name: 'ایران', flag: 'https://flagcdn.com/w20/ir.png', dialCode: '+98' },
    { code: 'iq', name: 'عراق', flag: 'https://flagcdn.com/w20/iq.png', dialCode: '+964' },
    { code: 'af', name: 'افغانستان', flag: 'https://flagcdn.com/w20/af.png', dialCode: '+93' },
    { code: 'cn', name: 'چین', flag: 'https://flagcdn.com/w20/cn.png', dialCode: '+86' },
    { code: 'ru', name: 'روسیه', flag: 'https://flagcdn.com/w20/ru.png', dialCode: '+7' },
    { code: 'ae', name: 'امارات', flag: 'https://flagcdn.com/w20/ae.png', dialCode: '+971' },
    { code: 'sa', name: 'عربستان', flag: 'https://flagcdn.com/w20/sa.png', dialCode: '+966' },
    { code: 'tr', name: 'ترکیه', flag: 'https://flagcdn.com/w20/tr.png', dialCode: '+90' },
    { code: 'om', name: 'عمان', flag: 'https://flagcdn.com/w20/om.png', dialCode: '+968' },
    { code: 'qa', name: 'قطر', flag: 'https://flagcdn.com/w20/qa.png', dialCode: '+974' },
    { code: 'kw', name: 'کویت', flag: 'https://flagcdn.com/w20/kw.png', dialCode: '+965' },
    { code: 'th', name: 'تایلند', flag: 'https://flagcdn.com/w20/th.png', dialCode: '+66' },
    { code: 'az', name: 'آذربایجان', flag: 'https://flagcdn.com/w20/az.png', dialCode: '+994' },
    { code: 'am', name: 'ارمنستان', flag: 'https://flagcdn.com/w20/am.png', dialCode: '+374' },
    { code: 'fr', name: 'فرانسه', flag: 'https://flagcdn.com/w20/fr.png', dialCode: '+33' },
    { code: 'de', name: 'آلمان', flag: 'https://flagcdn.com/w20/de.png', dialCode: '+49' },
    { code: 'ch', name: 'سوئیس', flag: 'https://flagcdn.com/w20/ch.png', dialCode: '+41' },
    { code: 'jp', name: 'ژاپن', flag: 'https://flagcdn.com/w20/jp.png', dialCode: '+81' }
  ];

  const validateMobile = (mobile: string, countryCode: string) => {
  if (countryCode === 'ir') {
    // برای ایران: باید 10 رقم، بدون صفر، و با 9 شروع شود
    const iranRegex = /^9[0-9]{9}$/;
    return iranRegex.test(mobile);
  }
  return mobile.length >= 5; // برای سایر کشورها حداقل 5 رقم
  };

  if (!isOpen) return null;

  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // اعتبارسنجی شماره موبایل
    if (!validateMobile(mobile, selectedCountry.code)) {
      if (selectedCountry.code === 'ir') {
        setError('شماره موبایل ایران باید 10 رقمی، بدون صفر و با عدد 9 شروع شود');
      } else {
        setError('شماره موبایل معتبر نیست');
      }
      setLoading(false);
      return;
    }
    
    try {
      const result: AuthResponse = await authService.initLogin(mobile);
      
      console.log('🔍 پاسخ سرور:', result);
      console.log('📱 userExists:', result.userExists);

      if (result.success) {
        setUserExists(result.userExists || false);
        
        if (result.userExists) {
          setCurrentStep('password');
        } else {
          const sendCodeResult = await authService.sendVerificationCode(mobile);
          if (sendCodeResult.success) {
            setCurrentStep('verification');
          } else {
            setError(sendCodeResult.message);
          }
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('خطا در ارتباط با سرور');
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result: AuthResponse = await authService.verifyCode(mobile, verificationCode);
      
      if (result.success && result.token && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('خطا در تأیید کد');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const result: AuthResponse = await authService.loginWithPassword(mobile, password);
      
      if (result.success && result.token && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      const result: AuthResponse = await authService.sendVerificationCode(mobile);
      
      if (result.success) {
        setCurrentStep('verification');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('خطا در ارسال کد تایید');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
  setCurrentStep('mobile'); // ✅ همیشه به مرحله اول برگرد
  setMobile('');
  setPassword('');
  setVerificationCode('');
  setUserExists(false);
  setError('');
  setIsCountryDropdownOpen(false);
  onClose();
};

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">
            {currentStep === 'mobile' && ' لطفا شماره بدید !'}
            {currentStep === 'password' && 'ورود با رمز عبور'}
            {currentStep === 'verification' && 'تایید شماره موبایل'}
          </h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {currentStep === 'mobile' && (
            <form onSubmit={handleMobileSubmit}>
              <div className="mb-4">
  <label className="block text-gray-700 text-sm font-medium mb-2">
   شماره موبایل (بدون صفر) 
  </label>
  <div className="flex space-x-2 justify-center items-center">
    <input
      type="tel"
      value={mobile}
      onChange={(e) => setMobile(e.target.value)}
      placeholder={selectedCountry.code === 'ir' ? "9xxxxxxxxx (بدون صفر)" : "شماره موبایل"}
      className="flex-[0.85] p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required
    />

    {/* انتخاب کننده کشور */}
    <div className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
        className="w-28 h-12 border border-gray-300 rounded-lg flex items-center justify-between px-3 hover:border-gray-400 transition"
      >
        <div className="flex items-center space-x-1">
          <span className="text-sm text-gray-600">{selectedCountry.dialCode.replace('+', '')}</span>
          <span className="text-sm text-gray-600 ml-1">+</span>
          <span className="w-px h-4 bg-gray-300 mx-0.5"></span>
          <img 
            src={selectedCountry.flag} 
            alt={selectedCountry.name}
            className="w-5 h-4 object-cover rounded"
          />
        </div>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isCountryDropdownOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

  {isCountryDropdownOpen && (
    <div className="absolute top-full right-0 mt-1 w-64 max-h-60 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-y-auto">
      {countries.map((country) => (
        <button
          key={country.code}
          type="button"
          onClick={() => handleCountrySelect(country)}
          className={`w-full text-right px-4 py-2 hover:bg-gray-100 transition flex items-center justify-between ${
            selectedCountry.code === country.code ? 'bg-blue-50 text-blue-600' : ''
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 ml-1">+</span>
            <span className="text-sm text-gray-600">{country.dialCode.replace('+', '')}</span>
            <span className="w-px h-4 bg-gray-300 mx-1"></span>
            <img 
              src={country.flag} 
              alt={country.name}
              className="w-5 h-4 object-cover rounded"
            />
          </div>
          <span className="text-sm">{country.name}</span>
        </button>
      ))}
    </div>
  )}
</div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading || !validateMobile(mobile, selectedCountry.code)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'در حال بررسی...' : 'ادامه'}
              </button>
            </form>
          )}

          {currentStep === 'password' && userExists && (
            <div>
              <p className="text-gray-600 mb-4">
                برای شماره {selectedCountry.dialCode} {mobile} رمز عبور خود را وارد کنید
              </p>
              <form onSubmit={handlePasswordSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="flex space-x-3 space-x-reverse">
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
                  >
                    ورود با کد تایید
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {loading ? 'در حال ورود...' : 'ورود'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {currentStep === 'verification' && (
            <div>
              <p className="text-gray-600 mb-4">
                کد تایید به شماره  {mobile} {selectedCountry.dialCode} ارسال شد
              </p>
              <form onSubmit={handleVerificationSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    کد تایید
                  </label>
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="xxxxxx"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl"
                    maxLength={6}
                    required
                  />
                </div>
                
                <div className="flex space-x-3 space-x-reverse">
                  <button
  type="button"
  onClick={() => {
    setVerificationCode(''); // ✅ این خط را اضافه کنید
    setCurrentStep('mobile');
  }}
  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-medium"
>
                    بازگشت
                  </button>
                  <button
                    type="submit"
                    disabled={loading || verificationCode.length !== 6}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {loading ? 'در حال تأیید...' : 'تأیید'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;