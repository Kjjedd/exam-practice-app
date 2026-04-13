import Link from "next/link";

type WrongAnswerCalloutProps = Readonly<{
  wrongCount: number;
}>;

export function WrongAnswerCallout({ wrongCount }: WrongAnswerCalloutProps) {
  if (wrongCount === 0) {
    return (
      <section className="rounded-[1.75rem] border border-tide/20 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
        <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
          Review Ready
        </span>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
          모든 문제를 맞혔습니다.
        </h2>
        <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
          이번 세션에는 다시 풀어야 할 오답이 없습니다. 홈으로 돌아가거나 다른
          문제 세트를 시작해도 좋습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[1.75rem] border border-coral/20 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
      <span className="inline-flex rounded-full bg-coral/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
        Wrong Answer Review
      </span>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
        틀린 문제 {wrongCount}개를 바로 복습할 수 있습니다.
      </h2>
      <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
        방금 틀린 문제만 다시 풀면서 놓친 개념을 바로 정리해 보세요. 복습
        세션은 일반 퀴즈와 분리된 오답 전용 흐름으로 시작됩니다.
      </p>
      <div className="mt-6">
        <Link
          href="/review"
          className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
        >
          오답 복습 시작
        </Link>
      </div>
    </section>
  );
}
