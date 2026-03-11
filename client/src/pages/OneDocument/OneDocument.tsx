import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

import { Alert, Box, Button, CircularProgress, Typography } from "@mui/material";

import { BottomNav, DocumentHeader, PageTransition } from "@/components";
import { DocReminderRoutes } from "@/routes/routes";
import { vibrate } from "@/utils/haptics";
import { axiosInstance } from "@/api/axiosInstance";
import { DOC_URL } from "@/api/apiConfig";
import { scrollableContentSx, containedButtonSx } from "@/styles/commonStyle";
import { Document, typeLabels } from "@/types/document";

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
        <DocumentHeader title="Detalle documento" onBack={() => navigate(DocReminderRoutes.home)} />

        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, p: 3, mb: "56px" }}>
          {days <= 30 && <Alert severity="error"> Date prisa. Caduca en {days} días</Alert>}
          {days <= 60 && days > 30 && (
            <Alert severity="warning">Caduca pronto, en {days} días</Alert>
          )}

          {doc.name && <InfoRow label="Nombre" value={doc.name ?? ""} />}
          <InfoRow label="Tipo de documento" value={typeLabels[doc.type]} />
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
              sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
            >
              Editar
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleDelete}
              sx={{
                ...containedButtonSx,
                backgroundColor: "rgba(239, 83, 80, 0.4)",
                color: "error.dark",
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
