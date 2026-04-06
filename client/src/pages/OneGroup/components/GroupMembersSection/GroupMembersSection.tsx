import React from "react";

import { Avatar, Box, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { GroupMember } from "@/types/group";
import { useGroupMember } from "@/hooks";

interface GroupMembersSectionProps {
  members: GroupMember[];
  adminId: number;
}

export const GroupMembersSection = ({ members, adminId }: GroupMembersSectionProps) => {
  const { isAdmin, sortedMembers, getMemberInfo } = useGroupMember({ members, adminId });

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography fontWeight="bold">Miembros</Typography>
        <Button variant="contained" size="small" color="inherit">
          + Invitar
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {sortedMembers.map((member) => {
          const { displayName, avatar } = getMemberInfo(member);
          const isMemberAdmin = member.user_id === adminId;

          return (
            <Box key={member.user_id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar>{avatar}</Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography fontWeight="bold">{displayName}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                  {isMemberAdmin ? "Admin" : member.status === "pending" ? "Pendiente" : "Miembro"}
                </Typography>
              </Box>

              {/* delete icon: only if current user is admin AND member is not admin */}
              {isAdmin && !isMemberAdmin && <DeleteIcon />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};
