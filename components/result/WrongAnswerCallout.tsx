import Link from "next/link";

type WrongAnswerCalloutProps = Readonly<{
  wrongCount: number;
}>;

export function WrongAnswerCallout({ wrongCount }: WrongAnswerCalloutProps) {
  if (wrongCount === 0) {
    return (
      <section className="theme-card rounded-[1.25rem] border-tide/20 px-4 py-4 sm:rounded-[1.75rem] sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-tide sm:text-xs">
              Review
            </span>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-[var(--app-text)] sm:mt-3 sm:text-2xl">
              오답 없음
            </h2>
          </div>
          <Link
            href="/"
            className="theme-outline-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            홈
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="theme-card rounded-[1.25rem] border-coral/20 px-4 py-4 sm:rounded-[1.75rem] sm:px-6 sm:py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-coral/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-coral sm:text-xs">
            Review
          </span>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-[var(--app-text)] sm:mt-3 sm:text-2xl">
            오답 {wrongCount}개
          </h2>
        </div>
        <Link
          href="/review"
          className="theme-solid-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90"
        >
          복습
        </Link>
      </div>
    </section>
  );
}
