import { AUTH_URL } from "@/api/apiConfig";
import { axiosInstance } from "@/api/axiosInstance";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";

export const useWebAuthn = () => {
  const registerFingerprint = async () => {
    // Get registration options from backend
    const { data: options } = await axiosInstance.post(`${AUTH_URL}/webauthn/register/start`);

    // Start registration on device
    const registration = await startRegistration({ optionsJSON: options });

    // Send registration response to backend for verification
    const { data } = await axiosInstance.post(`${AUTH_URL}/webauthn/register/finish`, {
      registration,
    });

    return data;
  };

  const verifyFingerprint = async (email: string) => {
    // Get authentication options from backend
    const { data: options } = await axiosInstance.post(`${AUTH_URL}/webauthn/auth/start`, {
      email,
    });

    // Start authentication on device
    const authentication = await startAuthentication({ optionsJSON: options });

    // Send authentication response to backend for verification
    const { data } = await axiosInstance.post(`${AUTH_URL}/webauthn/auth/finish`, {
      authentication,
      email,
    });

    return data;
  };

  return { registerFingerprint, verifyFingerprint };
};
