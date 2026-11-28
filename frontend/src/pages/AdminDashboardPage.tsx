import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listAdminExams, releaseExam } from '../api/adminExams';
import { ApiError } from '../api/client';
import type { AdminExam } from '../api/types';

export function AdminDashboardPage() {
  const [exams, setExams] = useState<AdminExam[]>([]);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [loading, setLoading] = useState(true);
  const [releasingId, setReleasingId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await listAdminExams();
        if (!cancelled) setExams(data);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError ? err.message : 'Something went wrong',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleRelease(exam: AdminExam) {
    const ok = window.confirm(
      `Release "${exam.title}"? Students will be able to see and take it.`,
    );
    if (!ok) return;

    setActionError('');
    setReleasingId(exam.id);
    try {
      await releaseExam(exam.id);
      setExams(await listAdminExams()); // show what the server says, not a guess
    } catch (err) {
      setActionError(
        err instanceof ApiError ? err.message : 'Could not release the exam',
      );
    } finally {
      setReleasingId(null);
    }
  }

  if (loading) return <p className="page">Loading...</p>;
  if (error)
    return (
      <p className="page" role="alert">
        {error}
      </p>
    );

  return (
    <div className="page">
      <h2>Admin dashboard</h2>
      <Link className="button-link" to="/admin/exams/new">
        Create exam
      </Link>

      {actionError && <p role="alert">{actionError}</p>}

      <h2 className="section-gap">Exams</h2>
      {exams.length === 0 ? (
        <p className="muted">No exams yet. Create your first one.</p>
      ) : (
        <ul className="plain">
          {exams.map((exam) => (
            <li key={exam.id} className="card">
              <strong>{exam.title}</strong>
              <div className="muted">
                {exam.durationMinutes} minutes, pass mark {exam.passMarkPercent}
                %
              </div>
              <div className="badges">
                <span
                  className={`badge ${exam.isReleased ? 'released' : 'draft'}`}
                >
                  {exam.isReleased ? 'Released' : 'Draft'}
                </span>
                {exam.isLocked && <span className="badge locked">Locked</span>}
              </div>
              <div className="actions">
                <Link className="button-link" to={`/admin/exams/${exam.id}`}>
                  Manage
                </Link>
                {!exam.isReleased && (
                  <button
                    className="secondary"
                    onClick={() => handleRelease(exam)}
                    disabled={releasingId !== null}
                  >
                    {releasingId === exam.id ? 'Releasing...' : 'Release'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
