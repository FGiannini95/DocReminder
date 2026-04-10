import React from "react";

import { Avatar, Box, Button, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { GroupMember } from "@/types/group";
import { useInviteMember, useMemberDisplay, useRemoveMember } from "@/hooks";
import { RemoveMemberDrawer } from "../RemoveMemberDrawer/RemoveMemberDrawer";
import { InviteMemberDrawer } from "../InviteMemberDrawer/InviteMemberDrawer";

interface GroupMembersSectionProps {
  members: GroupMember[];
  adminId: number;
  groupId: string;
}

export const GroupMembersSection = ({ members, adminId, groupId }: GroupMembersSectionProps) => {
  const { isAdmin, sortedMembers, getMemberInfo } = useMemberDisplay({ members, adminId });
  const { open, removeMember, isLoading, handleOpen, handleClose, handleRemove } =
    useRemoveMember(groupId);

  const {
    inviteEmail,
    inviteError,
    isInviteLoading,
    inviteOpen,
    handleChangeEmail,
    handleOpenInviteDrawer,
    handleCloseInviteDrawer,
    handleInvite,
  } = useInviteMember(groupId);

  const visibleMembers = sortedMembers.filter((member) => member.status === "active" || isAdmin);

  return (
    <>
      <Box sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography fontWeight="bold">Miembros</Typography>
          <Button variant="contained" size="small" color="inherit" onClick={handleOpenInviteDrawer}>
            + Invitar
          </Button>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          {visibleMembers.map((member) => {
            const { displayName, avatar } = getMemberInfo(member);
            const isMemberAdmin = member.user_id === adminId;

            return (
              <Box
                key={member.user_id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  opacity: member.status === "pending" ? 0.5 : 1,
                }}
              >
                <Avatar>{avatar}</Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight="bold">{displayName}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    {isMemberAdmin
                      ? "Admin"
                      : member.status === "pending"
                        ? "Pendiente"
                        : "Miembro"}
                  </Typography>
                </Box>

                {/* delete icon: only if current user is admin AND member is not admin */}
                {isAdmin && !isMemberAdmin && member.status === "active" && (
                  <IconButton onClick={() => handleOpen(member)} size="small" color="inherit">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>
      <RemoveMemberDrawer
        open={open}
        onClose={handleClose}
        member={removeMember}
        onConfirm={handleRemove}
        isLoading={isLoading}
      />
      <InviteMemberDrawer
        open={inviteOpen}
        email={inviteEmail}
        onClose={handleCloseInviteDrawer}
        onChange={handleChangeEmail}
        onConfirm={handleInvite}
        error={inviteError}
        isLoading={isInviteLoading}
      />
    </>
  );
};
