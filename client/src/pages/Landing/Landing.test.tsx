import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { Landing } from "./Landing";

// Wrap with MemoryRouter to provide router context
const renderLanding = () =>
  render(
    <MemoryRouter>
      <Landing />
    </MemoryRouter>
  );

describe("Landing", () => {
  it("renders without crashing", () => {
    renderLanding();
  });

  it("renders email input", () => {
    renderLanding();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
  });

  it("renders send code button", () => {
    renderLanding();
    expect(screen.getByRole("button", { name: /enviar código de acceso/i })).toBeInTheDocument();
  });

  it("renders google button", () => {
    renderLanding();
    expect(screen.getByRole("button", { name: /continuar con google/i })).toBeInTheDocument();
  });

  it("disables send code button when email is invalid", () => {
    renderLanding();
    expect(screen.getByRole("button", { name: /enviar código de acceso/i })).toBeDisabled();
  });

  it("enables send code button when email is valid", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.type(screen.getByLabelText(/correo electrónico/i), "fede@gmail.com");

    expect(screen.getByRole("button", { name: /enviar código de acceso/i })).toBeEnabled();
  });

  it("shows spinner when loading", async () => {
    const user = userEvent.setup();
    renderLanding();

    await user.type(screen.getByLabelText(/correo electrónico/i), "fede@gmail.com");
    await user.click(screen.getByRole("button", { name: /enviar código de acceso/i }));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });
});
