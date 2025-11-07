// Header.tsx - کد کامل و اصلاح شده
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import LoginModal from "./LoginModal";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../i18n/config";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  // State management
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const [userData, setUserData] = useState<any>(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showGoodbye, setShowGoodbye] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchModalRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCartOpen, setIsCartOpen] = useState(false);

  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const { state: cartState } = useCart();

  // زبان فعلی
  const currentLanguage =
    supportedLanguages[i18n.language as keyof typeof supportedLanguages] ||
    supportedLanguages.fa;

  // تغییر زبان
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLanguageMenuOpen(false);
  };

  // Navigation items با i18n
  const navItems = useMemo(
    () => [
      { href: "#tours", label: t("header.tours") },
      { href: "#hotels", label: t("header.hotels") },
      { href: "#tickets", label: t("header.tickets") },
      { href: "#services", label: t("header.services") },
    ],
    [t]
  );

  // Memoized values برای performance
  const userProfileImage = useMemo(
    () => userData?.profileImage || "/api/placeholder/32/32",
    [userData?.profileImage]
  );

  const fallbackProfileSvg = useMemo(
    () =>
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%236B7280'%3E%3Cpath d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'/%3E%3C/svg%3E",
    []
  );

  // Effects
  useEffect(() => {
    const savedLoginStatus = localStorage.getItem("isLoggedIn");
    const savedUserData = localStorage.getItem("userData");

    if (savedLoginStatus === "true" && savedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(savedUserData));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchModalRef.current &&
        !searchModalRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Event handlers با useCallback برای performance
  const handleLoginSuccess = useCallback((userData: any) => {
    console.log("کاربر با موفقیت وارد شد:", userData);
    setIsLoggedIn(true);
    setUserData(userData);
    setIsLoginModalOpen(false);

    setShowWelcome(true);
    setTimeout(() => {
      setShowWelcome(false);
    }, 2000);

    localStorage.setItem("userData", JSON.stringify(userData));
    localStorage.setItem("isLoggedIn", "true");
  }, []);

  const handleLogout = useCallback(() => {
    setShowGoodbye(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      setUserData(null);
      setIsProfileMenuOpen(false);
      setShowGoodbye(false);
      localStorage.removeItem("userData");
      localStorage.removeItem("isLoggedIn");
    }, 3000);
  }, []);

  const handleProfileMenuToggle = useCallback(() => {
    setIsProfileMenuOpen((prev) => !prev);
  }, []);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCartToggle = useCallback(() => {
    setIsCartOpen(true);
  }, []);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const handleCloseProfileMenu = useCallback(() => {
    setIsProfileMenuOpen(false);
  }, []);

  const handleImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      e.currentTarget.src = fallbackProfileSvg;
    },
    [fallbackProfileSvg]
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    const sanitizedQuery = searchQuery.trim().slice(0, 100);

    if (sanitizedQuery.length < 2) {
      console.warn(t("home.search.validation.minLength"));
      return;
    }

    setIsSearching(true);

    try {
      console.log(t("home.search.logging"), sanitizedQuery);
      // منطق جستجو اینجا اضافه بشه
      // ...
    } catch (error) {
      console.error("خطا در جستجو:", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Profile menu items
  const profileMenuItems = useMemo(
    () => [
      {
        to: "/profile",
        label: t("header.profile"),
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        ),
      },
      {
        to: "/profile#services",
        label: t("header.myServices"),
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        ),
      },
      {
        to: "/support",
        label: t("header.support"),
        icon: (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        ),
      },
    ],
    [t]
  );

  return (
    <>
      <header
        className={`shadow-lg sticky top-0 z-50 transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-white border-b border-gray-700"
            : "bg-white text-gray-800"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* لوگو */}
            <div className="flex items-center">
              {location.pathname === "/" ? (
                // در صفحه اصلی - بدون لینک
                <>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">ت</span>
                  </div>
                  <span className="mr-3 text-xl font-bold text-gray-800">
                    تورینو
                  </span>
                </>
              ) : (
                // در صفحات دیگر - با لینک به صفحه اصلی
                <Link
                  to="/"
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">ت</span>
                  </div>
                  <span className="mr-3 text-xl font-bold text-gray-800">
                    تورینو
                  </span>
                </Link>
              )}
            </div>

            {/* منوی دسکتاپ */}
            <nav className="hidden md:flex items-center space-x-8 space-x-reverse">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`hover:text-blue-600 transition font-medium ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </nav>

            {/* 🔍 این دکمه سرچ رو اینجا اضافه کن */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className={`p-2 transition-colors duration-200 ${
                theme === "dark"
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-600 hover:text-blue-600"
              }`}
              aria-label={t("header.search")}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* آیکن‌های سمت چپ */}
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              {/* سوییچ زبان */}
              <div className="relative">
                <button
                  onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                  className={`flex items-center space-x-2 space-x-reverse p-2 hover:text-blue-600 transition ${
                    theme === "dark" ? "text-gray-300" : "text-gray-700"
                  }`}
                  aria-label="تغییر زبان"
                >
                  <span className="text-sm font-medium">
                    {currentLanguage.code.toUpperCase()}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* منوی زبان */}
                {isLanguageMenuOpen && (
                  <div
                    className={`absolute left-0 mt-2 w-32 rounded-lg shadow-lg border z-50 ${
                      theme === "dark"
                        ? "bg-gray-800 border-gray-700"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    {Object.entries(supportedLanguages).map(([code, lang]) => (
                      <button
                        key={code}
                        onClick={() => changeLanguage(code)}
                        className={`w-full text-right px-4 py-2 hover:bg-gray-100 transition flex items-center justify-between ${
                          i18n.language === code
                            ? theme === "dark"
                              ? "bg-blue-600 text-white"
                              : "bg-blue-50 text-blue-600"
                            : theme === "dark"
                            ? "text-gray-300 hover:bg-gray-700"
                            : "text-gray-700"
                        }`}
                      >
                        <span>{lang.name}</span>
                        <span className="text-xs text-gray-500">
                          {lang.code.toUpperCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* دکمه دارک/لایت مود */}
              <button
                onClick={toggleTheme}
                className={`p-2 transition ${
                  theme === "dark"
                    ? "text-yellow-400 hover:text-yellow-300"
                    : "text-gray-700 hover:text-blue-600"
                }`}
              >
                {theme === "light" ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                )}
              </button>

              {/* آیکن سبد خرید */}
              <button
                onClick={handleCartToggle}
                className={`relative p-2 hover:text-blue-600 transition ${
                  theme === "dark" ? "text-gray-300" : "text-gray-700"
                }`}
                aria-label="سبد خرید"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5.5M7 13l2.5 5.5m0 0L17 21"
                  />
                </svg>
                {cartState.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartState.itemCount}
                  </span>
                )}
              </button>

              {/* دکمه ورود/پروفایل */}
              {isLoggedIn ? (
                <div className="relative">
                  <button
                    onClick={handleProfileMenuToggle}
                    className="flex items-center space-x-2 space-x-reverse border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium"
                  >
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                      <img
                        src={userProfileImage}
                        alt="پروفایل"
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                    <span>{t("header.profile")}</span>
                  </button>

                  {/* منوی پروفایل */}
                  {isProfileMenuOpen && (
                    <div
                      className={`absolute left-0 mt-2 w-64 rounded-2xl shadow-xl border z-50 ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {/* امتیاز کاربر */}
                      <div className="p-4 border-b border-gray-200 text-center">
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            {t("header.yourPoints")}
                            <div
                              className={`text-lg font-bold ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              ۱,۲۵۰
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* آیتم‌های منو */}
                      <div className="p-2">
                        {profileMenuItems.map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            onClick={handleCloseProfileMenu}
                            className={`w-full text-right px-4 py-3 rounded-lg transition flex items-center justify-between ${
                              theme === "dark"
                                ? "text-gray-300 hover:bg-gray-700"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <span>{item.label}</span>
                            <svg
                              className="w-5 h-5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {item.icon}
                            </svg>
                          </Link>
                        ))}

                        <button
                          onClick={handleLogout}
                          className={`w-full text-right px-4 py-3 rounded-lg transition flex items-center justify-between ${
                            theme === "dark"
                              ? "text-red-400 hover:bg-gray-700"
                              : "text-red-600 hover:bg-red-50"
                          }`}
                        >
                          <span>{t("header.logout")}</span>
                          <svg
                            className="w-5 h-5 text-red-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
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
                  {t("header.login")}
                </button>
              )}
            </div>

            {/* منوی موبایل */}
            <button
              className="md:hidden text-gray-700"
              onClick={handleMenuToggle}
              aria-label="منو"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>

          {/* منوی موبایل */}
          {isMenuOpen && (
            <div className="md:hidden bg-white py-4 border-t">
              <div className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    className="text-gray-700 hover:text-blue-600 transition font-medium text-right"
                    onClick={handleCloseMenu}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="flex flex-col space-y-2 pt-4 border-t">
                  {isLoggedIn ? (
                    <Link
                      to="/profile"
                      onClick={handleCloseMenu}
                      className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium text-center"
                    >
                      {t("header.profile")}
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        setIsLoginModalOpen(true);
                        handleCloseMenu();
                      }}
                      className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-600 hover:text-white transition font-medium"
                    >
                      {t("header.login")}
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
                <svg
                  className="w-8 h-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600">{t("common.seeYouSoon")} 👋</p>
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
      {/*   مودال سرچ     */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div
            ref={searchModalRef}
            className={`rounded-lg shadow-xl w-full max-w-2xl mx-4 ${
              theme === "dark" ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="p-4">
              <form onSubmit={handleSearch} className="flex gap-3">
                <input
                  type="text"
                  placeholder={t("home.search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    theme === "dark"
                      ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      : "bg-white border-gray-300 text-gray-800 placeholder-gray-500"
                  }`}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isSearching}
                  className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSearching ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    "🔍"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className={`px-4 py-3 rounded-lg transition ${
                    theme === "dark"
                      ? "bg-gray-600 text-white hover:bg-gray-500"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  ✕
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Header);
