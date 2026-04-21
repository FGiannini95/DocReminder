import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";

import { DocReminderRoutes } from "@/routes/routes";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, borderTop: "1px solid" }}
      elevation={3}
    >
      <BottomNavigation
        showLabels
        value={currentPath}
        sx={{
          "& .MuiBottomNavigationAction-root": {
            color: "grey.400",
          },
          "& .MuiBottomNavigationAction-root.Mui-selected": {
            color: "text.primary",
          },
        }}
      >
        <BottomNavigationAction
          label="Inicio"
          value={DocReminderRoutes.home}
          icon={<HomeIcon />}
          onClick={() => navigate(DocReminderRoutes.home)}
        />
        <BottomNavigationAction
          label="Grupos"
          value={DocReminderRoutes.group}
          icon={<GroupIcon />}
          onClick={() => navigate(DocReminderRoutes.group)}
        />
        <BottomNavigationAction
          label="Perfil"
          value={DocReminderRoutes.profile}
          icon={<PersonIcon />}
          onClick={() => navigate(DocReminderRoutes.profile)}
        />
      </BottomNavigation>
    </Paper>
  );
};
