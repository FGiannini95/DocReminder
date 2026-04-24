import React from "react";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from "@mui/material";
import IosShareOutlinedIcon from "@mui/icons-material/IosShareOutlined";

import { containedButtonSx } from "@/styles/commonStyle";
import { usePwa } from "@/context";

interface PWADialogProps {
  open: boolean;
  onClose: () => void;
}

export const PWADialog = ({ open, onClose }: PWADialogProps) => {
  const { isInstallable, triggerInstall } = usePwa();

  const isIos =
    typeof window !== "undefined" && /iphone|ipad|ipod/i.test(window.navigator.userAgent || "");

  // On iOS there is no beforeinstallprompt, so we show manual instructions instead
  const isIosInstructionFlow = isIos && !isInstallable;

  const handleConfirm = async () => {
    await triggerInstall();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogContentText>
          {isIosInstructionFlow ? "Añadir a la pantalla de inicio" : "Crear acceso directo"}
        </DialogContentText>
        <Typography>
          {isIosInstructionFlow ? (
            <Box component="span">
              Haz clic en
              <IosShareOutlinedIcon sx={{ verticalAlign: "top", fontSize: "1.2em", mx: 0.5 }} />
              en el navegador y selecciona 'Añadir a la pantalla de inicio' para instalar
              DocReminder
            </Box>
          ) : (
            "¿Quieres instalar la aplicación para una mejor experiencia?"
          )}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            flex: 1,
            ...containedButtonSx,
            border: "1px solid",
            borderColor: "text.primary",
            color: "text.primary",
          }}
        >
          Cancelar
        </Button>
        {/* On iOS we only show instructions, no confirm button needed */}
        {!isIosInstructionFlow && (
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
          >
            Instalar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
