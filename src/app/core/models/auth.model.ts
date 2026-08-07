export interface Signup {
  name: string;
  gender: string;
  email: string;
  phone: string;
  age: number;
}

export interface Login {
  email: string;
  phone: string;
}

// Matches the JSON actually returned by /login-password, /verify-otp
export interface AuthResponse {
  message: string;
  userId: string;
  name: string;
  role: 'User' | 'Admin';
  token: string;
}