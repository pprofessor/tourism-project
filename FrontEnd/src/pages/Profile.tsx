import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProfileForm from "../components/ProfileForm";
import ProfileImageUpload from "../components/ProfileImageUpload";
import PaymentHistory from "../components/PaymentHistory";
import UserServices from "../components/UserServices";
import { useTheme } from "../context/ThemeContext";

// انواع داده‌ها برای type safety
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

interface TabConfig {
  id: string;
  label: string;
  icon: string;
  translationKey: string;
}

interface UserStats {
  bookings: number;
  referrals: number;
  points: number;
}

const Profile: React.FC = () => {
  // State management
  const [user, setUser] = useState<UserData>({});
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { theme } = useTheme();
  const { t } = useTranslation();

  // Hooks
  const location = useLocation();

  // Configuration - خارج از کامپوننت برای جلوگیری از recreate
  const TAB_CONFIG: TabConfig[] = useMemo(
    () => [
      {
        id: "profile",
        label: "👤 اطلاعات پروفایل",
        icon: "👤",
        translationKey: "profile.tabs.profile",
      },
      {
        id: "payments",
        label: "💳 تاریخچه پرداخت‌ها",
        icon: "💳",
        translationKey: "profile.tabs.payments",
      },
      {
        id: "services",
        label: "🛎️ سرویس‌های من",
        icon: "🛎️",
        translationKey: "profile.tabs.services",
      },
    ],
    []
  );

  // User stats - با قابلیت چندزبانه
  const userStats: UserStats = useMemo(
    () => ({
      bookings: 4,
      referrals: 0,
      points: 1250,
    }),
    []
  );

  // تابع سانیتایز داده‌های کاربر برای امنیت
  const sanitizeUserData = useCallback((data: any): UserData => {
    return {
      id: typeof data.id === "number" ? data.id : undefined,
      mobile:
        typeof data.mobile === "string"
          ? data.mobile.replace(/[^\d+]/g, "")
          : undefined,
      role: typeof data.role === "string" ? data.role : undefined,
      profileImage:
        typeof data.profileImage === "string" ? data.profileImage : undefined,
      firstName:
        typeof data.firstName === "string"
          ? data.firstName.trim().slice(0, 50)
          : undefined,
      lastName:
        typeof data.lastName === "string"
          ? data.lastName.trim().slice(0, 50)
          : undefined,
      nationalCode:
        typeof data.nationalCode === "string"
          ? data.nationalCode.replace(/[^\d]/g, "").slice(0, 10)
          : undefined,
      passportNumber:
        typeof data.passportNumber === "string"
          ? data.passportNumber.trim().slice(0, 20)
          : undefined,
      address:
        typeof data.address === "string"
          ? data.address.trim().slice(0, 500)
          : undefined,
      userType: ["GUEST", "VERIFIED", "AMBASSADOR"].includes(data.userType)
        ? data.userType
        : "GUEST",
    };
  }, []);

  // اعتبارسنجی URL تصویر
  const isValidImageUrl = useCallback((url: string): boolean => {
    try {
      const parsedUrl = new URL(url);
      return (
        ["http:", "https:"].includes(parsedUrl.protocol) &&
        /\.(jpg|jpeg|png|webp|gif)$/i.test(parsedUrl.pathname)
      );
    } catch {
      return false;
    }
  }, []);

  // Memoized values برای performance
  const userFullName = useMemo(
    () =>
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.mobile || t("profile.guestUser"),
    [user.firstName, user.lastName, user.mobile, t]
  );

  // Effects
  useEffect(() => {
    // بارگذاری ایمن داده‌های کاربر از localStorage
    const loadUserData = async () => {
      try {
        const savedUserData = localStorage.getItem("userData");
        if (savedUserData) {
          const parsedData = JSON.parse(savedUserData);

          // اعتبارسنجی داده‌های حساس قبل از ست کردن
          const sanitizedData = sanitizeUserData(parsedData);
          setUser(sanitizedData);
        }
      } catch (error) {
        console.error(t("profile.errors.loadData"), error);
        // Fallback به داده‌های پیش‌فرض
        setUser({ userType: "GUEST" });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [t, sanitizeUserData]); // اضافه کردن sanitizeUserData به dependencies

  // Hash detection برای تب‌ها
  useEffect(() => {
    const hash = location.hash.replace("#", "");
    if (hash && TAB_CONFIG.some((tab) => tab.id === hash)) {
      setActiveTab(hash);

      // اسکرول به بالا برای UX بهتر
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.hash, TAB_CONFIG]);

  // Event handlers با useCallback
  const handleProfileUpdate = useCallback(
    (updatedData: Partial<UserData>) => {
      const sanitizedData = sanitizeUserData(updatedData);
      const updatedUser = { ...user, ...sanitizedData };

      setUser(updatedUser);

      // ذخیره‌سازی ایمن در localStorage
      try {
        localStorage.setItem("userData", JSON.stringify(updatedUser));
      } catch (error) {
        console.error(t("profile.errors.saveData"), error);
      }
    },
    [user, sanitizeUserData, t]
  );

  const handleImageUpdate = useCallback(
    (imageUrl: string) => {
      console.log("🖼️ آدرس تصویر جدید:", imageUrl);

      setUser((prevUser) => {
        // ساخت آدرس کامل برای ذخیره‌سازی با اعتبارسنجی
        const fullImageUrl = imageUrl.startsWith("http")
          ? imageUrl
          : `http://localhost:8080${imageUrl}`;

        // اعتبارسنجی URL تصویر
        if (!isValidImageUrl(fullImageUrl)) {
          console.error(t("profile.errors.invalidImageUrl"));
          return prevUser;
        }

        const updatedUser = { ...prevUser, profileImage: fullImageUrl };

        try {
          localStorage.setItem("userData", JSON.stringify(updatedUser));
        } catch (error) {
          console.error(t("profile.errors.saveImage"), error);
        }

        return updatedUser;
      });
    },
    [t, isValidImageUrl]
  ); // اضافه کردن isValidImageUrl به dependencies

  const handleTabChange = useCallback(
    (tabId: string) => {
      setActiveTab(tabId);

      // به‌روزرسانی URL بدون reload صفحه (برای UX بهتر)
      window.history.replaceState(null, "", `#${tabId}`);

      // تغییر title صفحه برای سئو
      document.title = `${t("profile.tabs." + tabId)} - ${t(
        "profile.pageTitle"
      )}`;
    },
    [t]
  );

  // Helper functions
  const getUserTypeLabel = useCallback(
    (userType: string = "GUEST"): string => {
      return t(`profile.userTypes.${userType}.label`);
    },
    [t]
  );

  const getUserTypeDescription = useCallback(
    (userType: string = "GUEST"): string => {
      return t(`profile.userTypes.${userType}.description`);
    },
    [t]
  );

  const getUserTypeColor = useCallback((userType: string = "GUEST"): string => {
    const colors: Record<string, string> = {
      GUEST: "bg-yellow-400",
      VERIFIED: "bg-green-500",
      AMBASSADOR: "bg-purple-500",
    };
    return colors[userType] || "bg-yellow-400";
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`min-h-screen transition-colors duration-300 ${
          theme === "dark" ? "bg-gray-900" : "bg-gray-50"
        }`}
        aria-live="polite"
        aria-label={t("profile.loading")}
      >
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div
              className={`rounded-2xl shadow-lg p-8 text-center transition-colors duration-300 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"
                aria-hidden="true"
              ></div>
              <p
                className={`mt-4 transition-colors duration-300 ${
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {t("profile.loading")}
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900" : "bg-gray-50"
      }`}
      itemScope
      itemType="https://schema.org/Person"
    >
      <meta itemProp="name" content={userFullName} />
      {user.mobile && <meta itemProp="telephone" content={user.mobile} />}

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* هدر صفحه پروفایل */}
          <section
            className={`rounded-2xl shadow-lg p-6 mb-6 transition-colors duration-300 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
            aria-labelledby="profile-header"
            itemScope
            itemType="https://schema.org/ProfilePage"
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 space-x-reverse mb-4 md:mb-0">
                <ProfileImageUpload
                  userData={user}
                  onImageUpdate={handleImageUpdate}
                />
                <div>
                  <h1
                    id="profile-header"
                    className={`text-xl font-semibold transition-colors duration-300 ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                    itemProp="name"
                  >
                    {userFullName}
                  </h1>
                  <p
                    className={`transition-colors duration-300 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-600"
                    }`}
                    itemProp="description"
                  >
                    {getUserTypeLabel(user.userType)}
                  </p>
                </div>
              </div>

              <div className="text-center md:text-right">
                <p
                  className={`transition-colors duration-300 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {t("profile.mobileNumber")}
                </p>
                <p
                  className={`font-semibold transition-colors duration-300 ${
                    theme === "dark" ? "text-white" : "text-gray-800"
                  }`}
                >
                  {user.mobile || "-"}
                </p>
              </div>
            </div>
          </section>

          {/* تب‌های navigation */}
          <nav
            className={`rounded-2xl shadow-lg p-2 mb-6 transition-colors duration-300 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
            aria-label={t("profile.tabs.navigation")}
          >
            <div className="flex space-x-2" role="tablist">
              {TAB_CONFIG.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  role="tab"
                  aria-selected={activeTab === tab.id}
                  aria-controls={`tab-${tab.id}`}
                  className={`flex-1 py-3 px-4 rounded-lg text-center transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-md transform scale-105"
                      : theme === "dark"
                      ? "text-gray-300 hover:bg-gray-700 hover:scale-105"
                      : "text-gray-600 hover:bg-gray-100 hover:scale-105"
                  }`}
                >
                  {t(tab.translationKey)}
                </button>
              ))}
            </div>
          </nav>

          {/* محتوای تب‌ها */}
          <div role="tabpanel">
            {activeTab === "profile" && (
              <div
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                id="tab-profile"
              >
                {/* ستون سمت راست - فرم اطلاعات هویتی */}
                <div className="lg:col-span-2">
                  <ProfileForm userData={user} onUpdate={handleProfileUpdate} />
                </div>

                {/* ستون سمت چپ - آمار و اطلاعات */}
                <div className="space-y-6">
                  {/* آمار کاربر */}
                  <section
                    className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                    aria-labelledby="user-stats"
                  >
                    <h3
                      id="user-stats"
                      className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {t("profile.stats.title")}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm transition-colors duration-300 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {t("profile.stats.bookings")}
                        </span>
                        <span
                          className={`font-semibold transition-colors duration-300 ${
                            theme === "dark" ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {userStats.bookings}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm transition-colors duration-300 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {t("profile.stats.referrals")}
                        </span>
                        <span
                          className={`font-semibold transition-colors duration-300 ${
                            theme === "dark" ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {userStats.referrals}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span
                          className={`text-sm transition-colors duration-300 ${
                            theme === "dark" ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {t("profile.stats.points")}
                        </span>
                        <span
                          className={`font-semibold transition-colors duration-300 ${
                            theme === "dark" ? "text-white" : "text-gray-800"
                          }`}
                        >
                          {userStats.points.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* سطح کاربری */}
                  <section
                    className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${
                      theme === "dark" ? "bg-gray-800" : "bg-white"
                    }`}
                    aria-labelledby="user-level"
                  >
                    <h3
                      id="user-level"
                      className={`text-lg font-semibold mb-4 transition-colors duration-300 ${
                        theme === "dark" ? "text-white" : "text-gray-800"
                      }`}
                    >
                      {t("profile.userLevel.title")}
                    </h3>
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div
                        className={`w-3 h-3 rounded-full ${getUserTypeColor(
                          user.userType
                        )}`}
                        aria-hidden="true"
                      ></div>
                      <span
                        className={`transition-colors duration-300 ${
                          theme === "dark" ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {getUserTypeLabel(user.userType)}
                      </span>
                    </div>
                    <p
                      className={`text-sm mt-2 transition-colors duration-300 ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {getUserTypeDescription(user.userType)}
                    </p>
                  </section>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="grid grid-cols-1 gap-6" id="tab-payments">
                <PaymentHistory userId={user.id} />
              </div>
            )}

            {activeTab === "services" && (
              <div className="grid grid-cols-1 gap-6" id="tab-services">
                <UserServices userId={user.id} />
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(Profile);
