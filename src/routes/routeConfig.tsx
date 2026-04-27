import { Navigate } from "react-router-dom";
import { AppLayout } from "../app/AppLayout";
import { FxConversionPage } from "../pages/FxConversionPage";
import { DashboardPage } from "../pages/DashboardPage";
import { DepositPage } from "../pages/DepositPage";
import { PayoutPage } from "../pages/PayoutPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";
import { routePaths } from "./routePaths";
import type { AppRouteObject } from "./appRouteObject";

export const routes: AppRouteObject[] = [
  {
    path: routePaths.home,
    element: <Navigate to={routePaths.dashboard} replace />,
    meta: {
      title: "Home",
      canLandingPage: true,
      hideFromNav: true,
    },
  },
  {
    path: routePaths.login,
    element: <LoginPage />,
    meta: {
      title: "Login",
      isPublic: true,
      hideFromNav: true,
    },
  },
  {
    path: routePaths.signup,
    element: <SignupPage />,
    meta: {
      title: "Sign Up",
      isPublic: true,
      hideFromNav: true,
    },
  },
  {
    path: routePaths.dashboard,
    element: (
      <AppLayout>
        <DashboardPage />
      </AppLayout>
    ),
    meta: {
      title: "Dashboard",
      requiresAuth: true,
    },
  },
  {
    path: routePaths.deposit,
    element: (
      <AppLayout>
        <DepositPage />
      </AppLayout>
    ),
    meta: {
      title: "Deposit",
      requiresAuth: true,
    },
  },
  {
    path: routePaths.convert,
    element: (
      <AppLayout>
        <FxConversionPage />
      </AppLayout>
    ),
    meta: {
      title: "FX Conversion",
      requiresAuth: true,
    },
  },
  {
    path: routePaths.payout,
    element: (
      <AppLayout>
        <PayoutPage />
      </AppLayout>
    ),
    meta: {
      title: "Payout",
      requiresAuth: true,
    },
  },
  {
    path: routePaths.transactions,
    element: (
      <AppLayout>
        <TransactionsPage />
      </AppLayout>
    ),
    meta: {
      title: "Transaction history",
      requiresAuth: true,
    },
  },
  {
    path: "*",
    element: <Navigate to={routePaths.dashboard} replace />,
    meta: {
      title: "Fallback",
      hideFromNav: true,
    },
  },
];
