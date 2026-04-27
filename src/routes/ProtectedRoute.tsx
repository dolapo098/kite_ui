import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isRouteAccessible } from './index';
import type { AppRouteObject } from './index';
import { routePaths } from './routePaths';

interface ProtectedRouteProps {
  route: AppRouteObject;
  children: ReactNode;
  isAuthenticated: boolean;
  sessionChecked: boolean;
}

export function ProtectedRoute({
  route,
  children,
  isAuthenticated,
  sessionChecked,
}: ProtectedRouteProps) {
  const location = useLocation();
  const accessResult = isRouteAccessible(route, isAuthenticated);

  const showBootstrap = Boolean(route.meta?.requiresAuth && !sessionChecked);
  const showLoginNavigate = Boolean(
    sessionChecked &&
      !accessResult.canAccess &&
      route.meta?.requiresAuth &&
      !isAuthenticated,
  );
  const showDashboardNavigate = Boolean(
    sessionChecked &&
      route.meta?.isPublic &&
      isAuthenticated &&
      (route.path === routePaths.login || route.path === routePaths.signup),
  );
  const showChildren = !showBootstrap && !showLoginNavigate && !showDashboardNavigate;

  return (
    <>
      {showBootstrap ? (
        <div className="auth-shell">
          <article className="card auth-card">
            <p className="brand-eyebrow">Grey Payment</p>
            <h3>Checking authentication...</h3>
          </article>
        </div>
      ) : null}

      {showLoginNavigate ? (
        <Navigate
          to={`${routePaths.login}?returnUrl=${encodeURIComponent(location.pathname)}`}
          replace
        />
      ) : null}

      {showDashboardNavigate ? <Navigate to={routePaths.dashboard} replace /> : null}

      {showChildren ? <>{children}</> : null}
    </>
  );
}
