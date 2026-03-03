import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import { validateOtp } from "@/utils/validation";

// Shared styles for sections
const sectionStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

export const Otp = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));

  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Top bar */}
      <Box
        sx={{
          px: 3,
          py: 1.5,
          backgroundColor: "grey.900",
        }}
      >
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIosIcon fontSize="small" aria-hidden />}
          sx={{ color: "white" }}
        >
          Volver
        </Button>
      </Box>

      {/* Icon */}
      <Box
        sx={{
          ...sectionStyles,
          justifyContent: "center",
          flex: 1,
        }}
      >
        <EmailOutlinedIcon sx={{ fontSize: 72, color: "primary.text" }} />
      </Box>

      <Box sx={{ ...sectionStyles, flex: 2, px: 3, gap: 2 }}>
        {/* Title and subtitle */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="h6" fontWeight="bold">
            Revisa tu correo
          </Typography>
          <Typography color="text.secondary">Hemos enviado un código de 6 dígitos a</Typography>
          <Typography fontWeight="bold">{email}</Typography>
        </Box>

        {/* OTP boxes */}
        <Box sx={{ display: "flex", gap: 1, py: 1.5 }}>
          {otp.map((digit, i) => (
            <TextField
              key={i}
              value={digit}
              onChange={(e) => handleChange(e.target.value, i)}
              inputProps={{ maxLength: 1, style: { textAlign: "center" } }}
              sx={{ width: 44 }}
            />
          ))}
        </Box>

        {/* Confirmation button */}
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!validateOtp(otp.join(""))}
          sx={{ borderRadius: 8, py: 1.5, backgroundColor: "text.primary" }}
        >
          Verificar código
        </Button>

        {/* Link and countdown */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <Typography color="text.secondary">¿No recibiste el código?</Typography>
          <Typography fontWeight="bold">Renviar código (0:47)</Typography>
        </Box>

        {/* Warning */}
        <Alert severity="warning" sx={{ width: "100%", borderRadius: 2 }}>
          Código válido durante 5 minutos
        </Alert>
      </Box>
    </Box>
  );
};
