import { renderHook, waitFor } from "@testing-library/react";
import { axiosInstance } from "@/api/axiosInstance";
import { act } from "react";

import { useRemoveDependent } from "./useRemoveDependent";
import { GroupDependent } from "@/types/group";
import { GROUP_URL } from "@/api/apiConfig";

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

const mockDependent: GroupDependent = {
  group_dependents_id: 1,
  name: "Matita",
  relationship: null,
  avatar: null,
};

describe("useRemoveDependent", () => {
  beforeEach(() => {
    vi.mocked(axiosInstance.delete).mockClear();
    mockInvalidateQueries.mockClear();
  });

  it("sets removeOpen to true and saves dependent when openRemoveDrawer is called", () => {
    const { result } = renderHook(() => useRemoveDependent("1"));

    act(() => {
      result.current.openRemoveDrawer(mockDependent);
    });

    expect(result.current.removeOpen).toBe(true);
    expect(result.current.dependentToRemove).toEqual(mockDependent);
  });

  it("sets removeOpen to false when closeRemoveDrawer ", () => {
    const { result } = renderHook(() => useRemoveDependent("1"));

    act(() => {
      result.current.closeRemoveDrawer();
    });

    expect(result.current.removeOpen).toBe(false);
  });

  it("calls API with correct data on handleRemoveDependent ", async () => {
    vi.mocked(axiosInstance.delete).mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useRemoveDependent("1"));

    act(() => {
      result.current.openRemoveDrawer(mockDependent);
    });

    await act(async () => {
      result.current.handleRemoveDependent();
    });

    expect(axiosInstance.delete).toHaveBeenCalledWith(`${GROUP_URL}/1/delete-dependent/1`);
  });

  it("closes drawer after successful API call", async () => {
    vi.mocked(axiosInstance.delete).mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useRemoveDependent("1"));

    act(() => {
      result.current.openRemoveDrawer(mockDependent);
    });

    await act(async () => {
      result.current.handleRemoveDependent();
    });

    await waitFor(() => {
      expect(result.current.removeOpen).toBe(false);
    });
  });
});
