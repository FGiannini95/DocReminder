import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router-dom";
import { axiosInstance } from "@/api/axiosInstance";
import dayjs from "dayjs";

import { OneDocument } from "./OneDocument";

const queryClient = new QueryClient();

const renderOneDocument = () => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <OneDocument />
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

describe("OneDocument", () => {
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
});
