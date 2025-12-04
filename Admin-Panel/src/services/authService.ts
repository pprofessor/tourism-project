const API_BASE_URL = "http://localhost:8080/api/auth";

export const authService = {
  // مرحله ۱: بررسی وجود کاربر
  initLogin: async (mobile: string) => {
    const response = await fetch(`${API_BASE_URL}/init-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });
    return await response.json();
  },

  // مرحله ۲: ارسال کد تایید
  sendVerification: async (mobile: string) => {
    const response = await fetch(`${API_BASE_URL}/send-verification`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile }),
    });
    return await response.json();
  },

  // مرحله ۳: تایید کد
  verifyCode: async (mobile: string, code: string) => {
    const response = await fetch(`${API_BASE_URL}/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, code }),
    });
    return await response.json();
  },

  // ورود با رمز عبور
  loginWithPassword: async (mobile: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/login-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mobile, password }),
    });
    return await response.json();
  },
};
