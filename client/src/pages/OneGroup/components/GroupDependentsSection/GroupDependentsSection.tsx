import React from "react";

import { Box, Button, Card, CardContent, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { useAddDependent } from "@/hooks";
import { AddDependentDrawer } from "../AddDependentDrawer/AddDependentDrawer";
import { GroupDependent } from "@/types/group";

interface GroupDependentsSectionProps {
  groupId: string;
  dependents: GroupDependent[];
}

export const GroupDependentsSection = ({ groupId, dependents }: GroupDependentsSectionProps) => {
  const { form, error, isLoading, open, handleOpen, handleClose, handleChange, handleSubmit } =
    useAddDependent(groupId);

  return (
    <>
      <Box sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography fontWeight="bold">Personas a cargo</Typography>
            <Button variant="contained" size="small" color="inherit" onClick={handleOpen}>
              + Añadir
            </Button>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {dependents.map((dependent) => (
              <Card
                key={dependent.group_dependents_id}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0px 0px 12px rgba(0,0,0,0.08)",
                  border: "1px solid",
                }}
              >
                <CardContent
                  sx={{ display: "flex", alignItems: "center", gap: 2, py: "6px !important" }}
                >
                  <Typography fontSize={36}>{dependent.avatar}</Typography>

                  <Box sx={{ flex: 1 }}>
                    <Typography fontWeight="bold">{dependent.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      {dependent.relationship}
                    </Typography>
                  </Box>

                  <IconButton size="small" color="inherit" onClick={() => {}}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Box>
      </Box>
      <AddDependentDrawer
        open={open}
        form={form}
        onClose={handleClose}
        onChange={handleChange}
        onConfirm={handleSubmit}
        error={error}
        isLoading={isLoading}
      />
    </>
  );
};
