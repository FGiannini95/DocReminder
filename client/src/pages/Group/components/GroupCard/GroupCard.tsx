import React, { useState } from "react";

import { Box, Button, Typography } from "@mui/material";

import { EmptyState } from "../../../../components/EmptyState/EmptyState";
import { GroupDrawer } from "../GroupDrawer/GroupDrawer";
import { ErrorMessage, Loading } from "@/components";
import { Group } from "@/types/group";

interface GroupCardProps {
  groups: Group[];
  isError: boolean;
  isPending: boolean;
}

export const GroupCard = ({ groups, isError, isPending }: GroupCardProps) => {
  const [open, setOpen] = useState<boolean>(false);

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage message="Error al cargar el grupo" />;

  return (
    <>
      <Box sx={{ px: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" fontWeight="bold">
              Mis grupos:
            </Typography>
            <Button variant="contained" size="small" color="inherit" onClick={() => setOpen(true)}>
              + Crear grupo
            </Button>
          </Box>
          <EmptyState message="Aún no has creado ningún grupo." />
        </Box>
      </Box>
      <GroupDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};
