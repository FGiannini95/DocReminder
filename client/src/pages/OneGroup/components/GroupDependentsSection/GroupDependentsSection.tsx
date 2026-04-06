import { Box, Button, Typography } from "@mui/material";
import React from "react";

export const GroupDependentsSection = () => {
  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography fontWeight="bold">Personas a cargo</Typography>
        <Button variant="contained" size="small" color="inherit">
          + Añadir
        </Button>
      </Box>
    </Box>
  );
};
