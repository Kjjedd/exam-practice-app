import Link from "next/link";

export default function ImportPage() {
  return (
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <section className="rounded-[2rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
          <span className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-sm font-medium text-ink/80">
            Import Flow
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            문제 PDF 가져오기 흐름을 준비하는 중입니다.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink/75 sm:text-base">
            다음 단계에서는 이 화면에서 PDF를 업로드하고, 추출 결과를 검수한 뒤
            활성 문제 세트로 저장할 수 있게 됩니다. 지금은 홈 화면에서 자연스럽게
            이어지는 placeholder 경로로 유지합니다.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
            >
              홈으로 돌아가기
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-coral/40 hover:text-coral"
            >
              문제 화면 확인
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
