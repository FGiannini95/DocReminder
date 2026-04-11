import React from "react";

import { Box, Button, Typography } from "@mui/material";

import { useAddDependent } from "@/hooks";
import { AddDependentDrawer } from "../AddDependentDrawer/AddDependentDrawer";

interface GroupDependentsSectionProps {
  groupId: string;
}

export const GroupDependentsSection = ({ groupId }: GroupDependentsSectionProps) => {
  const { form, error, isLoading, open, handleOpen, handleClose, handleChange } =
    useAddDependent(groupId);
  return (
    <>
      <Box sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Personas a cargo</Typography>
          <Button variant="contained" size="small" color="inherit" onClick={handleOpen}>
            + Añadir
          </Button>
        </Box>
      </Box>
      <AddDependentDrawer
        open={open}
        form={form}
        onClose={handleClose}
        onChange={handleChange}
        //onConfrim={handleAddDependent}
        error={error}
        isLoading={isLoading}
      />
    </>
  );
};
