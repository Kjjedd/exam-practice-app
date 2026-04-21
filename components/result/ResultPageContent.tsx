"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { loadActiveQuestionSet } from "../../lib/data";
import { getAwsExamTemplateById } from "../../lib/exams/aws-exam-templates";
import { getWrongQuestionIds } from "../../lib/quiz/get-wrong-questions";
import { readLatestQuizSession } from "../../lib/quiz/session-storage";
import { hasCompleteQuizSession } from "../../lib/quiz/quiz-session-model";
import {
  hasStoredWrongQuestionIds,
  readWrongQuestionIds
} from "../../lib/storage/wrong-answers";
import {
  summarizeResults,
  type ResultSummary
} from "../../lib/quiz/summarize-results";
import type { QuizSession } from "../../lib/types";
import { ResultQuestionList } from "./ResultQuestionList";
import { ResultSummaryCard } from "./ResultSummaryCard";
import { WrongAnswerCallout } from "./WrongAnswerCallout";

type ResultPageState = Readonly<{
  quizSession: QuizSession | null;
  resultSummary: ResultSummary | null;
  isQuestionSetMatched: boolean;
  wrongCount: number;
  isReady: boolean;
}>;

const INITIAL_RESULT_PAGE_STATE: ResultPageState = {
  quizSession: null,
  resultSummary: null,
  isQuestionSetMatched: false,
  wrongCount: 0,
  isReady: false
};

function getSessionModeLabel(quizSession: QuizSession): string {
  if (quizSession.mode === "random") {
    return "랜덤";
  }

  if (quizSession.mode === "review") {
    return "복습";
  }

  if (quizSession.mode === "exam") {
    return "시험";
  }

  return "일반";
}

function getPracticeExamStatusText(accuracyRate: number, passingPercentage: number): string {
  return accuracyRate >= passingPercentage ? "연습 기준 합격" : "연습 기준 불합격";
}

export function ResultPageContent() {
  const [state, setState] = useState<ResultPageState>(INITIAL_RESULT_PAGE_STATE);

  useEffect(() => {
    const activeQuestionSet = loadActiveQuestionSet();
    const quizSession = readLatestQuizSession();
    const isQuestionSetMatched =
      activeQuestionSet !== null &&
      hasCompleteQuizSession(quizSession) &&
      activeQuestionSet.id === quizSession.questionSetId;
    const resultSummary = hasCompleteQuizSession(quizSession)
      ? summarizeResults(quizSession, isQuestionSetMatched ? activeQuestionSet.questions : [])
      : null;
    const wrongCount = hasCompleteQuizSession(quizSession)
      ? hasStoredWrongQuestionIds(quizSession.questionSetId)
        ? readWrongQuestionIds(quizSession.questionSetId).length
        : getWrongQuestionIds(quizSession).length
      : 0;

    setState({
      quizSession,
      resultSummary,
      isQuestionSetMatched,
      wrongCount,
      isReady: true
    });
  }, []);

  if (!state.isReady) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-card mx-auto max-w-4xl rounded-[1.75rem] px-6 py-8 sm:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--app-text)]">
            결과를 불러오는 중입니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            마지막 세션 결과와 활성 문제 세트를 확인한 뒤 요약 화면을 준비합니다.
          </p>
        </div>
      </main>
    );
  }

  if (state.resultSummary === null || state.quizSession === null) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-card mx-auto max-w-4xl rounded-[1.75rem] px-6 py-8 sm:px-8">
          <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
            Result
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)]">
            표시할 세션 결과가 아직 없습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            퀴즈를 끝까지 진행하면 이 화면에서 총 문제 수, 정답 수, 오답 수,
            정답률과 문제별 결과를 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="theme-solid-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              홈으로 이동
            </Link>
            <Link
              href="/quiz"
              className="theme-outline-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
            >
              퀴즈로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    );
  }
  const examTemplate = getAwsExamTemplateById(state.quizSession.examTemplateId);

  return (
    <main className="theme-page-shell min-h-screen px-4 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:gap-6">
        <section className="theme-home-overview overflow-hidden rounded-[1.5rem] px-4 py-5 sm:rounded-[1.9rem] sm:px-8 sm:py-8">
          <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-coral sm:text-xs">
            Result
          </span>
          <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">
                결과
              </h1>
              <p className="mt-1 text-sm font-medium text-[color:var(--app-text-muted)] sm:mt-2 sm:text-base">
                {state.quizSession.questionSetTitle} · {getSessionModeLabel(state.quizSession)}
              </p>
            </div>
            <span className="theme-subtle-surface inline-flex w-fit rounded-full px-4 py-2 text-sm font-semibold text-[color:var(--app-text-muted)]">
              정답률 {state.resultSummary.accuracyRate}%
            </span>
          </div>
          {state.quizSession.mode === "exam" && examTemplate !== null ? (
            <div className="mt-4 rounded-[1.2rem] border border-coral/15 bg-coral/5 px-4 py-3 text-sm leading-6 text-ink/78 sm:rounded-2xl sm:px-5">
              {examTemplate.code} · {examTemplate.title} · {examTemplate.totalQuestionCount}문항
            </div>
          ) : null}
          {!state.isQuestionSetMatched ? (
            <p className="mt-3 rounded-[1.2rem] border border-coral/15 bg-coral/5 px-4 py-3 text-sm leading-6 text-coral sm:rounded-2xl">
              현재 활성 세트가 달라 일부 문항 제목은 기본 라벨로 표시됩니다.
            </p>
          ) : null}
        </section>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ResultSummaryCard
            label="Total"
            value={`${state.resultSummary.totalQuestions}`}
            tone="neutral"
          />
          <ResultSummaryCard
            label="Correct"
            value={`${state.resultSummary.correctCount}`}
            tone="success"
          />
          <ResultSummaryCard
            label="Wrong"
            value={`${state.resultSummary.wrongCount}`}
            tone="warning"
          />
          <ResultSummaryCard
            label="Accuracy"
            value={`${state.resultSummary.accuracyRate}%`}
            tone="neutral"
          />
          {state.resultSummary.unansweredCount > 0 ? (
            <ResultSummaryCard
              label="Pending"
              value={`${state.resultSummary.unansweredCount}`}
              tone="warning"
            />
          ) : null}
          {state.quizSession.mode === "exam" && examTemplate !== null ? (
            <ResultSummaryCard
              label="Practice"
              value={getPracticeExamStatusText(
                state.resultSummary.accuracyRate,
                examTemplate.practicePassingPercentage
              )}
              tone={
                state.resultSummary.accuracyRate >= examTemplate.practicePassingPercentage
                  ? "success"
                  : "warning"
              }
            />
          ) : null}
        </section>

        <WrongAnswerCallout wrongCount={state.wrongCount} />

        <ResultQuestionList items={state.resultSummary.items} />
      </div>
    </main>
  );
}
