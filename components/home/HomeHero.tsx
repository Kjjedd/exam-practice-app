export function HomeHero() {
  return (
    <section className="theme-card-soft relative overflow-hidden rounded-[1.75rem] px-6 py-6 sm:px-8 sm:py-8">
      <div className="pointer-events-none absolute -left-8 top-0 h-28 w-28 rounded-full bg-[#8be9fd]/10 blur-3xl sm:h-36 sm:w-36" />
      <div className="pointer-events-none absolute right-0 top-6 h-24 w-24 rounded-full bg-[#bd93f9]/12 blur-3xl sm:h-32 sm:w-32" />
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-[#8be9fd]/30 bg-[linear-gradient(90deg,_rgba(139,233,253,0.14),_rgba(189,147,249,0.14))] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--app-text)]">
            AWS SAA STUDY HUB
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-[var(--app-text)] sm:text-5xl lg:text-6xl">
            문제를 불러오고
            <br />
            바로 학습하세요.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--app-text-muted)] sm:text-base">
            PDF 업로드부터 일반 풀이, 랜덤 모드, 결과 복습까지 한 화면에서 바로
            시작할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
          <div className="theme-card rounded-[1.5rem] border-coral/15 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral/80">
              Flow
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--app-text)]">업로드 → 검수 → 학습</p>
          </div>
          <div className="theme-card rounded-[1.5rem] border-[#8bb3ff]/30 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4b72d7]">
              Modes
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--app-text)]">일반 · 랜덤</p>
          </div>
          <div className="theme-card rounded-[1.5rem] border-[#9adfcc]/30 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#25956d]">
              Review
            </p>
            <p className="mt-2 text-sm font-medium text-[var(--app-text)]">결과 · 오답 복습 · 통계</p>
          </div>
        </div>
      </div>
    </section>
  );
}
