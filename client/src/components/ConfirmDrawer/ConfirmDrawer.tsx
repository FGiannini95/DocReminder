import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { BaseDrawer } from "../BaseDrawer/BaseDrawer";
import { containedButtonSx } from "@/styles/commonStyle";

interface ConfirmDrawerProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
  title: string;
  message: string;
  confirmLabel: string;
}

export const ConfirmDrawer = ({
  open,
  onClose,
  onConfirm,
  isLoading,
  title,
  message,
  confirmLabel,
}: ConfirmDrawerProps) => {
  return (
    <BaseDrawer open={open} onClose={onClose}>
      <Box>
        <Typography fontWeight="bold" fontSize={16}>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {message}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={onClose}
          sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
        >
          Cancelar
        </Button>
        <Button
          fullWidth
          variant="contained"
          size="large"
          onClick={onConfirm}
          sx={{
            ...containedButtonSx,
            backgroundColor: "rgba(239, 83, 80, 0.4)",
            color: "error.dark",
            border: "1px solid",
          }}
        >
          {isLoading ? <CircularProgress size={20} /> : confirmLabel}
        </Button>
      </Box>
    </BaseDrawer>
  );
};
