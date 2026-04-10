import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Divider, IconButton, Menu, MenuItem, Typography } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { useMemberDisplay } from "@/hooks";
import { axiosInstance } from "@/api/axiosInstance";
import { DocReminderRoutes } from "@/routes/routes";
import { GROUP_URL } from "@/api/apiConfig";
import { DeleteGroupDrawer } from "../DeleteGroupDrawer/DeleteGroupDrawer";
import { GroupDrawer } from "@/pages/Group/components/GroupDrawer/GroupDrawer";

interface GroupHeaderProps {
  title: string;
  icon: string | null;
  memberCount: number;
  onBack?: () => void;
  adminId: number;
  groupId: string;
}

export const GroupHeader = ({
  title,
  icon,
  memberCount,
  onBack,
  adminId,
  groupId,
}: GroupHeaderProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openDeleteDrawer, setOpenDeleteDrawer] = useState<boolean>(false);
  const [openEditDrawer, setOpenEditDrawer] = useState<boolean>(false);

  const navigate = useNavigate();
  const { isAdmin } = useMemberDisplay({ adminId });

  const handleOpen = () => {
    setOpenDeleteDrawer(true);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setOpenDeleteDrawer(false);
    setOpenEditDrawer(false);
  };

  const handleDelete = () => {
    setIsLoading(true);
    axiosInstance
      .delete(`${GROUP_URL}/delete-group/${groupId}`)
      .then(() => {
        setAnchorEl(null);
        setIsLoading(false);
        navigate(DocReminderRoutes.home);
      })
      .catch(() => setIsLoading(false));
  };

  const handleLeave = () => {
    setIsLoading(true);
    axiosInstance
      .delete(`${GROUP_URL}/${groupId}/leave`)
      .then(() => {
        setAnchorEl(null);
        setIsLoading(false);
        navigate(DocReminderRoutes.home);
      })
      .catch(() => setIsLoading(false));
  };

  return (
    <>
      <Box
        sx={{
          p: 2,
          backgroundColor: "grey.900",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton onClick={onBack ?? (() => navigate(-1))} sx={{ color: "white" }}>
            <ArrowBackIosIcon />
          </IconButton>
          <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="h6" fontWeight="bold" color="white" lineHeight={1.2}>
              {title}
            </Typography>
            <Typography variant="caption" color="grey.400">
              {memberCount === 1 ? "1 miembro" : `${memberCount} miembros`}
            </Typography>
          </Box>

          {/* Menu anchored to the icon button */}
          <>
            <IconButton
              onClick={(e) => setAnchorEl(e.currentTarget)}
              sx={{ color: "white", ml: "auto" }}
            >
              <MoreVertIcon />
            </IconButton>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              {isAdmin ? (
                <>
                  <MenuItem
                    onClick={() => {
                      setAnchorEl(null);
                      setOpenEditDrawer(true);
                    }}
                    sx={{ gap: 1 }}
                  >
                    <EditIcon fontSize="small" />
                    Modificar grupo
                  </MenuItem>
                  <MenuItem onClick={handleOpen} sx={{ color: "error.main", gap: 1 }}>
                    <DeleteIcon fontSize="small" />
                    Eliminar grupo
                  </MenuItem>
                </>
              ) : (
                <MenuItem onClick={handleLeave} sx={{ color: "error.main", gap: 1 }}>
                  <ExitToAppIcon fontSize="small" />
                  Abandonar grupo
                </MenuItem>
              )}
            </Menu>
          </>
        </Box>

        <Divider sx={{ borderColor: "grey.700" }} />
      </Box>
      <DeleteGroupDrawer
        open={openDeleteDrawer}
        onClose={handleClose}
        onConfirm={handleDelete}
        isLoading={isLoading}
      />
      <GroupDrawer
        open={openEditDrawer}
        onClose={handleClose}
        groupId={groupId}
        initialValues={{ name: title, icon: icon }}
      />
    </>
  );
};
