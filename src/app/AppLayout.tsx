import { NavLink, Outlet } from "react-router-dom";
import { routePaths } from "../routes/routePaths";

const navItems = [
  { label: "Dashboard", to: routePaths.dashboard },
  { label: "Deposit", to: routePaths.deposit },
  { label: "Convert", to: routePaths.convert },
  { label: "Payout", to: routePaths.payout },
  { label: "Transactions", to: routePaths.transactions },
];

export function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="brand-block">
          <p className="brand-eyebrow">Grey Assessment</p>
          <h1 className="brand-title">Kite Wallet</h1>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="app-main">
        <header className="top-bar">
          <div>
            <p className="top-bar-subtitle">Internal Prototype</p>
            <h2 className="top-bar-title">Cross-Border Wallet UI</h2>
          </div>
          <button type="button" className="ghost-btn">
            Logout
          </button>
        </header>

        <section className="content-area">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
