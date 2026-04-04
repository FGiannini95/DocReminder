import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Box, Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { DocReminderRoutes } from "@/routes/routes";
import { scrollableContentSx } from "@/styles/commonStyle";
import { Document } from "@/types/document";
import { fetchAllDocuments } from "@/api/documentApi";
import { BottomNav, DocumentCard, PageTransition } from "@/components";
import { HomeHeader } from "./components/HomeHeader";
import { StatusBlocks } from "./components/StatusBlocks";
import { GroupCard } from "../Group/components/GroupCard/GroupCard";

const daysUntil = (dateStr: string) =>
  Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

export const Home = () => {
  const navigate = useNavigate();

  const {
    data: documents,
    isPending,
    isError,
  } = useQuery<Document[]>({
    queryKey: ["documents"],
    queryFn: fetchAllDocuments,
  });

  const sortedDocuments = [...(documents ?? [])].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  const urgent = documents?.filter((d) => daysUntil(d.expiryDate) <= 30).length;
  const upcoming = documents?.filter(
    (d) => daysUntil(d.expiryDate) > 30 && daysUntil(d.expiryDate) <= 60
  ).length;
  const ok = documents?.filter((d) => daysUntil(d.expiryDate) > 60).length;

  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <HomeHeader urgent={urgent ?? 0} />
        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, mb: "56px", display: "block" }}>
          <StatusBlocks urgent={urgent ?? 0} upcoming={upcoming ?? 0} ok={ok ?? 0} />{" "}
          <DocumentCard documents={sortedDocuments} isError={isError} isPending={isPending} />
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
