import { request } from './client';
import type { CurrentUser } from './types';

export function getMe(): Promise<CurrentUser> {
  return request<CurrentUser>('GET', '/users/me');
}
