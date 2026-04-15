import defaultQuestionSetJson from "../../data/default-question-set.json";
import defaultQuestionSet600PlusJson from "../../data/default-question-set-saa-600-plus.json";
import type { QuestionBank, QuestionSet } from "../types";
import { validateQuestionBank, validateQuestionSet } from "../storage/question-bank-model";

const DEFAULT_QUESTION_SET = validateQuestionSet(defaultQuestionSetJson as QuestionSet);
const DEFAULT_QUESTION_SET_600_PLUS = validateQuestionSet(
  defaultQuestionSet600PlusJson as QuestionSet
);
export const DEFAULT_QUESTION_SET_ID = DEFAULT_QUESTION_SET.id;
export const DEFAULT_QUESTION_SET_600_PLUS_ID = DEFAULT_QUESTION_SET_600_PLUS.id;

const DEFAULT_QUESTION_BANK: QuestionBank = validateQuestionBank({
  version: 1,
  activeQuestionSetId: DEFAULT_QUESTION_SET_600_PLUS.id,
  questionSets: [DEFAULT_QUESTION_SET_600_PLUS, DEFAULT_QUESTION_SET]
});

export function getDefaultQuestionBank(): QuestionBank {
  return DEFAULT_QUESTION_BANK;
}
