import type {
  Question,
  QuestionBank,
  QuestionId,
  QuestionSet,
  QuestionSetId
} from "../types";

const QUESTION_BANK_STORAGE_KEY = "exammate.question-bank.v1";

const EMPTY_QUESTION_BANK: QuestionBank = {
  version: 1,
  activeQuestionSetId: null,
  questionSets: []
};

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function assertNonEmptyText(value: string, message: string): void {
  if (value.trim().length === 0) {
    throw new Error(message);
  }
}

function validateQuestion(question: Question): Question {
  if (typeof question.id !== "string") {
    throw new Error("Question id must be a string.");
  }

  if (typeof question.question !== "string") {
    throw new Error(`Question text must be a string: ${question.id}`);
  }

  assertNonEmptyText(question.question, `Question text is required: ${question.id}`);

  if (!Array.isArray(question.choices)) {
    throw new Error(`Question choices must be an array: ${question.id}`);
  }

  if (question.choices.length < 2) {
    throw new Error(`Question must have at least two choices: ${question.id}`);
  }

  question.choices.forEach((choice, index) => {
    if (typeof choice !== "string") {
      throw new Error(`Question choice must be a string: ${question.id}:${index}`);
    }

    assertNonEmptyText(choice, `Question choice is required: ${question.id}:${index}`);
  });

  if (!Number.isInteger(question.answer)) {
    throw new Error(`Question answer must be an integer: ${question.id}`);
  }

  if (question.answer < 0 || question.answer >= question.choices.length) {
    throw new Error(`Question answer is out of range: ${question.id}`);
  }

  if (typeof question.explanation !== "string") {
    throw new Error(`Question explanation must be a string: ${question.id}`);
  }

  if (typeof question.category !== "string") {
    throw new Error(`Question category must be a string: ${question.id}`);
  }

  return question;
}

export function validateQuestions(questions: readonly Question[]): readonly Question[] {
  const seenIds = new Set<QuestionId>();

  questions.forEach((question) => {
    validateQuestion(question);

    if (seenIds.has(question.id)) {
      throw new Error(`Duplicate question id found: ${question.id}`);
    }

    seenIds.add(question.id);
  });

  return questions;
}

export function validateQuestionSet(questionSet: QuestionSet): QuestionSet {
  if (typeof questionSet.id !== "string") {
    throw new Error("Question set id must be a string.");
  }

  if (typeof questionSet.title !== "string") {
    throw new Error(`Question set title must be a string: ${questionSet.id}`);
  }

  assertNonEmptyText(questionSet.title, `Question set title is required: ${questionSet.id}`);

  if (typeof questionSet.sourceLabel !== "string") {
    throw new Error(`Question set source label must be a string: ${questionSet.id}`);
  }

  assertNonEmptyText(
    questionSet.sourceLabel,
    `Question set source label is required: ${questionSet.id}`
  );

  if (typeof questionSet.createdAt !== "string") {
    throw new Error(`Question set createdAt must be a string: ${questionSet.id}`);
  }

  assertNonEmptyText(
    questionSet.createdAt,
    `Question set createdAt is required: ${questionSet.id}`
  );

  if (!Array.isArray(questionSet.questions)) {
    throw new Error(`Question set questions must be an array: ${questionSet.id}`);
  }

  validateQuestions(questionSet.questions);

  return questionSet;
}

function validateQuestionBank(questionBank: QuestionBank): QuestionBank {
  if (questionBank.version !== 1) {
    throw new Error("Unsupported question bank version.");
  }

  const seenQuestionSetIds = new Set<QuestionSetId>();

  questionBank.questionSets.forEach((questionSet) => {
    validateQuestionSet(questionSet);

    if (seenQuestionSetIds.has(questionSet.id)) {
      throw new Error(`Duplicate question set id found: ${questionSet.id}`);
    }

    seenQuestionSetIds.add(questionSet.id);
  });

  if (
    questionBank.activeQuestionSetId !== null &&
    !seenQuestionSetIds.has(questionBank.activeQuestionSetId)
  ) {
    throw new Error("Active question set id does not exist in the question bank.");
  }

  return questionBank;
}

function parseQuestionBankStorage(rawValue: string): QuestionBank {
  const parsed = JSON.parse(rawValue) as Partial<QuestionBank>;
  const questionSets = Array.isArray(parsed.questionSets)
    ? (parsed.questionSets as readonly QuestionSet[])
    : [];
  const activeQuestionSetId =
    typeof parsed.activeQuestionSetId === "string" ? parsed.activeQuestionSetId : null;

  return validateQuestionBank({
    version: 1,
    activeQuestionSetId,
    questionSets
  });
}

export function createEmptyQuestionBank(): QuestionBank {
  return EMPTY_QUESTION_BANK;
}

export function readQuestionBank(): QuestionBank {
  if (!canUseLocalStorage()) {
    return createEmptyQuestionBank();
  }

  const rawValue = window.localStorage.getItem(QUESTION_BANK_STORAGE_KEY);

  if (rawValue === null) {
    return createEmptyQuestionBank();
  }

  try {
    return parseQuestionBankStorage(rawValue);
  } catch {
    return createEmptyQuestionBank();
  }
}

export function writeQuestionBank(questionBank: QuestionBank): QuestionBank {
  const validatedQuestionBank = validateQuestionBank(questionBank);

  if (!canUseLocalStorage()) {
    return validatedQuestionBank;
  }

  window.localStorage.setItem(
    QUESTION_BANK_STORAGE_KEY,
    JSON.stringify(validatedQuestionBank)
  );

  return validatedQuestionBank;
}

export function getActiveQuestionSet(questionBank: QuestionBank): QuestionSet | null {
  if (questionBank.activeQuestionSetId === null) {
    return null;
  }

  return (
    questionBank.questionSets.find(
      (questionSet) => questionSet.id === questionBank.activeQuestionSetId
    ) ?? null
  );
}
