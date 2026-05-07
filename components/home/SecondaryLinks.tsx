import Link from "next/link";

type SecondaryLink = Readonly<{
  title: string;
  description: string;
  href: string;
}>;

const secondaryLinks: readonly SecondaryLink[] = [
  {
    title: "오답 복습",
    description: "틀린 문제만 다시 봅니다.",
    href: "/review/"
  },
  {
    title: "즐겨찾기",
    description: "저장한 문제를 봅니다.",
    href: "/favorites/"
  },
  {
    title: "학습 통계",
    description: "학습 기록을 봅니다.",
    href: "/dashboard/"
  }
] as const;

export function SecondaryLinks() {
  return (
    <section className="theme-muted-surface rounded-[1.75rem] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
            Shortcuts
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[var(--app-text)]">바로가기</h2>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {secondaryLinks.map((link) => (
          <Link
            key={link.title}
            href={link.href}
            className="theme-card rounded-[1.5rem] px-5 py-4 transition-colors hover:border-coral/30 hover:bg-[var(--app-surface-soft)]"
          >
            <h3 className="text-base font-semibold text-[var(--app-text)]">{link.title}</h3>
            <p className="mt-1 text-sm leading-6 text-[color:var(--app-text-muted)]">
              {link.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
