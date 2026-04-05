import React from "react";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";

import { DocumentHeader, PageTransition } from "@/components";
import { DocReminderRoutes } from "@/routes/routes";

export const OneGroup = () => {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <DocumentHeader
          title="Un grupo y ya está"
          onBack={() => navigate(DocReminderRoutes.home)}
        />
      </Box>
    </PageTransition>
  );
};
