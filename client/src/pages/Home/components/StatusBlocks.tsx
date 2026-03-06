import { Box, Typography } from "@mui/material";

// Color config per status type
const statusConfig = {
  urgent: {
    label: "Urgente",
    borderColor: "error.light",
    textColor: "error.dark",
    shadow: "0px 0px 8px rgba(239, 83, 80, 0.4)",
  },
  upcoming: {
    label: "Próximo",
    borderColor: "warning.light",
    textColor: "warning.main",
    shadow: "0px 0px 8px rgba(255, 152, 0, 0.4)",
  },
  ok: {
    label: "Al día",
    borderColor: "success.light",
    textColor: "success.dark",
    shadow: "0px 0px 8px rgba(102, 187, 106, 0.4)",
  },
};

type StatusType = keyof typeof statusConfig;

interface StatusBlocksProps {
  urgent: number;
  upcoming: number;
  ok: number;
}

export const StatusBlocks = ({ urgent, upcoming, ok }: StatusBlocksProps) => {
  const counts = { urgent, upcoming, ok };

  return (
    <Box sx={{ display: "flex", width: "100%", p: 3, gap: 1 }}>
      {(Object.keys(statusConfig) as StatusType[]).map((status) => {
        const { label, borderColor, textColor, shadow } = statusConfig[status];
        return (
          <Box
            key={status}
            sx={{
              flex: 1,
              textAlign: "center",
              borderRadius: 2,
              p: 1,
              border: "2px solid",
              borderColor,
              boxShadow: shadow,
            }}
          >
            <Typography variant="h5" fontWeight="bold" sx={{ color: textColor }}>
              {counts[status]}
            </Typography>
            <Typography variant="caption" sx={{ color: textColor }}>
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
};
