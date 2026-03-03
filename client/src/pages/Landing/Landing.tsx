import { useState } from "react";
import { validateEmail } from "@/utils/validation";

import { Box, Typography, TextField, Divider, Button } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

// Shared styles for both sections
const sectionStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

export const Landing = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (email: string) => {
    console.log(email);
  };

  return (
    <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
      {/* Hero */}
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
              // Border color when input is focused
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "text.primary",
              },
              // Label color when focused
              "& .MuiInputLabel-root.Mui-focused": {
                color: "text.primary",
              },
              // Prevent browser autofill blue background
              "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus":
                {
                  transition: "background-color 99999s ease-in-out 0s",
                },
            }}
          />
          <Button
            variant="contained"
            size="large"
            disabled={!validateEmail(email)}
            sx={{ borderRadius: 8, py: 1.5, backgroundColor: "text.primary" }}
          >
            Enviar código de acceso
          </Button>
          <Divider sx={{ width: "100%" }}>
            <Typography color="text.secondary">o</Typography>
          </Divider>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            sx={{ borderRadius: 8, py: 1.5, color: "text.primary", borderColor: "text.primary" }}
          >
            Continuar con Google
          </Button>
        </Box>

        <Typography variant="caption" color="text.secondary">
          ¿Primera vez? Tu cuenta se crea automáticamente.
        </Typography>
      </Box>
    </Box>
  );
};
