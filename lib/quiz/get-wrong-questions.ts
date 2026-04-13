import type { Question, QuestionId, QuizSession } from "../types";

export function getWrongQuestionIds(quizSession: QuizSession): readonly QuestionId[] {
  const wrongQuestionIds = quizSession.results
    .filter((result) => !result.isCorrect)
    .map((result) => result.questionId);

  return Array.from(new Set(wrongQuestionIds));
}

export function getWrongQuestions(
  quizSession: QuizSession,
  questions: readonly Question[]
): readonly Question[] {
  const questionById = new Map<QuestionId, Question>(
    questions.map((question) => [question.id, question])
  );

  return getWrongQuestionIds(quizSession)
    .map((questionId) => questionById.get(questionId))
    .filter((question): question is Question => question !== undefined);
}
