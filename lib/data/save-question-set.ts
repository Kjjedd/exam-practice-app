import type { Question, QuestionBank, QuestionSet, QuestionSetId } from "../types";
import {
  clearQuestionBank as clearStoredQuestionBank,
  readQuestionBank,
  validateQuestionSet,
  writeQuestionBank
} from "../storage/question-bank";

export type SaveQuestionSetInput = Readonly<{
  id?: QuestionSetId;
  title: string;
  sourceLabel: string;
  createdAt?: string;
  questions: readonly Question[];
  makeActive?: boolean;
}>;

function createQuestionSetId(): QuestionSetId {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `question-set-${Date.now()}`;
}

function buildQuestionSet(input: SaveQuestionSetInput): QuestionSet {
  return validateQuestionSet({
    id: input.id ?? createQuestionSetId(),
    title: input.title,
    sourceLabel: input.sourceLabel,
    createdAt: input.createdAt ?? new Date().toISOString(),
    questions: input.questions
  });
}

function buildNextQuestionBank(
  currentQuestionBank: QuestionBank,
  questionSet: QuestionSet,
  makeActive: boolean
): QuestionBank {
  const nextQuestionSets = [
    questionSet,
    ...currentQuestionBank.questionSets.filter(
      (existingQuestionSet) => existingQuestionSet.id !== questionSet.id
    )
  ];

  return {
    version: 1,
    activeQuestionSetId: makeActive
      ? questionSet.id
      : currentQuestionBank.activeQuestionSetId,
    questionSets: nextQuestionSets
  };
}

export function saveQuestionSet(input: SaveQuestionSetInput): QuestionSet {
  const currentQuestionBank = readQuestionBank();
  const questionSet = buildQuestionSet(input);
  const nextQuestionBank = buildNextQuestionBank(
    currentQuestionBank,
    questionSet,
    input.makeActive ?? true
  );

  writeQuestionBank(nextQuestionBank);

  return questionSet;
}

export function setActiveQuestionSet(questionSetId: QuestionSetId): QuestionBank {
  const currentQuestionBank = readQuestionBank();
  const questionSetExists = currentQuestionBank.questionSets.some(
    (questionSet) => questionSet.id === questionSetId
  );

  if (!questionSetExists) {
    return currentQuestionBank;
  }

  return writeQuestionBank({
    version: 1,
    activeQuestionSetId: questionSetId,
    questionSets: currentQuestionBank.questionSets
  });
}

export function clearQuestionBank(): QuestionBank {
  return clearStoredQuestionBank();
}
