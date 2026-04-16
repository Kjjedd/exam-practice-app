import type { Question, QuestionId, QuestionSet } from "../types";

export type QuestionNumberRange = Readonly<{
  start: number;
  end: number;
}>;

export function getQuestionNumberFromId(questionId: QuestionId): number | null {
  const matchedDigits = questionId.match(/(\d+)(?!.*\d)/);

  if (matchedDigits === null) {
    return null;
  }

  const questionNumber = Number.parseInt(matchedDigits[1], 10);

  return Number.isInteger(questionNumber) ? questionNumber : null;
}

export function getQuestionNumber(question: Question): number | null {
  return getQuestionNumberFromId(question.id);
}

export function getQuestionSetNumberRange(
  questionSet: QuestionSet
): QuestionNumberRange | null {
  const questionNumbers = questionSet.questions
    .map(getQuestionNumber)
    .filter((questionNumber): questionNumber is number => questionNumber !== null);

  if (questionNumbers.length === 0) {
    return null;
  }

  return {
    start: Math.min(...questionNumbers),
    end: Math.max(...questionNumbers)
  };
}

export function isQuestionNumberRangeValid(
  range: QuestionNumberRange,
  allowedRange: QuestionNumberRange
): boolean {
  return (
    range.start >= allowedRange.start &&
    range.end <= allowedRange.end &&
    range.start <= range.end
  );
}

export function filterQuestionIdsByNumberRange(
  questionSet: QuestionSet,
  range: QuestionNumberRange
): readonly QuestionId[] {
  return questionSet.questions
    .filter((question) => {
      const questionNumber = getQuestionNumber(question);

      if (questionNumber === null) {
        return false;
      }

      return questionNumber >= range.start && questionNumber <= range.end;
    })
    .map((question) => question.id);
}

export function getQuestionNumberRangeLabel(range: QuestionNumberRange | null): string | null {
  if (range === null) {
    return null;
  }

  return `${range.start}~${range.end}`;
}
