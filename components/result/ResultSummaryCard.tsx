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
      ? "border-tide/18 bg-tide/12 text-tide"
      : tone === "warning"
        ? "border-coral/18 bg-coral/12 text-coral"
        : "border-[#dce5f5] bg-mist text-ink";

  return (
    <article className="rounded-[1.5rem] border border-ink/10 bg-white/92 px-5 py-5 shadow-sm backdrop-blur sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/48">
        {label}
      </p>
      <div className="mt-5 flex items-end justify-between gap-4">
        <div
          className={`inline-flex rounded-[1.1rem] border px-4 py-3 text-3xl font-semibold tracking-tight ${toneClassName}`}
        >
          {value}
        </div>
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-ink/32">
          Score
        </span>
      </div>
    </article>
  );
}
