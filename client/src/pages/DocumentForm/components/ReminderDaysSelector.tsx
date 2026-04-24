import { Box, Chip, Typography } from "@mui/material";

const REMINDER_OPTIONS = [7, 14, 30, 60, 90, 180];

interface ReminderDaysSelectorProps {
  selected: number[];
  onChange: (days: number[]) => void;
}

export const ReminderDaysSelector = ({ selected, onChange }: ReminderDaysSelectorProps) => {
  const toggleDay = (day: number) => {
    const updated = selected.includes(day) ? selected.filter((d) => d !== day) : [...selected, day];
    onChange(updated);
  };

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" mb={1}>
        Recordatorio
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
        }}
      >
        {REMINDER_OPTIONS.map((day) => {
          const isSelected = selected.includes(day);
          return (
            <Chip
              key={day}
              label={`${day} días`}
              onClick={() => toggleDay(day)}
              variant={isSelected ? "filled" : "outlined"}
              sx={{
                backgroundColor: isSelected ? "text.primary" : "transparent",
                color: isSelected ? "background.default" : "text.primary",
                borderColor: "text.primary",
                "&:hover": {
                  backgroundColor: isSelected ? "text.primary" : "transparent",
                },
                "&&.MuiChip-root:active": {
                  backgroundColor: isSelected ? "text.primary" : "transparent",
                },
              }}
            />
          );
        })}
      </Box>
    </Box>
  );
};
