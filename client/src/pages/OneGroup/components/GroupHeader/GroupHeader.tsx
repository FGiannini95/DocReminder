import React from "react";
import { useNavigate } from "react-router-dom";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Box, Divider, IconButton, Typography } from "@mui/material";

interface GroupHeaderProps {
  title: string;
  memberCount: number;
  onBack?: () => void;
}

export const GroupHeader = ({ title, memberCount, onBack }: GroupHeaderProps) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "grey.900",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={onBack ?? (() => navigate(-1))} sx={{ color: "white" }}>
          <ArrowBackIosIcon />
        </IconButton>

        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Typography variant="h6" fontWeight="bold" color="white" lineHeight={1.2}>
            {title}
          </Typography>
          <Typography variant="caption" color="grey.400">
            {memberCount === 1 ? "1 miembro" : `${memberCount} miembros`}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: "grey.700" }} />
    </Box>
  );
};
