import React from "react";
import { useNavigate } from "react-router-dom";

import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Box, Divider, IconButton, Typography } from "@mui/material";

interface DocumentHeaderProps {
  title: string;
  onBack?: () => void;
}

export const DocumentHeader = ({ title, onBack }: DocumentHeaderProps) => {
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
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={onBack ?? (() => navigate(-1))} sx={{ color: "white" }}>
          <ArrowBackIosIcon />
        </IconButton>

        <Typography variant="h6" fontWeight="bold" color="white">
          {title}
        </Typography>
      </Box>
      <Divider sx={{ borderColor: "grey.700" }} />
    </Box>
  );
};
