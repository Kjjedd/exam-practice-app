import Link from "next/link";

type SecondaryLink = Readonly<{
  title: string;
  description: string;
  href: string;
}>;

const secondaryLinks: readonly SecondaryLink[] = [
  {
    title: "오답 복습",
    description: "이후 복습 흐름이 완성되면 틀린 문제만 따로 다시 볼 수 있는 진입점입니다.",
    href: "/review"
  },
  {
    title: "즐겨찾기",
    description: "중요하다고 표시한 문제를 한곳에 모아서 다시 확인하는 화면으로 이동합니다.",
    href: "/favorites"
  },
  {
    title: "학습 통계",
    description: "누적 정답률과 최근 학습 흐름을 확인하는 대시보드 화면으로 이동합니다.",
    href: "/dashboard"
  }
] as const;

export function SecondaryLinks() {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
      <div className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight text-ink">
          보조 학습 기능
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-ink/70 sm:text-base">
          홈 화면에서는 가져오기와 문제풀이뿐 아니라 복습, 즐겨찾기, 통계
          흐름으로도 바로 이동할 수 있어야 합니다.
        </p>
        <div className="mt-6 grid gap-3">
          {secondaryLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="rounded-2xl border border-ink/10 bg-mist px-5 py-4 transition-colors hover:border-coral/30 hover:bg-white"
            >
              <h3 className="text-base font-semibold text-ink">{link.title}</h3>
              <p className="mt-1 text-sm leading-6 text-ink/70">
                {link.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
      <div className="rounded-[1.75rem] border border-ink/10 bg-ink p-6 text-white shadow-sm sm:p-8">
        <h2 className="text-2xl font-semibold tracking-tight">학습 흐름 요약</h2>
        <ul className="mt-5 space-y-4 text-sm leading-6 text-white/80 sm:text-base">
          <li>문제 PDF를 가져오고 검수해 활성 문제 세트를 만듭니다.</li>
          <li>저장된 문제 세트를 기준으로 문제풀이를 시작합니다.</li>
          <li>해설과 오답 복습으로 이해를 보완합니다.</li>
          <li>누적 학습 기록과 통계로 진도를 확인합니다.</li>
        </ul>
      </div>
    </section>
  );
}
