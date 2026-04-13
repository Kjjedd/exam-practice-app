export type StudyStats = Readonly<{
  totalSolved: number;
  correctCount: number;
  wrongCount: number;
  correctRate: number;
  favoriteCount: number;
  lastStudiedAt: string | null;
}>;
