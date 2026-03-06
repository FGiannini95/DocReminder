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
        <StatusBlocks urgent={2} upcoming={6} ok={1} />
        <DocumentCard />
        <BottomNav />
      </Box>
    </PageTransition>
  );
};
