"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { loadActiveQuestionSet } from "../../lib/data";
import { shuffleQuestionIds } from "../../lib/quiz/shuffle-questions";
import { writeLatestQuizSession } from "../../lib/quiz/session-storage";
import type {
  ChoiceIndex,
  QuestionId,
  QuestionResult,
  QuestionSet,
  QuizMode,
  QuizSession
} from "../../lib/types";
import { checkAnswer } from "../../lib/quiz/check-answer";
import { ChoiceList } from "./ChoiceList";
import { EmptyQuestionState } from "./EmptyQuestionState";
import { ExplanationPanel } from "./ExplanationPanel";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuizNavigation } from "./QuizNavigation";
import { QuestionCard } from "./QuestionCard";
import { QuizHeader } from "./QuizHeader";
import { SubmitBar } from "./SubmitBar";

type QuizPageState = Readonly<{
  activeQuestionSet: QuestionSet | null;
  isReady: boolean;
}>;

const INITIAL_QUIZ_PAGE_STATE: QuizPageState = {
  activeQuestionSet: null,
  isReady: false
};

const INITIAL_SELECTED_CHOICE_INDEX: ChoiceIndex | null = null;
const INITIAL_SUBMITTED_CHOICE_INDEX: ChoiceIndex | null = null;
const INITIAL_IS_SUBMITTED = false;
const INITIAL_IS_CORRECT: boolean | null = null;
const INITIAL_IS_EXPLANATION_OPEN = false;
const INITIAL_CURRENT_QUESTION_INDEX = 0;
const INITIAL_QUESTION_RESULTS: readonly QuestionResult[] = [];
const INITIAL_SESSION_QUESTION_IDS: readonly QuestionId[] = [];

function getQuizMode(mode: string | null): QuizMode {
  if (mode === "random") {
    return "random";
  }

  if (mode === "exam") {
    return "exam";
  }

  return "normal";
}

function getModeLabel(mode: QuizMode): string {
  if (mode === "random") {
    return "Random Mode";
  }

  if (mode === "exam") {
    return "Exam Mode";
  }

  if (mode === "review") {
    return "Review Mode";
  }

  return "Normal Mode";
}

function resolveSessionQuestionIds(
  activeQuestionSet: QuestionSet | null,
  mode: QuizMode
): readonly QuestionId[] {
  if (activeQuestionSet === null) {
    return INITIAL_SESSION_QUESTION_IDS;
  }

  const questionIds = activeQuestionSet.questions.map((question) => question.id);

  return mode === "random" ? shuffleQuestionIds(questionIds) : questionIds;
}

function resolveSessionQuestions(
  activeQuestionSet: QuestionSet | null,
  sessionQuestionIds: readonly QuestionId[]
) {
  if (activeQuestionSet === null) {
    return [];
  }

  const questionById = new Map<QuestionId, QuestionSet["questions"][number]>(
    activeQuestionSet.questions.map((question) => [question.id, question])
  );

  return sessionQuestionIds
    .map((questionId) => questionById.get(questionId))
    .filter((question): question is QuestionSet["questions"][number] => question !== undefined);
}

export function QuizPageContent() {
  const [state, setState] = useState<QuizPageState>(INITIAL_QUIZ_PAGE_STATE);
  const [sessionQuestionIds, setSessionQuestionIds] =
    useState<readonly QuestionId[]>(INITIAL_SESSION_QUESTION_IDS);
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
  const [questionResults, setQuestionResults] =
    useState<readonly QuestionResult[]>(INITIAL_QUESTION_RESULTS);
  const [sessionStartedAt, setSessionStartedAt] = useState<string>(new Date().toISOString());
  const router = useRouter();
  const searchParams = useSearchParams();
  const quizMode = getQuizMode(searchParams.get("mode"));
  const modeLabel = getModeLabel(quizMode);
  const isExamMode = quizMode === "exam";

  useEffect(() => {
    setState({
      activeQuestionSet: loadActiveQuestionSet(),
      isReady: true
    });
  }, []);

  const questions = resolveSessionQuestions(state.activeQuestionSet, sessionQuestionIds);
  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    setSessionQuestionIds(resolveSessionQuestionIds(state.activeQuestionSet, quizMode));
    setCurrentQuestionIndex(INITIAL_CURRENT_QUESTION_INDEX);
    setQuestionResults(INITIAL_QUESTION_RESULTS);
    setSessionStartedAt(new Date().toISOString());
  }, [state.activeQuestionSet, quizMode]);

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
    setQuestionResults((currentValue) => [
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

  function handleProceedToNextStep(): void {
    if (!isSubmitted || currentQuestion === undefined) {
      return;
    }

    if (isLastQuestion) {
      if (state.activeQuestionSet === null) {
        router.push("/result");
        return;
      }

      const completedQuizSession: QuizSession = {
        mode: quizMode,
        questionSetId: state.activeQuestionSet.id,
        questionSetTitle: state.activeQuestionSet.title,
        questionIds: sessionQuestionIds,
        currentQuestionIndex,
        results: questionResults,
        startedAt: sessionStartedAt,
        completedAt: new Date().toISOString()
      };

      writeLatestQuizSession(completedQuizSession);
      router.push("/result");
      return;
    }

    setCurrentQuestionIndex((currentValue) => {
      const nextIndex = currentValue + 1;

      return nextIndex < questions.length ? nextIndex : currentValue;
    });
  }

  return (
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {!state.isReady ? (
          <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
            <h1 className="text-2xl font-semibold tracking-tight text-ink">
              문제 세트를 불러오는 중입니다.
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
              저장된 활성 문제 세트 상태를 확인한 뒤 문제 화면을 준비합니다.
            </p>
          </section>
        ) : null}

        {state.isReady && !currentQuestion ? <EmptyQuestionState /> : null}

        {state.isReady && currentQuestion ? (
          <>
            <QuizHeader
              currentQuestionNumber={currentQuestionNumber}
              totalQuestions={questions.length}
              modeLabel={modeLabel}
              questionSetTitle={state.activeQuestionSet?.title ?? "활성 문제 세트"}
              isExamMode={isExamMode}
            />
            <ProgressIndicator
              currentQuestionNumber={currentQuestionNumber}
              totalQuestions={questions.length}
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
              isExamMode={isExamMode}
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
                onProceed={handleProceedToNextStep}
                isExamMode={isExamMode}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
