import React from 'react';
import { Route, Routes } from 'react-router-dom';
import type { AppRouteObject } from './appRouteObject';
import { ProtectedRoute } from './ProtectedRoute';

interface CustomRouterProps {
  routes: AppRouteObject[];
  isAuthenticated: boolean;
}

export const CustomRouter: React.FC<CustomRouterProps> = ({
  routes,
  isAuthenticated,
}) => {
  return (
    <Routes>
      {routes.map((route, index) => (
        <Route
          key={route.path || index}
          path={route.path}
          element={
            <ProtectedRoute
              route={route}
              isAuthenticated={isAuthenticated}
            >
              {route.element}
            </ProtectedRoute>
          }
        />
      ))}
    </Routes>
  );
};
