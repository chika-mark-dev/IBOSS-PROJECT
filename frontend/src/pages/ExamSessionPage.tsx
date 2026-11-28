import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSession, saveAnswer, submitSession } from '../api/sessions';
import { ApiError } from '../api/client';
import { Countdown } from '../components/Countdown';
import { QuestionNavigator } from '../components/QuestionNavigator';
import type { Session } from '../api/types';

const LETTERS = ['A', 'B', 'C', 'D'];

export function ExamSessionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [error, setError] = useState('');
  const [saveError, setSaveError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [pendingSaves, setPendingSaves] = useState(0);
  // questionId -> number of the latest click for that question
  const latestClick = useRef<Record<string, number>>({});
  // blocks a second submit starting while one is already running
  const submittingRef = useRef(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function load() {
      try {
        const data = await getSession(id as string);
        if (cancelled) return;
        if (data.status !== 'in_progress') {
          // ASSUMED: GET /sessions/:id/result works for submitted, submitted_late and expired
          navigate(`/sessions/${id}/result`, { replace: true });
          return;
        }
        setSession(data);
        setRemainingSeconds(data.remainingSeconds);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof ApiError && err.status === 404) {
          setError('Session not found.');
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

  // Set (or remove, when value is undefined) one answer in local state
  function setAnswer(questionId: string, value: number | undefined) {
    setSession((prev) => {
      if (!prev) return prev;
      const answers = { ...prev.answers };
      if (value === undefined) delete answers[questionId];
      else answers[questionId] = value;
      return { ...prev, answers };
    });
  }

  // The server said the session is closed (409). Ask the server what state it is in.
  async function handleClosed(sessionId: string) {
    try {
      const fresh = await getSession(sessionId);
      if (fresh.status !== 'in_progress') {
        navigate(`/sessions/${sessionId}/result`, { replace: true });
        return;
      }
      setSaveError('Answer not saved. Please try again.');
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Answer not saved.');
    }
  }

  async function handleSelect(questionId: string, index: number) {
    if (!session || !id || submitting) return;
    const previous: number | undefined = session.answers[questionId];
    if (previous === index) return;

    const clickNumber = (latestClick.current[questionId] ?? 0) + 1;
    latestClick.current[questionId] = clickNumber;

    setSaveError('');
    setAnswer(questionId, index); // show it immediately
    setPendingSaves((n) => n + 1);

    try {
      const saved = await saveAnswer(id, questionId, index);
      setRemainingSeconds(saved.remainingSeconds); // re-sync with the server clock
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        await handleClosed(id);
        return;
      }
      // Only the latest click may undo itself, so an old failure can't erase a newer choice
      if (latestClick.current[questionId] === clickNumber) {
        setAnswer(questionId, previous);
        setSaveError(
          err instanceof ApiError
            ? `Answer not saved: ${err.message}`
            : 'Answer not saved.',
        );
      }
    } finally {
      setPendingSaves((n) => n - 1);
    }
  }

  // Used by the countdown at 00:00, the confirm button, and the Retry button
  async function submitExam() {
    if (!id || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitError('');
    setSubmitting(true);
    try {
      await submitSession(id);
      navigate(`/sessions/${id}/result`, { replace: true });
    } catch (err) {
      setSubmitError(
        err instanceof ApiError
          ? `Submit failed: ${err.message}`
          : 'Submit failed.',
      );
      submittingRef.current = false; // allow Retry
      setSubmitting(false);
    }
  }

  if (loading) return <p className="page">Loading exam...</p>;
  if (error)
    return (
      <p className="page" role="alert">
        {error}
      </p>
    );
  if (!session) return null;

  const total = session.questions.length;
  const question = session.questions[currentIndex];
  const selected: number | undefined = session.answers[question.id];
  const unanswered = session.questions.filter(
    (q) => !(q.id in session.answers),
  ).length;

  return (
    <div className="page">
      <Countdown remainingSeconds={remainingSeconds} onExpire={submitExam} />

      {submitting && <p className="card">Submitting your exam...</p>}
      {submitError && (
        <div className="card">
          <p role="alert">{submitError}</p>
          <button onClick={submitExam}>Retry submit</button>
        </div>
      )}

      <QuestionNavigator
        questions={session.questions}
        answers={session.answers}
        currentIndex={currentIndex}
        onSelect={setCurrentIndex}
        disabled={submitting}
      />

      <div className="card">
        <p className="muted">
          Question {currentIndex + 1} of {total}
        </p>
        <h2>{question.text}</h2>

        <ul className="plain">
          {question.options.map((option, index) => (
            <li key={index}>
              <label
                className={`option${selected === index ? ' selected' : ''}`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={selected === index}
                  disabled={submitting}
                  onChange={() => handleSelect(question.id, index)}
                />
                {LETTERS[index]}. {option}
              </label>
            </li>
          ))}
        </ul>

        {saveError && <p role="alert">{saveError}</p>}

        <div className="actions">
          <button
            onClick={() => setCurrentIndex((i) => i - 1)}
            disabled={currentIndex === 0}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentIndex((i) => i + 1)}
            disabled={currentIndex === total - 1}
          >
            Next
          </button>
        </div>
      </div>

      <div className="card">
        {confirming ? (
          <>
            <p>
              {unanswered > 0
                ? `You have ${unanswered} unanswered question${unanswered === 1 ? '' : 's'}. Submit anyway?`
                : 'Submit your exam? You cannot change answers afterwards.'}
            </p>
            <div className="actions">
              <button
                onClick={() => {
                  setConfirming(false);
                  submitExam();
                }}
                disabled={submitting || pendingSaves > 0}
              >
                Yes, submit
              </button>
              <button
                className="secondary"
                onClick={() => setConfirming(false)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setConfirming(true)}
            disabled={submitting || pendingSaves > 0}
          >
            {pendingSaves > 0 ? 'Saving...' : 'Submit exam'}
          </button>
        )}
      </div>
    </div>
  );
}
