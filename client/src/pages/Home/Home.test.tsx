import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@/context";
import { fetchAllDocuments } from "@/api/documentApi";
import { fetchAllGroups } from "@/api/groupApi";

import { Home } from "./Home";

vi.mock("@/api/documentApi", () => ({
  fetchAllDocuments: vi.fn(),
}));

vi.mock("@/api/groupApi", () => ({
  fetchAllGroups: vi.fn(),
}));

const queryClient = new QueryClient();

const renderHome = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-document" element={<div>AddDocument</div>} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

beforeEach(() => {
  queryClient.clear();
  (fetchAllDocuments as ReturnType<typeof vi.fn>).mockResolvedValue([]);
  (fetchAllGroups as ReturnType<typeof vi.fn>).mockResolvedValue([]);
});

describe("Home", () => {
  it("renders without crashing", () => {
    renderHome();
  });

  it("shows loading while data is pending", () => {
    // Never resolve so queries stay pending
    (fetchAllDocuments as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    (fetchAllGroups as ReturnType<typeof vi.fn>).mockReturnValue(new Promise(() => {}));
    renderHome();
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("navigates to addDocument on Fab click", async () => {
    const user = userEvent.setup();
    renderHome();
    await screen.findByRole("button", { name: /add/i });
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByText("AddDocument")).toBeInTheDocument();
  });
});
