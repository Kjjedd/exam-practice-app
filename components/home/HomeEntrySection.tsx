"use client";

import { useEffect, useMemo, useState } from "react";

import { loadQuestionSetSummaries } from "../../lib/data";
import { setActiveQuestionSet } from "../../lib/data/save-question-set";
import { canUseExamModeForQuestionSet } from "../../lib/exams/exam-mode-availability";
import {
  clearInProgressQuizSession,
  readInProgressQuizSessions
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

  const searchParams = new URLSearchParams();

  if (quizSession.questionRangeStart !== null) {
    searchParams.set("start", String(quizSession.questionRangeStart));
  }

  if (quizSession.questionRangeEnd !== null) {
    searchParams.set("end", String(quizSession.questionRangeEnd));
  }

  if (quizSession.mode === "random") {
    searchParams.set("mode", "random");
    return `/quiz?${searchParams.toString()}`;
  }

  if (quizSession.mode === "exam") {
    if (quizSession.examTemplateId === null) {
      return `/exam?${searchParams.toString()}`;
    }

    searchParams.set("mode", "exam");
    searchParams.set("exam", quizSession.examTemplateId);

    return `/quiz?${searchParams.toString()}`;
  }

  const queryString = searchParams.toString();

  return queryString.length > 0 ? `/quiz?${queryString}` : "/quiz";
}

function getRestartHref(quizSession: InProgressQuizSession | null): string | null {
  if (quizSession === null) {
    return null;
  }

  const searchParams = new URLSearchParams();

  if (quizSession.questionRangeStart !== null) {
    searchParams.set("start", String(quizSession.questionRangeStart));
  }

  if (quizSession.questionRangeEnd !== null) {
    searchParams.set("end", String(quizSession.questionRangeEnd));
  }

  searchParams.set("restart", "1");

  if (quizSession.mode === "random") {
    searchParams.set("mode", "random");
    return `/quiz?${searchParams.toString()}`;
  }

  if (quizSession.mode === "exam") {
    if (quizSession.examTemplateId === null) {
      return `/exam?${searchParams.toString()}`;
    }

    searchParams.set("mode", "exam");
    searchParams.set("exam", quizSession.examTemplateId);

    return `/quiz?${searchParams.toString()}`;
  }

  return `/quiz?${searchParams.toString()}`;
}

function parseRangeInput(value: string): number | null {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return null;
  }

  if (!/^\d+$/.test(trimmedValue)) {
    return null;
  }

  const parsedValue = Number.parseInt(trimmedValue, 10);

  return Number.isInteger(parsedValue) ? parsedValue : null;
}

function buildModeHref(
  pathname: "/quiz" | "/exam",
  rangeStart: number | null,
  rangeEnd: number | null,
  mode: "normal" | "random" | "exam"
): string {
  const searchParams = new URLSearchParams();

  if (rangeStart !== null) {
    searchParams.set("start", String(rangeStart));
  }

  if (rangeEnd !== null) {
    searchParams.set("end", String(rangeEnd));
  }

  if (mode === "random") {
    searchParams.set("mode", "random");
  }

  const queryString = searchParams.toString();

  if (queryString.length === 0) {
    return pathname;
  }

  return `${pathname}?${queryString}`;
}

export function HomeEntrySection() {
  const [state, setState] = useState<HomeEntryState>(INITIAL_HOME_ENTRY_STATE);
  const [rangeStartInput, setRangeStartInput] = useState<string>("");
  const [rangeEndInput, setRangeEndInput] = useState<string>("");

  function refreshHomeEntryState(): void {
    const questionSetSummaries = loadQuestionSetSummaries();
    const activeQuestionSet =
      questionSetSummaries.find((summary) => summary.isActive) ?? null;
    const inProgressQuizSession =
      activeQuestionSet === null
        ? null
        : readInProgressQuizSessions()
            .filter((quizSession) => quizSession.questionSetId === activeQuestionSet.id)
            .sort((left, right) => right.savedAt.localeCompare(left.savedAt))[0] ?? null;
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

  useEffect(() => {
    if (state.activeQuestionSet === null) {
      setRangeStartInput("");
      setRangeEndInput("");
      return;
    }

    if (
      state.activeQuestionSet.minimumQuestionNumber === null ||
      state.activeQuestionSet.maximumQuestionNumber === null
    ) {
      setRangeStartInput("");
      setRangeEndInput("");
      return;
    }

    setRangeStartInput(String(state.activeQuestionSet.minimumQuestionNumber));
    setRangeEndInput(String(state.activeQuestionSet.maximumQuestionNumber));
  }, [
    state.activeQuestionSet?.id,
    state.activeQuestionSet?.minimumQuestionNumber,
    state.activeQuestionSet?.maximumQuestionNumber
  ]);

  function handleClearResume(): void {
    if (state.resumableQuizSession === null) {
      return;
    }

    clearInProgressQuizSession({
      mode: state.resumableQuizSession.mode,
      questionSetId: state.resumableQuizSession.questionSetId,
      questionRangeStart: state.resumableQuizSession.questionRangeStart,
      questionRangeEnd: state.resumableQuizSession.questionRangeEnd,
      examTemplateId: state.resumableQuizSession.examTemplateId
    });
    refreshHomeEntryState();
  }

  function handleChangeActiveQuestionSet(questionSetId: string): void {
    setActiveQuestionSet(questionSetId);
    refreshHomeEntryState();
  }

  const parsedRangeStart = parseRangeInput(rangeStartInput);
  const parsedRangeEnd = parseRangeInput(rangeEndInput);

  const rangeValidation = useMemo(() => {
    const activeQuestionSet = state.activeQuestionSet;

    if (
      activeQuestionSet === null ||
      activeQuestionSet.minimumQuestionNumber === null ||
      activeQuestionSet.maximumQuestionNumber === null
    ) {
      return {
        isRangeSelectable: false,
        isValid: true,
        message: null as string | null,
        rangeStart: null as number | null,
        rangeEnd: null as number | null
      };
    }

    if (parsedRangeStart === null || parsedRangeEnd === null) {
      return {
        isRangeSelectable: true,
        isValid: false,
        message: "시작 번호와 끝 번호를 모두 입력하세요.",
        rangeStart: null,
        rangeEnd: null
      };
    }

    if (
      parsedRangeStart < activeQuestionSet.minimumQuestionNumber ||
      parsedRangeEnd > activeQuestionSet.maximumQuestionNumber
    ) {
      return {
        isRangeSelectable: true,
        isValid: false,
        message: `현재 세트는 ${activeQuestionSet.minimumQuestionNumber}~${activeQuestionSet.maximumQuestionNumber} 범위만 지원합니다.`,
        rangeStart: null,
        rangeEnd: null
      };
    }

    if (parsedRangeStart > parsedRangeEnd) {
      return {
        isRangeSelectable: true,
        isValid: false,
        message: "시작 번호는 끝 번호보다 클 수 없습니다.",
        rangeStart: null,
        rangeEnd: null
      };
    }

    return {
      isRangeSelectable: true,
      isValid: true,
      message: null,
      rangeStart: parsedRangeStart,
      rangeEnd: parsedRangeEnd
    };
  }, [parsedRangeEnd, parsedRangeStart, state.activeQuestionSet]);

  const normalModeHref = buildModeHref(
    "/quiz",
    rangeValidation.rangeStart,
    rangeValidation.rangeEnd,
    "normal"
  );
  const randomModeHref = buildModeHref(
    "/quiz",
    rangeValidation.rangeStart,
    rangeValidation.rangeEnd,
    "random"
  );
  const examModeHref = buildModeHref(
    "/exam",
    rangeValidation.rangeStart,
    rangeValidation.rangeEnd,
    "exam"
  );

  return (
    <section className="grid items-stretch gap-5 xl:grid-cols-[1.28fr_0.72fr]">
      <PrimaryActions
        hasActiveQuestionSet={state.activeQuestionSet !== null}
        canUseExamMode={canUseExamModeForQuestionSet(state.activeQuestionSet)}
        isRangeValid={rangeValidation.isValid}
        rangeValidationMessage={rangeValidation.message}
        isReady={state.isReady}
        normalModeHref={normalModeHref}
        randomModeHref={randomModeHref}
        examModeHref={examModeHref}
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
        rangeStartInput={rangeStartInput}
        rangeEndInput={rangeEndInput}
        onChangeRangeStart={setRangeStartInput}
        onChangeRangeEnd={setRangeEndInput}
        isRangeSelectable={rangeValidation.isRangeSelectable}
        rangeValidationMessage={rangeValidation.message}
      />
    </section>
  );
}
