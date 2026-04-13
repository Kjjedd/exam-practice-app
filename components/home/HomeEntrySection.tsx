"use client";

import { useEffect, useState } from "react";

import { loadQuestionSetSummaries } from "../../lib/data";
import type { QuestionSetSummary } from "../../lib/types";
import { ActiveQuestionSetSummary } from "./ActiveQuestionSetSummary";
import { PrimaryActions } from "./PrimaryActions";

type HomeEntryState = Readonly<{
  activeQuestionSet: QuestionSetSummary | null;
  isReady: boolean;
}>;

const INITIAL_HOME_ENTRY_STATE: HomeEntryState = {
  activeQuestionSet: null,
  isReady: false
};

export function HomeEntrySection() {
  const [state, setState] = useState<HomeEntryState>(INITIAL_HOME_ENTRY_STATE);

  useEffect(() => {
    const activeQuestionSet =
      loadQuestionSetSummaries().find((summary) => summary.isActive) ?? null;

    setState({
      activeQuestionSet,
      isReady: true
    });
  }, []);

  return (
    <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <PrimaryActions
        hasActiveQuestionSet={state.activeQuestionSet !== null}
        isReady={state.isReady}
      />
      <ActiveQuestionSetSummary
        activeQuestionSet={state.activeQuestionSet}
        isReady={state.isReady}
      />
    </section>
  );
}
