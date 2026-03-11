import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { BottomNav, DocumentCard, GroupCard, PageTransition } from "@/components";
import { HomeHeader } from "./components/HomeHeader";
import { StatusBlocks } from "./components/StatusBlocks";
import { DocReminderRoutes } from "@/routes/routes";
import { scrollableContentSx } from "@/styles/commonStyle";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <HomeHeader />
        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, mb: "56px", display: "block" }}>
          <StatusBlocks urgent={2} upcoming={6} ok={1} />
          <DocumentCard />
          <GroupCard />
        </Box>
        <Fab
          aria-label="add"
          sx={{ position: "fixed", bottom: 72, right: 16 }}
          onClick={() => navigate(DocReminderRoutes.addDocument)}
        >
          <AddIcon />
        </Fab>
        <BottomNav />
      </Box>
    </PageTransition>
  );
};
