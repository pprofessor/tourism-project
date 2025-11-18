// FrontEnd/src/services/authService.ts
const API_BASE_URL = "http://localhost:8080/api/auth";

export interface AuthResponse {
  success: boolean;
  message: string;
  userExists?: boolean;
  token?: string;
  user?: {
    id: number;
    mobile: string;
    role: string;
    firstName?: string;
    lastName?: string;
    profileImage?: string;
    nationalCode?: string;
    passportNumber?: string;
    address?: string;
    userType?: string;
  };
}

class AuthService {
  private async fetchAPI(endpoint: string, body: any): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`خطا در ارتباط با سرور: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error at ${endpoint}:`, error);
      return {
        success: false,
        message: "خطا در ارتباط با سرور",
      };
    }
  }

  async initLogin(mobile: string): Promise<AuthResponse> {
    return this.fetchAPI("/init-login", { mobile });
  }

  async sendVerificationCode(mobile: string): Promise<AuthResponse> {
    return this.fetchAPI("/send-verification", { mobile });
  }

  async verifyCode(mobile: string, code: string): Promise<AuthResponse> {
    return this.fetchAPI("/verify-code", { mobile, code });
  }

  async loginWithPassword(
    mobile: string,
    password: string
  ): Promise<AuthResponse> {
    return this.fetchAPI("/login-password", { mobile, password });
  }

  async completeRegistration(
    mobile: string,
    userData: {
      username?: string;
      email?: string;
      password?: string;
    }
  ): Promise<AuthResponse> {
    return this.fetchAPI("/complete-registration", { mobile, ...userData });
  }
}

export const authService = new AuthService();
export default authService;
