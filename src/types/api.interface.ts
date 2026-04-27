export interface UserCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  user_id: number;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
}

export interface LogoutResponse {
  message: string;
}
