import React from "react";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import { DocReminderRoutes } from "@/routes/routes";

export const BottomNav = () => {
  const navigate = useNavigate();
  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels>
        <BottomNavigationAction
          label="Inicio"
          icon={<HomeIcon />}
          onClick={() => navigate(DocReminderRoutes.home)}
        />
        <BottomNavigationAction
          label="Grupos"
          icon={<GroupIcon />}
          onClick={() => navigate(DocReminderRoutes.home)}
        />
        <BottomNavigationAction
          label="Perfil"
          icon={<PersonIcon />}
          onClick={() => navigate(DocReminderRoutes.profile)}
        />
      </BottomNavigation>
    </Paper>
  );
};
