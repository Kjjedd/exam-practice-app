import type { Question } from "../types";
import type {
  ConfirmedImportedQuestionSet,
  ImportedQuestionCandidate
} from "./imported-question-types";

type BuildConfirmedQuestionSetInput = Readonly<{
  title: string;
  sourceFileName: string;
  candidates: readonly ImportedQuestionCandidate[];
}>;

function createQuestionId(index: number): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `imported-question-${index + 1}`;
}

function buildQuestion(
  candidate: ImportedQuestionCandidate,
  index: number,
  category: string
): Question {
  if (candidate.answer === null) {
    throw new Error("정답이 확정되지 않은 문항은 저장할 수 없습니다.");
  }

  return {
    id: createQuestionId(index),
    question: candidate.question.trim(),
    choices: candidate.choices.map((choice) => choice.trim()),
    answers: [candidate.answer],
    explanation:
      candidate.explanation.trim().length > 0
        ? candidate.explanation.trim()
        : "해설이 아직 입력되지 않았습니다.",
    category
  };
}

export function buildConfirmedQuestionSet(
  input: BuildConfirmedQuestionSetInput
): ConfirmedImportedQuestionSet {
  const normalizedTitle = input.title.trim();

  return {
    title: normalizedTitle,
    sourceFileName: input.sourceFileName,
    importedAt: new Date().toISOString(),
    questions: input.candidates.map((candidate, index) =>
      buildQuestion(candidate, index, normalizedTitle)
    )
  };
}
