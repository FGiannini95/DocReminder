import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { textFieldSx } from "@/styles/commonStyle";
import dayjs, { Dayjs } from "dayjs";

interface ExpiryDatePickerProps {
  value: Dayjs | null;
  onChange: (value: Dayjs | null) => void;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  error?: string;
}

export const ExpiryDatePicker = ({
  value,
  onChange,
  open,
  onOpen,
  onClose,
  error,
}: ExpiryDatePickerProps) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
      <MobileDatePicker
        open={open}
        onOpen={onOpen}
        onClose={onClose}
        label="Fecha de vencimiento"
        value={value}
        onChange={onChange}
        minDate={dayjs()} // Disable previous days
        slotProps={{
          textField: {
            onMouseDown: (e) => {
              e.preventDefault();
              onOpen();
            },
            inputProps: { tabIndex: -1 }, // Remove focus from input
            sx: textFieldSx,
            required: true,
            error: !!error,
            helperText: error,
          },
          // Action bar Ui
          actionBar: {
            sx: {
              "& .MuiButton-root": {
                color: "text.primary",
              },
            },
          },
          // Selected day Ui
          day: {
            sx: {
              "&&.Mui-selected": {
                backgroundColor: "text.primary",
                "&:hover": { backgroundColor: "text.primary" },
                "&:focus": { backgroundColor: "text.primary" },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};
