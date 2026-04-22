import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axiosInstance } from "@/api/axiosInstance";

import { PinSetup } from "./PinSetup";
import { AUTH_URL } from "@/api/apiConfig";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    togglePin: mockTogglePin,
    login: mockLogin,
  }),
}));

const mockNavigate = vi.fn();
const mockTogglePin = vi.fn();
const mockLogin = vi.fn();

const renderPinSetup = (mode: "create" | "verify" = "create") => {
  render(
    <MemoryRouter>
      <PinSetup mode={mode} />
    </MemoryRouter>
  );
};

// Helper to fill all 4 PIN inputs
const fillPin = async (user: ReturnType<typeof userEvent.setup>, pin = "1234") => {
  const inputs = document.querySelectorAll("input[type='password']");
  for (let i = 0; i < inputs.length; i++) {
    await user.type(inputs[i] as HTMLElement, pin[i]);
  }
};

describe("PinSetup", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockTogglePin.mockClear();
    mockLogin.mockClear();
    vi.mocked(axiosInstance.post).mockClear();
  });

  it("shows correct title in create mode", async () => {
    renderPinSetup();
    expect(await screen.findByText("Código PIN")).toBeInTheDocument();
  });

  it("shows correct title in verify mode", async () => {
    renderPinSetup("verify");
    expect(await screen.findByText("Acceder con PIN")).toBeInTheDocument();
  });

  it("shows correct button label in create mode", async () => {
    renderPinSetup();
    expect(await screen.findByRole("button", { name: /Guardar PIN/i })).toBeInTheDocument();
  });

  it("shows correct button label in verify mode", async () => {
    renderPinSetup("verify");
    expect(await screen.findByRole("button", { name: /Acceder/i })).toBeInTheDocument();
  });

  it("button is disabled when pin is incomplete", () => {
    renderPinSetup("verify");
    expect(screen.getByRole("button", { name: /Acceder/i })).toBeDisabled();
  });

  it("button is enabled when all 4 digits are filled", async () => {
    const user = userEvent.setup();
    renderPinSetup();

    await fillPin(user);
    expect(screen.getByRole("button", { name: /Guardar PIN/i })).toBeEnabled();
  });

  it("shows spinner after submit", async () => {
    vi.mocked(axiosInstance.post).mockReturnValue(new Promise(() => {}));

    const user = userEvent.setup();
    renderPinSetup();

    await fillPin(user);
    await user.click(screen.getByRole("button", { name: /Guardar PIN/i }));

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("calls save-pin endpoint in create mode", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: {} });
    const user = userEvent.setup();
    renderPinSetup();

    await fillPin(user);
    await user.click(screen.getByRole("button", { name: /Guardar PIN/i }));

    expect(axiosInstance.post).toHaveBeenCalledWith(`${AUTH_URL}/save-pin`, { pin: "1234" });
  });

  it("calls verify-pin endpoint in verify mode", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: {} });
    const user = userEvent.setup();
    renderPinSetup("verify");

    await fillPin(user);
    await user.click(screen.getByRole("button", { name: /Acceder/i }));

    expect(axiosInstance.post).toHaveBeenCalledWith(`${AUTH_URL}/verify-pin`, {
      pin: "1234",
      email: null,
    });
  });
});
