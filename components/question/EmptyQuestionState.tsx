import Link from "next/link";

export function EmptyQuestionState() {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
      <span className="inline-flex rounded-full border border-coral/25 bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
        Empty State
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
        아직 활성 문제 세트가 없습니다.
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70 sm:text-base">
        문제를 표시하려면 먼저 PDF를 가져오고 검수한 뒤 활성 문제 세트로 저장해야
        합니다. 저장이 끝나면 이 화면에서 바로 첫 문제를 읽기 시작할 수 있습니다.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/import"
          className="inline-flex items-center rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral/90"
        >
          PDF 가져오기
        </Link>
        <Link
          href="/"
          className="inline-flex items-center rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-coral/40 hover:text-coral"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
