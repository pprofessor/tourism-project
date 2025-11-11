import React, { useState, useEffect, useRef } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const InstallPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const autoCloseTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      deferredPromptRef.current = e;
      showInstallPrompt();
    };

    const showInstallPrompt = () => {
      const dismissedTime = localStorage.getItem("installPromptDismissed");
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

      if (!dismissedTime || parseInt(dismissedTime) < oneDayAgo) {
        setShowPrompt(true);
        setTimeout(() => setIsVisible(true), 100);
      }
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    // در موبایل همیشه بعد از 3 ثانیه نمایش بده
    const timer = setTimeout(() => {
      showInstallPrompt();
    }, 3000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  useEffect(() => {
    if (showPrompt && isVisible) {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }

      autoCloseTimerRef.current = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => setShowPrompt(false), 300);
      }, 20000);
    }

    return () => {
      if (autoCloseTimerRef.current) {
        clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, [showPrompt, isVisible]);

  const showManualInstallInstructions = () => {
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      alert(
        '📱 برای نصب اپلیکیشن:\n\n۱. منوی کروم (⋮) را باز کنید\n۲. گزینه "Add to Home Screen" را انتخاب کنید\n۳. روی "Add" کلیک کنید\n\nپس از نصب، اپلیکیشن در صفحه اصلی شما قرار می‌گیرد.'
      );
    } else if (isIOS) {
      alert(
        '📱 برای نصب اپلیکیشن:\n\n۱. دکمه Share (□ با ↑) را بزنید\n۲. گزینه "Add to Home Screen" را انتخاب کنید\n۳. روی "Add" در右上 کلیک کنید\n\nپس از نصب، اپلیکیشن در صفحه اصلی شما قرار می‌گیرد.'
      );
    } else {
      alert(
        '📱 برای نصب اپلیکیشن از منوی مرورگر گزینه "Install" یا "Add to Home Screen" را انتخاب کنید.'
      );
    }
  };

  const handleInstall = async () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    // اول سعی کن native prompt رو نمایش بدی
    if (deferredPromptRef.current) {
      try {
        await deferredPromptRef.current.prompt();
        const { outcome } = await deferredPromptRef.current.userChoice;

        if (outcome === "accepted") {
          localStorage.setItem("installPromptAccepted", Date.now().toString());
          // اگر کاربر پذیرفت، پیام موفقیت نشان بده
          alert("✅ اپلیکیشن با موفقیت نصب شد!");
        }

        deferredPromptRef.current = null;
      } catch (error) {
        // اگر خطا خورد، راهنمای دستی نمایش داده شود
        showManualInstallInstructions();
      }
    } else {
      // اگر native prompt موجود نبود، مستقیماً راهنمای دستی نمایش داده شود
      showManualInstallInstructions();
    }

    setIsVisible(false);
    setTimeout(() => setShowPrompt(false), 300);
  };

  const handleDismiss = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
    }

    setIsVisible(false);
    setTimeout(() => {
      setShowPrompt(false);
      localStorage.setItem("installPromptDismissed", Date.now().toString());
    }, 300);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "20px",
        left: "50%",
        transform: `translateX(-50%) ${
          isVisible ? "translateY(0)" : "translateY(-100px)"
        }`,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        padding: "18px 20px",
        zIndex: 9999,
        borderRadius: "12px",
        boxShadow:
          "0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)",
        fontSize: "14px",
        maxWidth: "90%",
        width: "350px",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          marginBottom: "14px",
          padding: "0 8px",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            fontSize: "15px",
            lineHeight: "1.4",
          }}
        >
          امکانات بیشتر با نصب اپلیکیشن
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        <button
          onClick={handleInstall}
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            color: "#667eea",
            border: "none",
            padding: "8px 18px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            backdropFilter: "blur(10px)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            minWidth: "80px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 1)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          نصب
        </button>
        <button
          onClick={handleDismiss}
          style={{
            background: "rgba(255, 255, 255, 0.1)",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s ease",
            backdropFilter: "blur(10px)",
            minWidth: "80px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          بعداً
        </button>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: "0",
          left: "10px",
          right: "10px",
          height: "3px",
          background: "rgba(255, 255, 255, 0.3)",
          borderRadius: "0 0 8px 8px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "rgba(255, 255, 255, 0.8)",
            width: "100%",
            animation: "countdown 20s linear forwards",
          }}
        ></div>
      </div>

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
