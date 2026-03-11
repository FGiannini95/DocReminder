import React from "react";

import { Box, Typography } from "@mui/material";
import { useAuth } from "@/context";

export const HomeHeader = () => {
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
        {/* TODO: replace "federico" with emailPrefix prop */}
        <Typography variant="h6" fontWeight="bold" color="white">
          Hola {emailPrefix}
        </Typography>
        {/* TODO: show "Todo bajo control" in green if urgentCount === 0, red alert if > 0 */}
        <Typography sx={{ color: "error.light" }}>Tienes 2 documentos urgentes.</Typography>
      </Box>
    </Box>
  );
};
