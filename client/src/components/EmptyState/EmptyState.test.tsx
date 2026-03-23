import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { EmptyState } from "./EmptyState";

const renderEmptyState = () => {
  render(
    <MemoryRouter>
      <EmptyState />
    </MemoryRouter>
  );
};

describe("EmptyState", () => {
  it("renders without crashing", () => {
    renderEmptyState();
  });

  it("displays EmptyState message", async () => {
    renderEmptyState();
    expect(await screen.findByText("Aún no has creado ningún documento.")).toBeInTheDocument();
  });
});
