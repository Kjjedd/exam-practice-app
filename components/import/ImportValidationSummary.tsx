import type { ImportValidationSummary } from "../../lib/import/imported-question-types";

type ImportValidationSummaryProps = Readonly<{
  summary: ImportValidationSummary;
  totalCount: number;
}>;

export function ImportValidationSummary({
  summary,
  totalCount
}: ImportValidationSummaryProps) {
  return (
    <section className="rounded-[1.5rem] border border-ink/10 bg-white px-5 py-5 shadow-sm">
      <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
        Validation
      </span>
      <h2 className="mt-4 text-xl font-semibold tracking-tight text-ink">
        저장 전 검증 상태
      </h2>
      <dl className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl bg-mist px-4 py-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            Total
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-ink">{totalCount}</dd>
        </div>
        <div className="rounded-2xl bg-tide/6 px-4 py-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            Valid
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-tide">
            {summary.validQuestionCount}
          </dd>
        </div>
        <div className="rounded-2xl bg-coral/6 px-4 py-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            Invalid
          </dt>
          <dd className="mt-2 text-2xl font-semibold text-coral">
            {summary.invalidQuestionCount}
          </dd>
        </div>
      </dl>
      {summary.issues.length > 0 ? (
        <ul className="mt-5 space-y-2 rounded-2xl border border-coral/15 bg-coral/5 px-4 py-4 text-sm leading-6 text-coral">
          {summary.issues.slice(0, 6).map((issue, index) => (
            <li key={`${issue.candidateTempId}-${issue.field}-${index}`}>
              {issue.message}
            </li>
          ))}
          {summary.issues.length > 6 ? (
            <li>그 외 {summary.issues.length - 6}개의 검증 이슈가 더 있습니다.</li>
          ) : null}
        </ul>
      ) : (
        <p className="mt-5 rounded-2xl border border-tide/15 bg-tide/5 px-4 py-4 text-sm leading-6 text-tide">
          모든 문항이 저장 가능한 상태입니다.
        </p>
      )}
    </section>
  );
}
