import "@testing-library/jest-dom";
import { vi } from "vitest";

// Global mock for axiosInstance to prevent interceptors from breaking tests that don't use protected routes
vi.mock("@/api/axiosInstance", () => ({
  axiosInstance: {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  setAuthToken: vi.fn(),
}));
