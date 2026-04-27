import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuthErrorMessage, useLoginMutation } from "../../hooks/useAuthMutations";
import { routePaths } from "../../routes/routePaths";
import { validateLoginForm } from "../../utils/authValidation";
import type { AuthFormErrors } from "../../utils/authValidation";

export function LoginPage() {
  const navigate = useNavigate();
  const loginMutation = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  }

  function handleLoginSuccess(): void {
    navigate(routePaths.dashboard);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const validationErrors = validateLoginForm(email, password);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    loginMutation.mutate(
      { email: email.trim(), password },
      { onSuccess: handleLoginSuccess },
    );
  }

  return (
    <div className="auth-shell">
      <article className="card auth-card">
        <p className="brand-eyebrow">Welcome back</p>
        <h3>Log in to Kite Wallet</h3>

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
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              aria-invalid={Boolean(errors.password)}
            />
            {errors.password ? <p className="error-text">{errors.password}</p> : null}
          </label>

          {loginMutation.isError ? (
            <p className="error-text">{getAuthErrorMessage(loginMutation.error)}</p>
          ) : null}

          <button type="submit" className="primary-btn" disabled={loginMutation.isPending}>
            {loginMutation.isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to={routePaths.signup}>Create an account</Link>
        </p>
      </article>
    </div>
  );
}
