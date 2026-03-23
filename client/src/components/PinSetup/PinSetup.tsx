import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, CircularProgress, TextField } from "@mui/material";

import { PageTransition } from "../PageTransition/PageTransition";
import { DocumentHeader } from "../DocumentHeader/DocumentHeader";
import { containedButtonSx, scrollableContentSx, textFieldSx } from "@/styles/commonStyle";

export const PinSetup = () => {
  const [pin, setPin] = useState<string[]>(Array(4).fill(""));
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleChange = (value: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
  };

  const handleSubmit = () => {
    console.log("Hi from submitting pin");
  };

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <DocumentHeader title="Código PIN" onBack={() => navigate(-1)} />
        <Box sx={{ ...scrollableContentSx, p: 3 }}>
          {/* PIN boxes */}
          <Box sx={{ display: "flex", gap: 1, py: 1.5 }}>
            {pin.map((digit, i) => (
              <TextField
                key={i}
                autoFocus={i === 0}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                inputProps={{
                  maxLength: 1,
                  style: { textAlign: "center" },
                  type: "password",
                  inputMode: "numeric",
                }}
                sx={{
                  ...textFieldSx,
                }}
              />
            ))}
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={20} /> : "Guardar PIN"}
          </Button>
        </Box>
      </Box>
    </PageTransition>
  );
};
