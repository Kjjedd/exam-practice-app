import type { PdfImportDraft } from "../../lib/import/pdf-import-input";

type SelectedPdfSummaryProps = Readonly<{
  draft: PdfImportDraft;
  note?: string;
}>;

function formatFileSize(fileSize: number): string {
  if (fileSize < 1024) {
    return `${fileSize} B`;
  }

  if (fileSize < 1024 * 1024) {
    return `${(fileSize / 1024).toFixed(1)} KB`;
  }

  return `${(fileSize / (1024 * 1024)).toFixed(1)} MB`;
}

export function SelectedPdfSummary({
  draft,
  note
}: SelectedPdfSummaryProps) {
  return (
    <section className="rounded-[1.75rem] border border-tide/20 bg-tide/5 px-6 py-6 shadow-sm sm:px-8">
      <span className="inline-flex rounded-full bg-tide/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-tide">
        Ready
      </span>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-ink">
        검수 단계로 넘길 PDF가 준비됐습니다.
      </h2>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            File Name
          </dt>
          <dd className="mt-2 text-sm leading-7 text-ink sm:text-base">
            {draft.fileName}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            File Size
          </dt>
          <dd className="mt-2 text-sm leading-7 text-ink sm:text-base">
            {formatFileSize(draft.fileSize)}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            File Type
          </dt>
          <dd className="mt-2 text-sm leading-7 text-ink sm:text-base">
            {draft.fileType || "application/pdf"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-semibold uppercase tracking-[0.18em] text-ink/55">
            Selected At
          </dt>
          <dd className="mt-2 text-sm leading-7 text-ink sm:text-base">
            {new Intl.DateTimeFormat("ko-KR", {
              dateStyle: "medium",
              timeStyle: "short"
            }).format(new Date(draft.selectedAt))}
          </dd>
        </div>
      </dl>
      {note ? (
        <p className="mt-5 text-sm leading-6 text-ink/70 sm:text-base">{note}</p>
      ) : null}
    </section>
  );
}
