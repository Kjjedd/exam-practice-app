type ResultSummaryCardProps = Readonly<{
  label: string;
  value: string;
  tone: "neutral" | "success" | "warning";
}>;

export function ResultSummaryCard({
  label,
  value,
  tone
}: ResultSummaryCardProps) {
  const toneClassName =
    tone === "success"
      ? "border-tide/18 bg-tide/10 text-tide"
      : tone === "warning"
        ? "border-coral/18 bg-coral/10 text-coral"
        : "border-[#dce5f5] bg-mist text-ink";

  return (
    <article className="rounded-[1.25rem] border border-ink/10 bg-white/92 px-4 py-4 shadow-sm backdrop-blur sm:rounded-[1.5rem] sm:px-5 sm:py-5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/48 sm:text-[11px]">
        {label}
      </p>
      <div className="mt-3 flex items-end justify-between gap-3 sm:mt-5">
        <div
          className={`inline-flex rounded-[1rem] border px-3 py-2.5 text-2xl font-semibold tracking-tight sm:px-4 sm:py-3 sm:text-3xl ${toneClassName}`}
        >
          {value}
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-ink/32 sm:text-xs">
          Score
        </span>
      </div>
    </article>
  );
}
