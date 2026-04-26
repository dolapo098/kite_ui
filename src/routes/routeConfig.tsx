import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { AppLayout } from "../app/AppLayout";
import { ConvertPage } from "../pages/ConvertPage";
import { DashboardPage } from "../pages/DashboardPage";
import { DepositPage } from "../pages/DepositPage";
import { PayoutPage } from "../pages/PayoutPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import { LoginPage } from "../pages/auth/LoginPage";
import { SignupPage } from "../pages/auth/SignupPage";
import { routePaths } from "./routePaths";

export type AppRoute = {
  path: string;
  element: ReactNode;
};

export const authRoutes: AppRoute[] = [
  { path: routePaths.login, element: <LoginPage /> },
  { path: routePaths.signup, element: <SignupPage /> },
];

export const appRoutes: AppRoute[] = [
  { path: routePaths.dashboard, element: <DashboardPage /> },
  { path: routePaths.deposit, element: <DepositPage /> },
  { path: routePaths.convert, element: <ConvertPage /> },
  { path: routePaths.payout, element: <PayoutPage /> },
  { path: routePaths.transactions, element: <TransactionsPage /> },
];

export const defaultRedirects = {
  home: <Navigate to={routePaths.dashboard} replace />,
  fallback: <Navigate to={routePaths.dashboard} replace />,
};

export { AppLayout };
