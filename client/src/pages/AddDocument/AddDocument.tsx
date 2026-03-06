import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/es";
import dayjs, { Dayjs } from "dayjs";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  IconButton,
  Chip,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { PageTransition } from "@/components";

const textFieldSx = {
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "text.primary",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "text.primary",
  },
  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
    transition: "background-color 99999s ease-in-out 0s",
  },
};
type DocumentType =
  | "passport"
  | "id"
  | "driver_license"
  | "residence"
  | "health"
  | "credit_card"
  | "custom";

interface AddDocumentForm {
  type: DocumentType | "";
  name: string;
  documentNumber: string;
  expiryDate: Dayjs | null;
  reminderDays: number[];
  personalNote: string;
}

export const AddDocument = () => {
  const [form, setForm] = useState<AddDocumentForm>({
    type: "",
    name: "",
    documentNumber: "",
    expiryDate: null,
    reminderDays: [60, 30],
    personalNote: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = <K extends keyof AddDocumentForm>(field: K, value: AddDocumentForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const REMINDER_OPTIONS = [7, 14, 30, 60, 90, 180];

  const toggleReminderDay = (day: number) => {
    const current = form.reminderDays;
    const updated = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
    handleChange("reminderDays", updated);
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            backgroundColor: "grey.900",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => navigate(-1)} sx={{ color: "white" }}>
              <ArrowBackIosIcon />
            </IconButton>

            <Typography variant="h6" fontWeight="bold" color="white">
              Añadir documento
            </Typography>
          </Box>
        </Box>

        {/* Scrollable content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mt: "56px",
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {/* Document type selector */}

          {/* Name input */}
          <TextField
            type="text"
            label="Nombre"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            variant="outlined"
            sx={textFieldSx}
          />

          {/* Document number input (optional) */}
          <TextField
            type="text"
            label="Nº de documento (opcional)"
            value={form.documentNumber}
            onChange={(e) => handleChange("documentNumber", e.target.value)}
            variant="outlined"
            sx={textFieldSx}
          />
          {/* Expiry date picker */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <MobileDatePicker
              label="Fecha de vencimiento"
              value={form.expiryDate}
              onChange={(value) => handleChange("expiryDate", value)}
              sx={textFieldSx}
            />
          </LocalizationProvider>

          {/* Reminder days */}
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Recordatorio
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
              }}
            >
              {REMINDER_OPTIONS.map((day) => {
                const selected = form.reminderDays.includes(day);
                return (
                  <Chip
                    key={day}
                    label={`${day} días`}
                    onClick={() => toggleReminderDay(day)}
                    variant={selected ? "filled" : "outlined"}
                    sx={{
                      backgroundColor: selected ? "text.primary" : "transparent",
                      color: selected ? "background.default" : "text.primary",
                      borderColor: "text.primary",
                      "&:hover": {
                        backgroundColor: selected ? "text.primary" : "action.hover",
                      },
                    }}
                  />
                );
              })}
            </Box>
          </Box>

          {/* Personal notes */}
          <TextField
            type="text"
            label="Notas"
            value={form.personalNote}
            onChange={(e) => handleChange("personalNote", e.target.value)}
            variant="outlined"
            sx={textFieldSx}
          />

          {/* Save button */}
          <Button
            variant="contained"
            size="large"
            sx={{ borderRadius: 8, py: 1.5, backgroundColor: "text.primary" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Guardar documento"}
          </Button>
        </Box>
      </Box>
    </PageTransition>
  );
};
