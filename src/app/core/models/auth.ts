export interface Signup {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface Login {
  email: string;
  phone: string;
}

export interface AuthResponse {
  token: string;
  userName: string;
  userId: string;
}