import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

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
  const navigate = useNavigate();

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage message="Error al cargar el grupo" />;

  return (
    <>
      <Box sx={{ px: 3, pb: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography fontWeight="bold">Mis grupos:</Typography>
            <Button variant="contained" size="small" color="inherit" onClick={() => setOpen(true)}>
              + Crear grupo
            </Button>
          </Box>
          {groups.length === 0 ? (
            <EmptyState message="Aún no has creado ningún grupo." />
          ) : (
            groups.map((group) => {
              return (
                <Card
                  key={group.private_groups_id}
                  onClick={() => navigate(`/group/${group.private_groups_id}`)}
                  sx={{
                    borderRadius: 2,
                    boxShadow: "0px 0px 12px rgba(0,0,0,0.08)",
                    border: "1px solid",
                    cursor: "pointer",
                  }}
                >
                  <CardContent
                    sx={{ display: "flex", alignItems: "center", gap: 2, py: "12px !important" }}
                  >
                    <Typography fontSize={28}> {group.icon}</Typography>

                    <Box sx={{ flex: 1 }}>
                      <Typography fontWeight="bold"> {group.name}</Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block" }}
                      >
                        {group.member_count + group.dependent_count === 1
                          ? "1 persona"
                          : `${group.member_count + group.dependent_count} personas`}
                      </Typography>
                    </Box>

                    <ArrowForwardIosIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      </Box>
      <GroupDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};
