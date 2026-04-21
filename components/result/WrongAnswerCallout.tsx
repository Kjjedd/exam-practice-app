import Link from "next/link";

type WrongAnswerCalloutProps = Readonly<{
  wrongCount: number;
}>;

export function WrongAnswerCallout({ wrongCount }: WrongAnswerCalloutProps) {
  if (wrongCount === 0) {
    return (
      <section className="rounded-[1.25rem] border border-tide/20 bg-white px-4 py-4 shadow-sm sm:rounded-[1.75rem] sm:px-6 sm:py-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-tide sm:text-xs">
              Review
            </span>
            <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink sm:mt-3 sm:text-2xl">
              오답 없음
            </h2>
          </div>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-ink/15 px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-mist"
          >
            홈
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[1.25rem] border border-coral/20 bg-white px-4 py-4 shadow-sm sm:rounded-[1.75rem] sm:px-6 sm:py-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-coral/12 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-coral sm:text-xs">
            Review
          </span>
          <h2 className="mt-2 text-lg font-semibold tracking-tight text-ink sm:mt-3 sm:text-2xl">
            오답 {wrongCount}개
          </h2>
        </div>
        <Link
          href="/review"
          className="inline-flex items-center justify-center rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
        >
          복습
        </Link>
      </div>
    </section>
  );
}
