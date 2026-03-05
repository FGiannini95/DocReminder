import React from "react";

import { Box, Typography } from "@mui/material";

import { PageTransition } from "@/components";

export const Home = () => {
  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <Typography variant="h4" fontWeight="bold">
          ¡Bienvenido en home!
        </Typography>
      </Box>
    </PageTransition>
  );
};
