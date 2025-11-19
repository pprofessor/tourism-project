import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface SetInitialPasswordProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userMobile: string;
}

const SetInitialPassword: React.FC<SetInitialPasswordProps> = ({
  isOpen,
  onClose,
  onSuccess,
  userMobile,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { t } = useTranslation();

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      setNewPassword("");
      setConfirmPassword("");
      setError("");
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      setError(t("changePassword.allFieldsRequired"));
      return;
    }

    if (newPassword.length < 6) {
      setError(t("changePassword.passwordMinLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("changePassword.passwordsNotMatch"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/set-initial-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            mobile: userMobile,
            newPassword: newPassword,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        console.log("✅ Password set successfully");
        // حذف flag از localStorage
        localStorage.removeItem("needsPasswordSetup");
        localStorage.removeItem("userMobileForPassword");
        onSuccess();
        onClose();
      } else {
        setError(result.message || t("changePassword.error"));
      }
    } catch (err) {
      setError(t("changePassword.serverError"));
      console.error("Set password error:", err);
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
      aria-labelledby="set-password-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300">
        <div className="flex flex-col items-center p-6 border-b border-gray-200">
          <div className="relative w-full flex justify-center items-center">
            <h2
              id="set-password-title"
              className="text-xl font-bold text-center text-gray-800"
            >
              {t("changePassword.title")}
            </h2>
            <button
              onClick={onClose}
              className="absolute left-0 p-1 rounded-full hover:bg-gray-100 transition"
              aria-label={t("common.close")}
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          <p className="text-gray-600 mb-6 text-center">
            لطفاً برای حساب کاربری خود یک رمز عبور تعریف کنید
          </p>

          {error && (
            <div
              className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm flex items-center"
              role="alert"
            >
              <svg
                className="w-4 h-4 ml-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("changePassword.newPassword")} *
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t("changePassword.newPasswordPlaceholder")}
                minLength={6}
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {t("changePassword.confirmPassword")} *
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t("changePassword.confirmPasswordPlaceholder")}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  {t("changePassword.changing")}
                </>
              ) : (
                t("changePassword.changeButton")
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetInitialPassword;
