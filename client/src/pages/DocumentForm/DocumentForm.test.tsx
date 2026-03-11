import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { axiosInstance } from "@/api/axiosInstance";
import { vi } from "vitest";
import dayjs from "dayjs";

import { DocumentForm } from "./DocumentForm";

const queryClient = new QueryClient();

const renderAddDocument = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/add-document"]}>
        <Routes>
          <Route path="/add-document" element={<DocumentForm />} />
          <Route path="/document/:id" element={<div>oneDocument</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

vi.mock("./components/ExpiryDatePicker", () => ({
  ExpiryDatePicker: ({ onChange }: { onChange: (date: unknown) => void }) => (
    <button onClick={() => onChange(dayjs("2027-01-01"))}>SetDate</button>
  ),
}));

describe("AddDocument", () => {
  it("renders without crashing", () => {
    renderAddDocument();
  });

  it("renders name input", () => {
    renderAddDocument();
    expect(screen.getByLabelText(/Nombre/i)).toBeInTheDocument();
  });

  it("renders number document input", () => {
    renderAddDocument();
    expect(screen.getByLabelText(/Nº de documento/i)).toBeInTheDocument();
  });

  it("renders personal note input", () => {
    renderAddDocument();
    expect(screen.getByLabelText(/Notas/i)).toBeInTheDocument();
  });

  it("renders save button", () => {
    renderAddDocument();
    expect(screen.getByRole("button", { name: /guardar documento/i })).toBeInTheDocument();
  });

  it("shows error when type field is not selected", async () => {
    const user = userEvent.setup();
    renderAddDocument();

    await user.click(screen.getByRole("button", { name: /guardar documento/i }));
    expect(screen.getAllByText("Campo obligatorio")).toHaveLength(1);
  });

  it("shows error when name has less than 2 characters", async () => {
    const user = userEvent.setup();
    renderAddDocument();

    await user.type(screen.getByLabelText(/Nombre/i), "a");
    await user.click(screen.getByRole("button", { name: /guardar documento/i }));

    expect(screen.getByText("Mínimo 2 caracteres")).toBeInTheDocument();
  });

  it("calls api on successful submit", async () => {
    vi.mocked(axiosInstance.post).mockResolvedValue({ data: { documentId: 1 } });
    const user = userEvent.setup();
    renderAddDocument();

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Pasaporte"));
    await user.click(screen.getByText("SetDate"));
    await user.click(screen.getByRole("button", { name: /guardar documento/i }));

    expect(axiosInstance.post).toHaveBeenCalled();
  });
});
