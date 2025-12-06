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
import ChangePassword from "../components/ChangePassword";
import SetInitialPassword from "../components/SetInitialPassword";
import AmbassadorButton from "../components/profile/AmbassadorButton";

// انواع داده‌ها برای type safety
interface UserData {
  id?: number;
  mobile?: string;
  role?: string;
  email?: string;
  profileImage?: string;
  firstName?: string;
  lastName?: string;
  nationalCode?: string;
  passportNumber?: string;
  address?: string;
  userType?: string;
  hasPassword?: boolean;
  countryCode?: string; // اضافه کردن این خط
  mobileNumber?: string;
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
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);

  // Hooks
  const location = useLocation();

  const TAB_CONFIG: TabConfig[] = useMemo(
    () => [
      {
        id: "profile",
        label: "👤",
        icon: "👤",
        translationKey: "profile.tabs.profile",
      },
      {
        id: "payments",
        label: "💳",
        icon: "💳",
        translationKey: "profile.tabs.payments",
      },
      {
        id: "services",
        label: "🛎️",
        icon: "🛎️",
        translationKey: "profile.tabs.services",
      },
      {
        id: "ambassador",
        label: "⭐", // آیکن ستاره
        icon: "⭐",
        translationKey: "profile.tabs.ambassador",
      },
    ],
    []
  );

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
      hasPassword:
        typeof data.hasPassword === "boolean" ? data.hasPassword : false, // اضافه کردن این خط
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
        : t("profile.completeProfile"),
    [user.firstName, user.lastName, t]
  );

  // Effects
  useEffect(() => {
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
  }, [t, sanitizeUserData]);

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
                  {user.countryCode && user.mobileNumber
                    ? `+${user.countryCode} ${user.mobileNumber}`
                    : user.mobile
                    ? `${user.mobile.slice(2)} ${user.mobile.slice(0, 2)}+`
                    : " "}
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
                  <span>{tab.icon}</span>
                  <span>{t(tab.translationKey)}</span>{" "}
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
                <div className="lg:col-span-2 space-y-6">
                  <ProfileForm userData={user} onUpdate={handleProfileUpdate} />

                  {/* هشدار تعریف رمز عبور */}
                  {!user.hasPassword && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 space-x-reverse">
                          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                          <div>
                            <h4 className="font-semibold text-red-800">
                              توجه: رمز عبور تعریف نشده است
                            </h4>
                            <p className="text-red-600 text-sm mt-1">
                              برای امنیت بیشتر حساب کاربری، لطفاً یک رمز عبور
                              تعریف کنید.
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPasswordSetup(true)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-medium text-sm"
                        >
                          تعریف رمز عبور
                        </button>
                      </div>
                    </div>
                  )}

                  {/* بخش تغییر رمز عبور (فقط برای کاربران با رمز) */}
                  {user.hasPassword && <ChangePassword userId={user.id} />}
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
                  {/* تبلیغ تشویقی سفیر - فقط برای کاربران VERIFIED */}
                  {user.userType === "VERIFIED" && (
                    <section
                      className={`rounded-2xl shadow-lg p-6 transition-colors duration-300 ${
                        theme === "dark" ? "bg-gray-800" : "bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-3 rounded-full ${
                              theme === "dark"
                                ? "bg-yellow-900/30"
                                : "bg-yellow-100"
                            }`}
                          >
                            <span className="text-yellow-500 text-xl">⭐</span>
                          </div>
                          <div>
                            <h4 className="font-semibold">
                              سفیر شوید، درآمد کسب کنید!
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              با ارائه خدمات گردشگری درآمدزایی کنید
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleTabChange("ambassador")}
                          className={`px-4 py-2 rounded-lg ${
                            theme === "dark"
                              ? "bg-yellow-700 hover:bg-yellow-600"
                              : "bg-yellow-500 hover:bg-yellow-400"
                          } text-white font-semibold`}
                        >
                          مشاهده
                        </button>
                      </div>
                    </section>
                  )}
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

            {activeTab === "ambassador" && (
              <div className="grid grid-cols-1 gap-6" id="tab-ambassador">
                {/* اینجا صفحه سفیر را ایجاد می‌کنیم */}
                {user.userType === "AMBASSADOR" ? (
                  // کاربر قبلاً سفیر شده
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🎉</div>
                    <h3 className="text-2xl font-bold mb-2">
                      شما یک سفیر هستید!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      به پنل مدیریت سفیران خوش آمدید.
                    </p>
                    <button
                      onClick={() =>
                        (window.location.href = "/ambassador/dashboard")
                      }
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:opacity-90 transition"
                    >
                      ورود به پنل سفیر
                    </button>
                  </div>
                ) : (
                  // کاربر هنوز سفیر نشده
                  <div>
                    <AmbassadorButton />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
      <SetInitialPassword
        isOpen={showPasswordSetup}
        onClose={() => setShowPasswordSetup(false)}
        onSuccess={() => {
          setShowPasswordSetup(false);
          // به‌روزرسانی وضعیت کاربر در state
          setUser((prev) => ({ ...prev, hasPassword: true }));
          // به‌روزرسانی localStorage
          const userData = JSON.parse(localStorage.getItem("userData") || "{}");
          userData.hasPassword = true;
          localStorage.setItem("userData", JSON.stringify(userData));
        }}
        userMobile={user.mobile || ""}
      />
    </div>
  );
};

export default React.memo(Profile);
