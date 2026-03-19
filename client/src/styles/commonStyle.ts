export const textFieldSx = {
  // Border color when input is focused
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "text.primary",
  },
  // Label color when focused
  "& .MuiInputLabel-root.Mui-focused": {
    color: "text.primary",
  },
  // Prevent browser autofill blue background
  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
    transition: "background-color 99999s ease-in-out 0s",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "text.primary",
  },
  "& .MuiInput-underline.Mui-focused:after": {
    borderBottomColor: "text.primary",
  },
};

export const scrollableContentSx = {
  flex: 1,
  overflowY: "auto",
  mt: "60px",
  display: "flex",
  flexDirection: "column",
  gap: 2,
  pt: 4,
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": { display: "none" },
};

export const containedButtonSx = {
  borderRadius: 8,
  py: 1.5,
  boxShadow: "none",
};

export const statusConfig = {
  urgent: {
    label: "Urgente",
    borderColor: "error.light",
    textColor: "error.dark",
    barColor: "error.main",
    shadow: "0px 0px 8px rgba(239, 83, 80, 0.4)",
  },
  upcoming: {
    label: "Próximo",
    borderColor: "warning.light",
    textColor: "warning.main",
    barColor: "warning.main",
    shadow: "0px 0px 8px rgba(255, 152, 0, 0.4)",
  },
  ok: {
    label: "Al día",
    borderColor: "success.light",
    textColor: "success.dark",
    barColor: "success.main",
    shadow: "0px 0px 8px rgba(102, 187, 106, 0.4)",
  },
};
