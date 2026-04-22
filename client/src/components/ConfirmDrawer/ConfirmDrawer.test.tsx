import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { ConfirmDrawer } from "./ConfirmDrawer";
import userEvent from "@testing-library/user-event";

const renderConfirmDrawer = () => {
  render(
    <MemoryRouter>
      <ConfirmDrawer
        open={true}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        isLoading={false}
        title="Test title"
        message="Test message"
        confirmLabel="Confirmar"
      />
    </MemoryRouter>
  );
};

describe("ConfirmDrawer", () => {
  it("renders without crashing", () => {
    renderConfirmDrawer();
  });

  it("display a title", async () => {
    renderConfirmDrawer();
    expect(await screen.findByText("Test title")).toBeInTheDocument();
  });

  it("display a message", async () => {
    renderConfirmDrawer();
    expect(await screen.findByText("Test message")).toBeInTheDocument();
  });

  it("calls onClose when Cancelar is clicked", async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ConfirmDrawer
          open={true}
          onClose={onClose}
          onConfirm={vi.fn()}
          isLoading={false}
          title="Test title"
          message="Test message"
          confirmLabel="Confirmar"
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onConfirm when confirm button is clicked", async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <ConfirmDrawer
          open={true}
          onClose={vi.fn()}
          onConfirm={onConfirm}
          isLoading={false}
          title="Test title"
          message="Test message"
          confirmLabel="Confirmar"
        />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button", { name: /confirmar/i }));
    expect(onConfirm).toHaveBeenCalled();
  });
});
