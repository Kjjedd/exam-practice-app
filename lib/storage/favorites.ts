import type { QuestionId } from "../types";

const FAVORITE_QUESTION_IDS_STORAGE_KEY = "exammate.favorite-question-ids.v1";

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function validateFavoriteQuestionIds(
  favoriteQuestionIds: readonly QuestionId[]
): readonly QuestionId[] {
  const normalizedFavoriteQuestionIds = favoriteQuestionIds.filter(
    (questionId): questionId is QuestionId => typeof questionId === "string"
  );

  return Array.from(new Set(normalizedFavoriteQuestionIds));
}

function parseFavoriteQuestionIds(rawValue: string): readonly QuestionId[] {
  const parsed = JSON.parse(rawValue) as Partial<{
    favoriteQuestionIds: readonly QuestionId[];
  }>;

  if (!Array.isArray(parsed.favoriteQuestionIds)) {
    return [];
  }

  return validateFavoriteQuestionIds(parsed.favoriteQuestionIds);
}

export function readFavoriteQuestionIds(): readonly QuestionId[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  const rawValue = window.localStorage.getItem(FAVORITE_QUESTION_IDS_STORAGE_KEY);

  if (rawValue === null) {
    return [];
  }

  try {
    return parseFavoriteQuestionIds(rawValue);
  } catch {
    return [];
  }
}

export function writeFavoriteQuestionIds(
  favoriteQuestionIds: readonly QuestionId[]
): readonly QuestionId[] {
  const validatedFavoriteQuestionIds = validateFavoriteQuestionIds(favoriteQuestionIds);

  if (!canUseLocalStorage()) {
    return validatedFavoriteQuestionIds;
  }

  window.localStorage.setItem(
    FAVORITE_QUESTION_IDS_STORAGE_KEY,
    JSON.stringify({
      favoriteQuestionIds: validatedFavoriteQuestionIds
    })
  );

  return validatedFavoriteQuestionIds;
}

export function isFavoriteQuestion(
  favoriteQuestionIds: readonly QuestionId[],
  questionId: QuestionId
): boolean {
  return favoriteQuestionIds.includes(questionId);
}

export function toggleFavoriteQuestionId(questionId: QuestionId): readonly QuestionId[] {
  const favoriteQuestionIds = readFavoriteQuestionIds();
  const nextFavoriteQuestionIds = favoriteQuestionIds.includes(questionId)
    ? favoriteQuestionIds.filter((favoriteQuestionId) => favoriteQuestionId !== questionId)
    : [...favoriteQuestionIds, questionId];

  return writeFavoriteQuestionIds(nextFavoriteQuestionIds);
}
