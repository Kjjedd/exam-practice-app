import defaultQuestionSetJson from "../../data/default-question-set.json";
import defaultQuestionSet1To100Json from "../../data/default-question-set-saa-1-100.json";
import defaultQuestionSet600PlusJson from "../../data/default-question-set-saa-600-plus.json";
import defaultQuestionSet600To725Json from "../../data/default-question-set-saa-600-725.json";
import type { QuestionBank, QuestionSet } from "../types";
import { validateQuestionBank, validateQuestionSet } from "../storage/question-bank-model";

const DEFAULT_QUESTION_SET = validateQuestionSet(defaultQuestionSetJson as QuestionSet);
const DEFAULT_QUESTION_SET_1_TO_100 = validateQuestionSet(
  defaultQuestionSet1To100Json as QuestionSet
);
const DEFAULT_QUESTION_SET_600_PLUS = validateQuestionSet(
  defaultQuestionSet600PlusJson as QuestionSet
);
const DEFAULT_QUESTION_SET_600_TO_725 = validateQuestionSet(
  defaultQuestionSet600To725Json as QuestionSet
);
export const DEFAULT_QUESTION_SET_ID = DEFAULT_QUESTION_SET.id;
export const DEFAULT_QUESTION_SET_1_TO_100_ID = DEFAULT_QUESTION_SET_1_TO_100.id;
export const DEFAULT_QUESTION_SET_600_PLUS_ID = DEFAULT_QUESTION_SET_600_PLUS.id;
export const DEFAULT_QUESTION_SET_600_TO_725_ID = DEFAULT_QUESTION_SET_600_TO_725.id;

const DEFAULT_QUESTION_BANK: QuestionBank = validateQuestionBank({
  version: 1,
  activeQuestionSetId: DEFAULT_QUESTION_SET_600_PLUS.id,
  questionSets: [
    DEFAULT_QUESTION_SET_600_PLUS,
    DEFAULT_QUESTION_SET,
    DEFAULT_QUESTION_SET_1_TO_100,
    DEFAULT_QUESTION_SET_600_TO_725
  ]
});

export function getDefaultQuestionBank(): QuestionBank {
  return DEFAULT_QUESTION_BANK;
}
