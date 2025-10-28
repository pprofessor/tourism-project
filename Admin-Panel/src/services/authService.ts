const API_BASE_URL = 'http://localhost:8083/api/auth';

export const authService = {
  // مرحله ۱: بررسی وجود کاربر
  initLogin: async (mobile: string) => {
    const response = await fetch(`${API_BASE_URL}/init-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobile })
    });
    return await response.json();
  }
};