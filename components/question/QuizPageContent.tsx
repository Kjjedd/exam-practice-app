"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { loadActiveQuestionSet } from "../../lib/data";
import type { QuestionSet } from "../../lib/types";
import { ChoiceList } from "./ChoiceList";
import { EmptyQuestionState } from "./EmptyQuestionState";
import { ProgressIndicator } from "./ProgressIndicator";
import { QuestionCard } from "./QuestionCard";
import { QuizHeader } from "./QuizHeader";

type QuizPageState = Readonly<{
  activeQuestionSet: QuestionSet | null;
  isReady: boolean;
}>;

const INITIAL_QUIZ_PAGE_STATE: QuizPageState = {
  activeQuestionSet: null,
  isReady: false
};

function getModeLabel(mode: string | null): string {
  if (mode === "random") {
    return "Random Mode";
  }

  if (mode === "exam") {
    return "Exam Mode";
  }

  return "Normal Mode";
}

export function QuizPageContent() {
  const [state, setState] = useState<QuizPageState>(INITIAL_QUIZ_PAGE_STATE);
  const searchParams = useSearchParams();
  const modeLabel = getModeLabel(searchParams.get("mode"));

  useEffect(() => {
    setState({
      activeQuestionSet: loadActiveQuestionSet(),
      isReady: true
    });
  }, []);

  const questions = state.activeQuestionSet?.questions ?? [];
  const currentQuestionNumber = 1;
  const currentQuestion = questions[0];

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
            />
            <ProgressIndicator
              currentQuestionNumber={currentQuestionNumber}
              totalQuestions={questions.length}
            />
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentQuestionNumber}
            />
            <ChoiceList choices={currentQuestion.choices} />
          </>
        ) : null}
      </div>
    </main>
  );
}
