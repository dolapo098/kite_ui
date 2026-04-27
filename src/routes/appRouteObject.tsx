import type { RouteObject } from "react-router-dom";

export interface RouteMetaData {
  title: string;
  canLandingPage?: boolean;
  isPublic?: boolean;
  requiresAuth?: boolean;
  hideFromNav?: boolean;
}

export type AppRouteObject = RouteObject & {
  meta?: RouteMetaData;
};
