import React from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { BottomNav, PageTransition } from "@/components";
import { useNavigate, useParams } from "react-router-dom";
import { DocReminderRoutes } from "@/routes/routes";
import { vibrate } from "@/utils/haptics";
import axiosInstance from "@/api/axiosInstance";
import { DOC_URL } from "@/api/apiConfig";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const InfoRow = ({ label, value }: { label: string; value: string }) => {
  const isLong = value.length > 15;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isLong ? "column" : "row",
        justifyContent: "space-between",
        alignItems: isLong ? "flex-start" : "center",
        gap: isLong ? 0.5 : 0,
        p: 2,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
      }}
    >
      <Typography color="text.secondary">{label}</Typography>
      <Typography fontWeight="bold">{value}</Typography>
    </Box>
  );
};

type DocumentType = "passport" | "id" | "driver_license" | "health" | "credit_card" | "custom";

interface Document {
  documentId: number;
  type: DocumentType;
  name: string | null;
  documentNumber: string | null;
  expiryDate: string;
  reminderDays: number[];
  personalNote: string | null;
}

export const OneDocument = () => {
  const daysUntil = (dateStr: string) =>
    Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();

  const fetchOneDocument = async () => {
    const res = await axiosInstance.get(`${DOC_URL}/${id}`);
    return res.data;
  };

  const {
    data: doc,
    isPending,
    isError,
  } = useQuery<Document>({
    queryKey: ["document", id],
    queryFn: fetchOneDocument,
  });

  if (isPending) return <CircularProgress />;
  if (isError) return <Typography>Error al cargar el documento</Typography>;

  const handleEdit = () => {
    console.log("editing");
    vibrate();
  };

  const handleDelete = () => {
    console.log("deleting");
    vibrate();
    navigate(DocReminderRoutes.home);
  };

  const days = daysUntil(doc.expiryDate);

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
            <IconButton onClick={() => navigate(DocReminderRoutes.home)} sx={{ color: "white" }}>
              <ArrowBackIosIcon />
            </IconButton>

            <Typography variant="h6" fontWeight="bold" color="white">
              Detalle documento
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
            mb: "56px",
            p: 3,
            pt: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {days <= 30 && <Alert severity="error"> Date prisa. Caduca en {days} días</Alert>}
          {days <= 60 && days > 30 && (
            <Alert severity="warning">Caduca pronto, en {days} días</Alert>
          )}

          {doc.name && <InfoRow label="Nombre" value={doc.name ?? ""} />}
          <InfoRow label="Tipo de documento" value="Carnet de conducir" />
          {doc.documentNumber && <InfoRow label="Número" value={doc.documentNumber ?? ""} />}
          <InfoRow label="Fecha de caducidad" value={dayjs(doc.expiryDate).format("DD/MM/YYYY")} />
          <InfoRow label="Recordatorio" value={doc.reminderDays.map((d) => `${d}d`).join(", ")} />
          {doc.personalNote && (
            <Box>
              <Typography variant="body2" color="text.secondary" mb={1}>
                Notas
              </Typography>
              <Box sx={{ border: "1px solid", borderRadius: 2, p: 2, borderColor: "divider" }}>
                <Typography variant="body2">{doc.personalNote ?? ""}</Typography>
              </Box>
            </Box>
          )}

          {/* Spacer — pushes buttons to bottom */}
          <Box sx={{ flex: 1 }} />

          {/* Actions buttons */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ borderRadius: 8, py: 1.5, backgroundColor: "text.primary", boxShadow: "none" }}
            >
              Editar
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleDelete}
              sx={{
                borderRadius: 8,
                py: 1.5,
                backgroundColor: "rgba(239, 83, 80, 0.4)",
                color: "error.dark",
                boxShadow: "none",
                border: "1px solid",
              }}
            >
              Eliminar
            </Button>
          </Box>
        </Box>
        <BottomNav />
      </Box>
    </PageTransition>
  );
};
