import type { Question, QuestionId, QuizSession } from "../types";

export type ResultListItem = Readonly<{
  questionId: QuestionId;
  questionNumber: number;
  questionText: string;
  status: "correct" | "wrong" | "unanswered";
}>;

export type ResultSummary = Readonly<{
  totalQuestions: number;
  answeredCount: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
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
  const resultByQuestionId = new Map(
    quizSession.results.map((questionResult) => [questionResult.questionId, questionResult])
  );

  const items = quizSession.questionIds.map((questionId, index) => {
    const question = questionById.get(questionId);
    const questionResult = resultByQuestionId.get(questionId);
    const status: ResultListItem["status"] =
      questionResult === undefined
        ? "unanswered"
        : questionResult.isCorrect
          ? "correct"
          : "wrong";

    return {
      questionId,
      questionNumber: index + 1,
      questionText: question?.question ?? `문제 ${index + 1}`,
      status
    };
  });

  const totalQuestions = quizSession.questionIds.length;
  const answeredCount = items.filter((item) => item.status !== "unanswered").length;
  const correctCount = items.filter((item) => item.status === "correct").length;
  const wrongCount = items.filter((item) => item.status === "wrong").length;
  const unansweredCount = Math.max(totalQuestions - answeredCount, 0);
  const accuracyRate =
    totalQuestions === 0 ? 0 : Math.round((correctCount / totalQuestions) * 100);

  return {
    totalQuestions,
    answeredCount,
    correctCount,
    wrongCount,
    unansweredCount,
    accuracyRate,
    items
  };
}
