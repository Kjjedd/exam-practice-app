type StatsCardProps = Readonly<{
  label: string;
  value: string;
  tone?: "neutral" | "success" | "warning";
}>;

function getToneClassName(tone: StatsCardProps["tone"]): string {
  if (tone === "success") {
    return "bg-tide/10 text-tide border-tide/20";
  }

  if (tone === "warning") {
    return "bg-coral/10 text-coral border-coral/20";
  }

  return "bg-white text-ink border-ink/10";
}

export function StatsCard({
  label,
  value,
  tone = "neutral"
}: StatsCardProps) {
  return (
    <article
      className={`rounded-[1.5rem] border px-5 py-5 shadow-sm ${getToneClassName(tone)}`}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-75">
        {label}
      </p>
      <p className="mt-3 text-3xl font-semibold tracking-tight">{value}</p>
    </article>
  );
}
