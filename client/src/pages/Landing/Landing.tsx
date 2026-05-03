import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import { validateEmail } from "@/utils/validation";
import { vibrate } from "@/utils/haptics";
import { DocReminderRoutes } from "@/routes/routes";
import { PageTransition } from "@/components";
import { AUTH_URL } from "@/api/apiConfig";
import { textFieldSx } from "@/styles/commonStyle";
import { FastAccesButtons } from "./components/FastAccesButtons";

// Shared styles for sections
const sectionStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

export const Landing = () => {
  const [email, setEmail] = useState<string>("");
  const [savedEmail] = useState<string | null>(() => localStorage.getItem("userEmail"));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = () => {
    setIsLoading(true);
    axios
      .post(`${AUTH_URL}/otp`, { email })
      .then(() => {
        navigate(DocReminderRoutes.otp, { state: { email } });
      })
      .catch((err) => {
        console.log(err);
        setEmail("");
        setIsLoading(false);
      });
  };

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
          <DescriptionOutlinedIcon sx={{ fontSize: 72, color: "white" }} />
          <Typography variant="h4" fontWeight="bold" color="white">
            DocReminder
          </Typography>
          <Typography color="grey.400">Nunca más un documento vencido.</Typography>
        </Box>

        {/* Form */}
        <Box sx={{ ...sectionStyles, flex: 2, px: 3, gap: 2, pt: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" fontWeight="bold">
              Accede a tu cuenta
            </Typography>
            <Typography color="text.secondary">Sin contraseña. Sin complicaciones.</Typography>
          </Box>

          {/* Interactive elements */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              py: 1.5,
              width: "100%",
            }}
          >
            <TextField
              type="email"
              label="Correo electrónico"
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                ...textFieldSx,
              }}
            />
            <Button
              variant="contained"
              size="large"
              disabled={!validateEmail(email)}
              onClick={() => {
                vibrate();
                handleSubmit();
              }}
              sx={{ borderRadius: 8, py: 1.5, backgroundColor: "text.primary" }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Enviar código de acceso"
              )}
            </Button>
            {savedEmail && <FastAccesButtons />}
          </Box>
        </Box>
      </Box>
    </PageTransition>
  );
};
