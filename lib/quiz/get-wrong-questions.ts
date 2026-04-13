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
  const wrongQuestionIds = new Set(getWrongQuestionIds(quizSession));

  return questions.filter((question) => wrongQuestionIds.has(question.id));
}
