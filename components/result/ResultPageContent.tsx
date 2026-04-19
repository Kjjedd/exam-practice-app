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

function getSessionModeDescription(quizSession: QuizSession): string {
  if (quizSession.mode === "random") {
    return "이번 세션은 랜덤 모드로 진행되어 섞인 순서대로 문제를 풀었습니다.";
  }

  if (quizSession.mode === "review") {
    return "이번 세션은 오답 복습 모드로 진행되었습니다.";
  }

  if (quizSession.mode === "exam") {
    return "이번 세션은 시험 모드로 진행되었습니다.";
  }

  return "이번 세션은 일반 모드로 진행되었습니다.";
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
      <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            결과를 불러오는 중입니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
            마지막 세션 결과와 활성 문제 세트를 확인한 뒤 요약 화면을 준비합니다.
          </p>
        </div>
      </main>
    );
  }

  if (state.resultSummary === null || state.quizSession === null) {
    return (
      <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
          <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
            Result
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
            표시할 세션 결과가 아직 없습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
            퀴즈를 끝까지 진행하면 이 화면에서 총 문제 수, 정답 수, 오답 수,
            정답률과 문제별 결과를 확인할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
            >
              홈으로 이동
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-white"
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
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="overflow-hidden rounded-[1.9rem] border border-ink/10 bg-[linear-gradient(135deg,_rgba(255,255,255,0.98),_rgba(247,250,255,0.96),_rgba(255,246,240,0.94))] px-6 py-8 shadow-[0_24px_60px_rgba(16,36,62,0.08)] sm:px-8">
          <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
            <div>
              <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
                Result
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                세션 결과를 요약했습니다.
              </h1>
              <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
                {state.quizSession.questionSetTitle} 기준으로 이번 세션의 전체 흐름을
                정리했습니다. 숫자 요약을 먼저 확인한 뒤, 아래에서 문제별 정답/오답을
                살펴볼 수 있습니다.
              </p>
              <p className="mt-3 text-sm leading-6 text-ink/65 sm:text-base">
                {getSessionModeDescription(state.quizSession)}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-sm font-semibold text-ink/72">
                  세트: {state.quizSession.questionSetTitle}
                </span>
                <span className="inline-flex rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-sm font-semibold text-ink/72">
                  모드: {state.quizSession.mode === "random"
                    ? "랜덤"
                    : state.quizSession.mode === "exam"
                      ? "시험"
                      : state.quizSession.mode === "review"
                        ? "복습"
                        : "일반"}
                </span>
                <span className="inline-flex rounded-full border border-ink/10 bg-white/75 px-4 py-2 text-sm font-semibold text-ink/72">
                  정답률: {state.resultSummary.accuracyRate}%
                </span>
              </div>
            </div>
            <div className="grid gap-3 self-start sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[1.5rem] border border-[#dce5f5] bg-white/85 px-5 py-5 shadow-sm backdrop-blur">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">
                  Quick View
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                  {state.resultSummary.correctCount}/{state.resultSummary.totalQuestions}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  정답 수와 전체 문항 수를 한 번에 확인할 수 있습니다.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-coral/15 bg-coral/5 px-5 py-5 shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-coral/80">
                  Review Count
                </p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-coral">
                  {state.wrongCount}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink/62">
                  현재 세트 기준으로 다시 복습할 오답 문제 수입니다.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-[#dce5f5] bg-[linear-gradient(135deg,_rgba(20,43,74,0.96),_rgba(52,84,138,0.92))] px-5 py-5 text-white shadow-sm">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/58">
                  Session Flow
                </p>
                <p className="mt-3 text-lg font-semibold tracking-tight">
                  결과 확인 → 오답 복습 → 다음 범위 학습
                </p>
                <p className="mt-2 text-sm leading-6 text-white/68">
                  이번 결과를 바로 다음 학습 흐름으로 연결할 수 있습니다.
                </p>
              </div>
            </div>
          </div>
          {state.quizSession.mode === "exam" && examTemplate !== null ? (
            <div className="mt-4 rounded-2xl border border-coral/15 bg-coral/5 px-4 py-4 text-sm leading-6 text-ink/78">
              <p>
                <span className="font-semibold text-ink">시험:</span> {examTemplate.code} ·{" "}
                {examTemplate.title}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-ink">문항 수:</span>{" "}
                {examTemplate.totalQuestionCount}문항
              </p>
              <p className="mt-2">
                <span className="font-semibold text-ink">공식 기준:</span>{" "}
                {examTemplate.officialScoringSummary}
              </p>
              <p className="mt-2">
                <span className="font-semibold text-ink">앱 연습 기준:</span>{" "}
                {examTemplate.practiceScoringSummary}
              </p>
            </div>
          ) : null}
          {!state.isQuestionSetMatched ? (
            <p className="mt-3 rounded-2xl border border-coral/15 bg-coral/5 px-4 py-4 text-sm leading-6 text-coral">
              현재 활성 문제 세트가 이 세션과 다르기 때문에, 일부 문제 본문은 세션
              기준 기본 라벨로 표시됩니다. 그래도 결과 숫자와 정답/오답 상태는 저장된
              세션 기준으로 유지됩니다.
            </p>
          ) : null}
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <ResultSummaryCard
            label="Total Questions"
            value={`${state.resultSummary.totalQuestions}`}
            tone="neutral"
          />
          <ResultSummaryCard
            label="Answered"
            value={`${state.resultSummary.answeredCount}`}
            tone="neutral"
          />
          <ResultSummaryCard
            label="Correct Answers"
            value={`${state.resultSummary.correctCount}`}
            tone="success"
          />
          <ResultSummaryCard
            label="Wrong Answers"
            value={`${state.resultSummary.wrongCount}`}
            tone="warning"
          />
          <ResultSummaryCard
            label="Unanswered"
            value={`${state.resultSummary.unansweredCount}`}
            tone="warning"
          />
          <ResultSummaryCard
            label="Accuracy"
            value={`${state.resultSummary.accuracyRate}%`}
            tone="neutral"
          />
          {state.quizSession.mode === "exam" && examTemplate !== null ? (
            <ResultSummaryCard
              label="Practice Result"
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
