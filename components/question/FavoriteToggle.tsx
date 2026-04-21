type FavoriteToggleProps = Readonly<{
  isFavorite: boolean;
  onToggle: () => void;
}>;

export function FavoriteToggle({
  isFavorite,
  onToggle
}: FavoriteToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center justify-center rounded-full border px-3.5 py-2 text-xs font-semibold transition-colors sm:px-4 sm:text-sm ${
        isFavorite
          ? "border-coral/30 bg-coral/10 text-coral hover:bg-coral/15"
          : "theme-outline-button hover:border-ink/25"
      }`}
    >
      {isFavorite ? "저장됨" : "저장"}
    </button>
  );
}
