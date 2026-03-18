import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Box, Button, CircularProgress } from "@mui/material";

import { containedButtonSx, scrollableContentSx } from "@/styles/commonStyle";
import { Document } from "@/types/document";
import { vibrate } from "@/utils/haptics";
import { DocReminderRoutes } from "@/routes/routes";
import { axiosInstance } from "@/api/axiosInstance";
import { AUTH_URL } from "@/api/apiConfig";
import { fetchAllDocuments } from "@/api/documentApi";
import { useAuth } from "@/context";
import { BottomNav, PageTransition, SecurityCard } from "@/components";
import { ProfileHeader } from "./components/ProfileHeader";
import { StatsProfile } from "./components/StatsProfile";

export const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: documents } = useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: fetchAllDocuments,
  });

  const totalDocuments = documents?.length;

  const handleLogout = () => {
    setIsLoading(true);
    axiosInstance
      .post(`${AUTH_URL}/logout`)
      .then(() => {
        vibrate();
        logout();
        navigate(DocReminderRoutes.landing);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <ProfileHeader />
        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, mb: "66px", gap: 1, px: 3 }}>
          <StatsProfile totalDocuments={totalDocuments ?? 0} totalGroups={0} />
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
