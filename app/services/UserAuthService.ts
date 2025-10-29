import { AuthUser, LoginCredentials, RegisterData } from "../types";

class UserAuthService {
  private static instance: UserAuthService;
  private baseUrl: string =
    (process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3000/api") +
    "/auth";

  static getInstance(): UserAuthService {
    if (!UserAuthService.instance) {
      UserAuthService.instance = new UserAuthService();
    }
    return UserAuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthUser | null> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success) {
        return data.user;
      } else {
        throw new Error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async register(userData: RegisterData): Promise<AuthUser | null> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (data.success) {
        return data.user;
      } else {
        throw new Error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error("Change password error:", error);
      throw error;
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/check-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error("Check email error:", error);
      return false;
    }
  }
}

export default UserAuthService;
