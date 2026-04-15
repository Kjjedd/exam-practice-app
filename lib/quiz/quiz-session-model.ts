import type {
  InProgressQuizSession,
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

  if (!Array.isArray(questionResult.selectedAnswers)) {
    throw new Error(
      `Question result selectedAnswers must be an array: ${questionResult.questionId}`
    );
  }

  questionResult.selectedAnswers.forEach((selectedAnswer) => {
    if (!Number.isInteger(selectedAnswer)) {
      throw new Error(
        `Question result selectedAnswers must contain integers: ${questionResult.questionId}`
      );
    }
  });

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

function validateQuizSessionCore(
  quizSession: Omit<QuizSession, "completedAt">
): Omit<QuizSession, "completedAt"> {
  if (!isQuizMode(quizSession.mode)) {
    throw new Error("Quiz session mode is invalid.");
  }

  if (typeof quizSession.questionSetId !== "string") {
    throw new Error("Quiz session questionSetId must be a string.");
  }

  if (typeof quizSession.questionSetTitle !== "string") {
    throw new Error("Quiz session questionSetTitle must be a string.");
  }

  if (quizSession.examTemplateId !== null && typeof quizSession.examTemplateId !== "string") {
    throw new Error("Quiz session examTemplateId must be a string or null.");
  }

  if (
    quizSession.examTemplateTitle !== null &&
    typeof quizSession.examTemplateTitle !== "string"
  ) {
    throw new Error("Quiz session examTemplateTitle must be a string or null.");
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

  return quizSession;
}

export function validateQuizSession(quizSession: QuizSession): QuizSession {
  validateQuizSessionCore(quizSession);

  if (quizSession.completedAt !== null && typeof quizSession.completedAt !== "string") {
    throw new Error("Quiz session completedAt must be a string or null.");
  }

  return quizSession;
}

export function validateInProgressQuizSession(
  quizSession: InProgressQuizSession
): InProgressQuizSession {
  validateQuizSessionCore(quizSession);

  if (typeof quizSession.savedAt !== "string") {
    throw new Error("In-progress quiz session savedAt must be a string.");
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
        selectedAnswers: Array.isArray(result.selectedAnswers)
          ? result.selectedAnswers.filter(
              (
                selectedAnswer:
                  | string
                  | number
                  | boolean
                  | null
                  | undefined
                  | object
              ): selectedAnswer is number =>
                typeof selectedAnswer === "number"
            )
          : [],
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
    examTemplateId: typeof parsed.examTemplateId === "string" ? parsed.examTemplateId : null,
    examTemplateTitle:
      typeof parsed.examTemplateTitle === "string" ? parsed.examTemplateTitle : null,
    questionIds,
    currentQuestionIndex:
      typeof parsed.currentQuestionIndex === "number" ? parsed.currentQuestionIndex : 0,
    results,
    startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : "",
    completedAt: typeof parsed.completedAt === "string" ? parsed.completedAt : null
  };

  return validateQuizSession(quizSession);
}

export function parseStoredInProgressQuizSession(rawValue: string): InProgressQuizSession {
  const parsed = JSON.parse(rawValue) as Partial<InProgressQuizSession> & {
    questionIds?: readonly string[];
    results?: readonly Partial<QuestionResult>[];
  };
  const questionIds = Array.isArray(parsed.questionIds) ? parsed.questionIds : [];
  const results = Array.isArray(parsed.results)
    ? parsed.results.map((result) => ({
        questionId: typeof result.questionId === "string" ? result.questionId : "",
        selectedAnswers: Array.isArray(result.selectedAnswers)
          ? result.selectedAnswers.filter(
              (
                selectedAnswer:
                  | string
                  | number
                  | boolean
                  | null
                  | undefined
                  | object
              ): selectedAnswer is number =>
                typeof selectedAnswer === "number"
            )
          : [],
        isCorrect: result.isCorrect === true,
        submittedAt: typeof result.submittedAt === "string" ? result.submittedAt : ""
      }))
    : [];

  const inProgressQuizSession: InProgressQuizSession = {
    mode: typeof parsed.mode === "string" && isQuizMode(parsed.mode) ? parsed.mode : "normal",
    questionSetId:
      typeof parsed.questionSetId === "string"
        ? (parsed.questionSetId as QuestionSetId)
        : "",
    questionSetTitle: typeof parsed.questionSetTitle === "string" ? parsed.questionSetTitle : "",
    examTemplateId: typeof parsed.examTemplateId === "string" ? parsed.examTemplateId : null,
    examTemplateTitle:
      typeof parsed.examTemplateTitle === "string" ? parsed.examTemplateTitle : null,
    questionIds,
    currentQuestionIndex:
      typeof parsed.currentQuestionIndex === "number" ? parsed.currentQuestionIndex : 0,
    results,
    startedAt: typeof parsed.startedAt === "string" ? parsed.startedAt : "",
    savedAt: typeof parsed.savedAt === "string" ? parsed.savedAt : ""
  };

  return validateInProgressQuizSession(inProgressQuizSession);
}
