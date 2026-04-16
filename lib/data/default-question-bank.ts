import defaultQuestionSetJson from "../../data/default-question-set.json";
import defaultQuestionSet600PlusJson from "../../data/default-question-set-saa-600-plus.json";
import type { QuestionBank, QuestionSet } from "../types";
import { validateQuestionBank, validateQuestionSet } from "../storage/question-bank-model";

const DEFAULT_QUESTION_SET = validateQuestionSet({
  ...(defaultQuestionSetJson as QuestionSet),
  title: "AWS SAA 전체 세트"
});
const DEFAULT_QUESTION_SET_600_PLUS = validateQuestionSet(
  {
    ...(defaultQuestionSet600PlusJson as QuestionSet),
    title: "AWS SAA 600~1019 세트"
  }
);
export const DEFAULT_QUESTION_SET_ID = DEFAULT_QUESTION_SET.id;
export const DEFAULT_QUESTION_SET_600_PLUS_ID = DEFAULT_QUESTION_SET_600_PLUS.id;
export const LEGACY_DEFAULT_QUESTION_SET_IDS = [
  "aws-saa-1-100",
  "aws-saa-600-725"
] as const;
export const MANAGED_DEFAULT_QUESTION_SET_IDS = [
  DEFAULT_QUESTION_SET.id,
  DEFAULT_QUESTION_SET_600_PLUS.id,
  ...LEGACY_DEFAULT_QUESTION_SET_IDS
] as const;

const DEFAULT_QUESTION_BANK: QuestionBank = validateQuestionBank({
  version: 1,
  activeQuestionSetId: DEFAULT_QUESTION_SET.id,
  questionSets: [
    DEFAULT_QUESTION_SET,
    DEFAULT_QUESTION_SET_600_PLUS
  ]
});

export function getDefaultQuestionBank(): QuestionBank {
  return DEFAULT_QUESTION_BANK;
}
