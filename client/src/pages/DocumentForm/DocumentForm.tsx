import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/es";

import { Box, Button, CircularProgress, TextField } from "@mui/material";

import { axiosInstance } from "@/api/axiosInstance";
import { DOC_URL } from "@/api/apiConfig";
import { fetchOneDocument } from "@/api/documentApi";
import { scrollableContentSx, textFieldSx, containedButtonSx } from "@/styles/commonStyle";
import { Document, DocumentFormValues } from "@/types/document";
import { DocumentHeader, ErrorMessage, Loading, PageTransition } from "@/components";
import { DocumentTypeSelect } from "./components/DocumentTypeSelect";
import { ExpiryDatePicker } from "./components/ExpiryDatePicker";
import { ReminderDaysSelector } from "./components/ReminderDaysSelector";
import { fetchGroupDependents } from "@/api/groupApi";
import { GroupDependent } from "@/types/group";
import { TitularSelect } from "./components/TitularSelect";

export const DocumentForm = () => {
  const [searchParams] = useSearchParams();
  const isFromGroup = searchParams.get("groupId");
  const dependentId = searchParams.get("dependentId");

  const [form, setForm] = useState<DocumentFormValues>({
    type: "",
    name: "",
    documentNumber: "",
    expiryDate: null,
    reminderDays: [60, 30],
    personalNote: "",
    assignTo: dependentId ?? "me",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof DocumentFormValues, string>>>({});
  const [dateOpen, setDateOpen] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const isEdit = !!id;

  // Fetch document only in edit mode
  const {
    data: doc,
    isPending,
    isError,
  } = useQuery<Document>({
    queryKey: ["document", id],
    queryFn: () => fetchOneDocument(id!),
    enabled: isEdit,
  });

  // Fetch group dependents
  const { data: groupDependents } = useQuery<GroupDependent[]>({
    queryKey: ["groupDependents", isFromGroup],
    queryFn: () => fetchGroupDependents(isFromGroup!),
    enabled: !!isFromGroup,
  });

  // Precompile form when doc loads in edit mode
  useEffect(() => {
    if (doc) {
      setForm({
        type: doc.type || "",
        name: doc.name || "",
        documentNumber: doc.documentNumber || "",
        expiryDate: dayjs(doc.expiryDate),
        reminderDays: doc.reminderDays,
        personalNote: doc.personalNote || "",
        assignTo: dependentId !== null ? dependentId : "me",
      });
    }
  }, [doc, dependentId]);

  if (isEdit && isPending) return <Loading />;
  if (isEdit && isError) return <ErrorMessage message="Error al cargar el formulario" />;

  const validate = () => {
    const newErrors: Partial<Record<keyof DocumentFormValues, string>> = {};
    if (!form.type) newErrors.type = "Campo obligatorio";
    if (form.name && form.name.trim().length < 2) newErrors.name = "Mínimo 2 caracteres";
    if (!form.expiryDate) newErrors.expiryDate = "Campo obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = <K extends keyof DocumentFormValues>(
    field: K,
    value: DocumentFormValues[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsLoading(true);

    const body = {
      type: form.type,
      name: form.name,
      document_number: form.documentNumber,
      expiry_date: form.expiryDate?.format("YYYY-MM-DD"),
      reminder_days: form.reminderDays,
      personal_note: form.personalNote,
      dependent_id: form.assignTo !== "me" ? Number(form.assignTo) : null,
    };

    const request = isEdit
      ? axiosInstance.put(`${DOC_URL}/edit-document/${id}`, body)
      : axiosInstance.post(`${DOC_URL}/add-document`, body);

    const getOwnerParam = () => {
      if (form.assignTo === "me") return "";
      const dep = groupDependents?.find((d) => String(d.group_dependents_id) === form.assignTo);
      return dep ? `?ownerName=${dep.name}` : "";
    };

    request
      .then((res) => {
        navigate(`/document/${isEdit ? id : res.data.documentId}${getOwnerParam()}`, {
          replace: true,
        });
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <DocumentHeader title={isEdit ? "Modificar documento" : "Añadir documento"} />

        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, p: 3, gap: 3 }}>
          {/* Assign document to owner */}
          {isFromGroup && !isEdit && (
            <TitularSelect
              value={form.assignTo ?? "me"}
              onChange={(value) => handleChange("assignTo", value)}
              dependents={groupDependents ?? []}
            />
          )}
          {/* Document type selector */}
          <DocumentTypeSelect
            value={form.type}
            onChange={(value) => handleChange("type", value)}
            error={errors.type}
          />
          {/* Name input */}
          <TextField
            type="text"
            label="Nombre"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            variant="outlined"
            sx={textFieldSx}
            error={!!errors.name}
            helperText={errors.name}
          />
          {/* Document number input (optional) */}
          <TextField
            type="text"
            label="Nº de documento"
            value={form.documentNumber}
            onChange={(e) => handleChange("documentNumber", e.target.value)}
            variant="outlined"
            sx={textFieldSx}
          />
          {/* Expiry date picker */}
          <ExpiryDatePicker
            value={form.expiryDate}
            onChange={(value) => handleChange("expiryDate", value)}
            open={dateOpen}
            onOpen={() => setDateOpen(true)}
            onClose={() => setDateOpen(false)}
            error={errors.expiryDate}
          />
          {/* Reminder days */}
          <ReminderDaysSelector
            selected={form.reminderDays}
            onChange={(days) => handleChange("reminderDays", days)}
          />
          {/* Personal notes */}
          <TextField
            type="text"
            label="Notas"
            value={form.personalNote}
            onChange={(e) => handleChange("personalNote", e.target.value)}
            variant="outlined"
            sx={textFieldSx}
          />
          {/* Actions buttons */}
          {isEdit ? (
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                sx={{ ...containedButtonSx, color: "text.primary", borderColor: "text.primary" }}
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                fullWidth
                variant="contained"
                sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? <CircularProgress size={20} /> : "Guardar"}
              </Button>
            </Box>
          ) : (
            <Button
              fullWidth
              variant="contained"
              sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={20} /> : "Guardar documento"}
            </Button>
          )}
        </Box>
      </Box>
    </PageTransition>
  );
};
