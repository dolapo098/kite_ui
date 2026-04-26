import { Link } from "react-router-dom";
import { routePaths } from "../../routes/routePaths";

export function SignupPage() {
  return (
    <div className="auth-shell">
      <article className="card auth-card">
        <p className="brand-eyebrow">Get started</p>
        <h3>Create your Kite account</h3>

        <label className="field">
          <span>Email</span>
          <input type="email" placeholder="you@example.com" />
        </label>

        <label className="field">
          <span>Password</span>
          <input type="password" placeholder="Create password" />
        </label>

        <button type="button" className="primary-btn">
          Sign Up
        </button>

        <p className="auth-footer">
          Already have an account? <Link to={routePaths.login}>Log in</Link>
        </p>
      </article>
    </div>
  );
}
