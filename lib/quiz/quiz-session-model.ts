import type {
  QuestionResult,
  QuestionSetId,
  QuizMode,
  QuizSession
} from "../types";
import { quizModes } from "../types";

function isQuizMode(value: string): value is QuizMode {
  return quizModes.includes(value as QuizMode);
}

function validateQuestionResult(questionResult: QuestionResult): QuestionResult {
  if (typeof questionResult.questionId !== "string") {
    throw new Error("Question result questionId must be a string.");
  }

  if (!Number.isInteger(questionResult.selectedAnswer)) {
    throw new Error(
      `Question result selectedAnswer must be an integer: ${questionResult.questionId}`
    );
  }

  if (typeof questionResult.isCorrect !== "boolean") {
    throw new Error(
      `Question result isCorrect must be a boolean: ${questionResult.questionId}`
    );
  }

  if (typeof questionResult.submittedAt !== "string") {
    throw new Error(
      `Question result submittedAt must be a string: ${questionResult.questionId}`
    );
  }

  return questionResult;
}

export function validateQuizSession(quizSession: QuizSession): QuizSession {
  if (!isQuizMode(quizSession.mode)) {
    throw new Error("Quiz session mode is invalid.");
  }

  if (typeof quizSession.questionSetId !== "string") {
    throw new Error("Quiz session questionSetId must be a string.");
  }

  if (typeof quizSession.questionSetTitle !== "string") {
    throw new Error("Quiz session questionSetTitle must be a string.");
  }

  if (!Array.isArray(quizSession.questionIds)) {
    throw new Error("Quiz session questionIds must be an array.");
  }

  quizSession.questionIds.forEach((questionId) => {
    if (typeof questionId !== "string") {
      throw new Error("Quiz session questionIds must contain strings.");
    }
  });

  if (!Number.isInteger(quizSession.currentQuestionIndex)) {
    throw new Error("Quiz session currentQuestionIndex must be an integer.");
  }

  if (!Array.isArray(quizSession.results)) {
    throw new Error("Quiz session results must be an array.");
  }

  quizSession.results.forEach((questionResult) => {
    validateQuestionResult(questionResult);
  });

  if (typeof quizSession.startedAt !== "string") {
    throw new Error("Quiz session startedAt must be a string.");
  }

  if (quizSession.completedAt !== null && typeof quizSession.completedAt !== "string") {
    throw new Error("Quiz session completedAt must be a string or null.");
  }

  return quizSession;
}

export function hasCompleteQuizSession(
  quizSession: QuizSession | null
): quizSession is QuizSession {
  return (
    quizSession !== null &&
    quizSession.completedAt !== null &&
    quizSession.questionIds.length > 0 &&
    quizSession.results.length === quizSession.questionIds.length
  );
}

export function parseStoredQuizSession(rawValue: string): QuizSession {
  const parsed = JSON.parse(rawValue) as Partial<QuizSession> & {
    questionIds?: readonly string[];
    results?: readonly Partial<QuestionResult>[];
  };
  const questionIds = Array.isArray(parsed.questionIds) ? parsed.questionIds : [];
  const results = Array.isArray(parsed.results)
    ? parsed.results.map((result) => ({
        questionId: typeof result.questionId === "string" ? result.questionId : "",
        selectedAnswer:
          typeof result.selectedAnswer === "number" ? result.selectedAnswer : -1,
        isCorrect: result.isCorrect === true,
        submittedAt: typeof result.submittedAt === "string" ? result.submittedAt : ""
      }))
    : [];

  const quizSession: QuizSession = {
    mode: typeof parsed.mode === "string" && isQuizMode(parsed.mode) ? parsed.mode : "normal",
    questionSetId:
      typeof parsed.questionSetId === "string"
        ? (parsed.questionSetId as QuestionSetId)
        : "",
    questionSetTitle: typeof parsed.questionSetTitle === "string" ? parsed.questionSetTitle : "",
    questionIds,
    currentQuestionIndex:
      typeof parsed.currentQuestionIndex === "number" ? parsed.currentQuestionIndex : 0,
    results,
    startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : "",
    completedAt: typeof parsed.completedAt === "string" ? parsed.completedAt : null
  };

  return validateQuizSession(quizSession);
}
