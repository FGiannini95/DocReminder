import React from "react";

import { Box, Button, Chip, CircularProgress, TextField, Typography } from "@mui/material";
import { BaseDrawer } from "@/components";

import { containedButtonSx, textFieldSx } from "@/styles/commonStyle";
import { GroupDependent } from "@/types/group";

interface AddDependentDrawerProps {
  open: boolean;
  form: GroupDependent;
  onClose: () => void;
  onChange: (field: keyof GroupDependent, value: string) => void;
  //onConfirm: () => void;
  error: string;
  isLoading: boolean;
}

const dependentEmojis: string[] = ["👶", "👦", "👧", "👨", "👩", "👴", "👵"];

export const AddDependentDrawer = ({
  open,
  form,
  onClose,
  onChange,
  isLoading,
  error,
}: AddDependentDrawerProps) => {
  return (
    <BaseDrawer open={open} onClose={onClose}>
      <TextField
        type="name"
        label="Nombre"
        value={form.name}
        onChange={(e) => onChange("name", e.target.value)}
        variant="outlined"
        sx={textFieldSx}
        required
        error={!!error}
        helperText={error}
      />

      <Box>
        <Typography variant="body2" color="text.secondary" mb={1}>
          Relación
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {["Hijo/a", "Padre/Madre", "Abuelo/a", "Otro"].map((rel) => {
            const isSelected = form.relationship === rel;
            return (
              <Chip
                key={rel}
                label={rel}
                onClick={() => onChange("relationship", rel)}
                variant={isSelected ? "filled" : "outlined"}
                sx={{
                  backgroundColor: isSelected ? "text.primary" : "transparent",
                  color: isSelected ? "background.default" : "text.primary",
                  borderColor: "text.primary",
                  "&:hover": {
                    backgroundColor: isSelected ? "text.primary" : "transparent",
                  },
                  "&&.MuiChip-root:active": {
                    backgroundColor: isSelected ? "text.primary" : "transparent",
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      <TextField
        label="Fecha de nacimiento"
        value={form.birth_date}
        //onChange={onChange}
        variant="outlined"
        sx={textFieldSx}
      />

      <Box sx={{ display: "flex", gap: 1 }}>
        {dependentEmojis.map((dependentEmoji) => (
          <Box
            key={dependentEmoji}
            onClick={() => onChange("avatar", dependentEmoji)}
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
              borderColor: form.avatar === dependentEmoji ? "text.primary" : "grey.300",
              bgcolor: form.avatar === dependentEmoji ? "grey.200" : "transparent",
            }}
          >
            {dependentEmoji}
          </Box>
        ))}
      </Box>

      <Button
        fullWidth
        variant="contained"
        sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
        disabled={!form.name}
      >
        {isLoading ? <CircularProgress size={20} /> : "Añadir"}
      </Button>
    </BaseDrawer>
  );
};
