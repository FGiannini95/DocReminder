import React from "react";
import { useQuery } from "@tanstack/react-query";

import { Box } from "@mui/material";

import { BottomNav, PageTransition } from "@/components";
import { GroupCard } from "./components/GroupCard/GroupCard";
import { ProfileHeader } from "../Profile/components/ProfileHeader";
import { scrollableContentSx } from "@/styles/commonStyle";
import { fetchAllGroups } from "@/api/groupApi";
import { Group } from "@/types/group";

export const Groups = () => {
  const {
    data: groups,
    isPending: groupsPending,
    isError: groupsError,
  } = useQuery<Group[]>({
    queryKey: ["groups"],
    queryFn: fetchAllGroups,
    refetchInterval: 30000,
  });
  const sortedGroups = [...(groups ?? [])].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <PageTransition>
      <Box sx={{ height: "100dvh", display: "flex", flexDirection: "column" }}>
        <ProfileHeader />
        {/* Scrollable content */}
        <Box sx={{ ...scrollableContentSx, mb: "66px", gap: 1, px: 3 }}>
          <GroupCard groups={sortedGroups} isError={groupsError} isPending={groupsPending} />
        </Box>
        <BottomNav />
      </Box>
    </PageTransition>
  );
};
