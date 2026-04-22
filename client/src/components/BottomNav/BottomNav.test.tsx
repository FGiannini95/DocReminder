import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import { BottomNav } from "./BottomNav";
import userEvent from "@testing-library/user-event";
import { DocReminderRoutes } from "@/routes/routes";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockNavigate = vi.fn();

const renderBottomNav = () => {
  render(
    <MemoryRouter initialEntries={[DocReminderRoutes.home]}>
      <BottomNav />
    </MemoryRouter>
  );
};

describe("BottomNav", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders three navigation options", () => {
    renderBottomNav();
    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.getByText("Grupos")).toBeInTheDocument();
    expect(screen.getByText("Perfil")).toBeInTheDocument();
  });

  it("highlights the correct tab based on current path", () => {
    renderBottomNav();
    screen.debug(screen.getByRole("button", { name: /grupos/i }));
  });

  it("navigates to home when Inicio is clicked", async () => {
    renderBottomNav();
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button", { name: /inicio/i }));
    expect(mockNavigate).toHaveBeenCalledWith(DocReminderRoutes.home);
  });

  it("navigates to group when Grupos is clicked", async () => {
    renderBottomNav();
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button", { name: /grupos/i }));
    expect(mockNavigate).toHaveBeenCalledWith(DocReminderRoutes.group);
  });

  it("navigates to profile when Perfil is clicked", async () => {
    renderBottomNav();
    const user = userEvent.setup();

    await user.click(await screen.findByRole("button", { name: /perfil/i }));
    expect(mockNavigate).toHaveBeenCalledWith(DocReminderRoutes.profile);
  });
});
