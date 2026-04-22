import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("axios");

import { DocumentHeader } from "./DocumentHeader";

const renderDocumentHeader = () =>
  render(
    <MemoryRouter>
      <DocumentHeader title={"Title"} />
    </MemoryRouter>
  );

describe("DocumentHeader", () => {
  it("renders without crashing", async () => {
    renderDocumentHeader();
  });

  it("display a text", async () => {
    renderDocumentHeader();
    expect(await screen.findByText("Title")).toBeInTheDocument();
  });

  it("display arrowBackIcon", async () => {
    renderDocumentHeader();
    expect(await screen.findByRole("button")).toBeInTheDocument();
  });

  it("calls onBack when back button is clicked", async () => {
    const onBack = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <DocumentHeader title="hi" onBack={onBack} />
      </MemoryRouter>
    );

    await user.click(screen.getByRole("button"));
    expect(onBack).toHaveBeenCalled();
  });
});
