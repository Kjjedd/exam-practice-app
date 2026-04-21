import Link from "next/link";

type EmptyQuestionStateProps = Readonly<{
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
}>;

export function EmptyQuestionState({
  title = "아직 활성 문제 세트가 없습니다.",
  description = "문제를 표시하려면 먼저 PDF를 가져오고 검수한 뒤 활성 문제 세트로 저장해야 합니다. 저장이 끝나면 이 화면에서 바로 첫 문제를 읽기 시작할 수 있습니다.",
  primaryHref = "/import",
  primaryLabel = "PDF 가져오기"
}: EmptyQuestionStateProps) {
  return (
    <section className="theme-card rounded-[1.75rem] px-6 py-8 sm:px-8">
      <span className="inline-flex rounded-full border border-coral/25 bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
        Empty State
      </span>
      <h1 className="mt-5 text-2xl font-semibold tracking-tight text-[var(--app-text)] sm:text-3xl">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={primaryHref}
          className="inline-flex items-center rounded-full bg-coral px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-coral/90"
        >
          {primaryLabel}
        </Link>
        <Link
          href="/"
          className="theme-outline-button inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition-colors hover:border-coral/40 hover:text-coral"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </section>
  );
}
