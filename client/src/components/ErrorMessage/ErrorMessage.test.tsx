import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { ErrorMessage } from "./ErrorMessage";

const renderErrorMessage = () => {
  render(
    <MemoryRouter>
      <ErrorMessage message="Error al cargar el documento" />
    </MemoryRouter>
  );
};

describe("errorMessage", () => {
  it("renders without crashing", () => {
    renderErrorMessage();
  });

  it("displays Error message", async () => {
    renderErrorMessage();
    expect(await screen.findByText("Error al cargar el documento")).toBeInTheDocument();
  });
});
