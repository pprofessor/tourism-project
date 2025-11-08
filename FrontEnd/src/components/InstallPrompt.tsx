import React, { useState, useEffect, useRef } from 'react';

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("🔍 InstallPrompt mounted");

    // تست: بعد از 3 ثانیه نمایش بده
    const timer = setTimeout(() => {
      console.log("✅ Showing install prompt");
      setShowPrompt(true);
      // کمی تاخیر برای انیمیشن
      setTimeout(() => setIsVisible(true), 100);
    }, 3000);

    return () => {
      clearTimeout(timer);
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  // تایم‌اوت خودکار 20 ثانیه‌ای - با useRef
  useEffect(() => {
    if (showPrompt && isVisible) {
      // پاک کردن تایمر قبلی اگر وجود دارد
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
      
      autoCloseTimerRef.current = setTimeout(() => {
        console.log("⏰ Auto-closing prompt after 20 seconds");
        setIsVisible(false);
        setTimeout(() => setShowPrompt(false), 300);
      }, 20000); // 20 ثانیه
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [showPrompt, isVisible]);

  const handleInstall = () => {
    console.log("🚀 Install clicked");
    // پاک کردن تایمر خودکار
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    // انیمیشن خروج قبل از بسته شدن
    setIsVisible(false);
    setTimeout(() => {
      setShowPrompt(false);
      alert('برای نصب اپ: منوی مرورگر → Add to Home Screen را انتخاب کنید');
    }, 300);
  };

  const handleDismiss = () => {
    console.log("❌ Dismissed");
    // پاک کردن تایمر خودکار
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }
    // انیمیشن خروج قبل از بسته شدن
    setIsVisible(false);
    setTimeout(() => setShowPrompt(false), 300);
  };

  if (!showPrompt) {
    console.log("❌ Not showing prompt");
    return null;
  }

  console.log("🔄 RENDERING PROMPT - SHOULD BE VISIBLE");

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: `translateX(-50%) ${isVisible ? 'translateY(0)' : 'translateY(-100px)'}`,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '18px 20px',
      zIndex: 9999,
      borderRadius: '12px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
      fontSize: '14px',
      maxWidth: '90%',
      width: '350px',
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      textAlign: 'center'
    }}>
      
      {/* متن اصلی */}
      <div style={{
        marginBottom: '14px',
        padding: '0 8px'
      }}>
        <div style={{ 
          fontWeight: 'bold', 
          fontSize: '15px',
          lineHeight: '1.4'
        }}>
          امکانات بیشتر با نصب اپلیکیشن
        </div>
      </div>

      {/* دکمه‌ها */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center',
        gap: '8px'
      }}>
        <button
          onClick={handleInstall}
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#667eea',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            minWidth: '80px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          نصب
        </button>
        <button
          onClick={handleDismiss}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            backdropFilter: 'blur(10px)',
            minWidth: '80px'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          بعداً
        </button>
      </div>

      {/* نوار تایم‌اوت */}
      <div style={{
        position: 'absolute',
        bottom: '0',
        left: '10px',
        right: '10px',
        height: '3px',
        background: 'rgba(255, 255, 255, 0.3)',
        borderRadius: '0 0 8px 8px',
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          background: 'rgba(255, 255, 255, 0.8)',
          width: '100%',
          animation: 'countdown 20s linear forwards'
        }}></div>
      </div>

      {/* استایل انیمیشن تایم‌اوت */}
      <style>
        {`
          @keyframes countdown {
            from { width: 100%; }
            to { width: 0%; }
          }
        `}
      </style>
    </div>
  );
};

export default InstallPrompt;