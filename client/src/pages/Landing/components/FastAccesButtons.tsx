import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Divider, IconButton, Typography } from "@mui/material";
import DialpadIcon from "@mui/icons-material/Dialpad";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

import { DocReminderRoutes } from "@/routes/routes";
import { vibrate } from "@/utils/haptics";

export const FastAccesButtons = () => {
  const navigate = useNavigate();

  const savedPin = localStorage.getItem("pinEnabled") === "true";
  //const savedHuella = localStorage.getItem("huellaEnabled") === "true";

  if (!savedPin) return null;
  // if (!savedPin && !savedHuella) return null;

  return (
    <>
      <Divider sx={{ width: "100%" }}>
        <Typography color="text.secondary">o </Typography>
      </Divider>
      <Typography variant="body2" color="text.secondary" textAlign="center">
        Acceso rápido
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        {savedPin && (
          <IconButton
            sx={{ border: "1px solid", borderRadius: 3, p: 1.5 }}
            onClick={() => {
              vibrate();
              navigate(DocReminderRoutes.pinLogin);
            }}
          >
            <DialpadIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}
        <IconButton sx={{ border: "1px solid", borderRadius: 3, p: 1.5 }}>
          <FingerprintIcon sx={{ fontSize: 32 }} />
        </IconButton>
      </Box>
    </>
  );
};
