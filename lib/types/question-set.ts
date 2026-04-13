import type { Question } from "./question";

export type QuestionSetId = string;

export type QuestionSet = Readonly<{
  id: QuestionSetId;
  title: string;
  sourceLabel: string;
  createdAt: string;
  questions: readonly Question[];
}>;

export type QuestionSetSummary = Readonly<{
  id: QuestionSetId;
  title: string;
  sourceLabel: string;
  createdAt: string;
  questionCount: number;
  isActive: boolean;
}>;

export type QuestionBank = Readonly<{
  version: 1;
  activeQuestionSetId: QuestionSetId | null;
  questionSets: readonly QuestionSet[];
}>;
