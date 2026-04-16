import { readQuestionBank } from "../storage/question-bank";
import { getActiveQuestionSet } from "../storage/question-bank-model";
import { getQuestionSetNumberRange } from "../quiz/question-range";
import type { Question, QuestionBank, QuestionId, QuestionSet, QuestionSetSummary } from "../types";

export function loadQuestionBank(): QuestionBank {
  return readQuestionBank();
}

export function loadActiveQuestionSet(): QuestionSet | null {
  return getActiveQuestionSet(loadQuestionBank());
}

export function loadQuestionSetSummaries(): readonly QuestionSetSummary[] {
  const questionBank = loadQuestionBank();

  return questionBank.questionSets.map((questionSet) => ({
    id: questionSet.id,
    title: questionSet.title,
    sourceLabel: questionSet.sourceLabel,
    createdAt: questionSet.createdAt,
    questionCount: questionSet.questions.length,
    minimumQuestionNumber: getQuestionSetNumberRange(questionSet)?.start ?? null,
    maximumQuestionNumber: getQuestionSetNumberRange(questionSet)?.end ?? null,
    isActive: questionSet.id === questionBank.activeQuestionSetId
  }));
}

export function loadQuestions(): readonly Question[] {
  return loadActiveQuestionSet()?.questions ?? [];
}

export function getQuestionById(questionId: QuestionId): Question | undefined {
  return loadQuestions().find((question) => question.id === questionId);
}
