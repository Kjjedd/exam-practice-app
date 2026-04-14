import {
  readSessionStorageValue,
  removeSessionStorageValue,
  writeSessionStorageValue
} from "../storage/storage-core";

const PDF_IMPORT_DRAFT_STORAGE_KEY = "exammate.pdf-import-draft.v1";

export type PdfImportDraft = Readonly<{
  fileName: string;
  fileSize: number;
  fileType: string;
  selectedAt: string;
}>;

export type PdfImportInput = Readonly<{
  file: File;
  draft: PdfImportDraft;
}>;

let currentPdfImportInput: PdfImportInput | null = null;

function toDraft(file: File): PdfImportDraft {
  return {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    selectedAt: new Date().toISOString()
  };
}

function parseStoredDraft(rawValue: string): PdfImportDraft | null {
  const parsed = JSON.parse(rawValue) as Partial<PdfImportDraft>;

  if (typeof parsed.fileName !== "string") {
    return null;
  }

  if (typeof parsed.fileSize !== "number") {
    return null;
  }

  if (typeof parsed.fileType !== "string") {
    return null;
  }

  if (typeof parsed.selectedAt !== "string") {
    return null;
  }

  return {
    fileName: parsed.fileName,
    fileSize: parsed.fileSize,
    fileType: parsed.fileType,
    selectedAt: parsed.selectedAt
  };
}

export function setPdfImportInput(file: File): PdfImportInput {
  const draft = toDraft(file);
  const nextInput: PdfImportInput = {
    file,
    draft
  };

  currentPdfImportInput = nextInput;
  writeSessionStorageValue(PDF_IMPORT_DRAFT_STORAGE_KEY, JSON.stringify(draft));

  return nextInput;
}

export function readPdfImportInput(): PdfImportInput | null {
  return currentPdfImportInput;
}

export function readStoredPdfImportDraft(): PdfImportDraft | null {
  const rawValue = readSessionStorageValue(PDF_IMPORT_DRAFT_STORAGE_KEY);

  if (rawValue === null) {
    return null;
  }

  try {
    return parseStoredDraft(rawValue);
  } catch {
    return null;
  }
}

export function clearPdfImportInput(): void {
  currentPdfImportInput = null;
  removeSessionStorageValue(PDF_IMPORT_DRAFT_STORAGE_KEY);
}
