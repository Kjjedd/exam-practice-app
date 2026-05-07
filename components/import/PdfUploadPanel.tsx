"use client";

import Link from "next/link";
import type { ChangeEvent } from "react";
import { useEffect, useRef, useState } from "react";

import {
  getMaxPdfFileSizeBytes,
  validatePdfFile
} from "../../lib/import/file-validation";
import {
  clearPdfImportInput,
  readPdfImportInput,
  readStoredPdfImportDraft,
  setPdfImportInput,
  type PdfImportDraft
} from "../../lib/import/pdf-import-input";
import { SelectedPdfSummary } from "./SelectedPdfSummary";

type PdfUploadPanelState = Readonly<{
  draft: PdfImportDraft | null;
  hasLiveFile: boolean;
  errorMessage: string | null;
}>;

const INITIAL_PDF_UPLOAD_PANEL_STATE: PdfUploadPanelState = {
  draft: null,
  hasLiveFile: false,
  errorMessage: null
};

export function PdfUploadPanel() {
  const [state, setState] = useState<PdfUploadPanelState>(INITIAL_PDF_UPLOAD_PANEL_STATE);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const liveInput = readPdfImportInput();
    const storedDraft = readStoredPdfImportDraft();

    setState({
      draft: liveInput?.draft ?? storedDraft,
      hasLiveFile: liveInput !== null,
      errorMessage: null
    });
  }, []);

  function handleChooseFile(): void {
    fileInputRef.current?.click();
  }

  function handleClear(): void {
    clearPdfImportInput();

    if (fileInputRef.current !== null) {
      fileInputRef.current.value = "";
    }

    setState(INITIAL_PDF_UPLOAD_PANEL_STATE);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const nextFile = event.target.files?.[0] ?? null;
    const validationResult = validatePdfFile(nextFile);

    if (!validationResult.isValid) {
      clearPdfImportInput();
      setState({
        draft: null,
        hasLiveFile: false,
        errorMessage: validationResult.errorMessage
      });
      return;
    }

    if (nextFile === null) {
      return;
    }

    const nextInput = setPdfImportInput(nextFile);

    setState({
      draft: nextInput.draft,
      hasLiveFile: true,
      errorMessage: null
    });
  }

  return (
    <section className="theme-card rounded-[2rem] px-6 py-8 sm:px-8 sm:py-10">
      <span className="theme-subtle-surface inline-flex rounded-full px-3 py-1 text-sm font-medium text-[color:var(--app-text-muted)]">
        Import Flow
      </span>
      <h1 className="mt-5 text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">
        문제 PDF를 가져올 수 있습니다.
      </h1>
      <p className="mt-4 max-w-3xl text-sm leading-7 text-[color:var(--app-text-muted)] sm:text-base">
        지금 단계에서는 PDF를 안전하게 선택하고, 다음 검수 단계가 소비할 입력
        상태를 준비합니다. 아직 문제 추출은 하지 않으며, 유효한 PDF를 고르면
        다음 단계 준비 상태로 넘길 수 있습니다.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="theme-subtle-surface rounded-[1.75rem] border-dashed px-6 py-8">
          <h2 className="text-xl font-semibold tracking-tight text-[var(--app-text)]">
            PDF 선택
          </h2>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            문제와 답이 포함된 PDF 파일만 가져올 수 있습니다. 빈 파일은 지원하지
            않으며, 최대 용량은 {(getMaxPdfFileSizeBytes() / (1024 * 1024)).toFixed(0)}
            MB입니다.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleChooseFile}
              className="theme-solid-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              PDF 선택하기
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="theme-outline-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
            >
              선택 초기화
            </button>
          </div>
          {state.errorMessage ? (
            <p className="mt-5 rounded-2xl border border-coral/20 bg-coral/5 px-4 py-4 text-sm leading-6 text-coral">
              {state.errorMessage}
            </p>
          ) : null}
        </div>

        <aside className="theme-home-overview rounded-[1.75rem] px-6 py-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--app-text)]">이 단계에서 하는 일</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            <li>지원 가능한 PDF인지 먼저 확인합니다.</li>
            <li>유효한 파일이면 다음 검수 단계 입력 상태를 만듭니다.</li>
            <li>아직 문제 추출이나 저장 확정은 하지 않습니다.</li>
            <li>다음 단계에서 변환 결과를 검토하고 수정하게 됩니다.</li>
          </ul>
        </aside>
      </div>

      {state.draft ? (
        <div className="mt-6">
          <SelectedPdfSummary
            draft={state.draft}
            note={
              state.hasLiveFile
                ? "이 PDF는 현재 브라우저 세션에서 다음 검수 단계로 바로 넘길 수 있습니다."
                : "이전 선택 기록은 남아 있지만 실제 파일 객체는 만료되었을 수 있습니다. 다음 단계로 가기 전 다시 선택하는 것이 안전합니다."
            }
          />
        </div>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/"
          className="theme-outline-button inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
        >
          홈으로 돌아가기
        </Link>
        <Link
          href="/import/review/"
          aria-disabled={!state.hasLiveFile}
          className={`inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold transition-colors ${
            state.hasLiveFile
              ? "bg-coral text-white hover:bg-coral/90"
              : "pointer-events-none bg-ink/10 text-ink/40"
          }`}
        >
          다음 단계로 이동
        </Link>
      </div>
    </section>
  );
}
