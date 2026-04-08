import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, CircularProgress, TextField } from "@mui/material";

import { containedButtonSx, textFieldSx } from "@/styles/commonStyle";
import { axiosInstance } from "@/api/axiosInstance";
import { GROUP_URL } from "@/api/apiConfig";
import { BaseDrawer } from "@/components";

interface GroupDrawerProps {
  open: boolean;
  onClose: () => void;
}

const emojis: string[] = ["👨‍👩‍👧", "🏠", "💼", "⭐", "❤️", "✈️", "🎓"];

export const GroupDrawer = ({ open, onClose }: GroupDrawerProps) => {
  const [name, setName] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [icon, setIcon] = useState<string>(emojis[0]);
  const navigate = useNavigate();

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
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={20} /> : "Crear grupo"}
      </Button>
    </BaseDrawer>
  );
};
