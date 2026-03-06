import React from "react";

import { Box, Typography } from "@mui/material";

import { EmptyState } from "../EmptyState/EmptyState";

export const GroupCard = () => {
  return (
    <Box sx={{ px: 3 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* TODO: replace "federico" with emailPrefix prop */}
        <Typography variant="h6" fontWeight="bold">
          Mis grupos:
        </Typography>
        <Typography>
          If there is content, map throught i and display in this section. Else, show EmptyState
        </Typography>
        <EmptyState />
      </Box>
    </Box>
  );
};
