/**
 * Form validation utility functions
 */

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return {
      isValid: false,
      message: "Password must be at least 6 characters long",
    };
  }
  return { isValid: true };
};

export const validateRequired = (
  value: string,
  fieldName: string
): { isValid: boolean; message?: string } => {
  if (!value.trim()) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true };
};

export const validatePhone = (
  phone: string
): { isValid: boolean; message?: string } => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return { isValid: false, message: "Please enter a valid phone number" };
  }
  return { isValid: true };
};

export const validatePrice = (
  price: string
): { isValid: boolean; message?: string } => {
  const numPrice = Number(price);
  if (isNaN(numPrice) || numPrice < 0) {
    return { isValid: false, message: "Please enter a valid price" };
  }
  return { isValid: true };
};

export const validateUrl = (
  url: string
): { isValid: boolean; message?: string } => {
  if (!url) return { isValid: true }; // URL is optional

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: "Please enter a valid URL" };
  }
};
