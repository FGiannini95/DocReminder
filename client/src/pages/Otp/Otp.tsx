import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";

import { validateOtp } from "@/utils/validation";
import { vibrate } from "@/utils/haptics";
import { DocReminderRoutes } from "@/routes/routes";
import { AUTH_URL, GROUP_URL } from "@/api/apiConfig";
import { useAuth } from "@/context";
import { PageTransition } from "@/components";
import { textFieldSx } from "@/styles/commonStyle";
import { useAutoAdvance } from "@/hooks";
import { axiosInstance } from "@/api/axiosInstance";

// Shared styles for sections
const sectionStyles = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
};

export const Otp = () => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState<string | null>(null);
  const { refs, handleInputChange } = useAutoAdvance(6);

  const { login } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;

  const handleChange = (value: string, index: number) => {
    setError(null);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    handleInputChange(value, index);
  };

  const handleSubmit = () => {
    setIsLoading(true);
    axios
      .post(`${AUTH_URL}/otp/verify`, { email, otpCode: otp.join("") }, { withCredentials: true })
      .then((res) => {
        vibrate();
        login(res.data.accessToken);
        localStorage.setItem("userEmail", email);

        const pendingInvite = sessionStorage.getItem("inviteToken");
        if (pendingInvite) {
          sessionStorage.removeItem("inviteToken");
          axiosInstance
            .get(`${GROUP_URL}/accept-invite/${pendingInvite}`)
            .then((res) => {
              navigate(DocReminderRoutes.home, { replace: true });
              navigate(`/group/${res.data.groupId}`);
            })
            .catch(() => navigate(DocReminderRoutes.security, { state: { email } }));
          return;
        }

        navigate(DocReminderRoutes.security, { state: { email } });
      })
      .catch(() => {
        setError("Código incorecto o expirado");
        setOtp(Array(6).fill(""));
        setIsLoading(false);
      });
  };

  // Decrement countdown every second, stop at 0
  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Autofocus in iOS
  useEffect(() => {
    setTimeout(() => {
      refs.current[0]?.focus();
    }, 100);
  }, [refs]);

  const formattedCountdown = `0:${countdown < 10 ? `0${countdown}` : countdown}`;

  const handleResend = () => {
    vibrate();
    setIsResending(true);
    axios
      .post(`${AUTH_URL}/otp`, { email }, { withCredentials: true })
      .then(() => {
        setCountdown(60);
        setIsResending(false);
      })
      .catch((err) => {
        console.log(err);
        setIsResending(false);
      });
  };

  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header*/}
        <Box
          sx={{
            ...sectionStyles,
            flex: 1,
            gap: 1,
            justifyContent: "center",
            backgroundColor: "grey.900",
            position: "relative",
          }}
        >
          <Button
            onClick={() => navigate(-1)}
            startIcon={<ArrowBackIosIcon fontSize="small" aria-hidden />}
            sx={{ color: "white", position: "absolute", top: 8, left: 24 }}
          >
            Volver
          </Button>

          <EmailOutlinedIcon sx={{ fontSize: 72, color: "white" }} />
        </Box>

        <Box sx={{ ...sectionStyles, flex: 2, px: 3, gap: 2, pt: 4 }}>
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
                autoFocus={i === 0}
                inputRef={(el) => (refs.current[i] = el)}
                onChange={(e) => handleChange(e.target.value, i)}
                onKeyDown={(e) => {
                  if (!/[0-9]/.test(e.key) && e.key !== "Backspace") {
                    e.preventDefault();
                  }
                }}
                inputProps={{ maxLength: 1, style: { textAlign: "center" }, inputMode: "numeric" }}
                sx={{
                  ...textFieldSx,
                }}
              />
            ))}
          </Box>

          {/* Confirmation button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!validateOtp(otp.join(""))}
            onClick={() => {
              vibrate();
              handleSubmit();
            }}
            sx={{ borderRadius: 8, py: 1.5, backgroundColor: "text.primary" }}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : "Verificar código"}
          </Button>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ width: "100%" }}>
              {error}
            </Alert>
          )}

          {/* Countdown */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography color="text.secondary">¿No has recibido el código?</Typography>
            <Typography
              fontWeight="bold"
              onClick={countdown === 0 && !isResending ? handleResend : undefined}
              sx={{
                opacity: countdown === 0 ? 1 : 0.5,
              }}
            >
              {countdown === 0 ? "Reenviar código" : `Reenviar código (${formattedCountdown})`}
            </Typography>
          </Box>

          {/* Warning */}
          <Alert severity="warning" sx={{ width: "100%", borderRadius: 2 }}>
            Código válido durante 10 minutos
          </Alert>
        </Box>
      </Box>
    </PageTransition>
  );
};
