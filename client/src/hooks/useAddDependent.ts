import { useState } from "react";
import { GroupDependent } from "@/types/group";
import { axiosInstance } from "@/api/axiosInstance";
import { GROUP_URL } from "@/api/apiConfig";
import { useQueryClient } from "@tanstack/react-query";

export const useAddDependent = (groupId: string) => {
  const [form, setForm] = useState<GroupDependent>({
    name: "",
    relationship: null,
    birth_date: null,
    avatar: null,
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setForm({ name: "", relationship: null, birth_date: null, avatar: null });
    setError("");
    setOpen(false);
  };

  const handleChange = (field: keyof GroupDependent, value: string) => {
    setForm({ ...form, [field]: value });
    if (field === "name") setError("");
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setError("Nombre obligatorio");
      return;
    }

    setIsLoading(true);
    axiosInstance
      .post(`${GROUP_URL}/${groupId}/add-dependent`, form)
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["group", groupId] });
        setIsLoading(false);
        handleClose();
      })
      .catch(() => setIsLoading(false));
  };

  return {
    form,
    error,
    isLoading,
    open,
    handleOpen,
    handleClose,
    handleChange,
    handleSubmit,
  };
};
