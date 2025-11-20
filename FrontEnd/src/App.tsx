import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import { ThemeProvider } from "./context/ThemeContext";
import InstallPrompt from "./components/InstallPrompt";
import LoginModal from "./components/LoginModal";
import SetInitialPassword from "./components/SetInitialPassword";
import "./App.css";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Support from "./pages/Support";

function App() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [userMobileForPassword, setUserMobileForPassword] = useState("");
  const [userData, setUserData] = useState<any>(null);
  const [hasCheckedAfterLogin, setHasCheckedAfterLogin] = useState(false);

  // تابع برای مدیریت موفقیت‌آمیز لاگین
  const handleLoginSuccess = useCallback((userData: any) => {
    setUserData(userData);
    setShowLoginModal(false);
    setHasCheckedAfterLogin(false); // ریست کردن برای چک جدید

    // بررسی نیاز به تعریف رمز عبور بعد از لاگین
    setTimeout(() => {
      handlePasswordSetupCheck(true);
    }, 1000);
  }, []);

  // تابع برای بررسی نیاز به تعریف رمز عبور
  const handlePasswordSetupCheck = useCallback(
    (isAfterLogin = false) => {
      // اگر قبلاً مودال نمایش داده شده، دیگر چک نکن
      if (showPasswordSetup) {
        return;
      }
      if (!isAfterLogin && hasCheckedAfterLogin) {
        return;
      }

      const needsSetup = localStorage.getItem("needsPasswordSetup");
      const mobile = localStorage.getItem("userMobileForPassword");

      if (needsSetup === "true" && mobile && !showPasswordSetup) {
        setShowPasswordSetup(true);
        setUserMobileForPassword(mobile);

        if (isAfterLogin) {
          setHasCheckedAfterLogin(true);
        }
      }
    },
    [showPasswordSetup, hasCheckedAfterLogin]
  );

  // تابع برای مدیریت موفقیت‌آمیز تعریف رمز عبور
  const handlePasswordSetupSuccess = useCallback(() => {
    setShowPasswordSetup(false);
    setUserMobileForPassword("");

    // پاک کردن flag از localStorage
    localStorage.removeItem("needsPasswordSetup");
    localStorage.removeItem("userMobileForPassword");

    // می‌توانید یک پیام موفقیت نشان دهید
    alert("رمز عبور با موفقیت تعریف شد!");
  }, []);

  // تابع برای مدیریت بستن مودال
  const handlePasswordSetupClose = useCallback(() => {
    setShowPasswordSetup(false);
    // پاک کردن localStorage تا با ریفرش دوباره نمایش داده نشود
    localStorage.removeItem("needsPasswordSetup");
    localStorage.removeItem("userMobileForPassword");
  }, []);

  // useEffect برای بررسی اولیه - فقط یک بار
  useEffect(() => {
    // فقط یک بار پس از لود اولیه چک کن (برای مواردی که کاربر قبلاً لاگین کرده)
    const timer = setTimeout(() => {
      handlePasswordSetupCheck(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [handlePasswordSetupCheck]);

  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <InstallPrompt />

            {/* Routes اصلی */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support" element={<Support />} />
            </Routes>

            {/* مودال لاگین */}
            <LoginModal
              isOpen={showLoginModal}
              onClose={() => setShowLoginModal(false)}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;
