export interface AuthFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function validateEmail(email: string): string | null {
  const normalizedEmail = email.trim();
  if (!normalizedEmail) {
    return "Email is required";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return "Enter a valid email address";
  }

  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) {
    return "Password is required";
  }
  if (!password.trim()) {
    return "Password cannot be empty";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  return null;
}

export function validateLoginForm(email: string, password: string): AuthFormErrors {
  const errors: AuthFormErrors = {};

  const emailError = validateEmail(email);
  if (emailError) {
    errors.email = emailError;
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
}

export function validateSignupForm(
  email: string,
  password: string,
  confirmPassword: string,
): AuthFormErrors {
  const errors = validateLoginForm(email, password);

  if (!confirmPassword) {
    errors.confirmPassword = "Confirm password is required";
  } else if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}
