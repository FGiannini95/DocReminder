import React from "react";
import { Box, Typography } from "@mui/material";

interface StatsProfileProps {
  totalDocuments: number;
  totalGroups: number;
}

export const StatsProfile = ({ totalDocuments, totalGroups }: StatsProfileProps) => {
  const stats = [
    { label: "Documentos", value: totalDocuments },
    { label: "Grupos", value: totalGroups },
  ];

  const statBoxSx = {
    flex: 1,
    textAlign: "center",
    borderRadius: 2,
    p: 1,
    border: "2px solid",
  };

  return (
    <Box sx={{ display: "flex", width: "100%", py: 3, gap: 1 }}>
      {stats.map(({ label, value }) => (
        <Box key={label} sx={statBoxSx}>
          <Typography variant="h5" fontWeight="bold">
            {value}
          </Typography>
          <Typography variant="caption">{label}</Typography>
        </Box>
      ))}
    </Box>
  );
};
