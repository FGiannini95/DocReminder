import React from "react";

import { Alert, Box, Button, Divider, IconButton, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

import { BottomNav, PageTransition } from "@/components";
import { useNavigate } from "react-router-dom";
import { DocReminderRoutes } from "@/routes/routes";
import { vibrate } from "@/utils/haptics";

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

  const days = daysUntil("2026-03-13");

  const navigate = useNavigate();

  const handleEdit = () => {
    console.log("editing");
    vibrate();
  };

  const handleDelete = () => {
    console.log("deleting");
    vibrate();
    navigate(DocReminderRoutes.home);
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
          <InfoRow label="Nombre" value="Carnet Fede" />
          <InfoRow label="Tipo de documento" value="Carnet de conducir" />
          <InfoRow label="Número" value="AAB123456" />
          <InfoRow label="Fecha de caducidad" value="15/05/2026" />
          <InfoRow label="Recordatorio" value="60d, 14d" />
          <Box>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Notas
            </Typography>
            <Box sx={{ border: "1px solid", borderRadius: 2, p: 2 }}>
              <Typography variant="body2">
                Renovar antes de verano. Llevar el libro de familia al consulado.
              </Typography>
            </Box>
          </Box>
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
