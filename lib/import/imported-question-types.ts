import type { Question } from "../types";

export type ImportStatus = "idle" | "parsing" | "ready" | "failed";

export type ImportedQuestionCandidate = Readonly<{
  tempId: string;
  question: string;
  choices: readonly string[];
  answer: number | null;
  explanation: string;
  warnings: readonly string[];
  sourceExcerpt: string | null;
}>;

export type ImportValidationIssueField =
  | "question"
  | "choices"
  | "answer"
  | "explanation";

export type ImportValidationIssue = Readonly<{
  candidateTempId: string;
  field: ImportValidationIssueField;
  message: string;
}>;

export type ImportValidationSummary = Readonly<{
  issues: readonly ImportValidationIssue[];
  validQuestionCount: number;
  invalidQuestionCount: number;
  canSave: boolean;
}>;

export type ConfirmedImportedQuestionSet = Readonly<{
  title: string;
  sourceFileName: string;
  importedAt: string;
  questions: readonly Question[];
}>;

export type RawImportedQuestionCandidate = Readonly<{
  prompt: string;
  choices: readonly string[];
  answerText: string | null;
  explanation: string;
  sourceExcerpt: string;
  warnings: readonly string[];
}>;
