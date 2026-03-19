import React, { createContext, useCallback, useContext, useMemo, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import { AUTH_URL } from "@/api/apiConfig";
import { setAuthToken } from "@/api/axiosInstance";

interface AuthContextType {
  user: number | null;
  email: string | null;
  displayName: string | null;
  accessToken: string | null;
  isLoading: boolean;
  isLogged: boolean;
  login: (token: string) => void;
  logout: () => void;
  updateDisplayName: (name: string) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState<boolean>(false);

  const login = useCallback((token: string) => {
    setAccessToken(token);
    setAuthToken(token);
    const decoded = jwtDecode<{ userId: number; email: string; displayName: string }>(token);
    setUser(decoded.userId);
    setEmail(decoded.email);
    setDisplayName(decoded.displayName);
    setIsLogged(true);
  }, []);

  const logout = useCallback(() => {
    setAccessToken(null);
    setAuthToken(null);
    setUser(null);
    setEmail(null);
    setDisplayName(null);
    setIsLogged(false);
  }, []);

  const updateDisplayName = useCallback((name: string) => {
    setDisplayName(name);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    // general structure axios.post(url, body, config)
    axios
      .post(`${AUTH_URL}/refresh`, {}, { withCredentials: true })
      .then((res) => {
        login(res.data.newAccessToken);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setIsLogged(false);
      });
  }, [login]);

  const value = useMemo(
    () => ({
      user,
      email,
      displayName,
      accessToken,
      isLoading,
      isLogged,
      login,
      logout,
      updateDisplayName,
    }),
    [user, email, displayName, accessToken, isLoading, isLogged, login, logout, updateDisplayName]
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
