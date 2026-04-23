import { renderHook, waitFor } from "@testing-library/react";
import { axiosInstance } from "@/api/axiosInstance";
import { DocReminderRoutes } from "@/routes/routes";

import { useAcceptInvite } from "./useAcceptInvite";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    isLogged: mockIsLogged,
  }),
}));

const mockNavigate = vi.fn();
let mockIsLogged = false;

describe("useAcceptInvite", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(axiosInstance.get).mockClear();
  });

  it("does nothing when token is undefined", async () => {
    renderHook(() => useAcceptInvite(undefined));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(axiosInstance.get).not.toHaveBeenCalled();
  });

  it("saves token in sessionStorage and navigates to landing when user is not logged in", async () => {
    mockIsLogged = false;
    renderHook(() => useAcceptInvite("abc123"));

    expect(sessionStorage.getItem("inviteToken")).toBe("abc123");
    expect(mockNavigate).toHaveBeenCalledWith(DocReminderRoutes.landing);
  });

  it("calls API and navigates to group on success", async () => {
    mockIsLogged = true;
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: { groupId: 1 } });

    renderHook(() => useAcceptInvite("abc1123"));

    await waitFor(() => {
      expect(axiosInstance.get).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/group/1");
    });
  });

  it("sets error message when API call fails", async () => {
    mockIsLogged = true;
    vi.mocked(axiosInstance.get).mockRejectedValue(new Error("error"));

    const { result } = renderHook(() => useAcceptInvite("abc1123"));

    await waitFor(() => {
      expect(result.current.error).toBe("El enlace ha caducado o no es válido");
    });
  });

  it("sets isLoading to true during API call and false after", async () => {
    mockIsLogged = true;
    vi.mocked(axiosInstance.get).mockResolvedValue({ data: { groupId: 1 } });

    const { result } = renderHook(() => useAcceptInvite("abc1123"));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });
});
