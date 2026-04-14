import type {
  ImportedQuestionCandidate,
  RawImportedQuestionCandidate
} from "./imported-question-types";

function createTempId(index: number): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `imported-question-${index + 1}`;
}

function normalizeChoice(choice: string): string {
  return choice.replace(/\s+/g, " ").trim();
}

function normalizeAnswer(answerText: string | null): number | null {
  if (answerText === null) {
    return null;
  }

  const answerMap = new Map<string, number>([
    ["①", 0],
    ["②", 1],
    ["③", 2],
    ["④", 3],
    ["⑤", 4],
    ["⑥", 5],
    ["1", 0],
    ["2", 1],
    ["3", 2],
    ["4", 3],
    ["5", 4],
    ["6", 5]
  ]);

  return answerMap.get(answerText.trim()) ?? null;
}

export function normalizePdfImportCandidates(
  rawCandidates: readonly RawImportedQuestionCandidate[]
): readonly ImportedQuestionCandidate[] {
  return rawCandidates.map((rawCandidate, index) => ({
    tempId: createTempId(index),
    question: rawCandidate.prompt.replace(/\s+/g, " ").trim(),
    choices: rawCandidate.choices.map((choice) => normalizeChoice(choice)),
    answer: normalizeAnswer(rawCandidate.answerText),
    explanation: rawCandidate.explanation.replace(/\s+/g, " ").trim(),
    warnings: rawCandidate.warnings,
    sourceExcerpt: rawCandidate.sourceExcerpt.trim().length > 0 ? rawCandidate.sourceExcerpt : null
  }));
}
