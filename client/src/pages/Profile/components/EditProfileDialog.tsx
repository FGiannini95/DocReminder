import React from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
} from "@mui/material";

import { containedButtonSx, textFieldSx } from "@/styles/commonStyle";
import { useAuth } from "@/context";
import { axiosInstance } from "@/api/axiosInstance";
import { AUTH_URL } from "@/api/apiConfig";

interface EditProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

export const EditProfileDialog = ({ open, onClose }: EditProfileDialogProps) => {
  const { updateDisplayName } = useAuth();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    const displayName = formJson.nombre as string;

    axiosInstance
      .put(`${AUTH_URL}/update-name`, { displayName })
      .then(() => {
        updateDisplayName(displayName);
        onClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <DialogContentText>Actualiza tu nombre de usuario</DialogContentText>
        <form onSubmit={handleSubmit} id="edit-form">
          <TextField
            sx={{ ...textFieldSx }}
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
            border: "1px solid",
            color: "text.primary",
          }}
        >
          Volver
        </Button>
        <Button
          type="submit"
          form="edit-form"
          variant="contained"
          sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
        >
          Modificar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
