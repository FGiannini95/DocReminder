import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { GroupMember } from "@/types/group";
import { axiosInstance } from "@/api/axiosInstance";
import { GROUP_URL } from "@/api/apiConfig";

export const useRemoveMember = (groupId: string) => {
  const [removeMember, setRemoveMember] = useState<GroupMember | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleOpen = (member: GroupMember) => {
    setRemoveMember(member);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRemove = () => {
    setIsLoading(true);
    axiosInstance
      .delete(`${GROUP_URL}/${groupId}/delete-member/${removeMember?.user_id}`)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        setIsLoading(false);
        handleClose();
      })
      .catch(() => setIsLoading(false));
  };

  return {
    removeMember,
    open,
    isLoading,
    handleOpen,
    handleClose,
    handleRemove,
  };
};
