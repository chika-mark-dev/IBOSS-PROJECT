import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getResult, getSession } from '../api/sessions';
import { getMe } from '../api/users';
import { ApiError } from '../api/client';
import type { Result, SessionQuestion } from '../api/types';

const LETTERS = ['A', 'B', 'C', 'D'];

function describe(question: SessionQuestion | undefined, index: number | null) {
  if (index === null) return 'No answer';
  const text = question?.options[index];
  return text ? `${LETTERS[index]}. ${text}` : LETTERS[index];
}

export function ResultPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState<Result | null>(null);
  const [questions, setQuestions] = useState<Record<string, SessionQuestion>>(
    {},
  );
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        const data = await getResult(id as string);
        if (cancelled) return;
        setResult(data);

        // The student's name is optional: if this fails the heading says "Your result".
        try {
          const me = await getMe();
          if (cancelled) return;
          setName(me.name);
        } catch {
          // name is optional
        }

        // ASSUMED: GET /sessions/:id also works for closed sessions and still returns questions.
        // If it fails we keep going and show "Question N" instead of the text.
        try {
          const session = await getSession(id as string);
          if (cancelled) return;
          const byId: Record<string, SessionQuestion> = {};
          session.questions.forEach((q) => {
            byId[q.id] = q;
          });
          setQuestions(byId);
        } catch {
          // question text is optional
        }
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 409) {
          // not submitted yet: go back to the exam
          navigate(`/sessions/${id}`, { replace: true });
          return;
        }
        if (err instanceof ApiError && err.status === 404) {
          setError('Result not found.');
        } else {
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
  }, [id, navigate]);

  if (loading) return <p className="page">Loading result...</p>;
  if (error)
    return (
      <div className="page">
        <p role="alert">{error}</p>
        <Link to="/exams">Back to exams</Link>
      </div>
    );
  if (!result) return null;

  return (
    <div className="page">
      <div className="card">
        <h1>{name ? `${name}'s result` : 'Your result'}</h1>
        <p className="score">
          {result.score} / {result.total}
        </p>
        <p>
          {Math.round(result.percentage)}% &middot;{' '}
          <span className={result.passed ? 'pass' : 'fail'}>
            {result.passed ? 'Passed' : 'Failed'}
          </span>
        </p>
        {result.status === 'submitted_late' && (
          <p className="muted">Submitted after the time limit.</p>
        )}
        {result.status === 'expired' && (
          <p className="muted">Time ran out before this exam was submitted.</p>
        )}
      </div>

      <h2>Breakdown</h2>
      <ul className="plain">
        {result.breakdown.map((item, position) => {
          const question = questions[item.questionId];
          return (
            <li
              key={item.questionId}
              className={`card ${item.isCorrect ? 'correct' : 'wrong'}`}
            >
              <p className="muted">
                Question {position + 1} &middot;{' '}
                <strong>{item.isCorrect ? 'Correct' : 'Wrong'}</strong>
              </p>
              {question && <p>{question.text}</p>}
              <p>Your answer: {describe(question, item.selectedIndex)}</p>
              {!item.isCorrect && (
                <p>Correct answer: {describe(question, item.correctIndex)}</p>
              )}
            </li>
          );
        })}
      </ul>

      <Link to="/exams">Back to exams</Link>
    </div>
  );
}
