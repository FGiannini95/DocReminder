import React, { useState } from "react";

import { Box, Button, CircularProgress, Typography } from "@mui/material";

import { containedButtonSx, scrollableContentSx } from "@/styles/commonStyle";
import { BottomNav, PageTransition } from "@/components";
import { ProfileHeader } from "./components/ProfileHeader";
import { SecurityCard } from "../SecuritySetup/components/SecurityCard";
import { vibrate } from "@/utils/haptics";
import { StatsProfile } from "./components/StatsProfile";

export const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <ProfileHeader />
        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, mb: "56px", display: "block" }}>
          <StatsProfile />
          <SecurityCard
            title="Huella o Face ID"
            description="Accede en segundos con tu huella o reconocimiento facial."
            buttonLabel="Activar"
            onActivate={() => {}}
          />

          <SecurityCard
            title="Código PIN"
            description="Crea un PIN de 4 dígitos para acceder rápidamente."
            buttonLabel="Crear"
            onActivate={() => {}}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
          >
            {isLoading ? <CircularProgress size={20} /> : "Cerrar sesión"}
          </Button>
        </Box>
        <BottomNav />
      </Box>
    </PageTransition>
  );
};
