import { apiClient } from "./client";
import { AuthResponse, TokenResponse } from "./types";

export interface SignUpData {
  full_name: string;
  email: string;
  mobile: string;
  password: string;
  career_status?: "fresher" | "experienced" | string;
}

export interface LoginData {
  email: string; // or mobile
  password: string;
}

export const authApi = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async login(data: LoginData): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getMe(): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/auth/me", {
      method: "GET",
    });
  },

  async logout(): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>("/auth/logout", {
      method: "POST",
      retryOn401: false,
    });
  },

  async refreshToken(): Promise<TokenResponse> {
    return apiClient<TokenResponse>("/auth/refresh", {
      method: "POST",
      retryOn401: false,
    });
  },

  async googleAuth(payload: { credential?: string; access_token?: string }): Promise<AuthResponse> {
    return apiClient<AuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};

