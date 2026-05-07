"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { loadActiveQuestionSet } from "../../lib/data";
import {
  readFavoriteQuestionIds,
  removeFavoriteQuestionId
} from "../../lib/storage/favorites";
import type { Question, QuestionId, QuestionSet } from "../../lib/types";

type FavoritesPageState = Readonly<{
  activeQuestionSet: QuestionSet | null;
  favoriteQuestionIds: readonly QuestionId[];
  favoriteQuestions: readonly Question[];
  isReady: boolean;
}>;

const INITIAL_FAVORITES_PAGE_STATE: FavoritesPageState = {
  activeQuestionSet: null,
  favoriteQuestionIds: [],
  favoriteQuestions: [],
  isReady: false
};

function resolveFavoriteQuestions(
  activeQuestionSet: QuestionSet | null,
  favoriteQuestionIds: readonly QuestionId[]
): readonly Question[] {
  if (activeQuestionSet === null) {
    return [];
  }

  const questionById = new Map<QuestionId, Question>(
    activeQuestionSet.questions.map((question) => [question.id, question])
  );

  return favoriteQuestionIds
    .map((questionId) => questionById.get(questionId))
    .filter((question): question is Question => question !== undefined);
}

export function FavoritesPageContent() {
  const [state, setState] = useState<FavoritesPageState>(INITIAL_FAVORITES_PAGE_STATE);

  useEffect(() => {
    const activeQuestionSet = loadActiveQuestionSet();
    const favoriteQuestionIds =
      activeQuestionSet === null ? [] : readFavoriteQuestionIds(activeQuestionSet.id);

    setState({
      activeQuestionSet,
      favoriteQuestionIds,
      favoriteQuestions: resolveFavoriteQuestions(activeQuestionSet, favoriteQuestionIds),
      isReady: true
    });
  }, []);

  function handleRemoveFavorite(questionId: QuestionId): void {
    if (state.activeQuestionSet === null) {
      return;
    }

    const nextFavoriteQuestionIds = removeFavoriteQuestionId(
      state.activeQuestionSet.id,
      questionId
    );

    setState((currentValue) => ({
      ...currentValue,
      favoriteQuestionIds: nextFavoriteQuestionIds,
      favoriteQuestions: resolveFavoriteQuestions(
        currentValue.activeQuestionSet,
        nextFavoriteQuestionIds
      )
    }));
  }

  if (!state.isReady) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-card mx-auto max-w-4xl rounded-[1.75rem] px-6 py-8 sm:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--app-text)]">
            즐겨찾기 목록을 불러오는 중입니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            저장된 즐겨찾기 문제와 활성 문제 세트를 연결한 뒤 목록 화면을 준비합니다.
          </p>
        </div>
      </main>
    );
  }

  if (state.favoriteQuestions.length === 0) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-card mx-auto max-w-4xl rounded-[1.75rem] px-6 py-8 sm:px-8">
          <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
            Favorites
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)]">
            저장된 즐겨찾기 문제가 아직 없습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            {state.activeQuestionSet?.title ?? "현재 문제 세트"}에서 다시 보고 싶은 문제를
            즐겨찾기에 추가하면 이곳에서 모아서 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/quiz/index.html"
              className="theme-solid-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              퀴즈로 이동
            </Link>
            <Link
              href="/"
              className="theme-outline-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="theme-card rounded-[1.75rem] px-6 py-8 sm:px-8">
          <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
            Favorites
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">
            저장한 문제를 다시 볼 수 있습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            {state.activeQuestionSet?.title ?? "현재 활성 문제 세트"} 기준으로 즐겨찾기한
            문제만 모았습니다. 다시 보고 싶은 문제를 골라 바로 풀이 흐름으로
            돌아가거나 목록에서 바로 제거할 수 있습니다.
          </p>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            총 {state.favoriteQuestions.length}개의 즐겨찾기 문제를 확인할 수 있습니다.
          </p>
        </section>

        <section className="space-y-4">
          {state.favoriteQuestions.map((question, index) => (
            <article
              key={question.id}
              className="theme-card rounded-[1.75rem] px-6 py-6 sm:px-8"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <span className="theme-subtle-surface inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-muted)]">
                    Favorite {index + 1}
                  </span>
                  <h2 className="mt-4 text-xl font-semibold leading-8 tracking-tight text-[var(--app-text)]">
                    {question.question}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
                    카테고리: {question.category}
                  </p>
                </div>
                <Link
                  href={`/quiz/index.html?questionId=${encodeURIComponent(question.id)}`}
                  className="theme-solid-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                >
                  이 문제 다시 보기
                </Link>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => handleRemoveFavorite(question.id)}
                  className="inline-flex items-center justify-center rounded-full border border-coral/25 px-4 py-2 text-sm font-semibold text-coral transition-colors hover:bg-coral/6"
                >
                  즐겨찾기에서 삭제
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
