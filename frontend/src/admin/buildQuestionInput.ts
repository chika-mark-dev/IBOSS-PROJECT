import type { QuestionInput } from '../api/types';

// correctIndex is the 0-based position in the options array (A = 0, B = 1, C = 2, D = 3).
export function buildQuestionInput(
  text: string,
  options: string[],
  correctIndex: number | null,
  position: number,
): QuestionInput {
  const cleanText = text.trim();
  const cleanOptions = options.map((o) => o.trim());

  if (!cleanText) throw new Error('Question text is required.');
  if (cleanOptions.some((o) => !o))
    throw new Error('Fill in all four options.');
  if (
    correctIndex === null ||
    !Number.isInteger(correctIndex) ||
    correctIndex < 0 ||
    correctIndex >= cleanOptions.length
  ) {
    throw new Error('Choose the correct option.');
  }

  return {
    text: cleanText,
    options: cleanOptions,
    correctIndex,
    position,
  };
}
