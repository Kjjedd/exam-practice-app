import defaultQuestionSetJson from "../../data/default-question-set.json";
import defaultQuestionSet600PlusJson from "../../data/default-question-set-saa-600-plus.json";
import type { QuestionBank, QuestionSet } from "../types";
import { validateQuestionBank, validateQuestionSet } from "../storage/question-bank-model";

const DEFAULT_QUESTION_SET = validateQuestionSet({
  ...(defaultQuestionSetJson as QuestionSet),
  title: "AWS SAA 전체 세트"
});

const DEFAULT_QUESTION_SET_600_PLUS = validateQuestionSet({
  ...(defaultQuestionSet600PlusJson as QuestionSet),
  title: "AWS SAA 600~1019 세트"
});

export const DEFAULT_QUESTION_SET_ID = DEFAULT_QUESTION_SET.id;
export const DEFAULT_QUESTION_SET_600_PLUS_ID = DEFAULT_QUESTION_SET_600_PLUS.id;

export const LEGACY_DEFAULT_QUESTION_SET_IDS = [
  "aws-saa-1-100",
  "aws-saa-600-725"
] as const;

export const LEGACY_VERIFIED_QUESTION_SET_IDS = [
  "aws-saa-verified-726-740",
  "aws-saa-verified-741-760",
  "aws-saa-verified-761-780",
  "aws-saa-verified-781-800",
  "aws-saa-verified-801-820",
  "aws-saa-verified-821-840",
  "aws-saa-verified-841-860",
  "aws-saa-verified-861-880",
  "aws-saa-verified-881-900",
  "aws-saa-verified-901-920",
  "aws-saa-verified-921-940",
  "aws-saa-verified-941-960",
  "aws-saa-verified-961-980",
  "aws-saa-verified-981-1000",
  "aws-saa-verified-1001-1019",
  "aws-saa-verified-726-1019"
] as const;

export const MANAGED_DEFAULT_QUESTION_SET_IDS = [
  DEFAULT_QUESTION_SET.id,
  DEFAULT_QUESTION_SET_600_PLUS.id,
  ...LEGACY_DEFAULT_QUESTION_SET_IDS,
  ...LEGACY_VERIFIED_QUESTION_SET_IDS
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
