import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { vi } from "vitest";

vi.mock("axios");

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

  it("shows spinner when loading", async () => {
    vi.mocked(axios.post).mockReturnValue(new Promise(() => {}));

    const user = userEvent.setup();
    renderOtp();

    const inputs = screen.getAllByRole("textbox");
    for (const input of inputs) {
      await user.type(input, "1");
    }
    await user.click(screen.getByRole("button", { name: /verificar código/i }));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("disables resend button when countdown is active", () => {
    renderOtp();
    const resendLink = screen.getByText(/reenviar código/i);
    expect(resendLink).toHaveStyle({ opacity: "0.5" });
  });

  it("enables resend button when countdown reaches 0", () => {
    vi.useFakeTimers();
    renderOtp();

    // Advance time by 60 seconds and trigger React re-render
    act(() => {
      vi.advanceTimersByTime(60000);
    });

    const resendLink = screen.getByText(/reenviar código/i);
    expect(resendLink).toHaveStyle({ opacity: "1" });

    vi.useRealTimers();
  });
});
