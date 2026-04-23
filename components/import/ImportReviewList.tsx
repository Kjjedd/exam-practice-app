import type {
  ImportedQuestionCandidate,
  ImportValidationSummary
} from "../../lib/import/imported-question-types";

type ImportReviewListProps = Readonly<{
  candidates: readonly ImportedQuestionCandidate[];
  selectedCandidateId: string | null;
  validationSummary: ImportValidationSummary;
  onSelectCandidate: (candidateTempId: string) => void;
}>;

function getIssueCount(
  candidateTempId: string,
  validationSummary: ImportValidationSummary
): number {
  return validationSummary.issues.filter((issue) => issue.candidateTempId === candidateTempId).length;
}

export function ImportReviewList({
  candidates,
  selectedCandidateId,
  validationSummary,
  onSelectCandidate
}: ImportReviewListProps) {
  return (
    <section className="theme-card rounded-[1.75rem] px-5 py-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="theme-subtle-surface inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-muted)]">
            Candidates
          </span>
          <h2 className="mt-3 text-xl font-semibold tracking-tight text-[var(--app-text)]">
            추출된 문항 목록
          </h2>
        </div>
        <span className="theme-home-overview rounded-full px-3 py-1 text-sm font-semibold text-[var(--app-text)]">
          {candidates.length}
        </span>
      </div>
      <div className="mt-5 space-y-3">
        {candidates.map((candidate, index) => {
          const issueCount = getIssueCount(candidate.tempId, validationSummary);
          const isSelected = candidate.tempId === selectedCandidateId;

          return (
            <button
              key={candidate.tempId}
              type="button"
              onClick={() => onSelectCandidate(candidate.tempId)}
              className={`w-full rounded-[1.25rem] border px-4 py-4 text-left transition-colors ${
                isSelected
                  ? "border-coral bg-coral/6"
                  : "theme-subtle-surface hover:border-[color:var(--app-border-strong)]"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
                    Question {index + 1}
                  </p>
                  <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-[var(--app-text)] sm:text-base">
                    {candidate.question || "문제 본문이 아직 비어 있습니다."}
                  </h3>
                </div>
                <div className="shrink-0 text-right">
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                      issueCount > 0 ? "text-coral" : "text-tide"
                    }`}
                  >
                    {issueCount > 0 ? `Issues ${issueCount}` : "Ready"}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {candidate.warnings.slice(0, 2).map((warning) => (
                  <span
                    key={`${candidate.tempId}-${warning}`}
                    className="rounded-full bg-coral/10 px-3 py-1 text-xs font-medium text-coral"
                  >
                    {warning}
                  </span>
                ))}
                {candidate.warnings.length === 0 ? (
                  <span className="rounded-full bg-tide/10 px-3 py-1 text-xs font-medium text-tide">
                    자동 변환 완료
                  </span>
                ) : null}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
