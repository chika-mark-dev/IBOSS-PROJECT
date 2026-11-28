import { useAuth } from '../auth/AuthContext';
import { AdminDashboardPage } from './AdminDashboardPage';
import { ExamListPage } from './ExamListPage';

export function DashboardPage() {
  const { user, loading, refreshUser } = useAuth();

  if (loading) return <p className="page">Loading...</p>;

  if (!user) {
    return (
      <div className="page">
        <p role="alert">Could not load your profile.</p>
        <button onClick={refreshUser}>Retry</button>
      </div>
    );
  }

  // ASSUMED: the role value is exactly 'ADMIN' (confirm against your Role enum)
  return user.role === 'ADMIN' ? <AdminDashboardPage /> : <ExamListPage />;
}
