import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";

import { DocumentTypeSelect } from "./DocumentTypeSelect";

const queryClient = new QueryClient();

const renderDocumentTypeSelect = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <DocumentTypeSelect value="" onChange={vi.fn()} error="" />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("DocumentTypeSelect", () => {
  it("renders six options", async () => {
    const user = userEvent.setup();
    renderDocumentTypeSelect();

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByText("Pasaporte")).toBeInTheDocument();
    expect(screen.getByText("DNI")).toBeInTheDocument();
    expect(screen.getByText("Carnet de conducir")).toBeInTheDocument();
    expect(screen.getByText("Tarjeta sanitaria")).toBeInTheDocument();
    expect(screen.getByText("Tarjeta bancaria")).toBeInTheDocument();
    expect(screen.getByText("Otro")).toBeInTheDocument();
  });

  it("calls onChange with correct value when option is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <MemoryRouter>
        <DocumentTypeSelect value="" onChange={onChange} error="" />
      </MemoryRouter>
    );
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Pasaporte"));

    expect(onChange).toHaveBeenCalledWith("passport");
  });
});
