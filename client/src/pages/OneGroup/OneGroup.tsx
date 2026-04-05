import React from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box } from "@mui/material";

import { ErrorMessage, Loading, PageTransition } from "@/components";
import { DocReminderRoutes } from "@/routes/routes";
import { GroupHeader } from "./components/GroupHeader/GroupHeader";
import { GroupDependentsSection } from "./components/GroupDependentsSection/GroupDependentsSection";
import { GroupMembersSection } from "./components/GroupMembersSection/GroupMembersSection";
import { useQuery } from "@tanstack/react-query";
import { GroupDetail } from "@/types/group";
import { fetchOneGroup } from "@/api/groupApi";

export const OneGroup = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isPending, isError } = useQuery<GroupDetail>({
    queryKey: ["group", id],
    queryFn: () => fetchOneGroup(id!),
  });

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage message="Error al cargar el grupo" />;

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <GroupHeader
          title={data?.group.name ?? ""}
          memberCount={data?.members.length ?? 0}
          onBack={() => navigate(DocReminderRoutes.home)}
        />
        <GroupMembersSection />
        <GroupDependentsSection />
      </Box>
    </PageTransition>
  );
};
