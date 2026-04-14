import type {
  ImportedQuestionCandidate,
  ImportValidationIssue,
  ImportValidationSummary
} from "./imported-question-types";

function buildQuestionIssues(candidate: ImportedQuestionCandidate): readonly ImportValidationIssue[] {
  const issues: ImportValidationIssue[] = [];

  if (candidate.question.trim().length === 0) {
    issues.push({
      candidateTempId: candidate.tempId,
      field: "question",
      message: "문제 본문이 비어 있습니다."
    });
  }

  if (candidate.choices.length < 2) {
    issues.push({
      candidateTempId: candidate.tempId,
      field: "choices",
      message: "선택지는 최소 2개 이상이어야 합니다."
    });
  }

  candidate.choices.forEach((choice) => {
    if (choice.trim().length === 0) {
      issues.push({
        candidateTempId: candidate.tempId,
        field: "choices",
        message: "비어 있는 선택지가 있습니다."
      });
    }
  });

  if (candidate.answer === null) {
    issues.push({
      candidateTempId: candidate.tempId,
      field: "answer",
      message: "정답을 선택해야 합니다."
    });
  }

  if (
    candidate.answer !== null &&
    (candidate.answer < 0 || candidate.answer >= candidate.choices.length)
  ) {
    issues.push({
      candidateTempId: candidate.tempId,
      field: "answer",
      message: "정답 인덱스가 선택지 범위를 벗어났습니다."
    });
  }

  return issues;
}

export function validateImportedCandidates(
  candidates: readonly ImportedQuestionCandidate[]
): ImportValidationSummary {
  const issues = candidates.flatMap((candidate) => buildQuestionIssues(candidate));
  const invalidCandidateIds = new Set(issues.map((issue) => issue.candidateTempId));
  const invalidQuestionCount = invalidCandidateIds.size;

  return {
    issues,
    validQuestionCount: candidates.length - invalidQuestionCount,
    invalidQuestionCount,
    canSave: candidates.length > 0 && issues.length === 0
  };
}
