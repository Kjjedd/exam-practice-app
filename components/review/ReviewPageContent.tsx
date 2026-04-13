"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { loadActiveQuestionSet } from "../../lib/data";
import { getWrongQuestions } from "../../lib/quiz/get-wrong-questions";
import { readLatestQuizSession } from "../../lib/quiz/session-storage";
import { checkAnswer } from "../../lib/quiz/check-answer";
import type { ChoiceIndex, Question, QuestionResult, QuestionSet, QuizSession } from "../../lib/types";
import { ChoiceList } from "../question/ChoiceList";
import { ExplanationPanel } from "../question/ExplanationPanel";
import { ProgressIndicator } from "../question/ProgressIndicator";
import { QuestionCard } from "../question/QuestionCard";
import { QuizHeader } from "../question/QuizHeader";
import { QuizNavigation } from "../question/QuizNavigation";
import { SubmitBar } from "../question/SubmitBar";

type ReviewPageState = Readonly<{
  activeQuestionSet: QuestionSet | null;
  quizSession: QuizSession | null;
  wrongQuestions: readonly Question[];
  isReady: boolean;
}>;

const INITIAL_REVIEW_PAGE_STATE: ReviewPageState = {
  activeQuestionSet: null,
  quizSession: null,
  wrongQuestions: [],
  isReady: false
};

const INITIAL_CURRENT_QUESTION_INDEX = 0;
const INITIAL_SELECTED_CHOICE_INDEX: ChoiceIndex | null = null;
const INITIAL_SUBMITTED_CHOICE_INDEX: ChoiceIndex | null = null;
const INITIAL_IS_SUBMITTED = false;
const INITIAL_IS_CORRECT: boolean | null = null;
const INITIAL_IS_EXPLANATION_OPEN = false;
const INITIAL_REVIEW_RESULTS: readonly QuestionResult[] = [];

function hasCompleteSession(quizSession: QuizSession | null): quizSession is QuizSession {
  return (
    quizSession !== null &&
    quizSession.completedAt !== null &&
    quizSession.questionIds.length > 0 &&
    quizSession.results.length === quizSession.questionIds.length
  );
}

export function ReviewPageContent() {
  const [state, setState] = useState<ReviewPageState>(INITIAL_REVIEW_PAGE_STATE);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    INITIAL_CURRENT_QUESTION_INDEX
  );
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<ChoiceIndex | null>(
    INITIAL_SELECTED_CHOICE_INDEX
  );
  const [submittedChoiceIndex, setSubmittedChoiceIndex] =
    useState<ChoiceIndex | null>(INITIAL_SUBMITTED_CHOICE_INDEX);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(INITIAL_IS_SUBMITTED);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(INITIAL_IS_CORRECT);
  const [isExplanationOpen, setIsExplanationOpen] = useState<boolean>(
    INITIAL_IS_EXPLANATION_OPEN
  );
  const [reviewResults, setReviewResults] =
    useState<readonly QuestionResult[]>(INITIAL_REVIEW_RESULTS);
  const router = useRouter();

  useEffect(() => {
    const activeQuestionSet = loadActiveQuestionSet();
    const quizSession = readLatestQuizSession();
    const wrongQuestions =
      activeQuestionSet !== null && hasCompleteSession(quizSession)
        ? getWrongQuestions(quizSession, activeQuestionSet.questions)
        : [];

    setState({
      activeQuestionSet,
      quizSession,
      wrongQuestions,
      isReady: true
    });
  }, []);

  const currentQuestion = state.wrongQuestions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  const isLastQuestion = currentQuestionIndex === state.wrongQuestions.length - 1;

  useEffect(() => {
    setCurrentQuestionIndex(INITIAL_CURRENT_QUESTION_INDEX);
    setReviewResults(INITIAL_REVIEW_RESULTS);
  }, [state.quizSession?.completedAt]);

  useEffect(() => {
    setSelectedChoiceIndex(INITIAL_SELECTED_CHOICE_INDEX);
    setSubmittedChoiceIndex(INITIAL_SUBMITTED_CHOICE_INDEX);
    setIsSubmitted(INITIAL_IS_SUBMITTED);
    setIsCorrect(INITIAL_IS_CORRECT);
    setIsExplanationOpen(INITIAL_IS_EXPLANATION_OPEN);
  }, [currentQuestion?.id]);

  function handleSelectChoice(choiceIndex: ChoiceIndex): void {
    if (isSubmitted) {
      return;
    }

    setSelectedChoiceIndex(choiceIndex);
  }

  function handleSubmit(): void {
    if (currentQuestion === undefined || selectedChoiceIndex === null || isSubmitted) {
      return;
    }

    const submittedAt = new Date().toISOString();
    const nextIsCorrect = checkAnswer(currentQuestion, selectedChoiceIndex);
    const nextQuestionResult: QuestionResult = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedChoiceIndex,
      isCorrect: nextIsCorrect,
      submittedAt
    };

    setSubmittedChoiceIndex(selectedChoiceIndex);
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
      router.push("/result");
      return;
    }

    setCurrentQuestionIndex((currentValue) => {
      const nextIndex = currentValue + 1;

      return nextIndex < state.wrongQuestions.length ? nextIndex : currentValue;
    });
  }

  if (!state.isReady) {
    return (
      <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            오답 복습을 준비하는 중입니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
            직전 세션 결과와 활성 문제 세트를 확인한 뒤 복습 문제를 구성합니다.
          </p>
        </div>
      </main>
    );
  }

  if (
    state.activeQuestionSet === null ||
    state.quizSession === null ||
    state.wrongQuestions.length === 0
  ) {
    return (
      <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
          <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
            Review
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
            복습할 오답이 아직 없습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
            결과 화면에서 오답이 있는 세션을 마친 뒤 이곳으로 오면, 틀린 문제만
            다시 학습할 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/result"
              className="inline-flex items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
            >
              결과 화면으로 이동
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-white"
            >
              홈으로 이동
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <QuizHeader
          currentQuestionNumber={currentQuestionNumber}
          totalQuestions={state.wrongQuestions.length}
          modeLabel="Review Mode"
          questionSetTitle={`${state.activeQuestionSet.title} · 오답 복습`}
        />
        <ProgressIndicator
          currentQuestionNumber={currentQuestionNumber}
          totalQuestions={state.wrongQuestions.length}
        />
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionNumber}
        />
        <SubmitBar
          canSubmit={selectedChoiceIndex !== null}
          isSubmitted={isSubmitted}
          isCorrect={isCorrect}
          onSubmit={handleSubmit}
        />
        <ChoiceList
          choices={currentQuestion.choices}
          selectedChoiceIndex={selectedChoiceIndex}
          submittedChoiceIndex={submittedChoiceIndex}
          correctChoiceIndex={isSubmitted ? currentQuestion.answer : null}
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
          />
        ) : null}
      </div>
    </main>
  );
}
