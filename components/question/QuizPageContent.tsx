"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { loadActiveQuestionSet } from "../../lib/data";
import { getAwsExamTemplateById } from "../../lib/exams/aws-exam-templates";
import { canUseExamModeForQuestionSet } from "../../lib/exams/exam-mode-availability";
import {
  filterQuestionIdsByNumberRange,
  getQuestionNumberRangeLabel,
  getQuestionSetNumberRange,
  type QuestionNumberRange
} from "../../lib/quiz/question-range";
import { shuffleQuestionIds } from "../../lib/quiz/shuffle-questions";
import {
  clearInProgressQuizSession,
  findInProgressQuizSession,
  writeInProgressQuizSession,
  writeLatestQuizSession
} from "../../lib/quiz/session-storage";
import {
  isFavoriteQuestion,
  readFavoriteQuestionIds,
  toggleFavoriteQuestionId
} from "../../lib/storage/favorites";
import { syncWrongQuestionIdsFromQuizSession } from "../../lib/storage/wrong-answers";
import type {
  ChoiceIndex,
  ExamTemplate,
  InProgressQuizSession,
  Question,
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
import { FavoriteToggle } from "./FavoriteToggle";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuizNavigation } from "./QuizNavigation";
import { QuestionCard } from "./QuestionCard";
import { QuestionContributionActions } from "./QuestionContributionActions";
import { QuizHeader } from "./QuizHeader";

type QuizPageState = Readonly<{
  activeQuestionSet: QuestionSet | null;
  isReady: boolean;
}>;

const INITIAL_QUIZ_PAGE_STATE: QuizPageState = {
  activeQuestionSet: null,
  isReady: false
};

const INITIAL_SELECTED_CHOICE_INDEXES: readonly ChoiceIndex[] = [];
const INITIAL_SUBMITTED_CHOICE_INDEXES: readonly ChoiceIndex[] = [];
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

function resolveSessionQuestionIds(
  activeQuestionSet: QuestionSet | null,
  mode: QuizMode,
  examTemplate: ExamTemplate | null,
  selectedQuestionRange: QuestionNumberRange | null
): readonly QuestionId[] {
  if (activeQuestionSet === null) {
    return INITIAL_SESSION_QUESTION_IDS;
  }

  const questionIds =
    selectedQuestionRange === null
      ? activeQuestionSet.questions.map((question) => question.id)
      : filterQuestionIdsByNumberRange(activeQuestionSet, selectedQuestionRange);

  if (mode === "random") {
    return shuffleQuestionIds(questionIds);
  }

  if (mode === "exam") {
    const shuffledQuestionIds = shuffleQuestionIds(questionIds);

    if (examTemplate === null) {
      return shuffledQuestionIds;
    }

    return shuffledQuestionIds.slice(
      0,
      Math.min(shuffledQuestionIds.length, examTemplate.totalQuestionCount)
    );
  }

  return questionIds;
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

function getQuestionResult(
  questionResults: readonly QuestionResult[],
  questionId: QuestionId | undefined
): QuestionResult | null {
  if (questionId === undefined) {
    return null;
  }

  return questionResults.find((result) => result.questionId === questionId) ?? null;
}

function toggleChoiceSelection(
  currentValue: readonly ChoiceIndex[],
  choiceIndex: ChoiceIndex
): readonly ChoiceIndex[] {
  return currentValue.includes(choiceIndex)
    ? currentValue.filter((currentIndex) => currentIndex !== choiceIndex)
    : [...currentValue, choiceIndex].sort((left, right) => left - right);
}

function createQuestionResult(
  question: Question,
  selectedAnswers: readonly ChoiceIndex[]
): QuestionResult {
  return {
    questionId: question.id,
    selectedAnswers,
    isCorrect: checkAnswer(question, selectedAnswers),
    submittedAt: new Date().toISOString()
  };
}

function isResumableQuizSession(
  activeQuestionSet: QuestionSet,
  quizMode: QuizMode,
  quizSession: InProgressQuizSession | null,
  examTemplateId: string | null,
  selectedQuestionRange: QuestionNumberRange | null
): boolean {
  const expectedRangeStart = selectedQuestionRange?.start ?? null;
  const expectedRangeEnd = selectedQuestionRange?.end ?? null;

  if (quizSession === null) {
    return false;
  }

  if (
    quizSession.mode !== quizMode ||
    quizSession.questionSetId !== activeQuestionSet.id ||
    quizSession.examTemplateId !== examTemplateId ||
    quizSession.questionRangeStart !== expectedRangeStart ||
    quizSession.questionRangeEnd !== expectedRangeEnd
  ) {
    return false;
  }

  if (
    quizSession.questionIds.length === 0 ||
    quizSession.currentQuestionIndex < 0 ||
    quizSession.currentQuestionIndex >= quizSession.questionIds.length
  ) {
    return false;
  }

  const availableQuestionIds = new Set(
    activeQuestionSet.questions.map((question) => question.id)
  );

  return quizSession.questionIds.every((questionId) => availableQuestionIds.has(questionId));
}

function parseRangeValue(value: string | null): number | null {
  if (value === null || !/^\d+$/.test(value)) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isInteger(parsedValue) ? parsedValue : null;
}

export function QuizPageContent() {
  const [state, setState] = useState<QuizPageState>(INITIAL_QUIZ_PAGE_STATE);
  const [sessionQuestionIds, setSessionQuestionIds] =
    useState<readonly QuestionId[]>(INITIAL_SESSION_QUESTION_IDS);
  const [favoriteQuestionIds, setFavoriteQuestionIds] =
    useState<readonly QuestionId[]>(INITIAL_SESSION_QUESTION_IDS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(
    INITIAL_CURRENT_QUESTION_INDEX
  );
  const [selectedChoiceIndexes, setSelectedChoiceIndexes] = useState<
    readonly ChoiceIndex[]
  >(
    INITIAL_SELECTED_CHOICE_INDEXES
  );
  const [submittedChoiceIndexes, setSubmittedChoiceIndexes] = useState<
    readonly ChoiceIndex[]
  >(INITIAL_SUBMITTED_CHOICE_INDEXES);
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
  const entryQuestionId = searchParams.get("questionId");
  const shouldRestartSession = searchParams.get("restart") === "1";
  const quizMode = getQuizMode(searchParams.get("mode"));
  const examTemplate = getAwsExamTemplateById(searchParams.get("exam"));
  const requestedRangeStart = parseRangeValue(searchParams.get("start"));
  const requestedRangeEnd = parseRangeValue(searchParams.get("end"));
  const isExamMode = quizMode === "exam";
  const isFreeNavigationMode = quizMode === "normal" || quizMode === "random";
  const activeQuestionSetRange = useMemo(
    () =>
      state.activeQuestionSet === null ? null : getQuestionSetNumberRange(state.activeQuestionSet),
    [state.activeQuestionSet]
  );
  const selectedQuestionRange = useMemo<QuestionNumberRange | null>(() => {
    if (
      activeQuestionSetRange !== null &&
      requestedRangeStart !== null &&
      requestedRangeEnd !== null &&
      requestedRangeStart >= activeQuestionSetRange.start &&
      requestedRangeEnd <= activeQuestionSetRange.end &&
      requestedRangeStart <= requestedRangeEnd
    ) {
      return { start: requestedRangeStart, end: requestedRangeEnd };
    }
    return activeQuestionSetRange;
  }, [activeQuestionSetRange, requestedRangeStart, requestedRangeEnd]);
  const selectedQuestionRangeLabel = getQuestionNumberRangeLabel(selectedQuestionRange);
  const hasExplicitInvalidRange = useMemo(
    () =>
      state.activeQuestionSet !== null &&
      activeQuestionSetRange !== null &&
      ((requestedRangeStart !== null && requestedRangeEnd === null) ||
        (requestedRangeStart === null && requestedRangeEnd !== null) ||
        (requestedRangeStart !== null &&
          requestedRangeEnd !== null &&
          (requestedRangeStart < activeQuestionSetRange.start ||
            requestedRangeEnd > activeQuestionSetRange.end ||
            requestedRangeStart > requestedRangeEnd))),
    [state.activeQuestionSet, activeQuestionSetRange, requestedRangeStart, requestedRangeEnd]
  );
  const currentSessionMatcher = useMemo(
    () => ({
      mode: quizMode,
      questionSetId: state.activeQuestionSet?.id ?? "",
      questionRangeStart: selectedQuestionRange?.start ?? null,
      questionRangeEnd: selectedQuestionRange?.end ?? null,
      examTemplateId: examTemplate?.id ?? null
    }),
    [quizMode, state.activeQuestionSet?.id, selectedQuestionRange, examTemplate?.id]
  );

  useEffect(() => {
    const activeQuestionSet = loadActiveQuestionSet();

    setState({
      activeQuestionSet,
      isReady: true
    });
    setFavoriteQuestionIds(
      activeQuestionSet === null ? [] : readFavoriteQuestionIds(activeQuestionSet.id)
    );
  }, []);

  useEffect(() => {
    setFavoriteQuestionIds(
      state.activeQuestionSet === null
        ? []
        : readFavoriteQuestionIds(state.activeQuestionSet.id)
    );
  }, [state.activeQuestionSet?.id]);

  const questions = resolveSessionQuestions(state.activeQuestionSet, sessionQuestionIds);
  const currentQuestion = questions[currentQuestionIndex];
  const currentQuestionNumber = currentQuestionIndex + 1;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  function startFreshSession(
    nextQuestionSet: QuestionSet,
    nextMode: QuizMode,
    nextExamTemplate: ExamTemplate | null
  ): void {
    setSessionQuestionIds(
      resolveSessionQuestionIds(
        nextQuestionSet,
        nextMode,
        nextExamTemplate,
        selectedQuestionRange
      )
    );
    setCurrentQuestionIndex(INITIAL_CURRENT_QUESTION_INDEX);
    setQuestionResults(INITIAL_QUESTION_RESULTS);
    setSessionStartedAt(new Date().toISOString());
    setSelectedChoiceIndexes(INITIAL_SELECTED_CHOICE_INDEXES);
    setSubmittedChoiceIndexes(INITIAL_SUBMITTED_CHOICE_INDEXES);
    setIsSubmitted(INITIAL_IS_SUBMITTED);
    setIsCorrect(INITIAL_IS_CORRECT);
    setIsExplanationOpen(INITIAL_IS_EXPLANATION_OPEN);
  }

  useEffect(() => {
    if (!state.isReady) {
      return;
    }

    if (state.activeQuestionSet === null) {
      setSessionQuestionIds(INITIAL_SESSION_QUESTION_IDS);
      setCurrentQuestionIndex(INITIAL_CURRENT_QUESTION_INDEX);
      setQuestionResults(INITIAL_QUESTION_RESULTS);
      return;
    }

    if (quizMode === "exam" && !canUseExamModeForQuestionSet(state.activeQuestionSet)) {
      setSessionQuestionIds(INITIAL_SESSION_QUESTION_IDS);
      setCurrentQuestionIndex(INITIAL_CURRENT_QUESTION_INDEX);
      setQuestionResults(INITIAL_QUESTION_RESULTS);
      return;
    }

    if (quizMode === "exam" && examTemplate === null) {
      setSessionQuestionIds(INITIAL_SESSION_QUESTION_IDS);
      setCurrentQuestionIndex(INITIAL_CURRENT_QUESTION_INDEX);
      setQuestionResults(INITIAL_QUESTION_RESULTS);
      return;
    }

    if (hasExplicitInvalidRange) {
      setSessionQuestionIds(INITIAL_SESSION_QUESTION_IDS);
      setCurrentQuestionIndex(INITIAL_CURRENT_QUESTION_INDEX);
      setQuestionResults(INITIAL_QUESTION_RESULTS);
      return;
    }

    if (shouldRestartSession) {
      clearInProgressQuizSession(currentSessionMatcher);
      startFreshSession(state.activeQuestionSet, quizMode, examTemplate);
      return;
    }

    const nextSessionQuestionIds = resolveSessionQuestionIds(
      state.activeQuestionSet,
      quizMode,
      examTemplate,
      selectedQuestionRange
    );

    if (
      quizMode === "exam" &&
      examTemplate !== null &&
      nextSessionQuestionIds.length < examTemplate.totalQuestionCount
    ) {
      setSessionQuestionIds(INITIAL_SESSION_QUESTION_IDS);
      setCurrentQuestionIndex(INITIAL_CURRENT_QUESTION_INDEX);
      setQuestionResults(INITIAL_QUESTION_RESULTS);
      return;
    }

    if (entryQuestionId !== null) {
      const entryQuestionIndex = nextSessionQuestionIds.indexOf(entryQuestionId);

      setSessionQuestionIds(nextSessionQuestionIds);
      setCurrentQuestionIndex(
        entryQuestionIndex >= 0 ? entryQuestionIndex : INITIAL_CURRENT_QUESTION_INDEX
      );
      setQuestionResults(INITIAL_QUESTION_RESULTS);
      setSessionStartedAt(new Date().toISOString());
      return;
    }

    const inProgressQuizSession = findInProgressQuizSession(currentSessionMatcher);

    const resumableQuizSession =
      state.activeQuestionSet !== null &&
      isResumableQuizSession(
        state.activeQuestionSet,
        quizMode,
        inProgressQuizSession,
        examTemplate?.id ?? null,
        selectedQuestionRange
      )
        ? inProgressQuizSession
        : null;

    if (resumableQuizSession !== null) {
      setSessionQuestionIds(resumableQuizSession.questionIds);
      setCurrentQuestionIndex(resumableQuizSession.currentQuestionIndex);
      setQuestionResults(resumableQuizSession.results);
      setSessionStartedAt(resumableQuizSession.startedAt);
      return;
    }

    setSessionQuestionIds(nextSessionQuestionIds);
    setCurrentQuestionIndex(INITIAL_CURRENT_QUESTION_INDEX);
    setQuestionResults(INITIAL_QUESTION_RESULTS);
    setSessionStartedAt(new Date().toISOString());
  }, [
    entryQuestionId,
    currentSessionMatcher.examTemplateId,
    currentSessionMatcher.mode,
    currentSessionMatcher.questionRangeEnd,
    currentSessionMatcher.questionRangeStart,
    currentSessionMatcher.questionSetId,
    hasExplicitInvalidRange,
    shouldRestartSession,
    state.isReady
  ]);

  useEffect(() => {
    const currentQuestionResult = getQuestionResult(questionResults, currentQuestion?.id);

    if (currentQuestionResult !== null) {
      setSelectedChoiceIndexes(currentQuestionResult.selectedAnswers);
      setSubmittedChoiceIndexes(currentQuestionResult.selectedAnswers);
      setIsSubmitted(true);
      setIsCorrect(isExamMode ? null : currentQuestionResult.isCorrect);
      setIsExplanationOpen(false);
      return;
    }

    setSelectedChoiceIndexes(INITIAL_SELECTED_CHOICE_INDEXES);
    setSubmittedChoiceIndexes(INITIAL_SUBMITTED_CHOICE_INDEXES);
    setIsSubmitted(INITIAL_IS_SUBMITTED);
    setIsCorrect(INITIAL_IS_CORRECT);
    setIsExplanationOpen(INITIAL_IS_EXPLANATION_OPEN);
  }, [currentQuestion?.id, isExamMode, questionResults]);

  function handleSelectChoice(choiceIndex: ChoiceIndex): void {
    if (currentQuestion === undefined || (isSubmitted && !isExamMode)) {
      return;
    }

    const nextSelectedChoiceIndexes =
      currentQuestion.answers.length > 1 || isExamMode
        ? toggleChoiceSelection(selectedChoiceIndexes, choiceIndex)
        : [choiceIndex];

    if (isExamMode) {
      setSelectedChoiceIndexes(nextSelectedChoiceIndexes);
      setSubmittedChoiceIndexes(nextSelectedChoiceIndexes);
      setIsSubmitted(nextSelectedChoiceIndexes.length > 0);
      setIsCorrect(INITIAL_IS_CORRECT);
      setIsExplanationOpen(false);
      setQuestionResults((currentValue) => {
        const filteredResults = currentValue.filter(
          (result) => result.questionId !== currentQuestion.id
        );

        if (nextSelectedChoiceIndexes.length === 0) {
          return filteredResults;
        }

        return [...filteredResults, createQuestionResult(currentQuestion, nextSelectedChoiceIndexes)];
      });
      return;
    }

    if (currentQuestion.answers.length > 1) {
      setSelectedChoiceIndexes(nextSelectedChoiceIndexes);

      if (nextSelectedChoiceIndexes.length < currentQuestion.answers.length) {
        setSubmittedChoiceIndexes(INITIAL_SUBMITTED_CHOICE_INDEXES);
        setIsSubmitted(false);
        setIsCorrect(INITIAL_IS_CORRECT);
        setIsExplanationOpen(false);
        return;
      }

      const nextQuestionResult = createQuestionResult(
        currentQuestion,
        nextSelectedChoiceIndexes
      );

      setSubmittedChoiceIndexes(nextSelectedChoiceIndexes);
      setIsSubmitted(true);
      setIsCorrect(nextQuestionResult.isCorrect);
      setIsExplanationOpen(true);
      setQuestionResults((currentValue) => [
        ...currentValue.filter((result) => result.questionId !== currentQuestion.id),
        nextQuestionResult
      ]);
      return;
    }

    const nextQuestionResult = createQuestionResult(currentQuestion, nextSelectedChoiceIndexes);

    setSelectedChoiceIndexes(nextSelectedChoiceIndexes);
    setSubmittedChoiceIndexes(nextSelectedChoiceIndexes);
    setIsSubmitted(true);
    setIsCorrect(nextQuestionResult.isCorrect);
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

  function handleToggleFavorite(): void {
    if (currentQuestion === undefined || state.activeQuestionSet === null) {
      return;
    }

    setFavoriteQuestionIds(
      toggleFavoriteQuestionId(state.activeQuestionSet.id, currentQuestion.id)
    );
  }

  function handleProceedToNextStep(): void {
    if (!isSubmitted || currentQuestion === undefined) {
      return;
    }

    if (isLastQuestion) {
      if (state.activeQuestionSet === null) {
        router.push("/result/");
        return;
      }

      const completedQuizSession: QuizSession = {
        mode: quizMode,
        questionSetId: state.activeQuestionSet.id,
        questionSetTitle: state.activeQuestionSet.title,
        questionRangeStart: selectedQuestionRange?.start ?? null,
        questionRangeEnd: selectedQuestionRange?.end ?? null,
        examTemplateId: examTemplate?.id ?? null,
        examTemplateTitle: examTemplate?.title ?? null,
        questionIds: sessionQuestionIds,
        currentQuestionIndex,
        results: questionResults,
        startedAt: sessionStartedAt,
        completedAt: new Date().toISOString()
      };

      clearInProgressQuizSession(currentSessionMatcher);
      writeLatestQuizSession(completedQuizSession);
      syncWrongQuestionIdsFromQuizSession(completedQuizSession);
      router.push("/result/");
      return;
    }

    setCurrentQuestionIndex((currentValue) => {
      const nextIndex = currentValue + 1;

      return nextIndex < questions.length ? nextIndex : currentValue;
    });
  }

  function handleGoToPreviousQuestion(): void {
    if (!isFreeNavigationMode) {
      return;
    }

    setCurrentQuestionIndex((currentValue) => {
      const previousIndex = currentValue - 1;

      return previousIndex >= 0 ? previousIndex : currentValue;
    });
  }

  function handleGoToNextQuestion(): void {
    if (!isFreeNavigationMode) {
      return;
    }

    setCurrentQuestionIndex((currentValue) => {
      const nextIndex = currentValue + 1;

      return nextIndex < questions.length ? nextIndex : currentValue;
    });
  }

  function handleExitToHome(): void {
    if (state.activeQuestionSet !== null && sessionQuestionIds.length > 0) {
      writeInProgressQuizSession({
        mode: quizMode,
        questionSetId: state.activeQuestionSet.id,
        questionSetTitle: state.activeQuestionSet.title,
        questionRangeStart: selectedQuestionRange?.start ?? null,
        questionRangeEnd: selectedQuestionRange?.end ?? null,
        examTemplateId: examTemplate?.id ?? null,
        examTemplateTitle: examTemplate?.title ?? null,
        questionIds: sessionQuestionIds,
        currentQuestionIndex,
        results: questionResults,
        startedAt: sessionStartedAt,
        savedAt: new Date().toISOString()
      });
    }

    router.push("/");
  }

  function handleRestartSession(): void {
    if (state.activeQuestionSet === null) {
      return;
    }

    clearInProgressQuizSession(currentSessionMatcher);
    startFreshSession(state.activeQuestionSet, quizMode, examTemplate);
  }

  return (
    <main className="theme-page-shell min-h-screen px-3 py-4 sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:gap-6">
        {!state.isReady ? (
          <section className="theme-card rounded-[1.5rem] px-4 py-5 sm:rounded-[1.75rem] sm:px-8 sm:py-8">
            <h1 className="text-xl font-semibold tracking-tight text-[var(--app-text)] sm:text-2xl">
              불러오는 중입니다.
            </h1>
          </section>
        ) : null}

        {state.isReady && !currentQuestion ? (
          <EmptyQuestionState
            title={
              isExamMode && examTemplate === null
                ? "시험 템플릿을 먼저 선택하세요."
                : hasExplicitInvalidRange
                  ? "선택한 문제 범위를 확인해 주세요."
                : undefined
            }
            description={
              isExamMode && !canUseExamModeForQuestionSet(state.activeQuestionSet)
                ? "시험 모드는 지원되는 AWS SAA 기본 세트에서만 사용할 수 있습니다. 업로드한 PDF 세트는 일반 문제풀이와 랜덤 모드만 지원합니다."
                : isExamMode && examTemplate === null
                ? "시험 모드는 지원되는 실제 시험 템플릿을 고른 뒤 시작할 수 있습니다."
                : hasExplicitInvalidRange
                  ? "선택한 범위가 현재 세트의 유효 범위를 벗어났습니다. 홈에서 범위를 다시 지정해 주세요."
                  : isExamMode &&
                      examTemplate !== null &&
                      sessionQuestionIds.length < examTemplate.totalQuestionCount
                    ? "선택한 범위 안의 문제 수가 시험 템플릿 요구 문항 수보다 적습니다. 홈에서 더 넓은 범위를 지정해 주세요."
                    : hasExplicitInvalidRange
                      ? "홈 화면에서 현재 활성 세트에 맞는 시작 번호와 끝 번호를 다시 지정한 뒤 시작해 주세요."
                : undefined
            }
            primaryHref={
              isExamMode && !canUseExamModeForQuestionSet(state.activeQuestionSet)
                ? "/quiz"
                : isExamMode
                  ? "/exam"
                  : "/import"
            }
            primaryLabel={
              isExamMode && !canUseExamModeForQuestionSet(state.activeQuestionSet)
                ? "일반 문제풀이로 이동"
                : isExamMode
                  ? "시험 선택하기"
                  : "PDF 가져오기"
            }
          />
        ) : null}

        {state.isReady && currentQuestion ? (
          <>
            <QuizHeader
              questionSetTitle={state.activeQuestionSet?.title ?? "활성 문제 세트"}
              questionRangeLabel={selectedQuestionRangeLabel}
              onExitToHome={handleExitToHome}
              onRestartSession={handleRestartSession}
            />
            <ProgressIndicator
              currentQuestionNumber={currentQuestionNumber}
              totalQuestions={questions.length}
            />
            <div className="flex justify-end">
              <FavoriteToggle
                isFavorite={
                  currentQuestion !== undefined &&
                  isFavoriteQuestion(favoriteQuestionIds, currentQuestion.id)
                }
                onToggle={handleToggleFavorite}
              />
            </div>
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionNumber}
              isExamMode={isExamMode}
            />
            <ChoiceList
              choices={currentQuestion.choices}
              selectedChoiceIndexes={selectedChoiceIndexes}
              submittedChoiceIndexes={submittedChoiceIndexes}
              correctChoiceIndexes={!isExamMode && isSubmitted ? currentQuestion.answers : []}
              requiredSelectionCount={currentQuestion.answers.length}
              isSubmitted={isSubmitted}
              isExamMode={isExamMode}
              onSelectChoice={handleSelectChoice}
            />
            {!isExamMode && isSubmitted && isCorrect !== null ? (
              <ExplanationPanel
                explanation={currentQuestion.explanation}
                isCorrect={isCorrect}
                isOpen={isExplanationOpen}
                onToggle={handleToggleExplanation}
              />
            ) : null}
            {!isExamMode && isSubmitted && state.activeQuestionSet !== null ? (
              <QuestionContributionActions
                question={currentQuestion}
                questionSet={state.activeQuestionSet}
              />
            ) : null}
            {isFreeNavigationMode || isSubmitted ? (
              <QuizNavigation
                isLastQuestion={isLastQuestion}
                onProceed={handleProceedToNextStep}
                isExamMode={isExamMode}
                onExitToHome={handleExitToHome}
                isFreeNavigationEnabled={isFreeNavigationMode}
                canGoPrevious={currentQuestionIndex > 0}
                canGoNext={!isLastQuestion}
                canFinishSession={isLastQuestion && isSubmitted}
                onGoPrevious={handleGoToPreviousQuestion}
                onGoNext={handleGoToNextQuestion}
              />
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
