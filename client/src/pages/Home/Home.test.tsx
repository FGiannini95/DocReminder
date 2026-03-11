import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { AuthProvider } from "@/context";

import { Home } from "./Home";

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

describe("Home", () => {
  it("renders without crashing", () => {
    renderHome();
  });

  it("navigates to addDocument on Fab click", async () => {
    const user = userEvent.setup();
    renderHome();
    await user.click(screen.getByRole("button", { name: /add/i }));
    expect(screen.getByText("AddDocument")).toBeInTheDocument();
  });
});
