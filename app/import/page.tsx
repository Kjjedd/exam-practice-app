import { PdfUploadPanel } from "../../components/import/PdfUploadPanel";

export default function ImportPage() {
  return (
    <main className="min-h-screen bg-mist px-6 py-10 text-ink sm:px-10 sm:py-14">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <PdfUploadPanel />
      </div>
    </main>
  );
}
