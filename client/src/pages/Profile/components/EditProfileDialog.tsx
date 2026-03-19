import { containedButtonSx } from "@/styles/commonStyle";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";
import React from "react";

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export const EditProfileDialog = ({ open, onClose }: EditProfileDialogProps) => {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const email = formJson.email;
    console.log(email);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogContentText>Actualiza tu nombre de usuario</DialogContentText>
        <form onSubmit={handleSubmit} id="subscription-form">
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="nombre"
            label="Nombre"
            type="name"
            fullWidth
            variant="standard"
          />
        </form>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{
            flex: 1,
            ...containedButtonSx,
            borderColor: "text.primary",
            border: "2px solid",
            color: "text.primary",
          }}
        >
          Volver
        </Button>
        <Button
          type="submit"
          form="subscription-form"
          variant="contained"
          sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
        >
          Modificar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
