import type { AppRouteObject } from './appRouteObject';

export function isRouteAccessible(
  route: AppRouteObject,
  isAuthenticated: boolean,
): { canAccess: boolean } {
  const meta = route.meta;
  const isPublic = Boolean(meta?.isPublic);
  const requiresAuth = Boolean(meta?.requiresAuth);
  const denyForAuthWall = Boolean(meta && requiresAuth && !isAuthenticated && !isPublic);
  const canAccess = !meta || isPublic || !denyForAuthWall;

  return { canAccess };
}
