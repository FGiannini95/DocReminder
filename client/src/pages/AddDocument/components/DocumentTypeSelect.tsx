import React from "react";

import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { textFieldSx } from "@/styles/commonStyle";
import { DocumentType } from "@/types/document";

interface DocumentTypeSelectProps {
  value: DocumentType | "";
  onChange: (value: DocumentType) => void;
  error?: string;
}

export const DocumentTypeSelect = ({ value, onChange, error }: DocumentTypeSelectProps) => {
  return (
    <FormControl sx={textFieldSx} required error={!!error}>
      <InputLabel>Tipo de documento</InputLabel>
      <Select
        value={value}
        label="Tipo de documento"
        onChange={(e) => onChange(e.target.value as DocumentType)}
      >
        <MenuItem value="passport">Pasaporte</MenuItem>
        <MenuItem value="id">DNI</MenuItem>
        <MenuItem value="driver_license">Carnet de conducir</MenuItem>
        <MenuItem value="health">Tarjeta sanitaria</MenuItem>
        <MenuItem value="credit_card">Tarjeta bancaria</MenuItem>
        <MenuItem value="custom">Otro</MenuItem>
      </Select>
      <FormHelperText>{error}</FormHelperText>
    </FormControl>
  );
};
