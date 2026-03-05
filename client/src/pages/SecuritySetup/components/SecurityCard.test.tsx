import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SecurityCard } from "./SecurityCard";

const defaultProps = {
  title: "Test title",
  description: "Test description",
  buttonLabel: "Test button",
  onActivate: vi.fn(),
};

describe("SecurityCard", () => {
  it("renders the title", () => {
    render(<SecurityCard {...defaultProps} />);
    expect(screen.getByText("Test title")).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<SecurityCard {...defaultProps} />);
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("button invokes onActivate when clicked", async () => {
    const user = userEvent.setup();
    render(<SecurityCard {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /test button/i }));

    expect(defaultProps.onActivate).toHaveBeenCalledOnce();
  });
});
