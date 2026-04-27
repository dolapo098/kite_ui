import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/NavigationMenu";
import { routePaths } from "../routes/routePaths";
import { authenticationService } from "../services";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();
  const userEmail = authenticationService.currentUserValue?.email || "";

  async function handleLogout(): Promise<void> {
    try {
      await authenticationService.logout();
      navigate(routePaths.login);
    } catch (e) {
      console.error("Logout failed:", e);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        isAuthenticated={Boolean(authenticationService.currentUserValue)}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
      <div className="layout-content">{children}</div>
    </div>
  );
}
