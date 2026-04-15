export function HomeHero() {
  return (
    <section className="rounded-[1.75rem] bg-[linear-gradient(135deg,_rgba(244,247,251,0.94),_rgba(255,255,255,1))] px-6 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-coral/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-coral">
            AWS SAA STUDY HUB
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl lg:text-6xl">
            문제를 불러오고
            <br />
            바로 학습하세요.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/64 sm:text-base">
            PDF 업로드부터 일반 풀이, 랜덤 모드, 결과 복습까지 한 화면에서 바로
            시작할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
          <div className="rounded-[1.5rem] border border-coral/15 bg-[linear-gradient(180deg,_rgba(255,255,255,1),_rgba(255,244,238,0.95))] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral/80">
              Flow
            </p>
            <p className="mt-2 text-sm font-medium text-ink">업로드 → 검수 → 학습</p>
          </div>
          <div className="rounded-[1.5rem] border border-[#8bb3ff]/30 bg-[linear-gradient(180deg,_rgba(255,255,255,1),_rgba(237,244,255,0.95))] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4b72d7]">
              Modes
            </p>
            <p className="mt-2 text-sm font-medium text-ink">일반 · 랜덤</p>
          </div>
          <div className="rounded-[1.5rem] border border-[#9adfcc]/30 bg-[linear-gradient(180deg,_rgba(255,255,255,1),_rgba(235,251,245,0.95))] px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#25956d]">
              Review
            </p>
            <p className="mt-2 text-sm font-medium text-ink">결과 · 오답 복습 · 통계</p>
          </div>
        </div>
      </div>
    </section>
  );
}
