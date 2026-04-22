import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { axiosInstance } from "@/api/axiosInstance";
import dayjs from "dayjs";

import { OneDocument } from "./OneDocument";

const renderOneDocument = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={["/1"]}>
        <Routes>
          <Route path="/:id" element={<OneDocument />} />
          <Route path="/" element={<div>Home</div>} />
          <Route path="/edit-document/:id" element={<div>Modificar documento</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

const mockDoc = {
  documentId: 1,
  type: "passport",
  name: "Test",
  documentNumber: "123",
  expiryDate: "2027-01-01",
  reminderDays: [30, 60],
  personalNote: null,
};

vi.mocked(axiosInstance.get).mockResolvedValue({ data: mockDoc });

describe.skip("OneDocument", () => {
  it("renders without crashing", () => {
    renderOneDocument();
  });

  it("renders edit button", async () => {
    renderOneDocument();
    expect(await screen.findByRole("button", { name: /editar/i })).toBeInTheDocument();
  });

  it("renders delete button", async () => {
    renderOneDocument();
    expect(await screen.findByRole("button", { name: /eliminar/i })).toBeInTheDocument();
  });

  it("displays all data information", async () => {
    renderOneDocument();

    expect(await screen.findByText("Test")).toBeInTheDocument();
    expect(screen.getByText("Pasaporte")).toBeInTheDocument();
    expect(screen.getByText("01/01/2027")).toBeInTheDocument();
    expect(screen.getByText("123")).toBeInTheDocument();
    expect(screen.getByText("30d, 60d")).toBeInTheDocument();
  });

  it("shows urgent alert when document expires within 30 days", async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: { ...mockDoc, expiryDate: dayjs().add(10, "day").format("YYYY-MM-DD") },
    });

    renderOneDocument();

    expect(await screen.findByText(/date prisa/i)).toBeInTheDocument();
  });

  it("shows warning alert when document expires within 60 days", async () => {
    vi.mocked(axiosInstance.get).mockResolvedValue({
      data: { ...mockDoc, expiryDate: dayjs().add(45, "day").format("YYYY-MM-DD") },
    });

    renderOneDocument();

    expect(await screen.findByText(/caduca pronto/i)).toBeInTheDocument();
  });

  it("cals api on successful deletion", async () => {
    vi.mocked(axiosInstance.delete).mockResolvedValue({});
    const user = userEvent.setup();
    renderOneDocument();

    await user.click(await screen.findByRole("button", { name: /eliminar/i }));

    expect(axiosInstance.delete).toHaveBeenCalled();
  });

  it("navigates to Home after successful deletion", async () => {
    vi.mocked(axiosInstance.delete).mockResolvedValue({});
    const user = userEvent.setup();
    renderOneDocument();

    await user.click(await screen.findByRole("button", { name: /eliminar/i }));
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  it("navigate to EditDocument when edit button is clicked", async () => {
    const user = userEvent.setup();
    renderOneDocument();

    await user.click(await screen.findByRole("button", { name: /editar/i }));
    expect(screen.getByText("Modificar documento")).toBeInTheDocument();
  });

  it("shows Loading when isPending", async () => {
    vi.mocked(axiosInstance.get).mockReturnValue(new Promise(() => {}));
    renderOneDocument();

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("shows ErrorMessage when isError", async () => {
    vi.mocked(axiosInstance.get).mockRejectedValue(new Error("Network error"));
    renderOneDocument();

    expect(await screen.findByTestId("error")).toBeInTheDocument();
  });
});
