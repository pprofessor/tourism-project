import React, { useState } from "react";
import { useTranslation } from "react-i18next";

interface ChangePasswordProps {
  userId?: number;
}

const ChangePassword: React.FC<ChangePasswordProps> = ({ userId }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({
        type: "error",
        text: t("changePassword.allFieldsRequired"),
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: t("changePassword.passwordMinLength"),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: t("changePassword.passwordsNotMatch"),
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${userId}/change-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setMessage({
          type: "success",
          text: t("changePassword.success"),
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage({
          type: "error",
          text: result.message || t("changePassword.error"),
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: t("changePassword.serverError"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">
        {t("changePassword.title")}
      </h3>

      {message && (
        <div
          className={`p-3 rounded-lg mb-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="currentPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {t("changePassword.currentPassword")} *
          </label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t("changePassword.currentPasswordPlaceholder")}
            required
          />
        </div>

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
  );
};

export default ChangePassword;
