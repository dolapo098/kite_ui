import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isRouteAccessible } from './index';
import type { AppRouteObject } from './index';
import { routePaths } from './routePaths';

interface ProtectedRouteProps {
  route: AppRouteObject;
  children: ReactNode;
  isAuthenticated: boolean;
}

export function ProtectedRoute({
  route,
  children,
  isAuthenticated,
}: ProtectedRouteProps) {
  const location = useLocation();
  const accessResult = isRouteAccessible(route, isAuthenticated);

  if (!accessResult.canAccess) {
    if (route.meta?.requiresAuth && !isAuthenticated) {
      return <Navigate to={`${routePaths.login}?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
    }
  }

  if (route.meta?.isPublic) {
    if (isAuthenticated && (route.path === routePaths.login || route.path === routePaths.signup)) {
      return <Navigate to={routePaths.dashboard} replace />;
    }

    return <>{children}</>;
  }

  return <>{children}</>;
}
