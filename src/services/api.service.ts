import { BehaviorSubject } from 'rxjs';
import { axiosClient } from './axiosClient';
import type { AuthResponse, AuthUser, LogoutResponse, UserCredentials } from '../types';

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
}

export const authenticationService = new AuthenticationService();
