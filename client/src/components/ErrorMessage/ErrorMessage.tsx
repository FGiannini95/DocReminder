import React from "react";
import { Box, Typography } from "@mui/material";

export const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "50vh",
      }}
    >
      <Typography color="error">{message}</Typography>
    </Box>
  );
};
