import { AuthResponse } from '../models/auth';
 
const TOKEN_KEY = 'token';
const USER_ID_KEY = 'userId';
const USER_NAME_KEY = 'userName';
const ROLE_KEY = 'role';
 
export function storeAuthResponse(res: AuthResponse): void {
  localStorage.setItem(TOKEN_KEY, res.token);
  localStorage.setItem(USER_ID_KEY, res.userId);
  localStorage.setItem(USER_NAME_KEY, res.name);
  if (res.role) {
    localStorage.setItem(ROLE_KEY, res.role);
  }
}
 
export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_ID_KEY);
  localStorage.removeItem(USER_NAME_KEY);
  localStorage.removeItem(ROLE_KEY);
}
 
export function getRole(): string | null {
  return localStorage.getItem(ROLE_KEY);
}
 
export function isAdmin(): boolean {
  return getRole() === 'Admin';
}