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
      <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
            <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
              Exam Mode Limited
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              시험 모드는 기본 AWS SAA 세트에서만 사용할 수 있습니다.
            </h1>
            <p className="mt-3 text-sm leading-7 text-ink/70 sm:text-base">
              현재 활성 문제 세트가 PDF 업로드 세트이거나 시험 전용 템플릿이 아닌
              세트입니다. 업로드한 PDF 세트는 일반 문제풀이와 랜덤 모드만 지원합니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/quiz"
                className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
              >
                일반 문제풀이
              </Link>
              <Link
                href="/quiz?mode=random"
                className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist"
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
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
          <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
            Exam Templates
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            시험 템플릿을 선택하세요.
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-ink/70 sm:text-base">
            현행 AWS 시험 템플릿을 기준으로 문항 수와 합격 기준을 맞춰 연습 세션을
            만듭니다. 공식 scaled scoring의 내부 배점은 AWS가 공개하지 않으므로,
            앱에서는 시험 정보는 그대로 보여주되 합격 판정은 연습용 기준으로 따로
            계산합니다.
          </p>
          {rangeQueryString.length > 0 ? (
            <p className="mt-3 text-sm leading-6 text-ink/72">
              현재 선택 범위: {requestedRangeStart}~{requestedRangeEnd}
            </p>
          ) : null}
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {awsExamTemplates.map((template) => (
            <article
              key={template.id}
              className="rounded-[1.75rem] border border-ink/10 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full bg-mist px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-ink/60">
                  {template.level}
                </span>
                <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
                  {template.code}
                </span>
              </div>

              <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
                {template.title}
              </h2>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-ink/10 bg-mist px-4 py-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
                    Total Questions
                  </dt>
                  <dd className="mt-2 text-xl font-semibold text-ink">
                    {template.totalQuestionCount}문항
                  </dd>
                </div>
                <div className="rounded-2xl border border-ink/10 bg-mist px-4 py-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/50">
                    Passing Score
                  </dt>
                  <dd className="mt-2 text-xl font-semibold text-ink">
                    {template.passingScaledScore} / 1000
                  </dd>
                </div>
              </dl>

              <div className="mt-5 space-y-3 rounded-[1.5rem] border border-ink/10 bg-[#fbfcfe] px-4 py-4">
                <p className="text-sm leading-6 text-ink/78">
                  <span className="font-semibold text-ink">공식 채점:</span>{" "}
                  {template.officialScoringSummary}
                </p>
                <p className="text-sm leading-6 text-ink/78">
                  <span className="font-semibold text-ink">연습 기준:</span>{" "}
                  {template.practiceScoringSummary}
                </p>
                <p className="text-sm leading-6 text-ink/78">
                  <span className="font-semibold text-ink">응답 방식:</span>{" "}
                  {template.responseTypeSummary}
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/quiz?mode=exam&exam=${template.id}&restart=1${
                    rangeQueryString.length > 0 ? `&${rangeQueryString}` : ""
                  }`}
                  className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
                >
                  이 시험으로 시작
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist"
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
