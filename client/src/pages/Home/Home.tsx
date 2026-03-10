import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { BottomNav, DocumentCard, GroupCard, PageTransition } from "@/components";
import { HomeHeader } from "./components/HomeHeader";
import { StatusBlocks } from "./components/StatusBlocks";
import { DocReminderRoutes } from "@/routes/routes";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <HomeHeader />
        {/* Scrollable content */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            mt: "56px",
            mb: "56px",
            py: 4,
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          <StatusBlocks urgent={2} upcoming={6} ok={1} />
          <DocumentCard />
          {/* <GroupCard /> */}
        </Box>

        <Fab
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
