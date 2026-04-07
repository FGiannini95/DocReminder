import React from "react";

import { Box, Button, CircularProgress, SwipeableDrawer, Typography } from "@mui/material";

import { containedButtonSx } from "@/styles/commonStyle";
import { GroupMember } from "@/types/group";
import { getMemberInfo } from "@/utils/memberInfo";

interface RemoveMemberDrawerProps {
  open: boolean;
  onClose: () => void;
  member: GroupMember | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export const RemoveMemberDrawer = ({
  open,
  onClose,
  member,
  onConfirm,
  isLoading,
}: RemoveMemberDrawerProps) => {
  if (!member) return null;

  const { displayName } = getMemberInfo(member!);

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      onOpen={() => {}}
      swipeAreaWidth={56}
      disableSwipeToOpen
      PaperProps={{ sx: { borderRadius: "16px 16px 0 0", p: 3 } }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {/* Drag handle bar centered at the top */}
        <Box sx={{ width: 36, height: 4, bgcolor: "grey.300", borderRadius: 2, mx: "auto" }} />
        <Box>
          <Typography fontWeight="bold" fontSize={16}>
            ¿Eliminar a {displayName}?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            El miembro perderá el acceso al grupo y sus documentos dejarán de aparecer aquí.
          </Typography>
        </Box>

        {/* Actions buttons */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onClose}
            sx={{ ...containedButtonSx, backgroundColor: "text.primary" }}
          >
            Cancelar
          </Button>
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={onConfirm}
            sx={{
              ...containedButtonSx,
              backgroundColor: "rgba(239, 83, 80, 0.4)",
              color: "error.dark",
              border: "1px solid",
            }}
          >
            {isLoading ? <CircularProgress size={20} /> : "Eliminar"}
          </Button>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};
