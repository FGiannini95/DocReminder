import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { StatusBlocks } from "./StatusBlocks";

const renderStatusBlocks = () =>
  render(
    <MemoryRouter>
      <StatusBlocks urgent={5} upcoming={2} ok={3} />
    </MemoryRouter>
  );

describe("StatusBlocks", () => {
  it("renders without crashing", () => {
    renderStatusBlocks();
  });

  it("renders correct counts", () => {
    renderStatusBlocks();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders three labels", () => {
    renderStatusBlocks();
    expect(screen.getByText("Urgente")).toBeInTheDocument();
    expect(screen.getByText("Próximo")).toBeInTheDocument();
    expect(screen.getByText("Al día")).toBeInTheDocument();
  });
});
