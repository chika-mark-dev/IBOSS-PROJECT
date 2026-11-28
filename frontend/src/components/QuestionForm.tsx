import { useId, useState } from 'react';
import type { FormEvent } from 'react';
import { buildQuestionInput } from '../admin/buildQuestionInput';
import type { Question, QuestionInput } from '../api/types';

const LETTERS = ['A', 'B', 'C', 'D'];

interface QuestionFormProps {
  initial?: Question; // present when editing
  position: number; // next free number when adding; the existing one when editing
  submitLabel: string;
  onSubmit: (input: QuestionInput) => Promise<void>;
  onCancel: () => void;
}

export function QuestionForm({
  initial,
  position,
  submitLabel,
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const groupName = useId();
  const [text, setText] = useState(initial?.text ?? '');
  const [options, setOptions] = useState<string[]>(
    initial?.options ?? ['', '', '', ''],
  );
  const [correctIndex, setCorrectIndex] = useState<number | null>(
    initial?.correctIndex ?? null,
  );
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function setOption(index: number, value: string) {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      const input = buildQuestionInput(text, options, correctIndex, position);
      setSaving(true);
      await onSubmit(input);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSaving(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <label htmlFor={`${groupName}-text`}>Question</label>
      <input
        id={`${groupName}-text`}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <p className="muted section-gap">
        Type the four options and select the correct one.
      </p>
      {options.map((option, index) => (
        <div className="option-row" key={index}>
          <input
            type="radio"
            name={groupName}
            checked={correctIndex === index}
            onChange={() => setCorrectIndex(index)}
            aria-label={`Mark option ${LETTERS[index]} as correct`}
          />
          <strong>{LETTERS[index]}</strong>
          <input
            type="text"
            value={option}
            onChange={(e) => setOption(index, e.target.value)}
            aria-label={`Option ${LETTERS[index]}`}
          />
        </div>
      ))}

      {error && <p role="alert">{error}</p>}

      <div className="actions">
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : submitLabel}
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
