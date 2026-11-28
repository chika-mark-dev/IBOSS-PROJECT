import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  if (loading) return <p className="page">Loading...</p>;
  if (!user) return <p className="page">Could not load your profile.</p>;

  return (
    <div className="page">
      <h2>Profile</h2>

      <div className="card">
        <p>
          <strong>Name:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
      </div>

      <h2>Settings</h2>
      <div className="card">
        <button onClick={handleLogout}>Log out</button>
      </div>
    </div>
  );
}
