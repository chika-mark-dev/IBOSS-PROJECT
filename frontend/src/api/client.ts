import { tokenStore } from '../auth/tokenStore';
import type { LoginResponse } from './types';

const BASE_URL = '/api';

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function send(
  method: string,
  path: string,
  body?: unknown,
): Promise<Response> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';

  const token = tokenStore.getAccess();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    return await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // status 0 = the request never reached the server
    throw new ApiError(0, 'Network error. Check your connection.');
  }
}

// Returns true if new tokens were saved, false if the server rejected the refresh.
// Throws ApiError(0) on a network failure, so the caller does NOT log the user out.
async function doRefresh(): Promise<boolean> {
  const refreshToken = tokenStore.getRefresh();
  if (!refreshToken) return false;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
  } catch {
    throw new ApiError(0, 'Network error. Check your connection.');
  }

  if (!response.ok) return false;

  const data = (await response.json()) as LoginResponse;
  tokenStore.set(data.access_token, data.refresh_token);
  return true;
}

// The refresh token is rotated on every refresh, so two refreshes at once would
// break each other. All waiting requests share one in-flight refresh.
let refreshPromise: Promise<boolean> | null = null;

function refreshTokens(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = doRefresh().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

export async function request<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<T> {
  let response = await send(method, path, body);

  if (response.status === 401 && !path.startsWith('/auth/')) {
    const refreshed = await refreshTokens();
    if (refreshed) {
      response = await send(method, path, body);
    } else {
      tokenStore.clear();
      window.location.assign('/login');
    }
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      // ASSUMED: NestJS error body { statusCode, message, error }, message may be an array
      const data = await response.json();
      message = Array.isArray(data.message)
        ? data.message.join(', ')
        : (data.message ?? message);
    } catch {

    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
