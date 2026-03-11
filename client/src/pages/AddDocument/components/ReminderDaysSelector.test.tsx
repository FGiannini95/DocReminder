import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { ReminderDaysSelector } from "./ReminderDaysSelector";
const queryClient = new QueryClient();

const renderReminderDaysSelector = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ReminderDaysSelector selected={[]} onChange={vi.fn()} />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("ReminderDaysSelector", () => {
  it("renders six chips", () => {
    renderReminderDaysSelector();
    expect(screen.getAllByRole("button")).toHaveLength(6);
  });

  it("call onChange with correct selection when option is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <MemoryRouter>
        <ReminderDaysSelector selected={[]} onChange={onChange} />
      </MemoryRouter>
    );

    await user.click(screen.getByText("7 días"));

    expect(onChange).toHaveBeenCalledWith([7]);
  });

  it("shows selected chip as filled", () => {
    render(
      <MemoryRouter>
        <ReminderDaysSelector selected={[7]} onChange={vi.fn()} />
      </MemoryRouter>
    );

    const chip = screen.getByText("7 días").closest(".MuiChip-root");
    expect(chip).toHaveClass("MuiChip-filled");
  });
});
