import type {
  ImportedQuestionCandidate,
  ImportValidationSummary
} from "../../lib/import/imported-question-types";

type ImportQuestionEditorProps = Readonly<{
  candidate: ImportedQuestionCandidate;
  questionNumber: number;
  validationSummary: ImportValidationSummary;
  onQuestionChange: (value: string) => void;
  onChoiceChange: (choiceIndex: number, value: string) => void;
  onAddChoice: () => void;
  onRemoveChoice: (choiceIndex: number) => void;
  onAnswerChange: (value: number | null) => void;
  onExplanationChange: (value: string) => void;
}>;

function getCandidateIssues(
  candidate: ImportedQuestionCandidate,
  validationSummary: ImportValidationSummary
): readonly string[] {
  return validationSummary.issues
    .filter((issue) => issue.candidateTempId === candidate.tempId)
    .map((issue) => issue.message);
}

export function ImportQuestionEditor({
  candidate,
  questionNumber,
  validationSummary,
  onQuestionChange,
  onChoiceChange,
  onAddChoice,
  onRemoveChoice,
  onAnswerChange,
  onExplanationChange
}: ImportQuestionEditorProps) {
  const issues = getCandidateIssues(candidate, validationSummary);

  return (
    <section className="theme-card rounded-[1.75rem] px-6 py-6 sm:px-8">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="theme-subtle-surface inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-muted)]">
            Editor
          </span>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[var(--app-text)]">
            문항 {questionNumber} 검수
          </h2>
        </div>
      </div>

      {candidate.warnings.length > 0 ? (
        <ul className="mt-5 space-y-2 rounded-2xl border border-coral/15 bg-coral/5 px-4 py-4 text-sm leading-6 text-coral">
          {candidate.warnings.map((warning) => (
            <li key={`${candidate.tempId}-${warning}`}>{warning}</li>
          ))}
        </ul>
      ) : null}

      {issues.length > 0 ? (
        <ul className="mt-4 space-y-2 rounded-2xl border border-coral/15 bg-coral/5 px-4 py-4 text-sm leading-6 text-coral">
          {issues.map((issue, index) => (
            <li key={`${candidate.tempId}-issue-${index}`}>{issue}</li>
          ))}
        </ul>
      ) : null}

      <div className="mt-6 space-y-6">
        <label className="block">
          <span className="text-sm font-semibold text-[var(--app-text)]">문제 본문</span>
          <textarea
            value={candidate.question}
            onChange={(event) => onQuestionChange(event.target.value)}
            rows={5}
            className="theme-input mt-3 w-full rounded-[1.25rem] px-4 py-3 text-sm leading-7 text-[var(--app-text)] outline-none transition-colors"
          />
        </label>

        <section>
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-[var(--app-text)]">선택지</span>
            <button
              type="button"
              onClick={onAddChoice}
              className="theme-outline-button rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            >
              선택지 추가
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {candidate.choices.map((choice, choiceIndex) => (
              <div
                key={`${candidate.tempId}-choice-${choiceIndex}`}
                className="theme-subtle-surface rounded-[1.25rem] px-4 py-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <label className="flex items-center gap-3 text-sm font-semibold text-[var(--app-text)]">
                    <input
                      type="radio"
                      name={`answer-${candidate.tempId}`}
                      checked={candidate.answer === choiceIndex}
                      onChange={() => onAnswerChange(choiceIndex)}
                    />
                    정답으로 선택
                  </label>
                  <button
                    type="button"
                    onClick={() => onRemoveChoice(choiceIndex)}
                    disabled={candidate.choices.length <= 2}
                    className={`text-sm font-semibold ${
                      candidate.choices.length <= 2
                        ? "cursor-not-allowed text-[color:var(--app-text-faint)]"
                        : "text-coral"
                    }`}
                  >
                    제거
                  </button>
                </div>
                <textarea
                  value={choice}
                  onChange={(event) => onChoiceChange(choiceIndex, event.target.value)}
                  rows={3}
                  className="theme-input mt-3 w-full rounded-[1rem] px-4 py-3 text-sm leading-7 text-[var(--app-text)] outline-none transition-colors"
                />
              </div>
            ))}
          </div>
        </section>

        <label className="block">
          <span className="text-sm font-semibold text-[var(--app-text)]">해설</span>
          <textarea
            value={candidate.explanation}
            onChange={(event) => onExplanationChange(event.target.value)}
            rows={4}
            className="theme-input mt-3 w-full rounded-[1.25rem] px-4 py-3 text-sm leading-7 text-[var(--app-text)] outline-none transition-colors"
          />
        </label>

        {candidate.sourceExcerpt ? (
          <section className="theme-home-overview rounded-[1.25rem] px-4 py-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
              Source Excerpt
            </h3>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-[color:var(--app-text-muted)]">
              {candidate.sourceExcerpt}
            </p>
          </section>
        ) : null}
      </div>
    </section>
  );
}
