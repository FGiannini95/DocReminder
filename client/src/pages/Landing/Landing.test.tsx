import { render, screen } from "@testing-library/react";
import { Landing } from "./Landing";

describe("Landing", () => {
  it("renders without crashing", () => {
    render(<Landing />);
  });

  it("renders email input", () => {
    render(<Landing />);
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
  });

  it("renders send code button", () => {
    render(<Landing />);
    expect(screen.getByRole("button", { name: /enviar código de acceso/i })).toBeInTheDocument();
  });

  it("renders google button", () => {
    render(<Landing />);
    expect(screen.getByRole("button", { name: /continuar con google/i })).toBeInTheDocument();
  });

  it("disables send code button when email is invalid", () => {
    render(<Landing />);
    expect(screen.getByRole("button", { name: /enviar código de acceso/i })).toBeDisabled();
  });

  it("enables send code button when email is valid", () => {});
});
