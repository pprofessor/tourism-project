import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { authService, AuthResponse } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';

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

const COUNTRIES: Country[] = [
  { code: 'ir', name: 'ایران', flag: 'https://flagcdn.com/w20/ir.png', dialCode: '98+' },
  { code: 'iq', name: 'عراق', flag: 'https://flagcdn.com/w20/iq.png', dialCode: '964+' },
  { code: 'af', name: 'افغانستان', flag: 'https://flagcdn.com/w20/af.png', dialCode: '93+' },
  { code: 'cn', name: 'چین', flag: 'https://flagcdn.com/w20/cn.png', dialCode: '86+' },
  { code: 'ru', name: 'روسیه', flag: 'https://flagcdn.com/w20/ru.png', dialCode: '7+' },
  { code: 'ae', name: 'امارات', flag: 'https://flagcdn.com/w20/ae.png', dialCode: '971+' },
  { code: 'sa', name: 'عربستان', flag: 'https://flagcdn.com/w20/sa.png', dialCode: '966+' },
  { code: 'tr', name: 'ترکیه', flag: 'https://flagcdn.com/w20/tr.png', dialCode: '90+' },
  { code: 'om', name: 'عمان', flag: 'https://flagcdn.com/w20/om.png', dialCode: '968+' },
  { code: 'qa', name: 'قطر', flag: 'https://flagcdn.com/w20/qa.png', dialCode: '974+' },
  { code: 'kw', name: 'کویت', flag: 'https://flagcdn.com/w20/kw.png', dialCode: '965+' },
  { code: 'th', name: 'تایلند', flag: 'https://flagcdn.com/w20/th.png', dialCode: '66+' },
  { code: 'az', name: 'آذربایجان', flag: 'https://flagcdn.com/w20/az.png', dialCode: '994+' },
  { code: 'am', name: 'ارمنستان', flag: 'https://flagcdn.com/w20/am.png', dialCode: '374+' },
  { code: 'fr', name: 'فرانسه', flag: 'https://flagcdn.com/w20/fr.png', dialCode: '33+' },
  { code: 'de', name: 'آلمان', flag: 'https://flagcdn.com/w20/de.png', dialCode: '49+' },
  { code: 'ch', name: 'سوئیس', flag: 'https://flagcdn.com/w20/ch.png', dialCode: '41+' },
  { code: 'jp', name: 'ژاپن', flag: 'https://flagcdn.com/w20/jp.png', dialCode: '81+' }
];


const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  // State management
  const [currentStep, setCurrentStep] = useState<'mobile' | 'verification' | 'password'>('mobile');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userExists, setUserExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country>(COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Validation function
  const validateMobile = useCallback((mobile: string, countryCode: string) => {
    const sanitizedMobile = mobile.replace(/[^\d]/g, '');
    
    if (countryCode === 'ir') {
      const iranRegex = /^9[0-9]{9}$/;
      if (!iranRegex.test(sanitizedMobile)) {
        return { isValid: false, message: t('errors.invalidIranMobile') };
      }
      return { isValid: true, message: '' };
    }
    
    const internationalRegex = /^[0-9]{5,15}$/;
    if (!internationalRegex.test(sanitizedMobile)) {
      return { isValid: false, message: t('errors.invalidInternationalMobile') };
    }
    return { isValid: true, message: '' };
  }, [t]);
  
  // Memoized values برای performance
  const isMobileValid = useMemo(() => 
    validateMobile(mobile, selectedCountry.code), 
    [mobile, selectedCountry.code, validateMobile]
  );

  const modalTitle = useMemo(() => {
    return {
      mobile: t('login.enterMobile'),
      password: t('login.passwordLogin'),
      verification: t('login.verifyMobile')
    }[currentStep];
  }, [currentStep, t]);
  
  // Event handlers با useCallback برای performance
  const handleClose = useCallback(() => {
    setCurrentStep('mobile');
    setMobile('');
    setPassword('');
    setVerificationCode('');
    setUserExists(false);
    setError('');
    setIsCountryDropdownOpen(false);
    onClose();
  }, [onClose]);

  const handleCountrySelect = useCallback((country: Country) => {
    setSelectedCountry(country);
    setIsCountryDropdownOpen(false);
    setError(''); // Clear error when country changes
  }, []);

  const handleMobileChange = useCallback((value: string) => {
    // امنیت: فقط اعداد قبول کن
    const numbersOnly = value.replace(/[^\d]/g, '');
    setMobile(numbersOnly);
    setError(''); // Clear error when typing
  }, []);

  const handleVerificationCodeChange = useCallback((value: string) => {
    const numbersOnly = value.replace(/[^\d]/g, '').slice(0, 6);
    setVerificationCode(numbersOnly);
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleClose]);

  // Auto-focus on input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const mobileInput = document.querySelector('input[type="tel"]') as HTMLInputElement;
        if (mobileInput && currentStep === 'mobile') {
          mobileInput.focus();
        }
      }, 100);
    }
  }, [isOpen, currentStep]);

  // API handlers
  const handleMobileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!isMobileValid.isValid) {
      setError(isMobileValid.message);
      setLoading(false);
      return;
    }
    
    try {
  const result: AuthResponse = await authService.initLogin(mobile);
  
  if (result.success) {
    setUserExists(result.userExists || false);
    
    if (result.userExists) {
      setCurrentStep('password');
    } else {
      const sendCodeResult = await authService.sendVerificationCode(mobile);
      if (sendCodeResult.success) {
        setCurrentStep('verification');
      } else {
        setError(sendCodeResult.message || t('errors.sendCodeError')); 
      }
    }
  } else {
    setError(result.message || t('errors.serverConnection')); 
  }
} catch (err) {
  setError(t('errors.serverConnection')); 
  console.error('Login error:', err);
} finally {
  setLoading(false);
}
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
    setError(t('errors.verificationCodeLength')); 
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
  const result: AuthResponse = await authService.verifyCode(mobile, verificationCode);
  
  if (result.success && result.token && result.user) {
    setPassword('');
    setVerificationCode('');
    onLoginSuccess(result.user);
    handleClose();
  } else {
    setError(result.message || t('errors.invalidVerificationCode')); // این خط
  }
} catch (err) {
  setError(t('errors.verificationError')); // این خط
  console.error('Verification error:', err);
} finally {
  setLoading(false);
}
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!password.trim()) {
    setError(t('errors.enterPassword')); // این خط
    return;
  }
  
  setLoading(true);
  setError('');
  
  try {
    const result: AuthResponse = await authService.loginWithPassword(mobile, password);
    
    if (result.success && result.token && result.user) {
      setPassword('');
      setVerificationCode('');
      onLoginSuccess(result.user);
      handleClose();
    } else {
      setError(result.message || t('errors.invalidPassword')); // این خط
    }
  } catch (err) {
    setError(t('errors.loginError')); // این خط
    console.error('Password login error:', err);
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
      setError(result.message || t('errors.sendCodeError'));
    }
  } catch (err) {
    setError(t('errors.sendCodeError'));
    console.error('Send code error:', err);
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className={`rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100 ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex flex-col items-center p-6 border-b ${
  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
}`}>
  <div className="relative w-full flex justify-center items-center">
    <h2 id="login-modal-title" className={`text-xl font-bold text-center transition-colors duration-300 ${
      theme === 'dark' ? 'text-white' : 'text-gray-800'
    }`}>
      {modalTitle}
    </h2>
    <button 
      onClick={handleClose}
      className={`absolute left-0 transition p-1 rounded-full hover:bg-gray-100 ${
        theme === 'dark' 
          ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' 
          : 'text-gray-500 hover:text-gray-700'
      }`}
      aria-label={t('common.close')}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</div>
        {/* Content */}
        <div className="p-6">
          {/* Error Message */}
          {error && (
            <div 
              className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-center"
              role="alert"
            >
              <svg className="w-4 h-4 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          {/* Mobile Step */}
          {currentStep === 'mobile' && (
            <form onSubmit={handleMobileSubmit} noValidate>
              <div className="mb-6">
                <div className="flex gap-3">
                  {/* Mobile Input */}
                  <div className="flex-1">
                    <input
                      id="mobile-input"
                      type="tel"
                      value={mobile}
                      onChange={(e) => handleMobileChange(e.target.value)}
                       placeholder={t('login.mobilePlaceholder')}
                      className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'border-gray-300 text-gray-800'
                      }`}
                      required
                      aria-describedby="mobile-hint"
                    />
                  </div>

                  {/* Country Selector */}
                  <div className="relative flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                      className={`w-28 h-12 border rounded-lg flex items-center justify-between px-3 hover:border-gray-400 transition ${
                        theme === 'dark' 
                          ? 'bg-gray-700 border-gray-600 hover:border-gray-500' 
                          : 'bg-white border-gray-300'
                      }`}
                      aria-expanded={isCountryDropdownOpen}
                      aria-haspopup="listbox"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-sm transition-colors duration-300 ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {selectedCountry.dialCode}
                        </span>
                        <span className={`w-px h-4 ${
                          theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                        }`}></span>
                        <img 
                          src={selectedCountry.flag} 
                          alt={selectedCountry.name}
                          className="w-5 h-4 object-cover rounded"
                          loading="lazy"
                        />
                      </div>
                      <svg 
  className={`w-4 h-4 transition duration-300 ${
    isCountryDropdownOpen ? 'rotate-180' : ''
  } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}
  fill="none" 
  stroke="currentColor" 
  viewBox="0 0 24 24"
>
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
</svg>
                    </button>

                    {/* Country Dropdown */}
                    {isCountryDropdownOpen && (
                      <div 
                        className={`absolute top-full right-0 mt-1 w-64 max-h-60 border rounded-lg shadow-lg z-50 overflow-y-auto ${
                          theme === 'dark' 
                            ? 'bg-gray-700 border-gray-600' 
                            : 'bg-white border-gray-300'
                        }`}
                        role="listbox"
                      >
                        {COUNTRIES.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            role="option"
                            aria-selected={selectedCountry.code === country.code}
                            className={`w-full text-right px-4 py-2 hover:bg-gray-100 transition flex items-center justify-between ${
                              selectedCountry.code === country.code 
                                ? theme === 'dark' 
                                  ? 'bg-blue-600 text-white' 
                                  : 'bg-blue-50 text-blue-600'
                                : theme === 'dark'
                                ? 'text-gray-300 hover:bg-gray-600'
                                : 'text-gray-700'
                            }`}
                          >
                            <div className="flex items-center gap-2">
  <span className={`text-sm ${
    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
  }`}>
    {country.dialCode}
  </span>
  <span className={`w-px h-4 ${
    theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
  }`}></span>
  <img 
    src={country.flag} 
    alt={country.name}
    className="w-5 h-4 object-cover rounded"
    loading="lazy"
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
  disabled={loading || !isMobileValid.isValid}
  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      {t('login.checking')}
    </>
  ) : (
    t('login.continue')
  )}
</button>
            </form>
          )}

          {/* Password Step */}
          {currentStep === 'password' && userExists && (
            <div>
              <p className={`mb-6 text-center transition-colors duration-300 ${
  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
}`}>
  {t('login.passwordPrompt', { 
    dialCode: selectedCountry.dialCode, 
    mobile: mobile 
  })}<br />
  {t('login.enterYourPassword')}
</p>
<form onSubmit={handlePasswordSubmit} noValidate>
  <div className="mb-6">
    <label htmlFor="password-input" className={`block text-sm font-medium mb-3 transition-colors duration-300 ${
      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
    }`}>
      {t('login.password')}
    </label>
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 text-gray-800'
                    }`}
                    required
                    autoComplete="current-password"
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSendVerificationCode}
                    className={`flex-1 py-3 rounded-lg transition font-medium border ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                  {t('login.sendCode')}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
{t('login.loggingIn')}                        </>
                    ) : (
t('login.login')                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Verification Step */}
          {currentStep === 'verification' && (
            <div>
  <p className={`mb-6 text-center transition-colors duration-300 ${
  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
}`}>
  {t('login.enterCodePrompt1')}<br />
  <strong>{mobile}{' '}{selectedCountry.dialCode.replace('+', '')}{'+'} </strong><br />
  {t('login.enterCodePrompt2')}
</p>
  <form onSubmit={handleVerificationSubmit} noValidate>
    <div className="mb-6">                  <input
                    id="verification-input"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={verificationCode}
                    onChange={(e) => handleVerificationCodeChange(e.target.value)}
                    placeholder="------"
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest transition ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'border-gray-300 text-gray-800'
                    }`}
                    maxLength={6}
                    required
                    autoComplete="one-time-code"
                  />

                </div>
                
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setVerificationCode('');
                      setCurrentStep('mobile');
                    }}
                    className={`flex-1 py-3 rounded-lg transition font-medium border ${
                      theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {t('login.back')}
                  </button>
                  <button
  type="submit"
  disabled={loading || verificationCode.length !== 6}
  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 flex items-center justify-center gap-2"
>
  {loading ? (
    <>
      <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
      </svg>
      {t('login.uploading')}
    </>
  ) : (
    t('login.verify')
  )}
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

export default React.memo(LoginModal);