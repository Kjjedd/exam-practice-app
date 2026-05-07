import Link from "next/link";

type SidebarItem = Readonly<{
  label: string;
  href: string;
  shortLabel: string;
}>;

const sidebarItems: readonly SidebarItem[] = [
  {
    label: "가져오기",
    href: "/import/index.html",
    shortLabel: "IM"
  },
  {
    label: "문제풀이",
    href: "/quiz/index.html",
    shortLabel: "QZ"
  },
  {
    label: "복습",
    href: "/review/index.html",
    shortLabel: "RV"
  },
  {
    label: "통계",
    href: "/dashboard/index.html",
    shortLabel: "ST"
  }
] as const;

export function HomeSidebar() {
  return (
    <aside className="flex h-full flex-col justify-between rounded-[2rem] bg-white/88 p-4 shadow-[0_20px_60px_rgba(16,36,62,0.08)] backdrop-blur sm:p-5">
      <div>
        <div className="flex items-center gap-3 rounded-[1.5rem] bg-mist px-3 py-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white">
            EM
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ink">Exam Mate</p>
            <p className="text-xs text-ink/55">AWS SAA Study</p>
          </div>
        </div>

        <nav className="mt-6 space-y-3">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="group flex items-center gap-3 rounded-[1.25rem] px-3 py-3 text-sm font-medium text-ink/68 transition-colors hover:bg-mist hover:text-ink"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-ink/10 bg-white text-[11px] font-semibold tracking-[0.16em] text-ink/72 transition-colors group-hover:border-coral/30 group-hover:text-coral">
                {item.shortLabel}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="rounded-[1.5rem] border border-ink/10 bg-mist px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/45">
          Ready
        </p>
        <p className="mt-2 text-sm font-medium leading-6 text-ink/72">
          문제 세트를 불러오고 바로 학습을 시작할 수 있습니다.
        </p>
      </div>
    </aside>
  );
}
