import { Navigate, Outlet } from 'react-router-dom';
import { tokenStore } from './tokenStore';

export function RequireAuth() {
  if (!tokenStore.getAccess()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
