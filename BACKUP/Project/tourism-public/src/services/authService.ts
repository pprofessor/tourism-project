const API_BASE_URL = 'http://localhost:8083/api/auth';

export interface AuthResponse {
  success: boolean;
  message: string;
  userExists?: boolean;
  token?: string;
  user?: {
    id: number;
    mobile: string;
    role: string;
  };
}

export const authService = {
  // مرحله ۱: بررسی شماره موبایل
  async initLogin(mobile: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/init-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      if (!response.ok) {
        throw new Error('خطا در ارتباط با سرور');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in initLogin:', error);
      return {
        success: false,
        message: 'خطا در ارتباط با سرور'
      };
    }
  },

  // مرحله ۲: ارسال کد تایید
  async sendVerificationCode(mobile: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      if (!response.ok) {
        throw new Error('خطا در ارسال کد تایید');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in sendVerificationCode:', error);
      return {
        success: false,
        message: 'خطا در ارسال کد تایید'
      };
    }
  },

  // مرحله ۳: تأیید کد
  async verifyCode(mobile: string, code: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, code }),
      });

      if (!response.ok) {
        throw new Error('خطا در تأیید کد');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in verifyCode:', error);
      return {
        success: false,
        message: 'خطا در تأیید کد'
      };
    }
  },

  // مرحله ۴: ورود با رمز عبور
  async loginWithPassword(mobile: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, password }),
      });

      if (!response.ok) {
        throw new Error('خطا در ورود');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in loginWithPassword:', error);
      return {
        success: false,
        message: 'خطا در ورود'
      };
    }
  }
};