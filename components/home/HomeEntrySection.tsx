"use client";

import { useEffect, useState } from "react";

import { loadQuestionSetSummaries } from "../../lib/data";
import { setActiveQuestionSet } from "../../lib/data/save-question-set";
import { canUseExamModeForQuestionSet } from "../../lib/exams/exam-mode-availability";
import {
  clearInProgressQuizSession,
  readInProgressQuizSession
} from "../../lib/quiz/session-storage";
import type { InProgressQuizSession, QuestionSetSummary } from "../../lib/types";
import { ActiveQuestionSetSummary } from "./ActiveQuestionSetSummary";
import { PrimaryActions } from "./PrimaryActions";

type HomeEntryState = Readonly<{
  activeQuestionSet: QuestionSetSummary | null;
  questionSetSummaries: readonly QuestionSetSummary[];
  resumableQuizSession: InProgressQuizSession | null;
  isReady: boolean;
}>;

const INITIAL_HOME_ENTRY_STATE: HomeEntryState = {
  activeQuestionSet: null,
  questionSetSummaries: [],
  resumableQuizSession: null,
  isReady: false
};

function isResumableQuizSession(
  activeQuestionSet: QuestionSetSummary | null,
  quizSession: InProgressQuizSession | null
): quizSession is InProgressQuizSession {
  if (activeQuestionSet === null || quizSession === null) {
    return false;
  }

  return (
    quizSession.questionSetId === activeQuestionSet.id &&
    quizSession.questionIds.length > 0 &&
    quizSession.currentQuestionIndex >= 0 &&
    quizSession.currentQuestionIndex < quizSession.questionIds.length
  );
}

function getResumeHref(quizSession: InProgressQuizSession | null): string | null {
  if (quizSession === null) {
    return null;
  }

  if (quizSession.mode === "random") {
    return "/quiz?mode=random";
  }

  if (quizSession.mode === "exam") {
    return quizSession.examTemplateId === null
      ? "/exam"
      : `/quiz?mode=exam&exam=${quizSession.examTemplateId}`;
  }

  return "/quiz";
}

function getRestartHref(quizSession: InProgressQuizSession | null): string | null {
  if (quizSession === null) {
    return null;
  }

  if (quizSession.mode === "random") {
    return "/quiz?mode=random&restart=1";
  }

  if (quizSession.mode === "exam") {
    return quizSession.examTemplateId === null
      ? "/exam"
      : `/quiz?mode=exam&exam=${quizSession.examTemplateId}&restart=1`;
  }

  return "/quiz?restart=1";
}

export function HomeEntrySection() {
  const [state, setState] = useState<HomeEntryState>(INITIAL_HOME_ENTRY_STATE);

  function refreshHomeEntryState(): void {
    const questionSetSummaries = loadQuestionSetSummaries();
    const activeQuestionSet =
      questionSetSummaries.find((summary) => summary.isActive) ?? null;
    const inProgressQuizSession = readInProgressQuizSession();
    const resumableQuizSession = isResumableQuizSession(
      activeQuestionSet,
      inProgressQuizSession
    )
      ? inProgressQuizSession
      : null;

    setState({
      activeQuestionSet,
      questionSetSummaries,
      resumableQuizSession,
      isReady: true
    });
  }

  useEffect(() => {
    refreshHomeEntryState();
  }, []);

  function handleClearResume(): void {
    clearInProgressQuizSession();
    refreshHomeEntryState();
  }

  function handleChangeActiveQuestionSet(questionSetId: string): void {
    setActiveQuestionSet(questionSetId);
    clearInProgressQuizSession();
    refreshHomeEntryState();
  }

  return (
    <section className="grid gap-5 xl:grid-cols-[1.28fr_0.72fr]">
      <PrimaryActions
        hasActiveQuestionSet={state.activeQuestionSet !== null}
        canUseExamMode={canUseExamModeForQuestionSet(state.activeQuestionSet)}
        isReady={state.isReady}
        resumeHref={getResumeHref(state.resumableQuizSession)}
        restartHref={getRestartHref(state.resumableQuizSession)}
        resumeMode={state.resumableQuizSession?.mode ?? null}
        resumeQuestionNumber={
          state.resumableQuizSession !== null
            ? state.resumableQuizSession.currentQuestionIndex + 1
            : null
        }
        onClearResume={state.resumableQuizSession !== null ? handleClearResume : undefined}
      />
      <ActiveQuestionSetSummary
        activeQuestionSet={state.activeQuestionSet}
        questionSetSummaries={state.questionSetSummaries}
        isReady={state.isReady}
        onSelectQuestionSet={handleChangeActiveQuestionSet}
      />
    </section>
  );
}
