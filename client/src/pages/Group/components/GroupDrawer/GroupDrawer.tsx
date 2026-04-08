import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Box, Button, CircularProgress, TextField } from "@mui/material";

import { containedButtonSx, textFieldSx } from "@/styles/commonStyle";
import { axiosInstance } from "@/api/axiosInstance";
import { GROUP_URL } from "@/api/apiConfig";
import { BaseDrawer } from "@/components";

interface GroupDrawerProps {
  open: boolean;
  onClose: () => void;
  groupId?: string;
  initialValues?: {
    name: string;
    icon: string | null;
  };
}

const emojis: string[] = ["👨‍👩‍👧", "🏠", "💼", "⭐", "❤️", "✈️", "🎓"];

export const GroupDrawer = ({ open, onClose, groupId, initialValues }: GroupDrawerProps) => {
  const [name, setName] = useState<string>(initialValues?.name ?? "");
  const [icon, setIcon] = useState<string>(initialValues?.icon ?? emojis[0]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const isEdit = !!initialValues;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setError("");
  };

  const handleSubmit = () => {
    setIsLoading(true);
    if (!name.trim()) {
      setError("Nombre obligatorio");
      setIsLoading(false);
      return;
    }
    setError("");

    axiosInstance
      .post(`${GROUP_URL}/add-group`, { name, icon })
      .then((res) => {
        navigate(`/group/${res.data.groupId}`);
        onClose();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const handleClose = () => {
    setName("");
    setError("");
    setIcon(emojis[0]);
    onClose();
  };

  const handleEdit = () => {
    setIsLoading(true);
    if (!name.trim()) {
      setError("Nombre obligatorio");
      setIsLoading(false);
      return;
    }

    axiosInstance
      .put(`${GROUP_URL}/edit-group/${groupId}`, { name, icon })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        setIsLoading(false);
        onClose();
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <BaseDrawer open={open} onClose={handleClose}>
      {/* Name input */}
      <TextField
        type="text"
        label="Nombre del grupo"
        value={name}
        onChange={handleChange}
        variant="outlined"
        sx={textFieldSx}
        required
        error={!!error}
        helperText={error}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        {emojis.map((emoji) => (
          <Box
            key={emoji}
            onClick={() => setIcon(emoji)}
            sx={{
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              cursor: "pointer",
              border: "1px solid",
              borderColor: icon === emoji ? "text.primary" : "grey.300",
              bgcolor: icon === emoji ? "grey.200" : "transparent",
            }}
          >
            {emoji}
          </Box>
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
        onClick={isEdit ? handleEdit : handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={20} /> : isEdit ? "Guardar" : "Crear grupo"}
      </Button>
    </BaseDrawer>
  );
};
