import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { GROUP_URL } from "@/api/apiConfig";
import { axiosInstance } from "@/api/axiosInstance";
import { GroupDependent } from "@/types/group";

export const useRemoveDependent = (groupId: string) => {
  const [dependentToRemove, setDependentToRemove] = useState<GroupDependent | null>(null);
  const [removeOpen, setRemoveOpen] = useState<boolean>(false);
  const [isRemoveLoading, setIsRemoveLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const openRemoveDrawer = (dependent: GroupDependent) => {
    setDependentToRemove(dependent);
    setRemoveOpen(true);
  };

  const closeRemoveDrawer = () => {
    setRemoveOpen(false);
  };

  const handleRemoveDependent = () => {
    setIsRemoveLoading(true);
    axiosInstance
      .delete(`${GROUP_URL}/${groupId}/delete-dependent/${dependentToRemove?.group_dependents_id}`)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        setIsRemoveLoading(false);
        closeRemoveDrawer();
      })
      .catch(() => setIsRemoveLoading(false));
  };

  return {
    dependentToRemove,
    removeOpen,
    isRemoveLoading,
    openRemoveDrawer,
    closeRemoveDrawer,
    handleRemoveDependent,
  };
};
