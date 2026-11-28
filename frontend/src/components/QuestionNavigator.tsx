import type { SessionQuestion } from '../api/types';

interface QuestionNavigatorProps {
  questions: SessionQuestion[];
  answers: Record<string, number>;
  currentIndex: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
}

export function QuestionNavigator({
  questions,
  answers,
  currentIndex,
  onSelect,
  disabled = false,
}: QuestionNavigatorProps) {
  // answered = the question id is a key in answers (the value 0 counts as answered)
  const answeredCount = questions.filter((q) => q.id in answers).length;

  return (
    <div className="card">
      <p className="muted">
        {answeredCount} of {questions.length} answered
      </p>
      <div className="navigator">
        {questions.map((question, index) => {
          const answered = question.id in answers;
          const classes = [
            'nav-item',
            answered ? 'answered' : '',
            index === currentIndex ? 'current' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={question.id}
              type="button"
              className={classes}
              onClick={() => onSelect(index)}
              disabled={disabled}
              aria-label={`Question ${index + 1}, ${answered ? 'answered' : 'not answered'}`}
              aria-current={index === currentIndex ? 'true' : undefined}
            >
              {index + 1}
              {answered ? ' ✓' : ''}
            </button>
          );
        })}
      </div>
    </div>
  );
}
