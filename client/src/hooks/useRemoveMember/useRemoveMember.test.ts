import { renderHook, waitFor } from "@testing-library/react";
import { axiosInstance } from "@/api/axiosInstance";
import { act } from "react";
import { GroupMember } from "@/types/group";
import { GROUP_URL } from "@/api/apiConfig";

import { useRemoveMember } from "./useRemoveMember";

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

const mockMember: GroupMember = {
  user_id: 1,
  displayName: "Matita",
  email: "test@test.com",
  status: "active",
};

describe("useRemoveMember", () => {
  beforeEach(() => {
    vi.mocked(axiosInstance.delete).mockClear();
    mockInvalidateQueries.mockClear();
  });

  it("sets open to true and saves member when handleOpen is called", () => {
    const { result } = renderHook(() => useRemoveMember("1"));

    act(() => {
      result.current.handleOpen(mockMember);
    });

    expect(result.current.open).toBe(true);
    expect(result.current.removeMember).toEqual(mockMember);
  });

  it("sets open to false when handleClose is called", () => {
    const { result } = renderHook(() => useRemoveMember("1"));

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.open).toBe(false);
  });

  it("calls API with correct data on handleRemove ", async () => {
    vi.mocked(axiosInstance.delete).mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useRemoveMember("1"));

    act(() => {
      result.current.handleOpen(mockMember);
    });

    await act(async () => {
      result.current.handleRemove();
    });

    expect(axiosInstance.delete).toHaveBeenCalledWith(`${GROUP_URL}/1/delete-member/1`);
  });

  it("closes drawer after successful API call", async () => {
    vi.mocked(axiosInstance.delete).mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useRemoveMember("1"));

    act(() => {
      result.current.handleOpen(mockMember);
    });

    await act(async () => {
      result.current.handleRemove();
    });

    await waitFor(() => {
      expect(result.current.open).toBe(false);
    });
  });
});
