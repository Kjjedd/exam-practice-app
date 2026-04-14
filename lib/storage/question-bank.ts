import type { QuestionBank } from "../types";
import {
  createEmptyQuestionBank,
  getActiveQuestionSet,
  parseQuestionBankStorage,
  validateQuestionBank
} from "./question-bank-model";
import {
  readStorageValue,
  writeStorageValue
} from "./storage-core";

const QUESTION_BANK_STORAGE_KEY = "exammate.question-bank.v1";

export function readQuestionBank(): QuestionBank {
  const rawValue = readStorageValue(QUESTION_BANK_STORAGE_KEY);

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
  writeStorageValue(QUESTION_BANK_STORAGE_KEY, JSON.stringify(validatedQuestionBank));

  return validatedQuestionBank;
}

export function clearQuestionBank(): QuestionBank {
  return writeQuestionBank(createEmptyQuestionBank());
}
