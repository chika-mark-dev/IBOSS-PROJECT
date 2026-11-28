import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createExam } from '../api/adminExams';
import { ApiError } from '../api/client';

export function CreateExamPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('30');
  const [passMark, setPassMark] = useState('50');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    const durationMinutes = Number(duration);
    const passMarkPercent = Number(passMark);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1) {
      setError('Duration must be a whole number of minutes, at least 1.');
      return;
    }
    // ASSUMED: pass mark is a whole number from 0 to 100
    if (
      !Number.isInteger(passMarkPercent) ||
      passMarkPercent < 0 ||
      passMarkPercent > 100
    ) {
      setError('Pass mark must be a whole number from 0 to 100.');
      return;
    }

    setLoading(true);
    try {
      // isReleased is NOT sent: new exams are always drafts
      const exam = await createExam({
        title: title.trim(),
        durationMinutes,
        passMarkPercent,
      });
      navigate(`/admin/exams/${exam.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit}>
        <h2>Create exam</h2>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label htmlFor="duration">Duration (minutes)</label>
        <input
          id="duration"
          type="number"
          min={1}
          step={1}
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />

        <label htmlFor="passMark">Pass mark (%)</label>
        <input
          id="passMark"
          type="number"
          min={0}
          max={100}
          step={1}
          value={passMark}
          onChange={(e) => setPassMark(e.target.value)}
          required
        />

        {error && <p role="alert">{error}</p>}

        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create exam'}
          </button>
          <Link className="button-link secondary-link" to="/dashboard">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
