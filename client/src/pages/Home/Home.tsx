import React from "react";

import { Box } from "@mui/material";

import { BottomNav, DocumentCard, PageTransition } from "@/components";
import { HomeHeader } from "./components/HomeHeader";
import { StatusBlocks } from "./components/StatusBlocks";

export const Home = () => {
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
        </Box>
        <BottomNav />
      </Box>
    </PageTransition>
  );
};
