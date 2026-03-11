import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { HomeHeader } from "./HomeHeader";

const renderHomeHeader = () =>
  render(
    <MemoryRouter>
      <HomeHeader />
    </MemoryRouter>
  );

describe("HomeHeader", () => {
  it("renders without cashing", () => {
    renderHomeHeader();
  });

  it("display the correct title", () => {
    renderHomeHeader();
    expect(screen.getByText("Hola fede")).toBeInTheDocument();
  });
});
