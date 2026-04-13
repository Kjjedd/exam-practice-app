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
      ? "bg-tide/12 text-tide"
      : tone === "warning"
        ? "bg-coral/12 text-coral"
        : "bg-mist text-ink";

  return (
    <article className="rounded-[1.5rem] border border-ink/10 bg-white px-5 py-5 shadow-sm sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
        {label}
      </p>
      <div
        className={`mt-4 inline-flex rounded-full px-4 py-2 text-2xl font-semibold tracking-tight ${toneClassName}`}
      >
        {value}
      </div>
    </article>
  );
}
