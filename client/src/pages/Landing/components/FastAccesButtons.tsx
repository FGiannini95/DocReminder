import { useNavigate } from "react-router-dom";

import { Box, Divider, IconButton, Typography } from "@mui/material";
import DialpadIcon from "@mui/icons-material/Dialpad";
import FingerprintIcon from "@mui/icons-material/Fingerprint";

import { DocReminderRoutes } from "@/routes/routes";
import { vibrate } from "@/utils/haptics";
import { useWebAuthn } from "@/hooks";
import { useAuth } from "@/context";

export const FastAccesButtons = () => {
  const navigate = useNavigate();
  const { verifyFingerprint } = useWebAuthn();
  const { login } = useAuth();

  const savedPin = localStorage.getItem("pinEnabled") === "true";
  const savedFingerprint = localStorage.getItem("fingerprintEnabled") === "true";
  const savedEmail = localStorage.getItem("userEmail");

  if (!savedPin && !savedFingerprint) return null;

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
        {savedFingerprint && (
          <IconButton
            sx={{ border: "1px solid", borderRadius: 3, p: 1.5 }}
            onClick={async () => {
              vibrate();
              try {
                const data = await verifyFingerprint(savedEmail!);
                login(data.newAccessToken); // ← stesso pattern del PIN
                navigate(DocReminderRoutes.home);
              } catch (err) {
                console.log(err);
              }
            }}
          >
            <FingerprintIcon sx={{ fontSize: 32 }} />
          </IconButton>
        )}
      </Box>
    </>
  );
};
