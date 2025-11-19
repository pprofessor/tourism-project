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

  // تابع برای مدیریت موفقیت‌آمیز لاگین
  const handleLoginSuccess = useCallback((userData: any) => {
    console.log("✅ Login successful in App.tsx:", userData);
    setUserData(userData);
    setShowLoginModal(false);
    
    // بررسی نیاز به تعریف رمز عبور
    setTimeout(() => {
      handlePasswordSetupCheck();
    }, 1000);
  }, []);

  // تابع برای بررسی نیاز به تعریف رمز عبور
  const handlePasswordSetupCheck = useCallback(() => {
    const needsSetup = localStorage.getItem('needsPasswordSetup');
    const mobile = localStorage.getItem('userMobileForPassword');
    
    console.log("🔍 Checking password setup:", { needsSetup, mobile });
    
    if (needsSetup === 'true' && mobile) {
      console.log("🔄 Showing password setup modal for:", mobile);
      setShowPasswordSetup(true);
      setUserMobileForPassword(mobile);
    }
  }, []);

  // تابع برای مدیریت موفقیت‌آمیز تعریف رمز عبور
  const handlePasswordSetupSuccess = useCallback(() => {
    console.log("✅ Password setup completed successfully");
    setShowPasswordSetup(false);
    setUserMobileForPassword("");
    
    // پاک کردن flag از localStorage
    localStorage.removeItem('needsPasswordSetup');
    localStorage.removeItem('userMobileForPassword');
    
    // می‌توانید یک پیام موفقیت نشان دهید
    alert("رمز عبور با موفقیت تعریف شد!");
  }, []);

  // useEffect برای بررسی اولیه نیاز به تعریف رمز عبور
  useEffect(() => {
    // بررسی هنگام لود اولیه اپ
    handlePasswordSetupCheck();
  }, [handlePasswordSetupCheck]);

  return (
    <ThemeProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <InstallPrompt />
            
            {/* Routes اصلی - بدون prop اضافی */}
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

            {/* مودال تعریف رمز عبور اولیه */}
            <SetInitialPassword
              isOpen={showPasswordSetup}
              onClose={() => {
                setShowPasswordSetup(false);
                // اگر کاربر مودال را بست، flag را پاک نکنیم تا دفعه بعد دوباره نمایش داده شود
              }}
              onSuccess={handlePasswordSetupSuccess}
              userMobile={userMobileForPassword}
            />
          </div>
        </Router>
      </CartProvider>
    </ThemeProvider>
  );
}

export default App;