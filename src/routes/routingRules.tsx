import type { AppRouteObject } from './appRouteObject';

export function isRouteAccessible(
  route: AppRouteObject,
  isAuthenticated: boolean,
): { canAccess: boolean } {
  const meta = route.meta;

  if (!meta) {
    return { canAccess: true };
  }

  const { isPublic, requiresAuth } = meta;

  if (isPublic) {
    return { canAccess: true };
  }

  if (requiresAuth && !isAuthenticated) {
    return { canAccess: false };
  }

  return { canAccess: true };
}
