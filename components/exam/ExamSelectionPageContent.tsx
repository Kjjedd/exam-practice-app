"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { loadActiveQuestionSet } from "../../lib/data";
import { canUseExamModeForQuestionSet } from "../../lib/exams/exam-mode-availability";
import { awsExamTemplates } from "../../lib/exams/aws-exam-templates";
import type { QuestionSet } from "../../lib/types";

export function ExamSelectionPageContent() {
  const [activeQuestionSet, setActiveQuestionSet] = useState<QuestionSet | null>(null);
  const [isReady, setIsReady] = useState(false);
  const searchParams = useSearchParams();
  const requestedRangeStart = searchParams.get("start");
  const requestedRangeEnd = searchParams.get("end");
  const rangeQueryString = new URLSearchParams(
    requestedRangeStart !== null && requestedRangeEnd !== null
      ? {
          start: requestedRangeStart,
          end: requestedRangeEnd
        }
      : {}
  ).toString();

  useEffect(() => {
    setActiveQuestionSet(loadActiveQuestionSet());
    setIsReady(true);
  }, []);

  const canUseExamMode = canUseExamModeForQuestionSet(activeQuestionSet);

  if (isReady && !canUseExamMode) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <section className="theme-card rounded-[1.75rem] px-6 py-8 sm:px-8">
            <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
              Exam Mode Limited
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">
              시험 모드는 AWS SAA 세트에서만 사용할 수 있습니다.
            </h1>
            <p className="mt-3 text-sm leading-7 text-[color:var(--app-text-muted)] sm:text-base">
              현재 활성 문제 세트가 PDF 업로드 세트이거나 시험 전용 템플릿이 아닌
              세트입니다. 업로드한 PDF 세트는 일반 문제풀이와 랜덤 모드만 지원합니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/quiz"
                className="theme-solid-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
              >
                일반 문제풀이
              </Link>
              <Link
                href="/quiz?mode=random"
                className="theme-outline-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
              >
                랜덤 모드
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="theme-home-overview rounded-[1.75rem] px-6 py-8 sm:px-8">
          <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
            Exam Templates
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">
            AWS SAA 시험모드를 시작하세요.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--app-text-muted)] sm:text-base">
            현재 문제세트 기준으로 AWS SAA 공식 시험 형식에 맞춘 연습 세션을 만듭니다.
          </p>
          {rangeQueryString.length > 0 ? (
            <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)]">
              현재 선택 범위: {requestedRangeStart}~{requestedRangeEnd}
            </p>
          ) : null}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {awsExamTemplates.map((template) => (
            <article
              key={template.id}
              className="theme-card rounded-[1.75rem] p-6"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="theme-subtle-surface inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-muted)]">
                  {template.level}
                </span>
                <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
                  {template.code}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--app-text)]">
                {template.title}
              </h2>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="theme-subtle-surface rounded-2xl px-4 py-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
                    Total Questions
                  </dt>
                  <dd className="mt-2 text-xl font-semibold text-[var(--app-text)]">
                    {template.totalQuestionCount}문항
                  </dd>
                </div>
                <div className="theme-subtle-surface rounded-2xl px-4 py-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
                    Passing Score
                  </dt>
                  <dd className="mt-2 text-xl font-semibold text-[var(--app-text)]">
                    {template.passingScaledScore} / 1000
                  </dd>
                </div>
              </dl>

              <div className="theme-subtle-surface mt-5 space-y-3 rounded-[1.5rem] px-4 py-4">
                <p className="text-sm leading-6 text-[color:var(--app-text-muted)]">
                  <span className="font-semibold text-[var(--app-text)]">공식 채점:</span>{" "}
                  {template.officialScoringSummary}
                </p>
                <p className="text-sm leading-6 text-[color:var(--app-text-muted)]">
                  <span className="font-semibold text-[var(--app-text)]">연습 기준:</span>{" "}
                  {template.practiceScoringSummary}
                </p>
                <p className="text-sm leading-6 text-[color:var(--app-text-muted)]">
                  <span className="font-semibold text-[var(--app-text)]">응답 방식:</span>{" "}
                  {template.responseTypeSummary}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/quiz?mode=exam&exam=${template.id}&restart=1${
                    rangeQueryString.length > 0 ? `&${rangeQueryString}` : ""
                  }`}
                  className="theme-solid-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
                >
                  이 시험으로 시작
                </Link>
                <Link
                  href="/"
                  className="theme-outline-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
                >
                  홈으로 이동
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
