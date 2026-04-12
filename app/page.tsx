const bootstrapTargets = [
  "Next.js App Router 기반 구조 준비",
  "TypeScript strict 설정 확인",
  "Tailwind CSS 전역 스타일 연결",
  "향후 기능용 디렉터리 뼈대 정리"
] as const;

export default function HomePage() {
  return (
    <main className="min-h-screen bg-mist text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center px-6 py-20 sm:px-10">
        <span className="mb-4 inline-flex w-fit rounded-full border border-ink/10 bg-white px-3 py-1 text-sm font-medium">
          feature/project-bootstrap
        </span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl">
          ExamMate 프로젝트의 기본 골격을 준비하는 단계입니다.
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-ink/75 sm:text-lg">
          이 화면은 실제 문제풀이 기능이 아니라, 앱이 정상 실행되고 이후 브랜치들이
          같은 구조 위에서 개발될 수 있는지 확인하기 위한 최소 홈 화면입니다.
        </p>
        <div className="mt-10 rounded-3xl border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold">이번 단계에서 준비하는 항목</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-ink/80 sm:text-base">
            {bootstrapTargets.map((target) => (
              <li key={target} className="flex items-start gap-3">
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-coral" />
                <span>{target}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
