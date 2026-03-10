/*** Renderizza HomeHeader, StatusBlocks, DocumentCard, BottomNav, Fab
 * Click sul Fab naviga a addDocument */
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import { Home } from "./Home";

const queryClient = new QueryClient();

const renderHome = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Home", () => {
  it("renders without crashing", () => {
    renderHome();
  });
});
