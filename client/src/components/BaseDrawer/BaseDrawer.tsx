import { Box, SwipeableDrawer } from "@mui/material";

interface BaseDrawerProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const BaseDrawer = ({ open, onClose, children }: BaseDrawerProps) => {
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
        {/* drag handle */}
        <Box sx={{ width: 36, height: 4, bgcolor: "grey.300", borderRadius: 2, mx: "auto" }} />
        {children}
      </Box>
    </SwipeableDrawer>
  );
};
