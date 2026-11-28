import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { deleteExam, getAdminExam, updateExam } from '../api/adminExams';
import {
  createQuestion,
  deleteQuestion,
  listQuestions,
  updateQuestion,
} from '../api/adminQuestions';
import { ApiError } from '../api/client';
import { QuestionForm } from '../components/QuestionForm';
import type { AdminExam, Question, QuestionInput } from '../api/types';

const LETTERS = ['A', 'B', 'C', 'D'];

function messageOf(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

export function AdminExamPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Exam details
  const [exam, setExam] = useState<AdminExam | null>(null);
  const [examLoading, setExamLoading] = useState(true);
  const [examError, setExamError] = useState('');

  // Questions (separate call, separate state)
  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState('');

  // Exam edit form
  const [editingExam, setEditingExam] = useState(false);
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [passMark, setPassMark] = useState('');
  const [examFormError, setExamFormError] = useState('');
  const [savingExam, setSavingExam] = useState(false);

  // Question add/edit
  const [showAdd, setShowAdd] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null,
  );

  const [actionError, setActionError] = useState('');

  const loadExam = useCallback(async () => {
    if (!id) return;
    try {
      setExam(await getAdminExam(id));
      setExamError('');
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setExamError('Exam not found.');
      } else {
        setExamError(messageOf(err, 'Something went wrong'));
      }
    } finally {
      setExamLoading(false);
    }
  }, [id]);

  const loadQuestions = useCallback(async () => {
    if (!id) return;
    try {
      setQuestions(await listQuestions(id));
      setQuestionsError('');
    } catch (err) {
      setQuestionsError(messageOf(err, 'Could not load questions'));
    } finally {
      setQuestionsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadExam();
    loadQuestions();
  }, [loadExam, loadQuestions]);

  function startEditExam(current: AdminExam) {
    setTitle(current.title);
    setDuration(String(current.durationMinutes));
    setPassMark(String(current.passMarkPercent));
    setExamFormError('');
    setEditingExam(true);
  }

  async function handleSaveExam(event: FormEvent) {
    event.preventDefault();
    if (!id) return;
    setExamFormError('');

    const durationMinutes = Number(duration);
    const passMarkPercent = Number(passMark);
    if (!title.trim()) {
      setExamFormError('Title is required.');
      return;
    }
    if (!Number.isInteger(durationMinutes) || durationMinutes < 1) {
      setExamFormError(
        'Duration must be a whole number of minutes, at least 1.',
      );
      return;
    }
    // ASSUMED: pass mark is a whole number from 0 to 100
    if (
      !Number.isInteger(passMarkPercent) ||
      passMarkPercent < 0 ||
      passMarkPercent > 100
    ) {
      setExamFormError('Pass mark must be a whole number from 0 to 100.');
      return;
    }

    setSavingExam(true);
    try {
      await updateExam(id, {
        title: title.trim(),
        durationMinutes,
        passMarkPercent,
      });
      await loadExam();
      setEditingExam(false);
    } catch (err) {
      // 409 here means a student has started the exam
      setExamFormError(messageOf(err, 'Could not save the exam'));
    } finally {
      setSavingExam(false);
    }
  }

  async function handleDeleteExam(current: AdminExam) {
    if (!id) return;
    const ok = window.confirm(
      `Delete "${current.title}" and all of its questions? This cannot be undone.`,
    );
    if (!ok) return;
    setActionError('');
    try {
      await deleteExam(id);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setActionError(messageOf(err, 'Could not delete the exam'));
    }
  }

  async function handleAddQuestion(input: QuestionInput) {
    if (!id) return;
    await createQuestion(id, input); // errors go back to the form
    setShowAdd(false);
    await loadQuestions();
  }

  async function handleUpdateQuestion(
    questionId: string,
    input: QuestionInput,
  ) {
    await updateQuestion(questionId, input);
    setEditingQuestionId(null);
    await loadQuestions();
  }

  async function handleDeleteQuestion(question: Question) {
    const ok = window.confirm('Delete this question? This cannot be undone.');
    if (!ok) return;
    setActionError('');
    try {
      await deleteQuestion(question.id);
      await loadQuestions();
    } catch (err) {
      setActionError(messageOf(err, 'Could not delete the question'));
    }
  }

  if (examLoading) return <p className="page">Loading exam...</p>;
  if (examError)
    return (
      <div className="page">
        <p role="alert">{examError}</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    );
  if (!exam) return null;

  const locked = exam.isLocked;
  const sorted = [...questions].sort((a, b) => a.position - b.position);
  const nextPosition =
    questions.reduce((max, q) => Math.max(max, q.position), 0) + 1;

  return (
    <div className="page">
      <Link to="/dashboard">&larr; Back to dashboard</Link>

      {/* Exam details */}
      <div className="card section-gap">
        {editingExam ? (
          <form onSubmit={handleSaveExam}>
            <h2>Edit exam</h2>

            <label htmlFor="exam-title">Title</label>
            <input
              id="exam-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label htmlFor="exam-duration">Duration (minutes)</label>
            <input
              id="exam-duration"
              type="number"
              min={1}
              step={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            <label htmlFor="exam-passmark">Pass mark (%)</label>
            <input
              id="exam-passmark"
              type="number"
              min={0}
              max={100}
              step={1}
              value={passMark}
              onChange={(e) => setPassMark(e.target.value)}
            />

            {examFormError && <p role="alert">{examFormError}</p>}

            <div className="actions">
              <button type="submit" disabled={savingExam}>
                {savingExam ? 'Saving...' : 'Save changes'}
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setEditingExam(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2>{exam.title}</h2>
            <p className="muted">
              {exam.durationMinutes} minutes, pass mark {exam.passMarkPercent}%
            </p>
            <div className="badges">
              <span
                className={`badge ${exam.isReleased ? 'released' : 'draft'}`}
              >
                {exam.isReleased ? 'Released' : 'Draft'}
              </span>
              {locked && <span className="badge locked">Locked</span>}
            </div>
            {locked && (
              <p className="muted">
                A student has started this exam, so it can no longer be edited.
              </p>
            )}
            <div className="actions">
              <button onClick={() => startEditExam(exam)} disabled={locked}>
                Edit exam
              </button>
              <button className="danger" onClick={() => handleDeleteExam(exam)}>
                Delete exam
              </button>
            </div>
          </>
        )}
      </div>

      {actionError && <p role="alert">{actionError}</p>}

      {/* Questions */}
      <h2 className="section-gap">Questions ({questions.length})</h2>

      {questionsLoading && <p>Loading questions...</p>}
      {questionsError && (
        <div className="card">
          <p role="alert">{questionsError}</p>
          <button onClick={loadQuestions}>Retry</button>
        </div>
      )}

      {!questionsLoading && !questionsError && sorted.length === 0 && (
        <p className="muted">No questions yet.</p>
      )}

      <ul className="plain">
        {sorted.map((question) =>
          editingQuestionId === question.id ? (
            <li key={question.id}>
              <QuestionForm
                initial={question}
                position={question.position}
                submitLabel="Save question"
                onSubmit={(input) => handleUpdateQuestion(question.id, input)}
                onCancel={() => setEditingQuestionId(null)}
              />
            </li>
          ) : (
            <li key={question.id} className="card">
              <p className="muted">Question {question.position}</p>
              <strong>{question.text}</strong>
              <ul className="plain">
                {question.options.map((option, index) => (
                  <li
                    key={index}
                    className={
                      index === question.correctIndex
                        ? 'correct-option'
                        : undefined
                    }
                  >
                    {LETTERS[index]}. {option}
                    {index === question.correctIndex ? ' ✓ Correct' : ''}
                  </li>
                ))}
              </ul>
              <div className="actions">
                <button
                  className="secondary"
                  onClick={() => {
                    setShowAdd(false);
                    setEditingQuestionId(question.id);
                  }}
                  disabled={locked}
                >
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => handleDeleteQuestion(question)}
                  disabled={locked}
                >
                  Delete
                </button>
              </div>
            </li>
          ),
        )}
      </ul>

      {showAdd ? (
        <QuestionForm
          position={nextPosition}
          submitLabel="Add question"
          onSubmit={handleAddQuestion}
          onCancel={() => setShowAdd(false)}
        />
      ) : (
        <button
          onClick={() => {
            setEditingQuestionId(null);
            setShowAdd(true);
          }}
          disabled={locked || questionsLoading}
        >
          Add question
        </button>
      )}
    </div>
  );
}
