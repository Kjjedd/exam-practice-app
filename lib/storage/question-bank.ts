import type { QuestionBank } from "../types";
import { getDefaultQuestionBank } from "../data/default-question-bank";
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

    return parsedQuestionBank;
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
