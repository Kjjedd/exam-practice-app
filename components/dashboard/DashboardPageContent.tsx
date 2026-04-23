"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  readDashboardSummary,
  type DashboardSummary
} from "../../lib/dashboard/read-dashboard-summary";
import { StatsCard } from "./StatsCard";

type DashboardPageState = Readonly<{
  summary: DashboardSummary | null;
  isReady: boolean;
}>;

const INITIAL_DASHBOARD_PAGE_STATE: DashboardPageState = {
  summary: null,
  isReady: false
};

function formatStudiedAt(value: string | null): string {
  if (value === null) {
    return "아직 학습 시점이 없습니다.";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

export function DashboardPageContent() {
  const [state, setState] = useState<DashboardPageState>(INITIAL_DASHBOARD_PAGE_STATE);

  useEffect(() => {
    setState({
      summary: readDashboardSummary(),
      isReady: true
    });
  }, []);

  if (!state.isReady || state.summary === null) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-card mx-auto max-w-5xl rounded-[1.75rem] px-6 py-8 sm:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--app-text)]">
            학습 통계를 불러오는 중입니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            저장된 최신 세션과 문제 세트 상태를 확인한 뒤 대시보드를 준비합니다.
          </p>
        </div>
      </main>
    );
  }

  const { summary } = state;

  if (!summary.hasLatestQuizSession) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-card mx-auto max-w-5xl rounded-[1.75rem] px-6 py-8 sm:px-8">
          <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
            Dashboard
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">
            아직 학습 기록이 없습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            문제풀이를 완료하면 이곳에서 정답률, 풀이 수, 즐겨찾기 수, 마지막
            학습 시점을 한눈에 확인할 수 있습니다.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatsCard
              label="Question Sets"
              value={`${summary.questionSetCount}`}
            />
            <StatsCard
              label="Favorites"
              value={`${summary.stats.favoriteCount}`}
            />
            <StatsCard
              label="Active Set"
              value={summary.hasActiveQuestionSet ? "Ready" : "None"}
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/quiz"
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
          <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
            Dashboard
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">
            현재 학습 상태를 요약했습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            최신 세션과 저장된 사용자 상태를 기준으로 핵심 학습 지표를 정리했습니다.
            장기 누적 분석이 아니라 현재 저장된 상태에 대한 정직한 요약입니다.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatsCard label="Solved" value={`${summary.stats.totalSolved}`} />
          <StatsCard
            label="Correct"
            value={`${summary.stats.correctCount}`}
            tone="success"
          />
          <StatsCard
            label="Wrong"
            value={`${summary.stats.wrongCount}`}
            tone="warning"
          />
          <StatsCard label="Accuracy" value={`${summary.stats.correctRate}%`} />
          <StatsCard label="Favorites" value={`${summary.stats.favoriteCount}`} />
          <StatsCard label="Question Sets" value={`${summary.questionSetCount}`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <article className="theme-card rounded-[1.75rem] px-6 py-8 sm:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--app-text)]">
              최신 학습 문맥
            </h2>
            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
                  Last Studied
                </dt>
                <dd className="mt-2 text-base leading-7 text-[var(--app-text)]">
                  {formatStudiedAt(summary.stats.lastStudiedAt)}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
                  Latest Mode
                </dt>
                <dd className="mt-2 text-base leading-7 text-[var(--app-text)]">
                  {summary.latestModeLabel ?? "기록 없음"}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
                  Latest Question Set
                </dt>
                <dd className="mt-2 text-base leading-7 text-[var(--app-text)]">
                  {summary.latestQuestionSetTitle ?? "아직 완료된 세션이 없습니다."}
                </dd>
              </div>
            </dl>
          </article>

          <article className="theme-home-overview rounded-[1.75rem] px-6 py-8 sm:px-8">
            <h2 className="text-2xl font-semibold tracking-tight text-[var(--app-text)]">학습 상태 해석</h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
              <li>
                현재 저장 구조 기준으로 통계는 최신 완료 세션을 중심으로 계산됩니다.
              </li>
              <li>
                활성 문제 세트 상태: {summary.hasActiveQuestionSet ? "준비됨" : "없음"}
              </li>
              <li>
                최신 완료 세션 기준 정확도는 {summary.stats.correctRate}%입니다.
              </li>
              <li>
                즐겨찾기 문제 {summary.stats.favoriteCount}개가 현재 저장돼 있습니다.
              </li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/result"
                className="theme-solid-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                결과 화면 보기
              </Link>
              <Link
                href="/favorites"
                className="theme-outline-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
              >
                즐겨찾기 보기
              </Link>
            </div>
          </article>
        </section>

        {!summary.hasCompletedLatestQuizSession ? (
          <section className="theme-card rounded-[1.75rem] border-coral/20 px-6 py-6 sm:px-8">
            <h2 className="text-xl font-semibold tracking-tight text-[var(--app-text)]">
              완료된 학습 세션이 아직 없습니다.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
              현재 저장된 세션이 있더라도 완료되지 않았다면, 성과 지표는 0으로
              표시됩니다. 퀴즈를 끝까지 진행하면 대시보드 수치가 정확히 반영됩니다.
            </p>
          </section>
        ) : null}
      </div>
    </main>
  );
}
