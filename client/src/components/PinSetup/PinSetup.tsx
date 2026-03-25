import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, CircularProgress, TextField } from "@mui/material";

import { PageTransition } from "../PageTransition/PageTransition";
import { DocumentHeader } from "../DocumentHeader/DocumentHeader";
import { containedButtonSx, scrollableContentSx, textFieldSx } from "@/styles/commonStyle";
import { axiosInstance } from "@/api/axiosInstance";
import { AUTH_URL } from "@/api/apiConfig";
import { useAuth } from "@/context";
import { useAutoAdvance } from "@/hooks";
import { DocReminderRoutes } from "@/routes/routes";

type PinMode = "create" | "verify";

interface PinSetupProps {
  mode: PinMode;
}

export const PinSetup = ({ mode }: PinSetupProps) => {
  const [pin, setPin] = useState<string[]>(Array(4).fill(""));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { togglePin, login } = useAuth();
  const { refs, handleInputChange } = useAutoAdvance(4);

  const savedEmail = localStorage.getItem("userEmail");

  const navigate = useNavigate();

  const handleChange = (value: string, index: number) => {
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    handleInputChange(value, index);
  };

  const handleSubmit = () => {
    setIsLoading(true);

    const request =
      mode === "create"
        ? axiosInstance.post(`${AUTH_URL}/save-pin`, { pin: pin.join("") })
        : axiosInstance.post(`${AUTH_URL}/verify-pin`, { pin: pin.join(""), email: savedEmail });

    request
      .then((res) => {
        if (mode === "create") {
          togglePin(true);
          localStorage.setItem("pinEnabled", "true");
          navigate(-1);
        } else {
          navigate(DocReminderRoutes.home);
          login(res.data.newAccessToken);
        }
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const isPinIncomplete = pin.some((digit) => digit.length === 0);

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <DocumentHeader
          title={mode === "create" ? "Código PIN" : "Acceder con PIN"}
          onBack={() => navigate(-1)}
        />
        <Box sx={{ ...scrollableContentSx, p: 3 }}>
          {/* PIN boxes */}
          <Box sx={{ display: "flex", gap: 1, py: 1.5 }}>
            {pin.map((digit, i) => (
              <TextField
                key={i}
                autoFocus={i === 0}
                inputRef={(el) => (refs.current[i] = el)}
                value={digit}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                }}
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
            disabled={isLoading || isPinIncomplete}
          >
            {isLoading ? (
              <CircularProgress size={20} sx={{ color: "inherit" }} />
            ) : mode === "create" ? (
              "Guardar PIN"
            ) : (
              "Acceder"
            )}
          </Button>
        </Box>
      </Box>
    </PageTransition>
  );
};
