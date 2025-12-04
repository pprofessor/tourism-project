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

export const authMockService = {
  async initLogin(mobile: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'موفق',
      userExists: true
    };
  },

  async sendVerificationCode(mobile: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'کد تایید ارسال شد'
    };
  },

  async verifyCode(mobile: string, code: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'ورود موفق',
      token: 'mock-token-' + Date.now(),
      user: {
        id: 1,
        mobile: mobile,
        role: 'USER'
      }
    };
  },

  async loginWithPassword(mobile: string, password: string): Promise<AuthResponse> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'ورود موفق',
      token: 'mock-token-' + Date.now(),
      user: {
        id: 1,
        mobile: mobile,
        role: 'USER'
      }
    };
  }
};