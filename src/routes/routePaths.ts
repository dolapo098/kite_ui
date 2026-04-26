export const routePaths = {
  home: "/",
  login: "/login",
  signup: "/signup",
  dashboard: "/dashboard",
  deposit: "/deposit",
  convert: "/convert",
  payout: "/payout",
  transactions: "/transactions",
} as const;

export type AppRoutePath = (typeof routePaths)[keyof typeof routePaths];
