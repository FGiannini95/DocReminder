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
  Divider,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { PageTransition } from "@/components";
import axiosInstance from "@/api/axiosInstance";
import { DOC_URL } from "@/api/apiConfig";

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

type DocumentType = "passport" | "id" | "driver_license" | "health" | "credit_card" | "custom";

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
  const [errors, setErrors] = useState<Partial<Record<keyof AddDocumentForm, string>>>({});
  const [dateOpen, setDateOpen] = useState<boolean>(false);

  const navigate = useNavigate();

  const validate = () => {
    const newErrors: Partial<Record<keyof AddDocumentForm, string>> = {};
    if (!form.type) newErrors.type = "Campo obligatorio";
    if (form.name && form.name.trim().length < 2) newErrors.name = "Mínimo 2 caracteres";
    if (!form.expiryDate) newErrors.expiryDate = "Campo obligatorio";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = <K extends keyof AddDocumentForm>(field: K, value: AddDocumentForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const REMINDER_OPTIONS = [7, 14, 30, 60, 90, 180];

  const toggleReminderDay = (day: number) => {
    const current = form.reminderDays;
    const updated = current.includes(day) ? current.filter((d) => d !== day) : [...current, day];
    handleChange("reminderDays", updated);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsLoading(true);
    // chiamata API
    axiosInstance
      .post(`${DOC_URL}/adddocument`, {
        type: form.type,
        name: form.name,
        document_number: form.documentNumber,
        expiry_date: form.expiryDate?.format("YYYY-MM-DD"),
        reminder_days: form.reminderDays,
        personal_note: form.personalNote,
      })
      .then(() => {
        navigate(-1);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
    console.log(form);
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
          <Divider sx={{ borderColor: "grey.700" }} />
        </Box>

        {/* Scrollable content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mt: "60px",
            p: 3,
            pt: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {/* Document type selector */}
          <FormControl sx={textFieldSx} required error={!!errors.type}>
            <InputLabel>Tipo de documento</InputLabel>
            <Select
              value={form.type}
              label="Tipo de documento"
              onChange={(e) => handleChange("type", e.target.value as DocumentType)}
            >
              <MenuItem value="passport">Pasaporte</MenuItem>
              <MenuItem value="id">DNI </MenuItem>
              <MenuItem value="driver_license">Carnet de conducir</MenuItem>
              <MenuItem value="health">Tarjeta sanitaria</MenuItem>
              <MenuItem value="credit_card">Tarjeta bancaria</MenuItem>
              <MenuItem value="custom">Otro</MenuItem>
            </Select>
            <FormHelperText>{errors.type}</FormHelperText>
          </FormControl>

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
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
            <MobileDatePicker
              open={dateOpen}
              onOpen={() => setDateOpen(true)}
              onClose={() => setDateOpen(false)}
              label="Fecha de vencimiento"
              value={form.expiryDate}
              onChange={(value) => handleChange("expiryDate", value)}
              minDate={dayjs()} // Disable previous days
              slotProps={{
                textField: {
                  onMouseDown: (e) => {
                    e.preventDefault();
                    setDateOpen(true);
                  },
                  inputProps: { tabIndex: -1 }, // Remove focus from input
                  sx: textFieldSx,
                  required: true,
                  error: !!errors.expiryDate,
                  helperText: errors.expiryDate,
                },
                // Action bar Ui
                actionBar: {
                  sx: {
                    "& .MuiButton-root": {
                      color: "text.primary",
                    },
                  },
                },
                // Selected day Ui
                day: {
                  sx: {
                    "&&.Mui-selected": {
                      backgroundColor: "text.primary",
                      "&:hover": { backgroundColor: "text.primary" },
                      "&:focus": { backgroundColor: "text.primary" },
                    },
                  },
                },
              }}
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
                        backgroundColor: selected ? "text.primary" : "transparent",
                      },
                      "&&.MuiChip-root:active": {
                        backgroundColor: selected ? "text.primary" : "transparent",
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
            onClick={handleSubmit}
            sx={{ borderRadius: 8, py: 1.5, backgroundColor: "text.primary" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Guardar documento"}
          </Button>
        </Box>
      </Box>
    </PageTransition>
  );
};
