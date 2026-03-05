import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: number | null;
  accessToken: string | null;
  isLoading: boolean;
  isLogged: boolean;
  login: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<number | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const login = useCallback((token: string) => {
    setAccessToken(token);
    const decoded = jwtDecode<{ userId: number }>(token);
    setUser(decoded.userId);
    setIsLogged(true);
  }, []);

  const value = useMemo(
    () => ({
      user,
      accessToken,
      isLoading,
      isLogged,
      login,
    }),
    [user, accessToken, isLoading, isLogged, login]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
};
