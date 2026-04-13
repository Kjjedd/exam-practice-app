export default function ResultPage() {
  return (
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
      <div className="mx-auto max-w-3xl rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
        <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
          Result
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
          결과 화면 준비 단계입니다.
        </h1>
        <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
          `feature/quiz-navigation` 단계에서는 마지막 문제 이후 이동이 끊기지
          않도록 결과 라우트를 먼저 연결했습니다. 다음 단계인
          `feature/result-summary`에서 정답 수, 오답 수, 정답률 요약이 이 화면에
          올라오게 됩니다.
        </p>
      </div>
    </main>
  );
}
