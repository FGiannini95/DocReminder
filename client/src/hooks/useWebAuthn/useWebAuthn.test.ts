import { renderHook } from "@testing-library/react";
import { axiosInstance } from "@/api/axiosInstance";
import { AUTH_URL } from "@/api/apiConfig";

import { useWebAuthn } from "./useWebAuthn";

vi.mock("@simplewebauthn/browser", () => ({
  startRegistration: vi.fn().mockResolvedValue({ id: "mock-registration" }),
  startAuthentication: vi.fn().mockResolvedValue({ id: "mock-authentication" }),
}));

describe("useWebAuthn", () => {
  beforeEach(() => {
    vi.mocked(axiosInstance.post).mockClear();
  });

  describe("registerFingerprint", () => {
    it("calls register/start and register/finish with correct data", async () => {
      // first call returns options, second call returns result
      vi.mocked(axiosInstance.post)
        .mockResolvedValueOnce({ data: { challenge: "mock-challenge" } })
        .mockResolvedValueOnce({ data: { verified: true } });

      const { result } = renderHook(() => useWebAuthn());
      const data = await result.current.registerFingerprint();

      expect(axiosInstance.post).toHaveBeenNthCalledWith(1, `${AUTH_URL}/webauthn/register/start`);
      expect(axiosInstance.post).toHaveBeenNthCalledWith(
        2,
        `${AUTH_URL}/webauthn/register/finish`,
        { registration: { id: "mock-registration" } }
      );
      expect(data).toEqual({ verified: true });
    });
  });

  describe("verifyFingerprint", () => {
    it("calls auth/start with email and auth/finish with correct data", async () => {
      vi.mocked(axiosInstance.post)
        .mockResolvedValueOnce({ data: { challenge: "mock-challenge" } })
        .mockResolvedValueOnce({ data: { verified: true } });

      const { result } = renderHook(() => useWebAuthn());
      const data = await result.current.verifyFingerprint("test@test.com");

      expect(axiosInstance.post).toHaveBeenNthCalledWith(1, `${AUTH_URL}/webauthn/auth/start`, {
        email: "test@test.com",
      });
      expect(axiosInstance.post).toHaveBeenNthCalledWith(2, `${AUTH_URL}/webauthn/auth/finish`, {
        authentication: { id: "mock-authentication" },
        email: "test@test.com",
      });
      expect(data).toEqual({ verified: true });
    });
  });
});
