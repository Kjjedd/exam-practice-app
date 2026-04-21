"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { loadActiveQuestionSet } from "../../lib/data";
import { checkAnswer } from "../../lib/quiz/check-answer";
import {
  readWrongQuestionIds,
  removeWrongQuestionId,
  writeWrongQuestionIds
} from "../../lib/storage/wrong-answers";
import type { ChoiceIndex, Question, QuestionId, QuestionResult, QuestionSet } from "../../lib/types";
import { ChoiceList } from "../question/ChoiceList";
import { ExplanationPanel } from "../question/ExplanationPanel";
import { ProgressIndicator } from "../question/ProgressIndicator";
import { QuestionCard } from "../question/QuestionCard";
import { QuizHeader } from "../question/QuizHeader";
import { QuizNavigation } from "../question/QuizNavigation";

type ReviewPageState = Readonly<{
  activeQuestionSet: QuestionSet | null;
  wrongQuestionIds: readonly QuestionId[];
  wrongQuestions: readonly Question[];
  isReady: boolean;
}>;

type ReviewCompletionSummary = Readonly<{
  round: number;
  reviewedCount: number;
  correctedCount: number;
  remainingWrongQuestionIds: readonly QuestionId[];
  remainingWrongQuestions: readonly Question[];
}>;

const INITIAL_REVIEW_PAGE_STATE: ReviewPageState = {
  activeQuestionSet: null,
  wrongQuestionIds: [],
  wrongQuestions: [],
  isReady: false
};

const INITIAL_CURRENT_QUESTION_INDEX = 0;
const INITIAL_SELECTED_CHOICE_INDEXES: readonly ChoiceIndex[] = [];
const INITIAL_SUBMITTED_CHOICE_INDEXES: readonly ChoiceIndex[] = [];
const INITIAL_IS_SUBMITTED = false;
const INITIAL_IS_CORRECT: boolean | null = null;
const INITIAL_IS_EXPLANATION_OPEN = false;
const INITIAL_REVIEW_RESULTS: readonly QuestionResult[] = [];
const INITIAL_REVIEW_COMPLETION_SUMMARY: ReviewCompletionSummary | null = null;
const INITIAL_REVIEW_ROUND = 1;

function resolveWrongQuestions(
  activeQuestionSet: QuestionSet | null,
  wrongQuestionIds: readonly QuestionId[]
): readonly Question[] {
  if (activeQuestionSet === null) {
    return [];
  }

  const questionById = new Map<QuestionId, Question>(
    activeQuestionSet.questions.map((question) => [question.id, question])
  );

  return wrongQuestionIds
    .map((questionId) => questionById.get(questionId))
    .filter((question): question is Question => question !== undefined);
}

function toggleChoiceSelection(
  currentValue: readonly ChoiceIndex[],
  choiceIndex: ChoiceIndex
): readonly ChoiceIndex[] {
  return currentValue.includes(choiceIndex)
    ? currentValue.filter((currentIndex) => currentIndex !== choiceIndex)
    : [...currentValue, choiceIndex].sort((left, right) => left - right);
}

export function ReviewPageContent() {
  const [state, setState] = useState<ReviewPageState>(INITIAL_REVIEW_PAGE_STATE);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    INITIAL_CURRENT_QUESTION_INDEX
  );
  const [selectedChoiceIndexes, setSelectedChoiceIndexes] = useState<
    readonly ChoiceIndex[]
  >(INITIAL_SELECTED_CHOICE_INDEXES);
  const [submittedChoiceIndexes, setSubmittedChoiceIndexes] = useState<
    readonly ChoiceIndex[]
  >(INITIAL_SUBMITTED_CHOICE_INDEXES);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(INITIAL_IS_SUBMITTED);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(INITIAL_IS_CORRECT);
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(
    INITIAL_IS_EXPLANATION_OPEN
  );
  const [reviewResults, setReviewResults] =
    useState<readonly QuestionResult[]>(INITIAL_REVIEW_RESULTS);
  const [reviewCompletionSummary, setReviewCompletionSummary] =
    useState<ReviewCompletionSummary | null>(INITIAL_REVIEW_COMPLETION_SUMMARY);
  const [reviewRound, setReviewRound] = useState<number>(INITIAL_REVIEW_ROUND);
  const router = useRouter();

  useEffect(() => {
    const activeQuestionSet = loadActiveQuestionSet();
    const wrongQuestionIds =
      activeQuestionSet === null ? [] : readWrongQuestionIds(activeQuestionSet.id);
    const wrongQuestions = resolveWrongQuestions(activeQuestionSet, wrongQuestionIds);

    setState({
      activeQuestionSet,
      wrongQuestionIds,
      wrongQuestions,
      isReady: true
    });
  }, []);

  const currentQuestion = state.wrongQuestions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  const isLastQuestion = currentQuestionIndex === state.wrongQuestions.length - 1;
  const canGoPrevious = currentQuestionIndex > 0;
  const canGoNext = isSubmitted && !isLastQuestion;

  useEffect(() => {
    if (currentQuestion === undefined) {
      setSelectedChoiceIndexes(INITIAL_SELECTED_CHOICE_INDEXES);
      setSubmittedChoiceIndexes(INITIAL_SUBMITTED_CHOICE_INDEXES);
      setIsSubmitted(INITIAL_IS_SUBMITTED);
      setIsCorrect(INITIAL_IS_CORRECT);
      setIsExplanationOpen(INITIAL_IS_EXPLANATION_OPEN);
      return;
    }

    const existingResult = reviewResults.find(
      (result) => result.questionId === currentQuestion.id
    );

    if (existingResult === undefined) {
      setSelectedChoiceIndexes(INITIAL_SELECTED_CHOICE_INDEXES);
      setSubmittedChoiceIndexes(INITIAL_SUBMITTED_CHOICE_INDEXES);
      setIsSubmitted(INITIAL_IS_SUBMITTED);
      setIsCorrect(INITIAL_IS_CORRECT);
      setIsExplanationOpen(INITIAL_IS_EXPLANATION_OPEN);
      return;
    }

    setSelectedChoiceIndexes(existingResult.selectedAnswers);
    setSubmittedChoiceIndexes(existingResult.selectedAnswers);
    setIsSubmitted(true);
    setIsCorrect(existingResult.isCorrect);
    setIsExplanationOpen(true);
  }, [currentQuestion?.id, reviewResults]);

  function handleSelectChoice(choiceIndex: ChoiceIndex): void {
    if (currentQuestion === undefined || isSubmitted) {
      return;
    }

    const nextSelectedChoiceIndexes =
      currentQuestion.answers.length > 1
        ? toggleChoiceSelection(selectedChoiceIndexes, choiceIndex)
        : [choiceIndex];

    setSelectedChoiceIndexes(nextSelectedChoiceIndexes);

    if (
      currentQuestion.answers.length > 1 &&
      nextSelectedChoiceIndexes.length < currentQuestion.answers.length
    ) {
      setSubmittedChoiceIndexes(INITIAL_SUBMITTED_CHOICE_INDEXES);
      setIsSubmitted(false);
      setIsCorrect(INITIAL_IS_CORRECT);
      setIsExplanationOpen(false);
      return;
    }

    const nextIsCorrect = checkAnswer(currentQuestion, nextSelectedChoiceIndexes);
    const nextQuestionResult: QuestionResult = {
      questionId: currentQuestion.id,
      selectedAnswers: nextSelectedChoiceIndexes,
      isCorrect: nextIsCorrect,
      submittedAt: new Date().toISOString()
    };

    setSubmittedChoiceIndexes(nextSelectedChoiceIndexes);
    setIsSubmitted(true);
    setIsCorrect(nextIsCorrect);
    setIsExplanationOpen(true);
    setReviewResults((currentValue) => [
      ...currentValue.filter((result) => result.questionId !== currentQuestion.id),
      nextQuestionResult
    ]);
  }

  function handleToggleExplanation(): void {
    if (!isSubmitted) {
      return;
    }

    setIsExplanationOpen((currentValue) => !currentValue);
  }

  function handleProceed(): void {
    if (!isSubmitted || currentQuestion === undefined) {
      return;
    }

    if (isLastQuestion) {
      if (state.activeQuestionSet === null) {
        return;
      }

      const remainingWrongQuestionIds = state.wrongQuestions
        .filter((question) =>
          reviewResults.some(
            (result) => result.questionId === question.id && !result.isCorrect
          )
        )
        .map((question) => question.id);
      const remainingWrongQuestions = resolveWrongQuestions(
        state.activeQuestionSet,
        remainingWrongQuestionIds
      );

      writeWrongQuestionIds(state.activeQuestionSet.id, remainingWrongQuestionIds);
      setState((currentValue) => ({
        ...currentValue,
        wrongQuestionIds: remainingWrongQuestionIds,
        wrongQuestions: remainingWrongQuestions
      }));
      setReviewCompletionSummary({
        round: reviewRound,
        reviewedCount: state.wrongQuestions.length,
        correctedCount: state.wrongQuestions.length - remainingWrongQuestionIds.length,
        remainingWrongQuestionIds,
        remainingWrongQuestions
      });
      return;
    }

    setCurrentQuestionIndex((currentValue) => {
      const nextIndex = currentValue + 1;

      return nextIndex < state.wrongQuestions.length ? nextIndex : currentValue;
    });
  }

  function handleRemoveWrongQuestion(): void {
    if (state.activeQuestionSet === null || currentQuestion === undefined) {
      return;
    }

    const nextWrongQuestionIds = removeWrongQuestionId(
      state.activeQuestionSet.id,
      currentQuestion.id
    );
    const nextWrongQuestions = resolveWrongQuestions(
      state.activeQuestionSet,
      nextWrongQuestionIds
    );

    setState((currentValue) => ({
      ...currentValue,
      wrongQuestionIds: nextWrongQuestionIds,
      wrongQuestions: nextWrongQuestions
    }));
    setReviewResults((currentValue) =>
      currentValue.filter((result) => result.questionId !== currentQuestion.id)
    );
    setCurrentQuestionIndex((currentValue) => {
      if (nextWrongQuestions.length === 0) {
        return INITIAL_CURRENT_QUESTION_INDEX;
      }

      return Math.min(currentValue, nextWrongQuestions.length - 1);
    });
  }

  function handleRetryRemainingWrongQuestions(): void {
    if (reviewCompletionSummary === null) {
      return;
    }

    setState((currentValue) => ({
      ...currentValue,
      wrongQuestionIds: reviewCompletionSummary.remainingWrongQuestionIds,
      wrongQuestions: reviewCompletionSummary.remainingWrongQuestions
    }));
    setCurrentQuestionIndex(INITIAL_CURRENT_QUESTION_INDEX);
    setSelectedChoiceIndexes(INITIAL_SELECTED_CHOICE_INDEXES);
    setSubmittedChoiceIndexes(INITIAL_SUBMITTED_CHOICE_INDEXES);
    setIsSubmitted(INITIAL_IS_SUBMITTED);
    setIsCorrect(INITIAL_IS_CORRECT);
    setIsExplanationOpen(INITIAL_IS_EXPLANATION_OPEN);
    setReviewResults(INITIAL_REVIEW_RESULTS);
    setReviewCompletionSummary(INITIAL_REVIEW_COMPLETION_SUMMARY);
    setReviewRound(reviewCompletionSummary.round + 1);
  }

  if (!state.isReady) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-card mx-auto max-w-4xl rounded-[1.75rem] px-6 py-8 sm:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--app-text)]">
            오답 복습을 준비하는 중입니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            현재 활성 문제 세트에 저장된 오답 목록을 확인한 뒤 복습 화면을 준비합니다.
          </p>
        </div>
      </main>
    );
  }

  if (reviewCompletionSummary !== null) {
    const hasRemainingWrongQuestions =
      reviewCompletionSummary.remainingWrongQuestionIds.length > 0;

    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-home-overview mx-auto max-w-4xl rounded-[1.9rem] px-6 py-8 sm:px-8">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
              hasRemainingWrongQuestions
                ? "bg-coral/12 text-coral"
                : "bg-tide/12 text-tide"
            }`}
          >
            Review Result
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">
            오답 복습 {reviewCompletionSummary.round}차를 마쳤습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            {state.activeQuestionSet?.title ?? "현재 문제 세트"} 기준으로{" "}
            {reviewCompletionSummary.reviewedCount}문제를 다시 풀었고,{" "}
            {reviewCompletionSummary.correctedCount}문제를 정리했습니다.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-ink/10 bg-white/88 px-5 py-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/48">
                Reviewed
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-ink">
                {reviewCompletionSummary.reviewedCount}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-tide/18 bg-tide/8 px-5 py-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-tide/88">
                Corrected
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-tide">
                {reviewCompletionSummary.correctedCount}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-coral/18 bg-coral/8 px-5 py-5 shadow-sm">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-coral/88">
                Remaining Wrong
              </p>
              <p className="mt-3 text-3xl font-semibold tracking-tight text-coral">
                {reviewCompletionSummary.remainingWrongQuestionIds.length}
              </p>
            </div>
          </div>

          {hasRemainingWrongQuestions ? (
            <div className="mt-6 rounded-[1.5rem] border border-coral/16 bg-white/82 px-5 py-5 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-ink">
                남은 오답만 다시 풀 수 있습니다.
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/68 sm:text-base">
                아직 틀린 문제 {reviewCompletionSummary.remainingWrongQuestionIds.length}개가
                남아 있습니다. 같은 세트 안에서 2차 오답 복습을 바로 시작할 수 있습니다.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleRetryRemainingWrongQuestions}
                  className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
                >
                  {reviewCompletionSummary.round + 1}차 오답 풀이 시작
                </button>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-white"
                >
                  홈으로 이동
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 rounded-[1.5rem] border border-tide/16 bg-white/82 px-5 py-5 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-ink">
                이번 오답 복습에서 모두 정답 처리했습니다.
              </h2>
              <p className="mt-3 text-sm leading-6 text-ink/68 sm:text-base">
                남아 있는 오답이 없어서 다음에는 빈 복습 화면이 보이게 됩니다.
                다른 범위를 시작하거나 홈에서 새 학습 흐름으로 이어갈 수 있습니다.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-[1.25rem] border border-ink/10 bg-mist/60 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">
                    Status
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
                    오답 0개
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-ink/10 bg-mist/60 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">
                    Next
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
                    새 범위 시작
                  </p>
                </div>
                <div className="rounded-[1.25rem] border border-ink/10 bg-mist/60 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-ink/45">
                    Action
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
                    홈으로 복귀
                  </p>
                </div>
              </div>
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
                  현재 세트 다시 풀기
                </Link>
                <Link
                  href="/quiz?restart=1"
                  className="inline-flex items-center justify-center rounded-full border border-tide/20 bg-tide/8 px-5 py-3 text-sm font-semibold text-tide transition-colors hover:bg-tide/12"
                >
                  처음부터 다시 시작
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  if (state.activeQuestionSet === null || state.wrongQuestions.length === 0) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-card mx-auto max-w-4xl rounded-[1.75rem] px-6 py-8 sm:px-8">
          <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
            Review
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)]">
            복습할 오답이 아직 없습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            {state.activeQuestionSet?.title ?? "현재 문제 세트"} 기준으로 남아 있는 오답이
            없습니다. 새 오답이 생기면 이곳에서 세트별로 다시 학습할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/result"
              className="theme-solid-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              결과 화면으로 이동
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
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <QuizHeader
          questionSetTitle={`${state.activeQuestionSet.title} · 오답 복습`}
        />
        <section className="theme-card rounded-[1.5rem] border-coral/15 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-[color:var(--app-text-muted)]">
              현재 세트에 남아 있는 오답 {state.wrongQuestionIds.length}개 중{" "}
              {currentQuestionNumber}번째 문제를 복습 중입니다.
            </p>
            <button
              type="button"
              onClick={handleRemoveWrongQuestion}
              className="inline-flex items-center justify-center rounded-full border border-coral/25 px-4 py-2 text-sm font-semibold text-coral transition-colors hover:bg-coral/6"
            >
              이 문제 오답 목록에서 삭제
            </button>
          </div>
        </section>
        <ProgressIndicator
          currentQuestionNumber={currentQuestionNumber}
          totalQuestions={state.wrongQuestions.length}
        />
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionNumber}
        />
        <ChoiceList
          choices={currentQuestion.choices}
          selectedChoiceIndexes={selectedChoiceIndexes}
          submittedChoiceIndexes={submittedChoiceIndexes}
          correctChoiceIndexes={isSubmitted ? currentQuestion.answers : []}
          requiredSelectionCount={currentQuestion.answers.length}
          isSubmitted={isSubmitted}
          onSelectChoice={handleSelectChoice}
        />
        {isSubmitted && isCorrect !== null ? (
          <ExplanationPanel
            explanation={currentQuestion.explanation}
            isCorrect={isCorrect}
            isOpen={isExplanationOpen}
            onToggle={handleToggleExplanation}
          />
        ) : null}
        {isSubmitted ? (
          <QuizNavigation
            isLastQuestion={isLastQuestion}
            onProceed={handleProceed}
            isFreeNavigationEnabled
            canGoPrevious={canGoPrevious}
            canGoNext={canGoNext}
            canFinishSession={isSubmitted}
            onGoPrevious={() =>
              setCurrentQuestionIndex((currentValue) =>
                currentValue > 0 ? currentValue - 1 : currentValue
              )
            }
            onGoNext={() =>
              setCurrentQuestionIndex((currentValue) =>
                currentValue < state.wrongQuestions.length - 1 ? currentValue + 1 : currentValue
              )
            }
            onExitToHome={() => router.push("/")}
          />
        ) : null}
      </div>
    </main>
  );
}
