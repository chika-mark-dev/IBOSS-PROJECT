import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listExams } from '../api/exams';
import { startSession } from '../api/sessions';
import { ApiError } from '../api/client';
import type { ExamSummary } from '../api/types';

export function ExamListPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState<ExamSummary[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState<string | null>(null);
  const [startError, setStartError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await listExams();
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

  async function handleStart(examId: string) {
    setStartError('');
    setStartingId(examId);
    try {
      const session = await startSession(examId);
      navigate(`/sessions/${session.id}`);
    } catch (err) {
      // ASSUMED: starting an already-submitted exam returns an error with a readable message
      setStartError(
        err instanceof ApiError ? err.message : 'Something went wrong',
      );
    } finally {
      setStartingId(null);
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
    <div>
      <h1>Exams</h1>
      {startError && <p role="alert">{startError}</p>}
      {exams.length === 0 ? (
        <p>No exams available yet.</p>
      ) : (
        <ul>
          {exams.map((exam) => (
            <li key={exam.id}>
              <strong>{exam.title}</strong>
              <div>
                {exam.durationMinutes} minutes, pass mark {exam.passMarkPercent}
                %
              </div>
              <button
                onClick={() => handleStart(exam.id)}
                disabled={startingId !== null}
              >
                {startingId === exam.id ? 'Starting...' : 'Start exam'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
