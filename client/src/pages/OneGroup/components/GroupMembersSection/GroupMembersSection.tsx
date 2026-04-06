import React from "react";

import { Avatar, Box, Button, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { GroupMember } from "@/types/group";
import { useAuth } from "@/context";

interface GroupMembersSectionProps {
  members: GroupMember[];
  adminId: number;
}

export const GroupMembersSection = ({ members, adminId }: GroupMembersSectionProps) => {
  const { user } = useAuth();
  const isAdmin = user === adminId;

  return (
    <Box sx={{ px: 3, pb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography fontWeight="bold">Miembros</Typography>
        <Button variant="contained" size="small" color="inherit">
          + Invitar
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        {members.map((member) => (
          <Box key={member.user_id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar />
            <Box sx={{ flex: 1 }}>
              <Typography fontWeight="bold"> federico</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                admin
              </Typography>
            </Box>
            {isAdmin && <DeleteIcon />}
          </Box>
        ))}
      </Box>
    </Box>
  );
};
