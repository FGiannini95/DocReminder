import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Box, Button, CircularProgress, IconButton, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
import { EditProfileDialog } from "./components/EditProfileDialog";
import { useWebAuthn } from "@/hooks";

export const Profile = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { logout, pinEnabled, togglePin, fingerprintEnabled, toggleFingerprint, login } = useAuth();
  const { registerFingerprint } = useWebAuthn();
  const navigate = useNavigate();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handlePin = () => {
    if (!pinEnabled && !localStorage.getItem("pinEnabled")) {
      // Pin doesn't exist
      navigate(DocReminderRoutes.pinSetup);
    } else {
      // pin exists → toggle on/off
      const newValue = !pinEnabled;
      togglePin(newValue);
      localStorage.setItem("pinEnabled", String(newValue));

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        axiosInstance
          .put(`${AUTH_URL}/toggle-pin`, { pin_enabled: newValue })
          .catch((err) => console.log(err));
      }, 500);
    }
  };

  const handleFingerPrint = async () => {
    if (!fingerprintEnabled && !localStorage.getItem("fingerprintEnabled")) {
      // fingerprint not registered → start registration
      try {
        const data = await registerFingerprint();
        login(data.newAccessToken);
        toggleFingerprint(true);
        localStorage.setItem("fingerprintEnabled", "true");
      } catch (err) {
        console.log(err);
      }
    } else {
      // fingerprint alredy registered → toggle on/off
      const newValue = !fingerprintEnabled;
      toggleFingerprint(newValue);
      localStorage.setItem("fingerprintEnabled", String(newValue));

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        axiosInstance
          .put(`${AUTH_URL}/toggle-fingerprint`, { fingerprint_enabled: newValue })
          .catch((err) => console.log(err));
      }, 500);
    }
  };

  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <ProfileHeader />
        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, mb: "66px", gap: 1, px: 3 }}>
          <StatsProfile totalDocuments={totalDocuments ?? 0} totalGroups={0} />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              border: "2px solid",
              borderRadius: 8,
              p: 2,
            }}
            onClick={handleOpen}
          >
            <Typography fontWeight="bold">Cambiar nombre</Typography>
            <IconButton>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>

          <SecurityCard
            title="Huella o Face ID"
            checked={fingerprintEnabled}
            compact
            onActivate={handleFingerPrint}
            onClick={() => {}}
          />

          <SecurityCard
            title="Código PIN"
            checked={pinEnabled}
            compact
            onActivate={handlePin}
            onClick={() => navigate(DocReminderRoutes.pinSetup)}
          />

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
      <EditProfileDialog open={open} onClose={handleClose} />
    </PageTransition>
  );
};
