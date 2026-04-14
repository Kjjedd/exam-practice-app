const PDF_MIME_TYPE = "application/pdf";
const MAX_PDF_FILE_SIZE_BYTES = 20 * 1024 * 1024;

export type PdfFileValidationResult =
  | Readonly<{
      isValid: true;
    }>
  | Readonly<{
      isValid: false;
      errorMessage: string;
    }>;

function hasPdfExtension(fileName: string): boolean {
  return fileName.trim().toLowerCase().endsWith(".pdf");
}

function isPdfFile(file: File): boolean {
  return file.type === PDF_MIME_TYPE || hasPdfExtension(file.name);
}

export function getMaxPdfFileSizeBytes(): number {
  return MAX_PDF_FILE_SIZE_BYTES;
}

export function validatePdfFile(file: File | null): PdfFileValidationResult {
  if (file === null) {
    return {
      isValid: false,
      errorMessage: "PDF 파일을 먼저 선택해 주세요."
    };
  }

  if (!isPdfFile(file)) {
    return {
      isValid: false,
      errorMessage: "PDF 형식의 파일만 가져올 수 있습니다."
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      errorMessage: "비어 있는 파일은 가져올 수 없습니다."
    };
  }

  if (file.size > MAX_PDF_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      errorMessage: "파일이 너무 큽니다. 20MB 이하 PDF만 지원합니다."
    };
  }

  return {
    isValid: true
  };
}
