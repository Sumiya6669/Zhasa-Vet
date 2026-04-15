import React, { createContext, useState, useContext, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

// Simple admin auth via localStorage — NO remote API calls
const ADMIN_KEY = 'zhasavet_admin_authed';

export const AuthProvider = ({ children }) => {
  const [isLoadingAuth] = useState(false);
  const [isLoadingPublicSettings] = useState(false);
  const [authError] = useState(null);

  const navigateToLogin = () => {};

  return (
    <AuthContext.Provider value={{
      user: null,
      isAuthenticated: false,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings: null,
      logout: () => {},
      navigateToLogin,
      checkAppState: () => {},
      checkUserAuth: () => {},
      authChecked: true,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

// Admin auth helpers used by AdminDashboard
const ADMIN_PASSWORD = 'admin123';

export function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_KEY) === 'true';
}

export function adminLogin(password) {
  if (password === ADMIN_PASSWORD) {
    localStorage.setItem(ADMIN_KEY, 'true');
    return true;
  }
  return false;
}

export function adminLogout() {
  localStorage.removeItem(ADMIN_KEY);
}