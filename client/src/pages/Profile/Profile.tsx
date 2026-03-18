import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, CircularProgress } from "@mui/material";

import { containedButtonSx, scrollableContentSx } from "@/styles/commonStyle";
import { vibrate } from "@/utils/haptics";
import { DocReminderRoutes } from "@/routes/routes";
import { axiosInstance } from "@/api/axiosInstance";
import { AUTH_URL } from "@/api/apiConfig";
import { useAuth } from "@/context";
import { BottomNav, PageTransition, SecurityCard } from "@/components";
import { ProfileHeader } from "./components/ProfileHeader";
import { StatsProfile } from "./components/StatsProfile";

export const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    axiosInstance
      .post(`${AUTH_URL}/logout`)
      .then(() => {
        vibrate();
        logout();
        navigate(DocReminderRoutes.landing);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <ProfileHeader />
        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, mb: "66px", gap: 1, px: 3 }}>
          <StatsProfile />
          <SecurityCard title="Huella o Face ID" compact onActivate={() => {}} />
          <SecurityCard title="Código PIN" compact onActivate={() => {}} />

          {/* Spacer — pushes buttons to bottom */}
          <Box sx={{ flex: 1 }} />

          <Button
            fullWidth
            variant="contained"
            sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
            onClick={handleLogout}
          >
            {isLoading ? <CircularProgress size={20} /> : "Cerrar sesión"}
          </Button>
        </Box>
        <BottomNav />
      </Box>
    </PageTransition>
  );
};
