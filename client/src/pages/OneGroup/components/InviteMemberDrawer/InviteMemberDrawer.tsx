import React from "react";

import { BaseDrawer } from "@/components";
import { containedButtonSx, textFieldSx } from "@/styles/commonStyle";
import { Button, CircularProgress, TextField } from "@mui/material";

interface InviteMemberDrawerProps {
  open: boolean;
  email: string;
  onClose: () => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirm: () => void;
  error: string;
  isLoading: boolean;
}

export const InviteMemberDrawer = ({
  open,
  email,
  onClose,
  onChange,
  onConfirm,
  isLoading,
  error,
}: InviteMemberDrawerProps) => {
  return (
    <BaseDrawer open={open} onClose={onClose}>
      <TextField
        type="email"
        label="Correo"
        value={email}
        onChange={onChange}
        variant="outlined"
        sx={textFieldSx}
        required
        error={!!error}
        helperText={error}
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
        onClick={onConfirm}
        disabled={!email}
      >
        {isLoading ? <CircularProgress size={20} /> : "Invitar"}
      </Button>
    </BaseDrawer>
  );
};
