import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../context/ThemeContext";
import AmbassadorRegisterForm from "../Ambassador/";

interface AmbassadorButtonProps {
  onRegistrationSuccess?: () => void;
}

const AmbassadorButton: React.FC<AmbassadorButtonProps> = ({
  onRegistrationSuccess,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [showForm, setShowForm] = useState(false);
  const [isAmbassador, setIsAmbassador] = useState(false);

  const handleSuccess = () => {
    setIsAmbassador(true);
    setShowForm(false);

    // فراخوانی callback اگر وجود داشت
    if (onRegistrationSuccess) {
      onRegistrationSuccess();
    }

    alert(
      t("profile.ambassador.registrationSuccess") ||
        "درخواست شما با موفقیت ثبت شد و در حال بررسی است!"
    );
  };

  if (isAmbassador) {
    return (
      <div
        className={`p-4 rounded-xl border ${
          isDark
            ? "border-green-800 bg-green-900/20"
            : "border-green-200 bg-green-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-full ${
                isDark ? "bg-green-900" : "bg-green-100"
              }`}
            >
              <span className="text-green-500">✓</span>
            </div>
            <div>
              <h3 className="font-semibold">
                {t("profile.ambassador.verified") || "سفیر تایید شده"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("profile.ambassador.verifiedDescription") ||
                  "شما به عنوان سفیر تایید شده‌اید"}
              </p>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/ambassador/dashboard")}
            className={`px-4 py-2 rounded-lg ${
              isDark
                ? "bg-gray-800 hover:bg-gray-700"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {t("profile.ambassador.goToDashboard") || "ورود به پنل سفیر"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className={`p-6 rounded-xl cursor-pointer transition-all duration-200 mb-4 ${
          isDark
            ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700 hover:border-blue-500"
            : "bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:border-blue-300"
        }`}
        onClick={() => setShowForm(true)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`p-3 rounded-full ${
                isDark ? "bg-blue-900/30" : "bg-blue-100"
              }`}
            >
              <span className="text-blue-500 text-xl">⭐</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {t("profile.ambassador.title") || "ثبت‌نام به عنوان سفیر"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t("profile.ambassador.description") ||
                  "همکاری با ما و کسب درآمد از خدمات گردشگری"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isDark ? "bg-green-500" : "bg-green-400"
              }`}
            ></span>
            <span className="text-sm">
              {t("profile.ambassador.benefit1") || "درآمد از هر تراکنش"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isDark ? "bg-green-500" : "bg-green-400"
              }`}
            ></span>
            <span className="text-sm">
              {t("profile.ambassador.benefit2") || "پشتیبانی ۲۴ ساعته"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`w-2 h-2 rounded-full ${
                isDark ? "bg-green-500" : "bg-green-400"
              }`}
            ></span>
            <span className="text-sm">
              {t("profile.ambassador.benefit3") || "تخفیف‌های ویژه"}
            </span>
          </div>
        </div>
      </div>

      {showForm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowForm(false)}
        >
          <div
            className="w-full max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AmbassadorRegisterForm
              onSuccess={handleSuccess}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AmbassadorButton;
