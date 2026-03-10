/**
 * Axios instance for protected API calls.
 * Stores the access token at module level (outside React) so interceptors
 * can attach it to every request without needing Context or localStorage.
 * The token is injected via setAuthToken() called by AuthContext on login.
 */
import axios from "axios";
import { AUTH_URL } from "./apiConfig";

// Module-level token store — updated by AuthContext on login
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const axiosInstance = axios.create({
  withCredentials: true, // sends httpOnly cookie automatically
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

// Handle 401 — try refresh, then retry original request
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint — cookie is sent automatically
        const { data } = await axios.post(`${AUTH_URL}/refresh`, {}, { withCredentials: true });
        setAuthToken(data.newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${data.newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        // Refresh failed → user must login again
        setAuthToken(null);
        window.location.href = "/"; // redirect to landing
      }
    }

    return Promise.reject(error);
  }
);
