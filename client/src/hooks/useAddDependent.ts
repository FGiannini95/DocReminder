import { useState } from "react";
import { GroupDependent } from "@/types/group";

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

  // handleSubmit:
  // validate name
  // call POST /:groupId/add-dependent
  // on success: invalidateQueries ["group", groupId] + handleClose
  // on error: setIsLoading(false)

  return {
    form,
    error,
    isLoading,
    open,
    handleOpen,
    handleClose,
    handleChange,
    // handleSubmit,
  };
};
