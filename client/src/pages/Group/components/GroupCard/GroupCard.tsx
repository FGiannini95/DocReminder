import React from "react";

import { Box, Button, Typography } from "@mui/material";

import { EmptyState } from "../../../../components/EmptyState/EmptyState";

export const GroupCard = () => {
  return (
    <Box sx={{ px: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            Mis grupos:
          </Typography>
          <Button variant="contained" size="small" color="inherit">
            + Crear grupo
          </Button>
        </Box>
        <EmptyState message="Aún no has creado ningún grupo." />
      </Box>
    </Box>
  );
};
