import React from "react";
import { Box, CircularProgress } from "@mui/material";

export const Loading = () => {
  return (
    <Box
      data-testid="loading"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
        color: "inherit",
      }}
    >
      <CircularProgress sx={{ color: "inherit" }} size={20} />
    </Box>
  );
};
