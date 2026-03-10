export const textFieldSx = {
  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
    borderColor: "text.primary",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "text.primary",
  },
  "& input:-webkit-autofill, & input:-webkit-autofill:hover, & input:-webkit-autofill:focus": {
    transition: "background-color 99999s ease-in-out 0s",
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
