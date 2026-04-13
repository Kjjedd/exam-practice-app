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
      className={`inline-flex items-center justify-center rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
        isFavorite
          ? "border-coral/30 bg-coral/10 text-coral hover:bg-coral/15"
          : "border-ink/15 bg-white text-ink hover:border-ink/25 hover:bg-mist"
      }`}
    >
      {isFavorite ? "즐겨찾기 해제" : "즐겨찾기 추가"}
    </button>
  );
}
