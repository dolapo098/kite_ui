import { Link } from "react-router-dom";
import { routePaths } from "../../routes/routePaths";

export function LoginPage() {
  return (
    <div className="auth-shell">
      <article className="card auth-card">
        <p className="brand-eyebrow">Welcome back</p>
        <h3>Log in to Kite Wallet</h3>

        <label className="field">
          <span>Email</span>
          <input type="email" placeholder="you@example.com" />
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" placeholder="Password" />
        </label>

        <button type="button" className="primary-btn">
          Login
        </button>

        <p className="auth-footer">
          New here? <Link to={routePaths.signup}>Create an account</Link>
        </p>
      </article>
    </div>
  );
}
