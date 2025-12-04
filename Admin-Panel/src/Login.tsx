import React, { useState, useRef } from "react";

// کامپوننت OTP Input مشابه فرانت اصلی
interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const inputValue = e.target.value.replace(/[^0-9]/g, "");

    if (inputValue) {
      // آپدیت مقدار
      const newValue = value.split("");
      newValue[index] = inputValue;
      onChange(newValue.join(""));

      // اگر مقدار وارد شد، به اینپوت بعدی برو
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      // اگر حذف کردی و اینپوت خالی بود، به اینپوت قبلی برو
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/[^0-9]/g, "")
      .slice(0, length);
    if (pasteData) {
      onChange(pasteData);
      // فوکوس به آخرین اینپوت
      const lastIndex = Math.min(pasteData.length, length - 1);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        direction: "ltr",
      }}
    >
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : undefined}
          disabled={disabled}
          style={{
            width: "40px",
            height: "50px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            fontSize: "20px",
            textAlign: "center",
            fontWeight: "bold",
            backgroundColor: "#fff",
            transition: "all 0.2s",
          }}
        />
      ))}
    </div>
  );
};

const Login: React.FC = () => {
  const [loginMethod, setLoginMethod] = useState<"mobile" | "email" | "otp">(
    "mobile"
  );
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = async () => {
    if (!mobile) {
      setError("شماره موبایل الزامی است");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/send-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setOtpSent(true);
        setError("");
      } else {
        setError(result.message || "خطا در ارسال کد تایید");
      }
    } catch (error) {
      setError("خطای شبکه. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !otpCode) {
      setError("شماره موبایل و کد تایید الزامی هستند");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/verify-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile, code: otpCode }),
        }
      );

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userData", JSON.stringify(result.user));
        window.location.href = "/";
      } else {
        setError(result.message || "کد تایید نامعتبر است");
      }
    } catch (error) {
      setError("خطای شبکه. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("ایمیل و رمز عبور الزامی هستند");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userData", JSON.stringify(result.user));
        window.location.href = "/";
      } else {
        setError(result.message || "ورود ناموفق بود");
      }
    } catch (error) {
      setError("خطای شبکه. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleMobileLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile || !password) {
      setError("شماره موبایل و رمز عبور الزامی هستند");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/api/auth/login-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile, password }),
        }
      );

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("userData", JSON.stringify(result.user));
        window.location.href = "/";
      } else {
        setError(result.message || "ورود ناموفق بود");
      }
    } catch (error) {
      setError("خطای شبکه. لطفا دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    if (loginMethod === "mobile") {
      handleMobileLogin(e);
    } else if (loginMethod === "email") {
      handleEmailLogin(e);
    } else if (loginMethod === "otp") {
      handleOtpLogin(e);
    }
  };

  const resetOtpFlow = () => {
    setOtpSent(false);
    setOtpCode("");
  };

  // کامپوننت ForgotPassword
  const ForgotPassword: React.FC = () => {
    const [step, setStep] = useState<"email" | "verify" | "success">("email");
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fpLoading, setFpLoading] = useState(false);
    const [message, setMessage] = useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);

    const handleRequestReset = async () => {
      if (!email) {
        setMessage({ type: "error", text: "ایمیل الزامی است" });
        return;
      }

      setFpLoading(true);
      setMessage(null);

      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/forgot-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          }
        );

        console.log("Response status:", response.status);
        const result = await response.json();
        console.log("Response data:", result);

        if (result.success) {
          setStep("verify");
          setMessage({
            type: "success",
            text: "کد بازیابی به ایمیل شما ارسال شد",
          });
        } else {
          setMessage({ type: "error", text: result.message });
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setMessage({ type: "error", text: "خطا در ارسال درخواست" });
      } finally {
        setFpLoading(false);
      }
    };

    const handleResetPassword = async () => {
      if (!token || !newPassword || !confirmPassword) {
        setMessage({ type: "error", text: "تمام فیلدها الزامی هستند" });
        return;
      }

      if (newPassword.length < 6) {
        setMessage({
          type: "error",
          text: "رمز عبور باید حداقل ۶ کاراکتر باشد",
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        setMessage({
          type: "error",
          text: "رمز عبور و تکرار آن مطابقت ندارند",
        });
        return;
      }

      setFpLoading(true);
      setMessage(null);

      try {
        const response = await fetch(
          "http://localhost:8080/api/auth/reset-password",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, token, newPassword }),
          }
        );

        const result = await response.json();

        if (result.success) {
          setStep("success");
          setMessage({ type: "success", text: "رمز عبور با موفقیت تغییر کرد" });
        } else {
          setMessage({ type: "error", text: result.message });
        }
      } catch (error) {
        setMessage({ type: "error", text: "خطا در تغییر رمز عبور" });
      } finally {
        setFpLoading(false);
      }
    };

    const handleClose = () => {
      setStep("email");
      setEmail("");
      setToken("");
      setNewPassword("");
      setConfirmPassword("");
      setMessage(null);
      setForgotPasswordOpen(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (step === "email") {
          handleRequestReset();
        } else if (step === "verify") {
          handleResetPassword();
        }
      }
    };

    if (!forgotPasswordOpen) return null;

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
      >
        <div
          style={{
            background: "white",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            width: "100%",
            maxWidth: "400px",
            maxHeight: "90vh",
            overflow: "auto",
          }}
        >
          <h3
            style={{
              textAlign: "center",
              marginBottom: "20px",
              color: "#333",
              direction: "rtl",
            }}
          >
            بازیابی رمز عبور
          </h3>

          {message && (
            <div
              style={{
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "15px",
                backgroundColor:
                  message.type === "success" ? "#d4edda" : "#f8d7da",
                color: message.type === "success" ? "#155724" : "#721c24",
                border: `1px solid ${
                  message.type === "success" ? "#c3e6cb" : "#f5c6cb"
                }`,
                textAlign: "center",
                direction: "rtl",
              }}
            >
              {message.text}
            </div>
          )}

          {step === "email" && (
            <div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  ایمیل حساب کاربری را وارد نمایید
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={fpLoading}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px",
                  }}
                  placeholder="email@example.com"
                />
              </div>
              <p
                style={{
                  fontSize: "14px",
                  color: "#666",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                کد بازیابی به این ایمیل ارسال خواهد شد
              </p>
            </div>
          )}

          {step === "verify" && (
            <div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "15px",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  کد تأیید
                </label>
                <OTPInput
                  value={token}
                  onChange={setToken}
                  length={6}
                  disabled={fpLoading}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  رمز عبور جدید
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={fpLoading}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                  placeholder="حداقل ۶ کاراکتر"
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  تکرار رمز عبور جدید
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={fpLoading}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                  placeholder="تکرار رمز عبور"
                />
              </div>
            </div>
          )}

          {step === "success" && (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: "24px",
                  color: "green",
                  marginBottom: "10px",
                }}
              >
                ✅
              </div>
              <p style={{ color: "#666" }}>
                اکنون می‌توانید با رمز عبور جدید وارد شوید
              </p>
            </div>
          )}

          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              marginTop: "20px",
            }}
          >
            {step !== "success" && (
              <button
                onClick={handleClose}
                disabled={fpLoading}
                style={{
                  padding: "10px 20px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  backgroundColor: "white",
                  cursor: fpLoading ? "not-allowed" : "pointer",
                }}
              >
                انصراف
              </button>
            )}

            {step === "email" && (
              <button
                onClick={handleRequestReset}
                disabled={fpLoading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: fpLoading ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: fpLoading ? "not-allowed" : "pointer",
                }}
              >
                {fpLoading ? "در حال ارسال..." : "ارسال کد بازیابی"}
              </button>
            )}

            {step === "verify" && (
              <button
                onClick={handleResetPassword}
                disabled={fpLoading}
                style={{
                  padding: "10px 20px",
                  backgroundColor: fpLoading ? "#ccc" : "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: fpLoading ? "not-allowed" : "pointer",
                }}
              >
                {fpLoading ? "در حال تغییر..." : "تغییر رمز عبور"}
              </button>
            )}

            {step === "success" && (
              <button
                onClick={() => {
                  handleClose();
                  setForgotPasswordOpen(false);
                }}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#2196F3",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ورود به سیستم
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            background: "white",
            padding: "40px",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            width: "100%",
            maxWidth: "400px",
          }}
        >
          <h2
            style={{ textAlign: "center", marginBottom: "30px", color: "#333" }}
          >
            پنل مدیریت
          </h2>

          {/* انتخاب روش ورود */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                gap: "10px",
                justifyContent: "center",
                marginBottom: "15px",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("mobile");
                  resetOtpFlow();
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor:
                    loginMethod === "mobile" ? "#2196F3" : "#f0f0f0",
                  color: loginMethod === "mobile" ? "white" : "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                موبایل
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("email");
                  resetOtpFlow();
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor:
                    loginMethod === "email" ? "#2196F3" : "#f0f0f0",
                  color: loginMethod === "email" ? "white" : "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                ایمیل
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod("otp");
                  resetOtpFlow();
                }}
                style={{
                  padding: "8px 16px",
                  backgroundColor:
                    loginMethod === "otp" ? "#2196F3" : "#f0f0f0",
                  color: loginMethod === "otp" ? "white" : "#333",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                کد تایید
              </button>
            </div>
          </div>

          {error && (
            <div
              style={{
                color: "red",
                backgroundColor: "#ffe6e6",
                padding: "10px",
                borderRadius: "4px",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* ورود با موبایل */}
            {loginMethod === "mobile" && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    شماره موبایل
                  </label>
                  <input
                    type="text"
                    value={mobile}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/[^0-9]/g, "")
                        .slice(0, 12);
                      setMobile(value);
                    }}
                    required
                    maxLength={12}
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "16px",
                      textAlign: "center",
                      letterSpacing: "2px",
                      fontFamily: "monospace",
                    }}
                    placeholder="989__________"
                  />
                </div>

                <div style={{ marginBottom: "25px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                    placeholder="رمز عبور"
                  />
                </div>
              </>
            )}

            {/* ورود با ایمیل */}
            {loginMethod === "email" && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                    placeholder="email@example.com"
                  />
                </div>

                <div style={{ marginBottom: "25px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    رمز عبور
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "10px",
                      border: "1px solid #ddd",
                      borderRadius: "4px",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                    placeholder="رمز عبور"
                  />
                </div>
              </>
            )}

            {/* ورود با OTP */}
            {loginMethod === "otp" && (
              <>
                <div style={{ marginBottom: "20px" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "5px",
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    شماره موبایل
                  </label>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <input
                      type="text"
                      value={mobile}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/[^0-9]/g, "")
                          .slice(0, 12);
                        setMobile(value);
                      }}
                      required
                      disabled={otpSent}
                      maxLength={12}
                      style={{
                        flex: "1",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        fontSize: "16px",
                        textAlign: "center",
                        letterSpacing: "2px",
                        fontFamily: "monospace",
                      }}
                      placeholder="989__________"
                    />
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || otpSent}
                      style={{
                        padding: "10px 15px",
                        backgroundColor: otpSent ? "#ccc" : "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: otpSent ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {otpSent ? "ارسال شد" : "ارسال کد"}
                    </button>
                  </div>
                </div>

                {otpSent && (
                  <div style={{ marginBottom: "25px" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "15px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      کد تایید
                    </label>
                    <OTPInput
                      value={otpCode}
                      onChange={setOtpCode}
                      length={6}
                      disabled={loading}
                    />
                  </div>
                )}
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: loading ? "#ccc" : "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                cursor: loading ? "not-allowed" : "pointer",
                fontWeight: "bold",
              }}
            >
              {loading ? "در حال ورود..." : "ورود به پنل"}
            </button>
          </form>

          <div style={{ marginTop: "20px", textAlign: "center" }}>
            <button
              onClick={() => setForgotPasswordOpen(true)}
              style={{
                background: "none",
                border: "none",
                color: "#2196F3",
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "14px",
              }}
            >
              بازیابی رمز عبور !
            </button>
          </div>
        </div>
      </div>

      <ForgotPassword />
    </>
  );
};

export default Login;
