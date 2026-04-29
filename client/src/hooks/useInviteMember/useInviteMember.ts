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
  const isEmailValid = emailRegex.test(inviteEmail);

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

    if (!inviteEmail || !isEmailValid) {
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
      .catch((err) => {
        const msg = err.response?.data?.message;
        if (msg === "Cannot invite yourself") {
          setInviteError("Admin ya presente");
        } else if (msg === "This user already belong to the group") {
          setInviteError("Este usuario ya es miembro del grupo");
        } else if (msg === "Pending invite already sent") {
          setInviteError("Ya existe una invitación pendiente para este email");
        } else {
          setInviteError("Error al enviar la invitación");
        }
        setIsInviteLoading(false);
      });
  };

  return {
    inviteEmail,
    isEmailValid,
    inviteError,
    isInviteLoading,
    inviteOpen,
    handleChangeEmail,
    handleOpenInviteDrawer,
    handleCloseInviteDrawer,
    handleInvite,
  };
};
