import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { Loading } from "./Loading";

const renderLoading = () => {
  render(
    <MemoryRouter>
      <Loading />
    </MemoryRouter>
  );
};

describe("Loading", () => {
  it("renders without crashing", () => {
    renderLoading();
  });

  it("shows spinner when loading", async () => {
    renderLoading();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
