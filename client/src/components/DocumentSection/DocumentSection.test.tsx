import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Document, DocumentType } from "@/types/document";

import { DocumentSection } from "./DocumentSection";

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockNavigate = vi.fn();

const mockDoc = (overrides = {}): Document => ({
  documentId: 1,
  name: "Test Doc",
  type: "passport" as DocumentType,
  expiryDate: "2099-01-01",
  documentNumber: "123456",
  reminderDays: [30],
  personalNote: null,
  user_id: 1,
  dependent_id: null,
  ownerName: undefined,
  ...overrides,
});

const defaultProps = {
  documents: [mockDoc()],
  isError: false,
  isPending: false,
  groupId: undefined,
};

const renderDocumentSection = (props = {}) => {
  render(
    <MemoryRouter>
      <DocumentSection {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

describe("DocumentSection", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders without crashing", () => {
    renderDocumentSection();
  });

  it("shows loading when isPending is true", () => {
    renderDocumentSection({ isPending: true });
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("shows error message when isError is true", () => {
    renderDocumentSection({ isError: true });
    expect(screen.getByText("Error al cargar el documento")).toBeInTheDocument();
  });

  it("shows empty state when documents array is empty", async () => {
    renderDocumentSection({ documents: [] });
    expect(await screen.findByText("Aún no has añadido ningún documento.")).toBeInTheDocument();
  });

  it("renders the correct number of documents", async () => {
    renderDocumentSection({ documents: [mockDoc(), mockDoc(), mockDoc()] });
    expect(await screen.findAllByText("Test Doc")).toHaveLength(3);
  });

  it("navigates to document page when card is clicked", async () => {
    renderDocumentSection();
    const user = userEvent.setup();

    await user.click(await screen.findByText("Test Doc"));
    expect(mockNavigate).toHaveBeenCalledWith("/document/1");
  });

  it("shows Vencido when document is expired", async () => {
    renderDocumentSection({ documents: [mockDoc({ expiryDate: "2009-01-01" })] });
    expect(await screen.findByText("Vencido")).toBeInTheDocument();
  });

  it("shows owner chip when ownerName is present", async () => {
    renderDocumentSection({ documents: [mockDoc({ ownerName: "Fede Giannini" })] });
    expect(await screen.findByText("Fede Giannini")).toBeInTheDocument();
  });
});
