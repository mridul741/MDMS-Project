
import { useState, type ReactNode } from "react";

import {
  login as authenticate,
  type UserRole,
} from "../authService";

import { AuthContext } from "./AuthContextValue";

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

export interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const STORAGE_KEY = "mdms-auth-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem(STORAGE_KEY);

    if (!savedUser) return null;

    try {
      return JSON.parse(savedUser) as AuthUser;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  });

  const handleLogin = (email: string, password: string): boolean => {
    const authenticatedUser = authenticate(email, password);

    if (!authenticatedUser) return false;

    setUser(authenticatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authenticatedUser));

    return true;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
