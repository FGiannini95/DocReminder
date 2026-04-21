import { Dayjs } from "dayjs";

export type DocumentType =
  | "passport"
  | "id"
  | "driver_license"
  | "health"
  | "credit_card"
  | "custom";

export interface Document {
  documentId: number;
  type: DocumentType;
  name: string | null;
  documentNumber: string | null;
  expiryDate: string;
  reminderDays: number[];
  personalNote: string | null;
  user_id: number | null;
  dependent_id: number | null;
}

export const typeLabels: Record<DocumentType, string> = {
  passport: "Pasaporte",
  id: "DNI",
  driver_license: "Carnet de conducir",
  health: "Tarjeta sanitaria",
  credit_card: "Tarjeta bancaria",
  custom: "Otro",
};

export interface DocumentFormValues {
  type: DocumentType | "";
  name: string | null;
  documentNumber: string | null;
  expiryDate: Dayjs | null;
  reminderDays: number[];
  personalNote: string | null;
}
