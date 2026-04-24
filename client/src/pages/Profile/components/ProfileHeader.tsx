import { Avatar, Box, Typography } from "@mui/material";

import { useAuth } from "@/context";

export const ProfileHeader = () => {
  const { email, displayName } = useAuth();
  const headerName = displayName ?? email?.split("@")[0];

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "grey.900",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ width: 48, height: 48, backgroundColor: "grey.700", fontSize: 18 }}>
          {headerName?.[0]?.toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="white">
            {headerName}
          </Typography>
          <Typography color="grey.400">{email}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
