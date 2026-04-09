import { GROUP_URL } from "@/api/apiConfig";
import { axiosInstance } from "@/api/axiosInstance";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useInviteMember = (groupId: string) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError("");
  };

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setEmail("");
    setError("");
    setIsLoading(false);
    setOpen(false);
  };

  const handleInvite = () => {
    setIsLoading(true);

    if (!email || !emailRegex.test(email)) {
      setError("Email requerida");
      setIsLoading(false);
      return;
    }

    axiosInstance
      .post(`${GROUP_URL}/${groupId}/invite-member`, { email })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        setIsLoading(false);
        handleClose();
      })
      .catch(() => setIsLoading(false));
  };

  return {
    email,
    error,
    isLoading,
    open,
    handleChange,
    handleOpen,
    handleClose,
    handleInvite,
  };
};
