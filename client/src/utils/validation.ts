// Validates email format: requires characters before @, a domain, and a TLD of at least 2 chars
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};

// Validate otp: returns true if OTP is complete (6 numeric digits)
export const validateOtp = (otp: string): boolean => {
  return /^\d{6}$/.test(otp);
};

// Validate date
