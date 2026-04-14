"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { saveQuestionSet } from "../../lib/data";
import { buildConfirmedQuestionSet } from "../../lib/import/build-confirmed-question-set";
import { extractPdfImportCandidates } from "../../lib/import/extract-pdf-import-candidates";
import type {
  ImportedQuestionCandidate,
  ImportStatus,
  ImportValidationSummary
} from "../../lib/import/imported-question-types";
import { normalizePdfImportCandidates } from "../../lib/import/normalize-pdf-import-candidates";
import {
  clearPdfImportInput,
  readPdfImportInput,
  readStoredPdfImportDraft,
  type PdfImportDraft
} from "../../lib/import/pdf-import-input";
import { validateImportedCandidates } from "../../lib/import/validate-imported-candidates";
import { ImportQuestionEditor } from "./ImportQuestionEditor";
import { ImportReviewList } from "./ImportReviewList";
import { ImportValidationSummary as ImportValidationSummaryCard } from "./ImportValidationSummary";
import { SelectedPdfSummary } from "./SelectedPdfSummary";

type ImportReviewPageState = Readonly<{
  importStatus: ImportStatus;
  importErrorMessage: string | null;
  sourceDraft: PdfImportDraft | null;
  hasLiveFile: boolean;
  title: string;
  candidates: readonly ImportedQuestionCandidate[];
  selectedCandidateId: string | null;
  saveMessage: string | null;
}>;

const INITIAL_VALIDATION_SUMMARY: ImportValidationSummary = {
  issues: [],
  validQuestionCount: 0,
  invalidQuestionCount: 0,
  canSave: false
};

const INITIAL_IMPORT_REVIEW_PAGE_STATE: ImportReviewPageState = {
  importStatus: "idle",
  importErrorMessage: null,
  sourceDraft: null,
  hasLiveFile: false,
  title: "",
  candidates: [],
  selectedCandidateId: null,
  saveMessage: null
};

function buildInitialTitle(draft: PdfImportDraft): string {
  return draft.fileName.replace(/\.pdf$/i, "").trim() || "PDF 가져오기 문제 세트";
}

function updateCandidate(
  candidates: readonly ImportedQuestionCandidate[],
  candidateTempId: string,
  updater: (candidate: ImportedQuestionCandidate) => ImportedQuestionCandidate
): readonly ImportedQuestionCandidate[] {
  return candidates.map((candidate) =>
    candidate.tempId === candidateTempId ? updater(candidate) : candidate
  );
}

export function ImportReviewPageContent() {
  const router = useRouter();
  const [state, setState] = useState<ImportReviewPageState>(INITIAL_IMPORT_REVIEW_PAGE_STATE);
  const [isPending, startTransition] = useTransition();
  const [isSaving, startSavingTransition] = useTransition();

  const validationSummary = validateImportedCandidates(state.candidates);
  const selectedCandidate =
    state.candidates.find((candidate) => candidate.tempId === state.selectedCandidateId) ?? null;
  const selectedCandidateIndex =
    selectedCandidate === null
      ? -1
      : state.candidates.findIndex((candidate) => candidate.tempId === selectedCandidate.tempId);

  useEffect(() => {
    const liveInput = readPdfImportInput();
    const storedDraft = readStoredPdfImportDraft();

    if (liveInput === null) {
      setState({
        ...INITIAL_IMPORT_REVIEW_PAGE_STATE,
        importStatus: storedDraft === null ? "idle" : "failed",
        importErrorMessage:
          storedDraft === null
            ? null
            : "현재 브라우저 세션에 실제 PDF 파일이 없어 자동 변환을 시작할 수 없습니다. PDF를 다시 선택해 주세요.",
        sourceDraft: storedDraft,
        hasLiveFile: false,
        title: storedDraft ? buildInitialTitle(storedDraft) : ""
      });
      return;
    }

    setState({
      ...INITIAL_IMPORT_REVIEW_PAGE_STATE,
      importStatus: "parsing",
      sourceDraft: liveInput.draft,
      hasLiveFile: true,
      title: buildInitialTitle(liveInput.draft)
    });

    startTransition(() => {
      void extractPdfImportCandidates(liveInput)
        .then((rawCandidates) => {
          const normalizedCandidates = normalizePdfImportCandidates(rawCandidates);

          setState((currentState) => ({
            ...currentState,
            importStatus: normalizedCandidates.length > 0 ? "ready" : "failed",
            importErrorMessage:
              normalizedCandidates.length > 0
                ? null
                : "PDF에서 검수 가능한 문항 후보를 찾지 못했습니다. 형식이 특수하거나 스캔본일 수 있습니다.",
            candidates: normalizedCandidates,
            selectedCandidateId: normalizedCandidates[0]?.tempId ?? null,
            saveMessage: null
          }));
        })
        .catch(() => {
          setState((currentState) => ({
            ...currentState,
            importStatus: "failed",
            importErrorMessage:
              "PDF를 자동 변환하는 중 문제가 발생했습니다. 파일을 다시 선택하거나 다른 PDF로 시도해 주세요.",
            candidates: [],
            selectedCandidateId: null,
            saveMessage: null
          }));
        });
    });
  }, []);

  function handleTitleChange(value: string): void {
    setState((currentState) => ({
      ...currentState,
      title: value,
      saveMessage: null
    }));
  }

  function handleSelectCandidate(candidateTempId: string): void {
    setState((currentState) => ({
      ...currentState,
      selectedCandidateId: candidateTempId
    }));
  }

  function handleQuestionChange(candidateTempId: string, value: string): void {
    setState((currentState) => ({
      ...currentState,
      candidates: updateCandidate(currentState.candidates, candidateTempId, (candidate) => ({
        ...candidate,
        question: value
      })),
      saveMessage: null
    }));
  }

  function handleChoiceChange(
    candidateTempId: string,
    choiceIndex: number,
    value: string
  ): void {
    setState((currentState) => ({
      ...currentState,
      candidates: updateCandidate(currentState.candidates, candidateTempId, (candidate) => ({
        ...candidate,
        choices: candidate.choices.map((choice, currentChoiceIndex) =>
          currentChoiceIndex === choiceIndex ? value : choice
        )
      })),
      saveMessage: null
    }));
  }

  function handleAddChoice(candidateTempId: string): void {
    setState((currentState) => ({
      ...currentState,
      candidates: updateCandidate(currentState.candidates, candidateTempId, (candidate) => ({
        ...candidate,
        choices: [...candidate.choices, ""]
      })),
      saveMessage: null
    }));
  }

  function handleRemoveChoice(candidateTempId: string, choiceIndex: number): void {
    setState((currentState) => ({
      ...currentState,
      candidates: updateCandidate(currentState.candidates, candidateTempId, (candidate) => {
        if (candidate.choices.length <= 2) {
          return candidate;
        }

        const nextChoices = candidate.choices.filter(
          (_, currentChoiceIndex) => currentChoiceIndex !== choiceIndex
        );
        const nextAnswer =
          candidate.answer === null
            ? null
            : candidate.answer === choiceIndex
              ? null
              : candidate.answer > choiceIndex
                ? candidate.answer - 1
                : candidate.answer;

        return {
          ...candidate,
          choices: nextChoices,
          answer: nextAnswer
        };
      }),
      saveMessage: null
    }));
  }

  function handleAnswerChange(candidateTempId: string, value: number | null): void {
    setState((currentState) => ({
      ...currentState,
      candidates: updateCandidate(currentState.candidates, candidateTempId, (candidate) => ({
        ...candidate,
        answer: value
      })),
      saveMessage: null
    }));
  }

  function handleExplanationChange(candidateTempId: string, value: string): void {
    setState((currentState) => ({
      ...currentState,
      candidates: updateCandidate(currentState.candidates, candidateTempId, (candidate) => ({
        ...candidate,
        explanation: value
      })),
      saveMessage: null
    }));
  }

  function handleSaveQuestionSet(): void {
    const normalizedTitle = state.title.trim();
    const sourceDraft = state.sourceDraft;

    if (normalizedTitle.length === 0) {
      setState((currentState) => ({
        ...currentState,
        saveMessage: "문제 세트 제목을 입력해 주세요."
      }));
      return;
    }

    if (!validationSummary.canSave || sourceDraft === null) {
      setState((currentState) => ({
        ...currentState,
        saveMessage: "아직 저장할 수 없는 문항이 남아 있습니다."
      }));
      return;
    }

    startSavingTransition(() => {
      const confirmedQuestionSet = buildConfirmedQuestionSet({
        title: normalizedTitle,
        sourceFileName: sourceDraft.fileName,
        candidates: state.candidates
      });

      saveQuestionSet({
        title: confirmedQuestionSet.title,
        sourceLabel: confirmedQuestionSet.sourceFileName,
        createdAt: confirmedQuestionSet.importedAt,
        questions: confirmedQuestionSet.questions,
        makeActive: true
      });
      clearPdfImportInput();
      router.push("/");
    });
  }

  if (state.importStatus === "idle" && state.sourceDraft === null) {
    return (
      <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">
            아직 검수할 PDF가 준비되지 않았습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
            먼저 가져오기 화면에서 PDF를 선택해야 자동 변환과 검수 흐름을 시작할 수
            있습니다.
          </p>
          <div className="mt-6">
            <Link
              href="/import"
              className="inline-flex items-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
            >
              PDF 선택 화면으로 이동
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (state.importStatus === "parsing" || isPending) {
    return (
      <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
        <div className="mx-auto max-w-4xl rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
          <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
            Import Review
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
            PDF를 자동으로 문제 후보로 변환하고 있습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
            문항 수가 많은 PDF라면 조금 더 시간이 걸릴 수 있습니다. 변환이 끝나면 바로
            검수 화면으로 이어집니다.
          </p>
        </div>
      </main>
    );
  }

  if (state.importStatus === "failed") {
    return (
      <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
        <div className="mx-auto flex max-w-4xl flex-col gap-6">
          <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
            <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
              Import Review
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
              자동 변환을 진행할 수 없습니다.
            </h1>
            <p className="mt-3 text-sm leading-6 text-ink/70 sm:text-base">
              {state.importErrorMessage ??
                "현재 PDF 입력 상태로는 검수 흐름을 시작할 수 없습니다."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/import"
                className="inline-flex items-center rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-ink/90"
              >
                PDF 다시 선택
              </Link>
              <Link
                href="/"
                className="inline-flex items-center rounded-full border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink/25 hover:bg-white"
              >
                홈으로 이동
              </Link>
            </div>
          </section>
          {state.sourceDraft ? (
            <SelectedPdfSummary
              draft={state.sourceDraft}
              note="현재 브라우저 세션에 실제 파일 객체가 없거나, 자동 변환 결과를 충분히 만들지 못했습니다. 파일을 다시 선택한 뒤 재시도하는 편이 안전합니다."
            />
          ) : null}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
          <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
            Import Review
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            자동 변환된 문항 후보를 검수하고 저장합니다.
          </h1>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-ink/70 sm:text-base">
            앱이 PDF를 자동으로 읽어 문제 후보 JSON 형태로 정리했습니다. 여기서는
            자동 변환 결과를 바로 저장하지 않고, 문제 본문, 선택지, 정답, 해설을
            확인한 뒤 저장 가능한 문제 세트로 확정합니다.
          </p>
        </section>

        {state.sourceDraft ? (
          <SelectedPdfSummary
            draft={state.sourceDraft}
            note="자동 변환은 초안입니다. 저장 전까지는 검수와 수정이 필요합니다."
          />
        ) : null}

        <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8">
          <label className="block">
            <span className="text-sm font-semibold text-ink">문제 세트 제목</span>
            <input
              value={state.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              className="mt-3 w-full rounded-[1.25rem] border border-ink/10 bg-mist px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-coral"
            />
          </label>
        </section>

        <ImportValidationSummaryCard
          summary={validationSummary}
          totalCount={state.candidates.length}
        />

        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <ImportReviewList
            candidates={state.candidates}
            selectedCandidateId={state.selectedCandidateId}
            validationSummary={validationSummary}
            onSelectCandidate={handleSelectCandidate}
          />

          {selectedCandidate ? (
            <ImportQuestionEditor
              candidate={selectedCandidate}
              questionNumber={selectedCandidateIndex + 1}
              validationSummary={validationSummary}
              onQuestionChange={(value) => handleQuestionChange(selectedCandidate.tempId, value)}
              onChoiceChange={(choiceIndex, value) =>
                handleChoiceChange(selectedCandidate.tempId, choiceIndex, value)
              }
              onAddChoice={() => handleAddChoice(selectedCandidate.tempId)}
              onRemoveChoice={(choiceIndex) =>
                handleRemoveChoice(selectedCandidate.tempId, choiceIndex)
              }
              onAnswerChange={(value) => handleAnswerChange(selectedCandidate.tempId, value)}
              onExplanationChange={(value) =>
                handleExplanationChange(selectedCandidate.tempId, value)
              }
            />
          ) : (
            <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-8 shadow-sm sm:px-8">
              <h2 className="text-2xl font-semibold tracking-tight text-ink">
                아직 검수할 문항이 없습니다.
              </h2>
            </section>
          )}
        </div>

        <section className="rounded-[1.75rem] border border-ink/10 bg-ink px-6 py-8 text-white shadow-sm sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight">저장 준비</h2>
          <p className="mt-3 text-sm leading-6 text-white/80 sm:text-base">
            모든 문항이 유효성 검사를 통과하면 현재 문제 세트를 활성 문제 세트로
            저장합니다.
          </p>
          {state.saveMessage ? (
            <p className="mt-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-4 text-sm leading-6 text-white">
              {state.saveMessage}
            </p>
          ) : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/import"
              className="inline-flex items-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-colors hover:border-white/35 hover:bg-white/10"
            >
              PDF 다시 선택
            </Link>
            <button
              type="button"
              onClick={handleSaveQuestionSet}
              disabled={!validationSummary.canSave || isSaving}
              className={`inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
                !validationSummary.canSave || isSaving
                  ? "cursor-not-allowed bg-white/15 text-white/45"
                  : "bg-coral text-white hover:bg-coral/90"
              }`}
            >
              {isSaving ? "저장 중..." : "문제 세트 저장"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
