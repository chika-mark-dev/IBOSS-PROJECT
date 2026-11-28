import { tokenStore } from '../auth/tokenStore';
import { request } from './client';
import type { LoginResponse } from './types';

// ASSUMED: login body fields are "email" and "password"
export async function login(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const data = await request<LoginResponse>('POST', '/auth/login', {
    email,
    password,
  });
  tokenStore.set(data.access_token, data.refresh_token);
  return data;
}
// ASSUMED: register body fields are "name", "email" and "password"; response shape unknown, so we ignore it
export async function register(
  name: string,
  email: string,
  password: string,
): Promise<void> {
  await request<unknown>('POST', '/auth/register', { name, email, password });
}
// Tell the server to revoke the refresh token, then always clear local tokens.
// ASSUMED: POST /auth/logout with body { refresh_token }. Check your logout DTO.
export async function logout(): Promise<void> {
  const refreshToken = tokenStore.getRefresh();
  try {
    if (refreshToken) {
      await request<unknown>('POST', '/auth/logout', {
        refresh_token: refreshToken,
      });
    }
  } catch {
    // if the server can't be reached, we still sign out locally
  } finally {
    tokenStore.clear();
  }
}
