import React from "react";

import { BottomNavigation, BottomNavigationAction, Paper } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";

export const BottomNav = () => {
  return (
    <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation showLabels>
        <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
        <BottomNavigationAction label="Grupos" icon={<GroupIcon />} />
        <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
};
