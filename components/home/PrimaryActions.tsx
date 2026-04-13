import Link from "next/link";

type PrimaryAction = Readonly<{
  title: string;
  description: string;
  href: string;
  badge: string;
}>;

const primaryActions: readonly PrimaryAction[] = [
  {
    title: "일반 문제풀이",
    description: "기본 순서대로 문제를 풀며 흐름을 익히는 가장 기본적인 시작 방식입니다.",
    href: "/quiz",
    badge: "Normal"
  },
  {
    title: "랜덤 모드",
    description: "문제 순서를 섞어서 익숙함을 줄이고 실제 기억을 점검하는 방식입니다.",
    href: "/quiz?mode=random",
    badge: "Random"
  },
  {
    title: "시험 모드",
    description: "연속 풀이 중심의 시험형 흐름으로 집중해서 실전 감각을 점검합니다.",
    href: "/quiz?mode=exam",
    badge: "Exam"
  }
] as const;

export function PrimaryActions() {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            주요 시작 흐름
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
            지금 바로 시작할 수 있는 핵심 학습 모드입니다.
          </p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {primaryActions.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className="group rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:border-coral/30 hover:shadow-md"
          >
            <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
              {action.badge}
            </span>
            <h3 className="mt-5 text-xl font-semibold text-ink">{action.title}</h3>
            <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
              {action.description}
            </p>
            <span className="mt-6 inline-flex text-sm font-medium text-ink/80 transition-colors group-hover:text-coral">
              시작하기
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
