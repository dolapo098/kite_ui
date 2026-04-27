export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  user_id: string;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}

export interface DepositRequest {
  currency_code: string;
  amount_in_cents: number;
  idempotency_key: string;
}

export interface DepositResponse {
  message: string;
  status: string;
}

export interface PayoutRequest {
  source_currency_code: string;
  amount_in_cents: number;
  account_number: string;
  bank_code: string;
  account_name: string;
  reference: string;
}

export interface PayoutResponse {
  message: string;
  status: string;
  payout_id: string;
}

export interface AdminMarkPayoutFailedRequest {
  failure_reason: string;
}

export interface AdminMarkPayoutFailedResponse {
  message: string;
  status: string;
  payout_id: string;
}

export interface BalanceResponse {
  currency_code: string;
  balance_cents: number;
}

export interface TransactionItemResponse {
  id: string;
  type: string;
  status: string;
  amount_in_cents: number;
  amount_out_cents: number | null;
  source_currency_code: string;
  target_currency_code: string | null;
  created_at: string;
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total_items: number;
  total_pages: number;
}

export interface ListTransactionsResponse {
  items: TransactionItemResponse[];
  pagination: PaginationResponse;
}

export interface ConversionQuoteRequest {
  source_currency_code: string;
  target_currency_code: string;
  amount_in_cents: number;
}

export interface ConversionQuoteResponse {
  quote_id: string;
  source_currency_code: string;
  target_currency_code: string;
  amount_in_cents: number;
  amount_out_cents: number;
  market_rate: number;
  quoted_rate: number;
  spread_bps: number;
  expires_at: string;
}

export interface ConversionExecuteRequest {
  quote_id: string;
}

export interface ConversionExecuteResponse {
  message: string;
  quote_id: string;
  source_currency_code: string;
  target_currency_code: string;
  amount_in_cents: number;
  amount_out_cents: number;
  executed_at: string;
}

export interface HealthResponse {
  status?: string;
  [key: string]: string | number | boolean | null | undefined;
}
