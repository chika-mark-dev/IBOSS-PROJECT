import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

// Convenience only: the server enforces the real admin rule (401/403).
export function RequireAdmin() {
  const { user, loading } = useAuth();

  if (loading) return <p className="page">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  // ASSUMED: the role value is exactly 'ADMIN'
  if (user.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
