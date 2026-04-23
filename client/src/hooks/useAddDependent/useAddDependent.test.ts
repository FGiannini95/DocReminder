import { renderHook, waitFor } from "@testing-library/react";
import { axiosInstance } from "@/api/axiosInstance";
import { GROUP_URL } from "@/api/apiConfig";
import { act } from "react";

import { useAddDependent } from "./useAddDependent";

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

describe("useAddDependent", () => {
  beforeEach(() => {
    vi.mocked(axiosInstance.post).mockClear();
    mockInvalidateQueries.mockClear();
  });

  it("sets open to true when handleOpen is called", () => {
    const { result } = renderHook(() => useAddDependent("1"));

    act(() => {
      result.current.handleOpen();
    });
    expect(result.current.open).toBe(true);
  });

  it("sets open to false when handleClose is called", () => {
    const { result } = renderHook(() => useAddDependent("1"));

    act(() => {
      result.current.handleClose();
    });
    expect(result.current.open).toBe(false);
  });

  it("resets form when handleClose is called", () => {
    const { result } = renderHook(() => useAddDependent("1"));

    act(() => {
      result.current.handleClose();
    });

    expect(result.current.form).toEqual({
      name: "",
      relationship: null,
      avatar: null,
    });
  });

  it("updates field value when handleChange is called", () => {
    const { result } = renderHook(() => useAddDependent("1"));

    act(() => {
      result.current.handleChange("name", "Matita");
    });

    expect(result.current.form).toEqual({
      name: "Matita",
      relationship: null,
      avatar: null,
    });
  });

  it("clears error when name field changes", () => {
    const { result } = renderHook(() => useAddDependent("1"));

    // first trigger an error
    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.error).toBe("Nombre obligatorio");

    // then change name and verify error is cleared
    act(() => {
      result.current.handleChange("name", "Matita");
    });

    expect(result.current.error).toBe("");
  });

  it("sets error when handleSubmit is called with empty name", () => {
    const { result } = renderHook(() => useAddDependent("1"));

    act(() => {
      result.current.handleSubmit();
    });

    expect(result.current.error).toBe("Nombre obligatorio");
  });

  it("calls API with correct data on handleSubmit", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useAddDependent("1"));

    act(() => {
      result.current.handleChange("name", "Matita");
    });

    await act(async () => {
      result.current.handleSubmit();
    });

    expect(axiosInstance.post).toHaveBeenCalledWith(`${GROUP_URL}/1/add-dependent`, {
      name: "Matita",
      relationship: null,
      avatar: null,
    });
  });

  it("closes form after successful API call", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: {} });
    const { result } = renderHook(() => useAddDependent("1"));

    act(() => {
      result.current.handleChange("name", "Matita");
    });

    await act(async () => {
      result.current.handleSubmit();
    });

    await waitFor(() => {
      expect(result.current.open).toBe(false);
    });
  });
});
