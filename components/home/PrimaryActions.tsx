import Link from "next/link";

type PrimaryAction = Readonly<{
  title: string;
  description: string;
  href: string;
  badge: string;
  requiresActiveQuestionSet: boolean;
}>;

const primaryActions: readonly PrimaryAction[] = [
  {
    title: "PDF 가져오기",
    description: "문제와 답이 담긴 PDF를 업로드하고, 검수 후 활성 문제 세트로 저장하는 시작 흐름입니다.",
    href: "/import",
    badge: "Import",
    requiresActiveQuestionSet: false
  },
  {
    title: "일반 문제풀이",
    description: "기본 순서대로 문제를 풀며 흐름을 익히는 가장 기본적인 시작 방식입니다.",
    href: "/quiz",
    badge: "Normal",
    requiresActiveQuestionSet: true
  },
  {
    title: "랜덤 모드",
    description: "문제 순서를 섞어서 익숙함을 줄이고 실제 기억을 점검하는 방식입니다.",
    href: "/quiz?mode=random",
    badge: "Random",
    requiresActiveQuestionSet: true
  },
  {
    title: "시험 모드",
    description: "연속 풀이 중심의 시험형 흐름으로 집중해서 실전 감각을 점검합니다.",
    href: "/quiz?mode=exam",
    badge: "Exam",
    requiresActiveQuestionSet: true
  }
] as const;

type PrimaryActionsProps = Readonly<{
  hasActiveQuestionSet: boolean;
  isReady: boolean;
}>;

export function PrimaryActions({
  hasActiveQuestionSet,
  isReady
}: PrimaryActionsProps) {
  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-ink">
            주요 시작 흐름
          </h2>
          <p className="mt-2 text-sm leading-6 text-ink/70 sm:text-base">
            PDF 가져오기와 학습 시작 흐름을 현재 상태에 맞게 선택할 수 있습니다.
          </p>
        </div>
      </div>
      {!hasActiveQuestionSet && isReady ? (
        <div className="mb-5 rounded-2xl border border-dashed border-coral/35 bg-coral/5 px-5 py-4">
          <p className="text-sm leading-6 text-ink/75 sm:text-base">
            아직 저장된 활성 문제 세트가 없어 일반/랜덤/시험 모드는 안내 상태로
            표시됩니다. 먼저 PDF 가져오기 흐름을 시작해 주세요.
          </p>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {primaryActions.map((action) => {
          const isDisabled =
            action.requiresActiveQuestionSet && (!hasActiveQuestionSet || !isReady);

          if (isDisabled) {
            return (
              <div
                key={action.title}
                className="rounded-[1.75rem] border border-ink/10 bg-white/70 p-6 shadow-sm"
              >
                <span className="inline-flex rounded-full bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
                  {action.badge}
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">{action.title}</h3>
                <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
                  {action.description}
                </p>
                <span className="mt-6 inline-flex text-sm font-medium text-ink/45">
                  활성 문제 세트 필요
                </span>
              </div>
            );
          }

          return (
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
          );
        })}
      </div>
    </section>
  );
}
