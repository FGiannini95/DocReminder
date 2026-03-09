import axios from "axios";

// Module-level token store — updated by AuthContext on login
let authToken: string | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

const axiosInstance = axios.create({
  withCredentials: true, // sends httpOnly cookie automatically
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

export default axiosInstance;
