import type { Question, QuestionId, QuizSession } from "../types";

export type ResultListItem = Readonly<{
  questionId: QuestionId;
  questionNumber: number;
  questionText: string;
  isCorrect: boolean;
}>;

export type ResultSummary = Readonly<{
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracyRate: number;
  items: readonly ResultListItem[];
}>;

export function summarizeResults(
  quizSession: QuizSession,
  questions: readonly Question[]
): ResultSummary {
  const questionById = new Map<QuestionId, Question>(
    questions.map((question) => [question.id, question])
  );

  const items = quizSession.questionIds.map((questionId, index) => {
    const question = questionById.get(questionId);
    const questionResult = quizSession.results.find((result) => result.questionId === questionId);

    return {
      questionId,
      questionNumber: index + 1,
      questionText: question?.question ?? `문제 ${index + 1}`,
      isCorrect: questionResult?.isCorrect ?? false
    };
  });

  const totalQuestions = quizSession.questionIds.length;
  const correctCount = quizSession.results.filter((result) => result.isCorrect).length;
  const wrongCount = Math.max(totalQuestions - correctCount, 0);
  const accuracyRate =
    totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

  return {
    totalQuestions,
    correctCount,
    wrongCount,
    accuracyRate,
    items
  };
}
