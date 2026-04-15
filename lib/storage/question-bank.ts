import type { QuestionBank } from "../types";
import {
  DEFAULT_QUESTION_SET_600_PLUS_ID,
  DEFAULT_QUESTION_SET_ID,
  getDefaultQuestionBank
} from "../data/default-question-bank";
import {
  createEmptyQuestionBank,
  parseQuestionBankStorage,
  validateQuestionBank
} from "./question-bank-model";
import {
  readStorageValue,
  writeStorageValue
} from "./storage-core";

const QUESTION_BANK_STORAGE_KEY = "exammate.question-bank.v1";

function getInitialQuestionBank(): QuestionBank {
  return getDefaultQuestionBank();
}

function mergeDefaultQuestionBank(currentQuestionBank: QuestionBank): QuestionBank {
  const defaultQuestionBank = getDefaultQuestionBank();
  const hasStoredSecondDefaultSet = currentQuestionBank.questionSets.some(
    (questionSet) => questionSet.id === DEFAULT_QUESTION_SET_600_PLUS_ID
  );
  const mergedQuestionSets = [
    ...defaultQuestionBank.questionSets,
    ...currentQuestionBank.questionSets.filter(
      (questionSet) =>
        !defaultQuestionBank.questionSets.some(
          (defaultQuestionSet) => defaultQuestionSet.id === questionSet.id
        )
    )
  ];

  const nextActiveQuestionSetId =
    !hasStoredSecondDefaultSet &&
    (currentQuestionBank.activeQuestionSetId === DEFAULT_QUESTION_SET_ID ||
      currentQuestionBank.activeQuestionSetId === null)
      ? DEFAULT_QUESTION_SET_600_PLUS_ID
      : currentQuestionBank.activeQuestionSetId;

  return validateQuestionBank({
    version: 1,
    activeQuestionSetId: mergedQuestionSets.some(
      (questionSet) => questionSet.id === nextActiveQuestionSetId
    )
      ? nextActiveQuestionSetId
      : defaultQuestionBank.activeQuestionSetId,
    questionSets: mergedQuestionSets
  });
}

export function readQuestionBank(): QuestionBank {
  const rawValue = readStorageValue(QUESTION_BANK_STORAGE_KEY);

  if (rawValue === null) {
    return getInitialQuestionBank();
  }

  try {
    const parsedQuestionBank = parseQuestionBankStorage(rawValue);

    if (parsedQuestionBank.questionSets.length === 0) {
      return getInitialQuestionBank();
    }

    return mergeDefaultQuestionBank(parsedQuestionBank);
  } catch {
    return getInitialQuestionBank();
  }
}

export function writeQuestionBank(questionBank: QuestionBank): QuestionBank {
  const validatedQuestionBank = validateQuestionBank(questionBank);
  writeStorageValue(QUESTION_BANK_STORAGE_KEY, JSON.stringify(validatedQuestionBank));

  return validatedQuestionBank;
}

export function clearQuestionBank(): QuestionBank {
  return writeQuestionBank(createEmptyQuestionBank());
}
