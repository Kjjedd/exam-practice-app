"use client";

const processingSteps = [
  "PDF 텍스트 조각 수집",
  "문항 후보 분리",
  "선택지 구조 정리",
  "검수 화면 준비"
] as const;

export function ImportProcessingStage() {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-sm">
      <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[360px] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,126,103,0.20),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(91,167,255,0.22),_transparent_28%),linear-gradient(135deg,_#fef6f3_0%,_#eef5ff_52%,_#f5fbf6_100%)] px-8 py-8 sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute inset-0">
            <div className="processing-orb absolute left-[10%] top-[16%] h-24 w-24 rounded-full bg-[#ff8d74]/25 blur-2xl" />
            <div className="processing-orb processing-orb-delay-1 absolute right-[14%] top-[24%] h-20 w-20 rounded-full bg-[#6aa7ff]/25 blur-2xl" />
            <div className="processing-orb processing-orb-delay-2 absolute bottom-[14%] left-[22%] h-28 w-28 rounded-full bg-[#76d6b1]/20 blur-2xl" />
          </div>

          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <span className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-ink/55 backdrop-blur">
                Conversion In Progress
              </span>
              <h3 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                PDF를 읽고 구조를 정리하고 있습니다.
              </h3>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-white/78 px-4 py-2 text-sm font-semibold text-ink/72 shadow-sm backdrop-blur">
                  문항 후보 생성 중
                </span>
                <span className="rounded-full bg-white/72 px-4 py-2 text-sm font-semibold text-ink/62 shadow-sm backdrop-blur">
                  정답 패턴 정리 중
                </span>
                <span className="rounded-full bg-white/72 px-4 py-2 text-sm font-semibold text-ink/62 shadow-sm backdrop-blur">
                  검수 화면 준비 중
                </span>
              </div>
            </div>

            <div className="relative mt-10">
              <div className="grid gap-4 sm:grid-cols-2">
                {processingSteps.map((step, index) => (
                  <div
                    key={step}
                    className="processing-card rounded-[1.5rem] border border-white/60 bg-white/75 px-5 py-5 shadow-[0_18px_45px_rgba(19,35,66,0.08)] backdrop-blur"
                    style={{ animationDelay: `${index * 0.18}s` }}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink text-sm font-semibold text-white">
                      {index + 1}
                    </span>
                    <p className="mt-4 text-base font-semibold tracking-tight text-ink">
                      {step}
                    </p>
                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-ink/8">
                      <div
                        className="processing-bar h-full rounded-full bg-gradient-to-r from-[#ff7e67] via-[#6aa7ff] to-[#76d6b1]"
                        style={{ animationDelay: `${index * 0.22}s` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between border-t border-ink/8 bg-white px-8 py-8 sm:px-10 sm:py-10 lg:border-l lg:border-t-0">
          <div>
            <span className="inline-flex rounded-full bg-[#edf2ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#4766d4]">
              Live Preview
            </span>
            <h3 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
              변환 상태 미리보기
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#f4f7ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#5c72d6]">
                Parsing
              </span>
              <span className="rounded-full bg-[#f7fbff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#5c72d6]">
                Structuring
              </span>
              <span className="rounded-full bg-[#f4fff8] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#3c8a6a]">
                Ready for Review
              </span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="rounded-[1.5rem] border border-ink/8 bg-mist px-5 py-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink/50">
                  Parsing Queue
                </p>
                <span className="processing-dot h-3 w-3 rounded-full bg-[#ff7e67]" />
              </div>
              <div className="mt-5 space-y-3">
                <div className="h-3 w-[78%] rounded-full bg-ink/10" />
                <div className="h-3 w-[92%] rounded-full bg-ink/8" />
                <div className="h-3 w-[66%] rounded-full bg-ink/10" />
              </div>
            </div>

            <div className="rounded-[1.5rem] border border-ink/8 bg-[#0f1726] px-5 py-5 text-white shadow-[0_18px_50px_rgba(15,23,38,0.16)]">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/58">
                  Candidate Builder
                </p>
                <span className="processing-dot processing-dot-delay h-3 w-3 rounded-full bg-[#76d6b1]" />
              </div>
              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-white/8 px-4 py-4">
                  <div className="h-2.5 w-[62%] rounded-full bg-white/20" />
                  <div className="mt-3 h-2.5 w-[88%] rounded-full bg-white/12" />
                </div>
                <div className="rounded-2xl bg-white/8 px-4 py-4">
                  <div className="h-2.5 w-[54%] rounded-full bg-white/20" />
                  <div className="mt-3 h-2.5 w-[80%] rounded-full bg-white/12" />
                </div>
              </div>
            </div>

            <div className="rounded-[1.25rem] border border-ink/8 bg-[#fafbfd] px-4 py-4">
              <p className="text-sm font-semibold text-ink/72">
                변환이 끝나면 바로 검수 화면으로 넘어갑니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
