import { BehaviorSubject } from 'rxjs';
import {
  TRANSACTION_LIST_MAX_LIMIT,
  TRANSACTION_LIST_MIN_LIMIT,
  TRANSACTION_LIST_MIN_PAGE,
} from '../constants/transactions';
import { axiosClient } from './axiosClient';
import type {
  AuthResponse,
  AuthUser,
  BalanceResponse,
  ConversionExecuteRequest,
  ConversionExecuteResponse,
  ConversionQuoteRequest,
  ConversionQuoteResponse,
  DepositRequest,
  DepositResponse,
  HealthResponse,
  ListTransactionsResponse,
  LogoutResponse,
  PayoutRequest,
  PayoutResponse,
  UserCredentials,
} from '../types';

export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<AuthUser | null> = new BehaviorSubject<AuthUser | null>(
    null,
  );

  public currentUser = this.currentUserSubject.asObservable();

  public get currentUserValue(): AuthUser | null {
    return this.currentUserSubject.value;
  }

  public async signup(credentials: UserCredentials): Promise<AuthUser> {
    try {
      const response = await axiosClient.post<AuthResponse>('/v1/auth/signup', credentials);
      const user = response.data.user;
      this.currentUserSubject.next(user);
      return user;
    } catch (e) {
      console.error('Failed to sign up user:', e);
      throw e;
    }
  }

  public async login(credentials: UserCredentials): Promise<AuthUser> {
    try {
      const response = await axiosClient.post<AuthResponse>('/v1/auth/login', credentials);
      const user = response.data.user;
      this.currentUserSubject.next(user);
      return user;
    } catch (e) {
      console.error('Failed to log in user:', e);
      throw e;
    }
  }

  public async fetchCurrentUser(): Promise<AuthUser | null> {
    try {
      const response = await axiosClient.get<AuthResponse>('/v1/auth/current-user');
      const user = response.data.user;
      this.currentUserSubject.next(user);
      return user;
    } catch (e) {
      console.error('Failed to fetch current user:', e);
      this.currentUserSubject.next(null);
      return null;
    }
  }

  public async logout(): Promise<void> {
    try {
      const response = await axiosClient.post<LogoutResponse>('/v1/auth/logout');
      if (response.status !== 200) {
        throw new Error(`Logout failed with status ${response.status}`);
      }
      this.currentUserSubject.next(null);
    } catch (e) {
      console.error('Failed to log out user:', e);
      throw e;
    }
  }

  public async createDeposit(payload: DepositRequest): Promise<DepositResponse> {
    try {
      const response = await axiosClient.post<DepositResponse>('/v1/deposits/', payload);
      return response.data;
    } catch (e) {
      console.error('Failed to create deposit:', e);
      throw e;
    }
  }

  public async createPayout(payload: PayoutRequest): Promise<PayoutResponse> {
    try {
      const response = await axiosClient.post<PayoutResponse>('/v1/payouts/', payload);
      return response.data;
    } catch (e) {
      console.error('Failed to create payout:', e);
      throw e;
    }
  }

  public async getBalanceByCurrency(currencyCode: string): Promise<BalanceResponse> {
    try {
      const normalizedCurrencyCode = currencyCode.trim().toUpperCase();
      const response = await axiosClient.get<BalanceResponse>(
        `/v1/transactions/balances/${encodeURIComponent(normalizedCurrencyCode)}`,
      );
      return response.data;
    } catch (e) {
      console.error(`Failed to fetch balance for currency ${currencyCode}:`, e);
      throw e;
    }
  }

  public async listTransactions(params: { page: number; limit: number }): Promise<ListTransactionsResponse> {
    try {
      const page = Math.max(TRANSACTION_LIST_MIN_PAGE, Math.floor(params.page));
      const limit = Math.max(
        TRANSACTION_LIST_MIN_LIMIT,
        Math.min(TRANSACTION_LIST_MAX_LIMIT, Math.floor(params.limit)),
      );
      const response = await axiosClient.get<ListTransactionsResponse>('/v1/transactions/', {
        params: { page, limit },
      });
      return response.data;
    } catch (e) {
      console.error('Failed to list transactions:', e);
      throw e;
    }
  }

  public async createConversionQuote(
    payload: ConversionQuoteRequest,
  ): Promise<ConversionQuoteResponse> {
    try {
      const response = await axiosClient.post<ConversionQuoteResponse>(
        '/v1/conversions/quote',
        payload,
      );
      return response.data;
    } catch (e) {
      console.error('Failed to create conversion quote:', e);
      throw e;
    }
  }

  public async executeConversionQuote(
    payload: ConversionExecuteRequest,
  ): Promise<ConversionExecuteResponse> {
    try {
      const response = await axiosClient.post<ConversionExecuteResponse>(
        '/v1/conversions/execute',
        payload,
      );
      return response.data;
    } catch (e) {
      console.error('Failed to execute conversion quote:', e);
      throw e;
    }
  }

  public async getLiveHealth(): Promise<HealthResponse> {
    try {
      const response = await axiosClient.get<HealthResponse>('/.well-known/live');
      return response.data;
    } catch (e) {
      console.error('Failed to fetch live health:', e);
      throw e;
    }
  }

  public async getReadyHealth(): Promise<HealthResponse> {
    try {
      const response = await axiosClient.get<HealthResponse>('/.well-known/ready');
      return response.data;
    } catch (e) {
      console.error('Failed to fetch ready health:', e);
      throw e;
    }
  }
}

export const authenticationService = new AuthenticationService();
