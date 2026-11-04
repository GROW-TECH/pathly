"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, CandidateProfile, AuthResponse } from "@/lib/api/types";
import { authApi, LoginData, SignUpData } from "@/lib/api/auth";
import { profileApi } from "@/lib/api/profile";

interface AuthContextType {
  user: User | null;
  profile: CandidateProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginData) => Promise<AuthResponse>;
  signUp: (data: SignUpData) => Promise<AuthResponse>;
  loginWithGoogle: (payload: { credential?: string; access_token?: string }) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<CandidateProfile>) => Promise<CandidateProfile>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await authApi.getMe();
      setUser(response.user);
      if (response.profile) {
        setProfile(response.profile);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check and restore session on page mount / refresh
    refreshSession();
  }, [refreshSession]);

  const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await authApi.login(data);
    setUser(response.user);
    if (response.profile) {
      setProfile(response.profile);
    }
    return response;
  };

  const signUp = async (data: SignUpData): Promise<AuthResponse> => {
    const response = await authApi.signUp(data);
    setUser(response.user);
    if (response.profile) {
      setProfile(response.profile);
    }
    return response;
  };

  const loginWithGoogle = async (payload: { credential?: string; access_token?: string }): Promise<AuthResponse> => {
    const response = await authApi.googleAuth(payload);
    setUser(response.user);
    if (response.profile) {
      setProfile(response.profile);
    }
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.warn("Logout error:", err);
    } finally {
      setUser(null);
      setProfile(null);
    }
  };

  const updateProfile = async (data: Partial<CandidateProfile>): Promise<CandidateProfile> => {
    const updated = await profileApi.updateProfile(data);
    setProfile(updated);
    return updated;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        signUp,
        loginWithGoogle,
        logout,
        updateProfile,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

