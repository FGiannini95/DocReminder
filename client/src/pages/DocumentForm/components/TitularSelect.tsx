import React from "react";

import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

import { textFieldSx } from "@/styles/commonStyle";
import { GroupDependent } from "@/types/group";

interface TitularSelectProps {
  value: string;
  onChange: (value: string) => void;
  dependents: GroupDependent[];
}

export const TitularSelect = ({ value, onChange, dependents }: TitularSelectProps) => {
  return (
    <FormControl sx={textFieldSx}>
      <InputLabel>Titular</InputLabel>
      <Select value={value} label="Titular" onChange={(e) => onChange(e.target.value)}>
        <MenuItem value="me">Yo</MenuItem>
        {dependents.map((dep) => (
          <MenuItem key={dep.group_dependents_id} value={String(dep.group_dependents_id)}>
            {dep.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
