// Validates email format: requires characters before @, a domain, and a TLD of at least 2 chars
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
};

// Validate pin
// Validate date
