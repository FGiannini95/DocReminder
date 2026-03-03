import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import { Otp } from "./Otp";

// Wrap with MemoryRouter to provide router context
const renderOtp = () =>
  render(
    <MemoryRouter initialEntries={[{ pathname: "/otp", state: { email: "fede@gmail.com" } }]}>
      <Routes>
        <Route path="/otp" element={<Otp />} />
      </Routes>
    </MemoryRouter>
  );

describe("Otp", () => {
  it("renders without crashing", () => {
    renderOtp();
  });

  it("renders email from navigation state", () => {
    renderOtp();
    expect(screen.getByText("fede@gmail.com")).toBeInTheDocument();
  });

  it("renders six box for the OTP", () => {
    renderOtp();
    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });

  it("renders verify button", () => {
    renderOtp();
    expect(screen.getByRole("button", { name: /verificar código/i })).toBeInTheDocument();
  });

  it("disables verify button", () => {
    renderOtp();
    expect(screen.getByRole("button", { name: /verificar código/i })).toBeDisabled();
  });

  it("enables verify button when every box has a numeric value", async () => {
    const user = userEvent.setup();
    renderOtp();

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      await user.type(input, "1");
    }

    expect(screen.getByRole("button", { name: /verificar código/i })).toBeEnabled();
  });
});
