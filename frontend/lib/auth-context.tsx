"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, User, AuthResponse } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  loginWithGoogle: (googleToken: string) => Promise<void>;
  loginWithPhone: (phone: string, otpCode: string) => Promise<void>;
  updateUser: (updatedUser: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setIsLoading(false);
  }, []);

  const saveAuth = (authResponse: AuthResponse) => {
    localStorage.setItem('access_token', authResponse.access_token);
    localStorage.setItem('user', JSON.stringify(authResponse.user));
    setToken(authResponse.access_token);
    setUser(authResponse.user);
  };

  const login = async (email: string, password: string) => {
    const response = await api.login({ email, password });
    saveAuth(response);
  };

  const register = async (email: string, password: string, fullName: string) => {
    const response = await api.register({
      email,
      password,
      full_name: fullName,
      auth_provider: 'email',
    });
    saveAuth(response);
  };

  const loginWithGoogle = async (googleToken: string) => {
    const response = await api.googleAuth(googleToken);
    saveAuth(response);
  };

  const loginWithPhone = async (phone: string, otpCode: string) => {
    const response = await api.verifyOTP(phone, otpCode);
    saveAuth(response);
  };

  const updateUser = (updatedUser: User) => {
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        register,
        loginWithGoogle,
        loginWithPhone,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
