import { GROUP_URL } from "@/api/apiConfig";
import { axiosInstance } from "@/api/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useInviteMember = (groupId: string) => {
  const [inviteEmail, setInviteEmail] = useState<string>("");
  const [inviteError, setInviteError] = useState<string>("");
  const [isInviteLoading, setIsInviteLoading] = useState<boolean>(false);
  const [inviteOpen, setInviteOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteEmail(e.target.value);
    setInviteError("");
  };

  const handleOpenInviteDrawer = () => setInviteOpen(true);

  const handleCloseInviteDrawer = () => {
    setInviteEmail("");
    setInviteError("");
    setIsInviteLoading(false);
    setInviteOpen(false);
  };

  const handleInvite = () => {
    setIsInviteLoading(true);

    if (!inviteEmail || !emailRegex.test(inviteEmail)) {
      setInviteError("Email requerida");
      setIsInviteLoading(false);
      return;
    }

    axiosInstance
      .post(`${GROUP_URL}/${groupId}/invite-member`, { email: inviteEmail })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        setIsInviteLoading(false);
        handleCloseInviteDrawer();
      })
      .catch(() => setIsInviteLoading(false));
  };

  return {
    inviteEmail,
    inviteError,
    isInviteLoading,
    inviteOpen,
    handleChangeEmail,
    handleOpenInviteDrawer,
    handleCloseInviteDrawer,
    handleInvite,
  };
};
