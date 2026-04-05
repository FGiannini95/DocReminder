import React from "react";
import { useNavigate } from "react-router-dom";

import { Box } from "@mui/material";

import { PageTransition } from "@/components";
import { DocReminderRoutes } from "@/routes/routes";
import { GroupHeader } from "./components/GroupHeader/GroupHeader";
import { GroupDependentsSection } from "./components/GroupDependentsSection/GroupDependentsSection";
import { GroupMembersSection } from "./components/GroupMembersSection/GroupMembersSection";

export const OneGroup = () => {
  const navigate = useNavigate();
  return (
    <PageTransition>
      <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <GroupHeader title="Un grupo y ya está" onBack={() => navigate(DocReminderRoutes.home)} />
        <GroupMembersSection />
        <GroupDependentsSection />
      </Box>
    </PageTransition>
  );
};
