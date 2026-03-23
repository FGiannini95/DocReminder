import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Box, Typography } from "@mui/material";

import { PageTransition, SecurityCard } from "@/components";
import { DocReminderRoutes } from "@/routes/routes";
import { vibrate } from "@/utils/haptics";
import { useAuth } from "@/context";

// Shared styles for sections
const sectionStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

export const SecuritySetup = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { pinEnabled } = useAuth();
  const email = state?.email;
  const emailPrefix = email?.split("@")[0];

  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <Box
          sx={{
            ...sectionStyles,
            flex: 1,
            gap: 1,
            justifyContent: "center",
            backgroundColor: "grey.900",
          }}
        >
          <Typography variant="h4" fontWeight="bold" color="white">
            ¡Bienvenido {emailPrefix}!
          </Typography>
          <Typography color="grey.400">Configura el acceso rápido.</Typography>
        </Box>

        {/* FaceId and Pin */}
        <Box sx={{ ...sectionStyles, flex: 2, px: 3, gap: 2, pt: 4 }}>
          <SecurityCard
            title="Huella o Face ID"
            checked={false}
            description="Accede en segundos con tu huella o reconocimiento facial."
            buttonLabel="Activar"
            onActivate={() => {}}
            onClick={() => {}}
          />

          <SecurityCard
            title="Código PIN"
            checked={pinEnabled}
            description="Crea un PIN de 4 dígitos para acceder rápidamente."
            buttonLabel="Crear"
            onActivate={() => {}}
            onClick={() => navigate(DocReminderRoutes.pinSetup)}
          />

          <Typography
            fontWeight="bold"
            color="text.secondary"
            onClick={() => {
              vibrate();
              navigate(DocReminderRoutes.home);
            }}
          >
            Ahora no
          </Typography>
        </Box>
      </Box>
    </PageTransition>
  );
};
