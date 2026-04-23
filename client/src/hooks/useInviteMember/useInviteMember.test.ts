import { renderHook, waitFor } from "@testing-library/react";
import { axiosInstance } from "@/api/axiosInstance";
import { GROUP_URL } from "@/api/apiConfig";
import { act } from "react";

import { useInviteMember } from "./useInviteMember";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useQueryClient: () => ({
      invalidateQueries: mockInvalidateQueries,
    }),
  };
});
const mockInvalidateQueries = vi.fn();

describe("useInviteMember", () => {
  beforeEach(() => {
    vi.mocked(axiosInstance.post).mockClear();
    mockInvalidateQueries.mockClear();
  });

  it("sets inviteOpen to true when handleOpenInviteDrawer is called", () => {
    const { result } = renderHook(() => useInviteMember("1"));

    act(() => {
      result.current.handleOpenInviteDrawer();
    });
    expect(result.current.inviteOpen).toBe(true);
  });

  it("sets inviteOpen to false when handleCloseInviteDrawer is called", () => {
    const { result } = renderHook(() => useInviteMember("1"));

    act(() => {
      result.current.handleCloseInviteDrawer();
    });
    expect(result.current.inviteOpen).toBe(false);
  });

  it("updates field value when handleChangeEmail is called", () => {
    const { result } = renderHook(() => useInviteMember("1"));

    act(() => {
      result.current.handleChangeEmail({
        target: { value: "test@test.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.inviteEmail).toBe("test@test.com");
  });

  it("clears error when email field changes", () => {
    const { result } = renderHook(() => useInviteMember("1"));

    // first trigger an error
    act(() => {
      result.current.handleInvite();
    });
    expect(result.current.inviteError).toBe("Email requerida");

    // then change name and verify error is cleared
    act(() => {
      result.current.handleChangeEmail({
        target: { value: "test@test.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });
    expect(result.current.inviteError).toBe("");
  });

  it("sets error when handleInvite is called with empty email", () => {
    const { result } = renderHook(() => useInviteMember("1"));

    act(() => {
      result.current.handleInvite();
    });

    expect(result.current.inviteError).toBe("Email requerida");
  });

  it("sets error when handleInvite is called with invalid email", () => {
    const { result } = renderHook(() => useInviteMember("1"));

    act(() => {
      result.current.handleChangeEmail({
        target: { value: "notanemail" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleInvite();
    });

    expect(result.current.inviteError).toBe("Email requerida");
  });

  it("calls API with correct data on handleInvite ", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useInviteMember("1"));

    act(() => {
      result.current.handleChangeEmail({
        target: { value: "test@test.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      result.current.handleInvite();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(`${GROUP_URL}/1/invite-member`, {
      email: "test@test.com",
    });
  });

  it("closes form after successful API call", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useInviteMember("1"));

    act(() => {
      result.current.handleChangeEmail({
        target: { value: "test@test.com" },
      } as React.ChangeEvent<HTMLInputElement>);
    });

    await act(async () => {
      result.current.handleInvite();
    });

    await waitFor(() => {
      expect(result.current.inviteOpen).toBe(false);
    });
  });
});
