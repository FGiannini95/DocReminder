import React from "react";

import { Box, Typography } from "@mui/material";

export const HomeHeader = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: "grey.900" }}>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* TODO: replace "federico" with emailPrefix prop */}
        <Typography variant="h6" fontWeight="bold" color="white">
          Hola federico
        </Typography>
        {/* TODO: show "Todo bajo control" in green if urgentCount === 0, red alert if > 0 */}
        <Typography sx={{ color: "error.light" }}>Tienes 2 documentos urgentes.</Typography>
      </Box>
    </Box>
  );
};
