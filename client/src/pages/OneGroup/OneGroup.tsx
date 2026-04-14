import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Box } from "@mui/material";

import { DocumentCard, ErrorMessage, Loading, PageTransition } from "@/components";
import { DocReminderRoutes } from "@/routes/routes";
import { GroupHeader } from "./components/GroupHeader/GroupHeader";
import { GroupDependentsSection } from "./components/GroupDependentsSection/GroupDependentsSection";
import { GroupDetail } from "@/types/group";
import { fetchOneGroup } from "@/api/groupApi";
import { GroupMembersSection } from "./components/GroupMembersSection/GroupMembersSection";
import { scrollableContentSx } from "@/styles/commonStyle";

export const OneGroup = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isPending, isError } = useQuery<GroupDetail>({
    queryKey: ["group", id],
    queryFn: () => fetchOneGroup(id!),
    refetchInterval: 30000,
  });

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage message="Error al cargar el grupo" />;

  const sortedDocuments = [...(data.documents ?? [])].sort(
    (a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime()
  );

  return (
    <PageTransition>
      <Box sx={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <GroupHeader
          title={data?.group.name ?? ""}
          icon={data?.group.icon}
          memberCount={
            (data?.members.filter((m) => m.status === "active").length ?? 0) +
            (data?.dependents.length ?? 0)
          }
          onBack={() => navigate(DocReminderRoutes.home)}
          adminId={data.group.admin_id}
          groupId={id!}
        />
        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, mb: "56px", display: "block" }}>
          <GroupMembersSection members={data.members} adminId={data.group.admin_id} groupId={id!} />
          <GroupDependentsSection groupId={id!} dependents={data.dependents} />
          <DocumentCard
            documents={sortedDocuments}
            isError={false}
            isPending={false}
            title="Documentos del grupo"
          />
        </Box>
      </Box>
    </PageTransition>
  );
};
