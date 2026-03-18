import React from "react";

import { Box, Typography } from "@mui/material";

import { useAuth } from "@/context";

interface HomeHeaderProps {
  urgent: number;
}

export const HomeHeader = ({ urgent }: HomeHeaderProps) => {
  const { email } = useAuth();
  const emailPrefix = email?.split("@")[0];

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "grey.900",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6" fontWeight="bold" color="white">
          Hola {emailPrefix}
        </Typography>
        {urgent > 0 ? (
          <Typography sx={{ color: "error.light" }}>
            Tienes {urgent} documentos urgentes.
          </Typography>
        ) : (
          <Typography sx={{ color: "success.light" }}>Todo bajo control.</Typography>
        )}{" "}
      </Box>
    </Box>
  );
};
