"use client";

import { useMemo } from "react";

import { buildQuestionSuggestionIssueUrl } from "../../lib/utils/github-issue-links";
import type { Question, QuestionSet } from "../../lib/types";

type QuestionContributionActionsProps = Readonly<{
  question: Question;
  questionSet: QuestionSet;
  className?: string;
}>;

export function QuestionContributionActions({
  question,
  questionSet,
  className = ""
}: QuestionContributionActionsProps) {
  const appOrigin =
    typeof window === "undefined" ? null : window.location.origin;

  const questionIssueUrl = useMemo(
    () =>
      buildQuestionSuggestionIssueUrl({
        kind: "question-error",
        question,
        questionSet,
        appOrigin
      }),
    [appOrigin, question, questionSet]
  );

  const explanationIssueUrl = useMemo(
    () =>
      buildQuestionSuggestionIssueUrl({
        kind: "explanation-improvement",
        question,
        questionSet,
        appOrigin
      }),
    [appOrigin, question, questionSet]
  );

  return (
    <section
      className={`theme-card rounded-[1.35rem] px-4 py-4 sm:rounded-[1.55rem] sm:px-6 sm:py-5 ${className}`.trim()}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-text-faint)]">
            Contribution
          </p>
          <p className="mt-2 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-[0.95rem]">
            문제 오류나 해설 보완은 GitHub Issue로 제안할 수 있습니다. 정답은
            자동으로 바뀌지 않으며, 검토 후 반영됩니다.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <a
            href={questionIssueUrl}
            target="_blank"
            rel="noreferrer"
            className="theme-outline-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            문제 오류 제안
          </a>
          <a
            href={explanationIssueUrl}
            target="_blank"
            rel="noreferrer"
            className="theme-outline-button inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition-colors"
          >
            해설 보완 제안
          </a>
        </div>
      </div>
    </section>
  );
}
