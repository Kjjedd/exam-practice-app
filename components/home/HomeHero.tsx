export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-ink/10 bg-white/90 px-6 py-10 shadow-sm sm:px-10 sm:py-14">
      <div className="absolute -right-16 top-0 h-40 w-40 rounded-full bg-coral/10 blur-2xl" />
      <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-tide/70 blur-2xl" />
      <div className="relative">
        <span className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-sm font-medium text-ink/80">
          Exam Practice Hub
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
          시험 대비 흐름을 한곳에서 시작하는 학습용 홈 화면입니다.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-ink/75 sm:text-lg">
          ExamMate는 객관식 문제풀이, 즉시 채점, 해설 확인, 오답 복습,
          즐겨찾기, 통계 확인까지 이어지는 학습 루프를 목표로 하는 웹앱입니다.
          이 화면에서는 주요 학습 모드와 보조 기능으로 바로 진입할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
