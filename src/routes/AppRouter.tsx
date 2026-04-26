import { Route, Routes } from "react-router-dom";
import { AppLayout, appRoutes, authRoutes, defaultRedirects } from "./routeConfig";
import { routePaths } from "./routePaths";

export function AppRouter() {
  return (
    <Routes>
      <Route path={routePaths.home} element={defaultRedirects.home} />

      {authRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      <Route element={<AppLayout />}>
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Route>

      <Route path="*" element={defaultRedirects.fallback} />
    </Routes>
  );
}
