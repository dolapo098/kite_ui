import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthErrorMessage, useSignupMutation } from "../../hooks/useAuthMutations";
import { routePaths } from "../../routes/routePaths";
import { validateSignupForm } from "../../utils/authValidation";
import type { AuthFormErrors } from "../../utils/authValidation";

export function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<AuthFormErrors>({});

  function clearFieldError(field: keyof AuthFormErrors): void {
    setErrors((previousState) => ({ ...previousState, [field]: undefined }));
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>): void {
    setEmail(event.target.value);
    clearFieldError("email");
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>): void {
    setPassword(event.target.value);
    clearFieldError("password");
    clearFieldError("confirmPassword");
  }

  function handleConfirmPasswordChange(event: ChangeEvent<HTMLInputElement>): void {
    setConfirmPassword(event.target.value);
    clearFieldError("confirmPassword");
  }

  function handleSignupSuccess(): void {
    navigate(routePaths.dashboard);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const validationErrors = validateSignupForm(email, password, confirmPassword);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    signupMutation.mutate(
      { email: email.trim(), password },
      { onSuccess: handleSignupSuccess },
    );
  }

  return (
    <div className="auth-shell">
      <article className="card auth-card">
        <p className="brand-eyebrow">Get started</p>
        <h3>Create your Kite account</h3>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleEmailChange}
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email ? <p className="error-text">{errors.email}</p> : null}
          </label>

          <label className="field">
            <span>Password</span>
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password ? <p className="error-text">{errors.password}</p> : null}
          </label>

          <label className="field">
            <span>Confirm password</span>
            <input
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              aria-invalid={Boolean(errors.confirmPassword)}
            />
            {errors.confirmPassword ? (
              <p className="error-text">{errors.confirmPassword}</p>
            ) : null}
          </label>

          {signupMutation.isError ? (
            <p className="error-text">{getAuthErrorMessage(signupMutation.error)}</p>
          ) : null}

          <button type="submit" className="primary-btn" disabled={signupMutation.isPending}>
            {signupMutation.isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to={routePaths.login}>Log in</Link>
        </p>
      </article>
    </div>
  );
}
