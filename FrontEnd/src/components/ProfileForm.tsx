// ProfileForm.tsx - نسخه نهایی اصلاح شده
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

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

interface ProfileFormProps {
  userData: UserData;
  onUpdate: (data: any) => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  nationalCode: string;
  passportNumber: string;
  address: string;
}

// اعتبارسنجی فرم
const validateForm = (
  formData: FormData,
  t: any
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // اعتبارسنجی نام
  if (!formData.firstName.trim()) {
    errors.push(t("validation.firstNameRequired"));
  } else if (formData.firstName.length < 2) {
    errors.push(t("validation.firstNameMinLength"));
  }

  // اعتبارسنجی نام خانوادگی
  if (!formData.lastName.trim()) {
    errors.push(t("validation.lastNameRequired"));
  } else if (formData.lastName.length < 2) {
    errors.push(t("validation.lastNameMinLength"));
  }

  // اعتبارسنجی کد ملی (اگر پر شده)
  if (formData.nationalCode && !/^\d{10}$/.test(formData.nationalCode)) {
    errors.push(t("validation.nationalCodeInvalid"));
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const ProfileForm: React.FC<ProfileFormProps> = ({ userData, onUpdate }) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    nationalCode: "",
    passportNumber: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const { t } = useTranslation();

  // تابع مدیریت Tab و Enter
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const form = e.currentTarget.form;
        if (form) {
          const inputs = Array.from(form.elements) as HTMLElement[];
          const currentIndex = inputs.indexOf(e.currentTarget);
          const nextInput = inputs[currentIndex + 1] as HTMLInputElement;
          nextInput?.focus();
        }
      }
    },
    []
  );

  // پر کردن فرم با داده‌های کاربر
  const initialFormData = useMemo(
    (): FormData => ({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      nationalCode: userData.nationalCode || "",
      passportNumber: userData.passportNumber || "",
      address: userData.address || "",
    }),
    [userData]
  );

  useEffect(() => {
    setFormData(initialFormData);
  }, [initialFormData]);

  // بررسی سطح کاربر
  const checkUserLevel = useCallback(async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(t("profileForm.userLevelError"), error);
    }
  }, [t]);

  // مدیریت تغییرات input
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      // اعتبارسنجی بلادرنگ برای کد ملی
      if (name === "nationalCode" && value && !/^\d*$/.test(value)) {
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // پاک کردن خطاها هنگام تایپ
      if (validationErrors.length > 0) {
        setValidationErrors([]);
      }
      if (message) {
        setMessage(null);
      }
    },
    [validationErrors.length, message]
  );

  // مدیریت ارسال فرم
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // اعتبارسنجی فرم
      const validation = validateForm(formData, t);
      if (!validation.isValid) {
        setValidationErrors(validation.errors);
        setMessage({
          type: "error",
          text: t("validation.formErrors"),
        });
        return;
      }

      setLoading(true);
      setMessage(null);
      setValidationErrors([]);

      // ارسال به بک‌اند برای ذخیره در دیتابیس

      try {
        const updateResponse = await fetch(
          `http://localhost:8080/api/users/${userData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              firstName: formData.firstName,
              lastName: formData.lastName,
              nationalCode: formData.nationalCode,
              passportNumber: formData.passportNumber,
              address: formData.address,
            }),
          }
        );

        if (!updateResponse.ok) {
          throw new Error("خطا در ذخیره اطلاعات در سرور");
        }

        const updatedUser = await updateResponse.json();

        // فراخوانی callback والد با حفظ داده‌های موجود
        const updatedData = {
          ...userData,
          ...formData,
        };

        onUpdate(updatedData);

        // نمایش پیام موفقیت
        setMessage({
          type: "success",
          text: t("profileForm.saveSuccess"),
        });

        // بررسی سطح کاربر
        await checkUserLevel();
      } catch (error) {
        console.error("❌ خطا در آپدیت پروفایل:", error);
        setMessage({
          type: "error",
          text: t("profileForm.saveError"),
        });
      } finally {
        setLoading(false);
      }
    },
    [formData, onUpdate, t, checkUserLevel, userData]
  );

  // کلاس‌های شرطی برای تم
  const inputClasses = useMemo(
    () =>
      "w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200",
    []
  );

  const labelClasses = useMemo(
    () => "block text-sm font-medium text-gray-700 mb-2",
    []
  );

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6"
      role="form"
      aria-labelledby="profile-form-title"
    >
      <h3
        id="profile-form-title"
        className="text-xl font-bold text-gray-800 mb-6"
      >
        {t("profileForm.title")}
      </h3>

      {/* نمایش پیام‌ها */}
      {message && (
        <div
          className={`p-3 rounded-lg mb-4 ${
            message.type === "success"
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
          }`}
          role="alert"
          aria-live="polite"
        >
          {message.text}
        </div>
      )}

      {/* نمایش خطاهای اعتبارسنجی */}
      {validationErrors.length > 0 && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
          role="alert"
          aria-live="assertive"
        >
          <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* نام */}
          <div>
            <label htmlFor="firstName" className={labelClasses}>
              {t("profileForm.firstName")} *
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={inputClasses}
              placeholder={t("profileForm.firstNamePlaceholder")}
              required
              aria-required="true"
              minLength={2}
              maxLength={50}
            />
          </div>

          {/* نام خانوادگی */}
          <div>
            <label htmlFor="lastName" className={labelClasses}>
              {t("profileForm.lastName")} *
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={inputClasses}
              placeholder={t("profileForm.lastNamePlaceholder")}
              required
              aria-required="true"
              minLength={2}
              maxLength={50}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* کد ملی */}
          <div>
            <label htmlFor="nationalCode" className={labelClasses}>
              {t("profileForm.nationalCode")}
            </label>
            <input
              id="nationalCode"
              type="text"
              name="nationalCode"
              value={formData.nationalCode}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={inputClasses}
              placeholder={t("profileForm.nationalCodePlaceholder")}
              maxLength={10}
              pattern="\d{10}"
              inputMode="numeric"
            />
          </div>

          {/* شماره پاسپورت */}
          <div>
            <label htmlFor="passportNumber" className={labelClasses}>
              {t("profileForm.passportNumber")}
            </label>
            <input
              id="passportNumber"
              type="text"
              name="passportNumber"
              value={formData.passportNumber}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={inputClasses}
              placeholder={t("profileForm.passportPlaceholder")}
              maxLength={20}
            />
          </div>
        </div>

        {/* آدرس */}
        <div>
          <label htmlFor="address" className={labelClasses}>
            {t("profileForm.address")}
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={3}
            className={`${inputClasses} resize-none`}
            placeholder={t("profileForm.addressPlaceholder")}
            maxLength={500}
          />
        </div>

        {/* دکمه ذخیره */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={
              loading ? t("profileForm.saving") : t("profileForm.saveButton")
            }
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
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
                {t("profileForm.saving")}
              </>
            ) : (
              t("profileForm.saveButton")
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default React.memo(ProfileForm);
