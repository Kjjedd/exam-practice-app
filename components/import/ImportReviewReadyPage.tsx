"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  readPdfImportInput,
  readStoredPdfImportDraft,
  type PdfImportDraft
} from "../../lib/import/pdf-import-input";
import { SelectedPdfSummary } from "./SelectedPdfSummary";

type ImportReviewReadyPageState = Readonly<{
  draft: PdfImportDraft | null;
  hasLiveFile: boolean;
  isReady: boolean;
}>;

const INITIAL_IMPORT_REVIEW_READY_PAGE_STATE: ImportReviewReadyPageState = {
  draft: null,
  hasLiveFile: false,
  isReady: false
};

export function ImportReviewReadyPage() {
  const [state, setState] = useState<ImportReviewReadyPageState>(
    INITIAL_IMPORT_REVIEW_READY_PAGE_STATE
  );

  useEffect(() => {
    const liveInput = readPdfImportInput();
    const storedDraft = readStoredPdfImportDraft();

    setState({
      draft: liveInput?.draft ?? storedDraft,
      hasLiveFile: liveInput !== null,
      isReady: true
    });
  }, []);

  if (!state.isReady) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-card mx-auto max-w-4xl rounded-[1.75rem] px-6 py-8 sm:px-8">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--app-text)]">
            검수 단계 준비 상태를 확인하는 중입니다.
          </h1>
        </div>
      </main>
    );
  }

  if (state.draft === null) {
    return (
      <main className="theme-page-shell min-h-screen px-6 py-10 sm:px-10 sm:py-14">
        <div className="theme-card mx-auto max-w-4xl rounded-[1.75rem] px-6 py-8 sm:px-8">
          <span className="inline-flex rounded-full bg-coral/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-coral">
            Import Review
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)]">
            아직 검수할 PDF가 준비되지 않았습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            먼저 PDF를 선택해야 다음 단계 입력 상태를 만들 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/import/"
              className="theme-solid-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              가져오기 화면으로 이동
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
        <section className="theme-card rounded-[1.75rem] px-6 py-8 sm:px-8">
          <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
            Import Review
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[var(--app-text)] sm:text-4xl">
            다음 검수 단계 입력 상태가 준비됐습니다.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            이 브랜치에서는 PDF를 안전하게 받아 검수 단계 직전 상태까지만 준비합니다.
            실제 문항 추출과 편집 UI는 다음 브랜치에서 구현됩니다.
          </p>
        </section>

        <SelectedPdfSummary
          draft={state.draft}
          note={
            state.hasLiveFile
              ? "현재 브라우저 세션에서는 실제 파일 객체도 유지되고 있어, 다음 단계 구현이 이어지면 바로 변환/검수 흐름으로 넘길 수 있습니다."
              : "파일 메타데이터는 남아 있지만 실제 파일 객체는 다시 선택해야 할 수 있습니다. 검수 브랜치 구현 전까지는 이 상태를 준비 완료 표시로 사용합니다."
          }
        />

        <section className="theme-home-overview rounded-[1.75rem] px-6 py-8 sm:px-8">
          <h2 className="text-2xl font-semibold tracking-tight text-[var(--app-text)]">현재 가능한 상태</h2>
          <ul className="mt-5 space-y-4 text-sm leading-6 text-[color:var(--app-text-muted)] sm:text-base">
            <li>PDF 형식과 기본 용량 검증이 끝났습니다.</li>
            <li>다음 단계가 읽을 입력 메타데이터가 준비됐습니다.</li>
            <li>실제 추출/검수 로직은 아직 붙지 않았습니다.</li>
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/import/"
              className="theme-solid-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
            >
              PDF 다시 선택
            </Link>
            <Link
              href="/"
              className="theme-outline-button inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-colors"
            >
              홈으로 이동
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
