import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { Box, Fab, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { DocumentSection, ErrorMessage, Loading, PageTransition } from "@/components";
import { DocReminderRoutes } from "@/routes/routes";
import { GroupHeader } from "./components/GroupHeader/GroupHeader";
import { GroupDependentsSection } from "./components/GroupDependentsSection/GroupDependentsSection";
import { GroupDetail } from "@/types/group";
import { fetchOneGroup } from "@/api/groupApi";
import { GroupMembersSection } from "./components/GroupMembersSection/GroupMembersSection";
import { scrollableContentSx } from "@/styles/commonStyle";
import { vibrate } from "@/utils/haptics";
import { StatusBlocks } from "../Home/components/StatusBlocks";

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

  const daysUntil = (dateStr: string) =>
    Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  const urgent = data.documents.filter((d) => daysUntil(d.expiryDate) <= 30).length;
  const upcoming = data.documents.filter(
    (d) => daysUntil(d.expiryDate) > 30 && daysUntil(d.expiryDate) <= 60
  ).length;
  const ok = data.documents.filter((d) => daysUntil(d.expiryDate) > 60).length;

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
          onBack={() => navigate(-1)}
          adminId={data.group.admin_id}
          groupId={id!}
        />
        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, mb: "56px", display: "block" }}>
          <GroupMembersSection members={data.members} adminId={data.group.admin_id} groupId={id!} />
          <GroupDependentsSection groupId={id!} dependents={data.dependents} />
          <Box sx={{ px: 3 }}>
            <Typography fontWeight="bold">Estadisticas:</Typography>
          </Box>
          <StatusBlocks urgent={urgent ?? 0} upcoming={upcoming ?? 0} ok={ok ?? 0} />
          <DocumentSection
            documents={sortedDocuments}
            isError={false}
            isPending={false}
            title="Documentos del grupo"
            groupId={id}
          />
        </Box>
        <Fab
          aria-label="add"
          sx={{ position: "fixed", bottom: 20, right: 16 }}
          onClick={() => {
            vibrate();
            navigate(`${DocReminderRoutes.addDocument}?groupId=${id}`);
          }}
        >
          <AddIcon />
        </Fab>
      </Box>
    </PageTransition>
  );
};
