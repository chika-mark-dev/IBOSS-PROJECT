import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function Layout() {
  const { user } = useAuth();

  return (
    <>
      <header className="app-header">
        <h1>IBOSS CBT SYSTEM</h1>
      </header>
      {user && (
        <nav className="app-nav">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/profile">{user.name}</Link>
        </nav>
      )}
      <Outlet />
    </>
  );
}
