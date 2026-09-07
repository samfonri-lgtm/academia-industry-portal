export const required = (value, message = "This field is required") => {
  if (value === null || value === undefined || String(value).trim() === "") {
    return message;
  }

  return "";
};

export const isValidEmail = (email) => {
  if (!email) return false;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateEmail = (
  email,
  message = "Please enter a valid email address"
) => {
  if (!email || !isValidEmail(email)) {
    return message;
  }

  return "";
};

export const validatePassword = (
  password,
  minLength = 6
) => {
  if (!password) {
    return "Password is required";
  }

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters`;
  }

  return "";
};

export const validateConfirmPassword = (
  password,
  confirmPassword
) => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match";
  }

  return "";
};

export const validatePhone = (phone) => {
  if (!phone) {
    return "Phone number is required";
  }

  const cleaned = String(phone).replace(/\D/g, "");

  if (cleaned.length !== 10) {
    return "Please enter a valid 10-digit phone number";
  }

  return "";
};

export const validateName = (name) => {
  if (!name || !String(name).trim()) {
    return "Name is required";
  }

  if (String(name).trim().length < 2) {
    return "Name must contain at least 2 characters";
  }

  return "";
};

export const validateForm = (fields, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = fields[field];

    for (const rule of fieldRules) {
      const error = rule(value, fields);

      if (error) {
        errors[field] = error;
        break;
      }
    }
  });

  return errors;
};

export const hasErrors = (errors) => {
  return Object.keys(errors || {}).length > 0;
};

export const validators = {
  required,
  email: validateEmail,
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
  phone: validatePhone,
  name: validateName,
};

export default validators;