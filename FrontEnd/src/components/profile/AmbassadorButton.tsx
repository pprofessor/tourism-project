import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import AmbassadorRegisterForm from "../Ambassador/AmbassadorRegisterForm";

interface AmbassadorButtonProps {
  onRegistrationSuccess?: () => void;
  userId?: number;
}

const AmbassadorButton: React.FC<AmbassadorButtonProps> = ({
  onRegistrationSuccess,
  userId,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showForm, setShowForm] = useState(false);
  const [isAmbassador, setIsAmbassador] = useState(false);
  const [ambassadorStatus, setAmbassadorStatus] = useState<
    "NOT_REGISTERED" | "PENDING" | "APPROVED" | "REJECTED"
  >("NOT_REGISTERED");

  // بارگذاری وضعیت از localStorage هنگام لود کامپوننت
  useEffect(() => {
    const loadAmbassadorStatus = () => {
      try {
        const savedStatus = localStorage.getItem('ambassador_status');
        const savedData = localStorage.getItem('ambassador_data');

        if (savedStatus) {
          const status = savedStatus as "PENDING" | "APPROVED" | "REJECTED";
          setAmbassadorStatus(status);
          setIsAmbassador(status === "PENDING" || status === "APPROVED");
        }

        // همچنین وضعیت را از API بررسی کن
        checkAmbassadorStatus();
      } catch (error) {
        console.error('Error loading ambassador status:', error);
      }
    };

    loadAmbassadorStatus();
  }, []);

  // بررسی وضعیت از API
  const checkAmbassadorStatus = async () => {
    try {
      // این endpoint باید در service تعریف شود
      // const status = await ambassadorService.getCurrentUserAmbassadorStatus();
      // setAmbassadorStatus(status);
    } catch (error) {
      console.error('Failed to check ambassador status:', error);
    }
  };

  const handleSuccess = () => {
    // ذخیره وضعیت در localStorage و state
    setIsAmbassador(true);
    setAmbassadorStatus("PENDING");
    setShowForm(false);

    localStorage.setItem('ambassador_status', 'PENDING');
    localStorage.setItem('ambassador_data', JSON.stringify({
      registeredAt: new Date().toISOString(),
      status: 'PENDING'
    }));

    // فراخوانی callback اگر وجود داشت
    if (onRegistrationSuccess) {
      onRegistrationSuccess();
    }

    // نمایش پیام زیبا به جای alert
    const successMessage = t("profile.ambassador.registrationSuccess") ||
      "درخواست شما با موفقیت ثبت شد و در حال بررسی است!";

    console.log(successMessage);
  };

  if (isAmbassador) {
    return (
      <div
        className={`p-6 rounded-xl border ${isDark
          ? "border-green-800 bg-green-900/20"
          : "border-green-200 bg-green-50"
          }`}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <div
            className={`p-3 rounded-full ${isDark ? "bg-green-900" : "bg-green-100"
              } mb-4`}
          >
            <span className="text-green-500 text-2xl">
              {ambassadorStatus === "APPROVED" ? "✅" : "⏳"}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {ambassadorStatus === "APPROVED"
                ? t("profile.ambassador.verified") || "سفیر تایید شده"
                : t("profile.ambassador.pending") || "در انتظار تایید"
              }
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-md mx-auto">
              {ambassadorStatus === "APPROVED"
                ? t("profile.ambassador.verifiedDescription") ||
                "شما به عنوان سفیر تایید شده‌اید"
                : t("profile.ambassador.pendingDescription") ||
                "درخواست شما در حال بررسی است. نتیجه از طریق پنل کاربری اطلاع‌رسانی خواهد شد."
              }
            </p>
            {ambassadorStatus === "PENDING" && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                {t("profile.ambassador.estimatedTime") || "زمان بررسی: ۲۴ تا ۴۸ ساعت کاری"}
              </p>
            )}
          </div>

          <div className="mt-6">
            {ambassadorStatus === "APPROVED" && (
              <button
                onClick={() => (window.location.href = "/ambassador/dashboard")}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all ${isDark
                  ? "bg-gradient-to-r from-green-700 to-emerald-700 hover:from-green-600 hover:to-emerald-600 text-white"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                  }`}
              >
                {t("profile.ambassador.goToDashboard") || "ورود به پنل سفیر"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`p-6 rounded-xl cursor-pointer transition-all duration-200 mb-4 ${isDark
          ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500 hover:shadow-lg"
          : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-400 hover:shadow-lg"
          }`}
        onClick={() => setShowForm(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-full ${isDark ? "bg-blue-900/30" : "bg-blue-100"
                }`}
            >
              <span className="text-blue-500 text-2xl">⭐</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">
                {t("profile.ambassador.title") || "ثبت‌نام به عنوان سفیر"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t("profile.ambassador.description") ||
                  "با همکاری در پلتفرم تورینو، خدمات گردشگری ارائه دهید و درآمد کسب کنید"}
              </p>
            </div>
          </div>
          <div className="text-blue-500 dark:text-blue-400">
            <span className="text-2xl">→</span>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <div className={`w-3 h-3 rounded-full ${isDark ? "bg-green-500" : "bg-green-400"}`} />
            <div>
              <div className="font-medium">
                {t("profile.ambassador.benefit1") || "درآمد از هر تراکنش"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t("profile.ambassador.benefit1_desc") || "۱۵-۲۵٪ از هر سرویس موفق"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <div className={`w-3 h-3 rounded-full ${isDark ? "bg-green-500" : "bg-green-400"}`} />
            <div>
              <div className="font-medium">
                {t("profile.ambassador.benefit2") || "پشتیبانی ۲۴ ساعته"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t("profile.ambassador.benefit2_desc") || "تیم پشتیبانی همیشه در دسترس"}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 rounded-lg bg-white/50 dark:bg-gray-800/50">
            <div className={`w-3 h-3 rounded-full ${isDark ? "bg-green-500" : "bg-green-400"}`} />
            <div>
              <div className="font-medium">
                {t("profile.ambassador.benefit3") || "تخفیف‌های ویژه"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t("profile.ambassador.benefit3_desc") || "تا ۵۰٪ تخفیف در خدمات گردشگری"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AmbassadorRegisterForm
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
              userId={userId}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AmbassadorButton;