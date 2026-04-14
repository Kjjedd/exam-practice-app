import type { PdfImportInput } from "./pdf-import-input";
import type { RawImportedQuestionCandidate } from "./imported-question-types";

const CHOICE_MARKERS = ["①", "②", "③", "④", "⑤", "⑥"];
const CHOICE_LINE_PATTERN = /^\s*(①|②|③|④|⑤|⑥|\(?[1-6]\)|[1-6][.)]|[A-F][.)])\s*/;

function decodePdfLiteralText(literalText: string): string {
  return literalText
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\\(/g, "(")
    .replace(/\\\)/g, ")")
    .replace(/\\\\/g, "\\");
}

function extractLiteralTextSegments(pdfText: string): readonly string[] {
  const segments = pdfText.match(/\((?:\\.|[^\\)])*\)/g);

  if (segments === null) {
    return [];
  }

  return segments
    .map((segment) => decodePdfLiteralText(segment.slice(1, -1)).trim())
    .filter((segment) => segment.length > 0);
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\r/g, "\n").replace(/\u0000/g, " ").replace(/[ \t]+/g, " ");
}

function buildReadablePdfText(pdfBytesText: string): string {
  const literalSegments = extractLiteralTextSegments(pdfBytesText);

  if (literalSegments.length >= 8) {
    return literalSegments.join("\n");
  }

  return normalizeWhitespace(pdfBytesText)
    .replace(/[^0-9A-Za-z가-힣①②③④⑤⑥()\[\].,:;!?/\-_\n ]/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

function splitQuestionBlocks(readableText: string): readonly string[] {
  const preparedText = readableText
    .replace(/\s+(?=(\d+)[.)]\s)/g, "\n")
    .replace(/\s+(?=Q\d+\s)/gi, "\n")
    .trim();

  const blocks = preparedText.match(/(?:^|\n)(?:Q?\d+[.)]?\s+)[\s\S]*?(?=(?:\nQ?\d+[.)]?\s+)|$)/g);

  if (blocks === null) {
    return [];
  }

  return blocks
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
}

function normalizeChoiceLines(block: string): readonly string[] {
  const withChoiceBreaks = CHOICE_MARKERS.reduce(
    (currentBlock, marker) => currentBlock.replaceAll(marker, `\n${marker} `),
    block
  );

  return withChoiceBreaks
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function extractAnswerText(block: string): string | null {
  const match = block.match(/정답\s*[:：]?\s*(①|②|③|④|⑤|⑥|[1-6])/);

  if (match === null) {
    return null;
  }

  return match[1] ?? null;
}

function stripQuestionPrefix(line: string): string {
  return line.replace(/^(Q?\d+[.)]?\s*)/, "").trim();
}

function stripChoicePrefix(line: string): string {
  return line.replace(CHOICE_LINE_PATTERN, "").trim();
}

function splitExplanation(block: string): Readonly<{
  mainContent: string;
  explanation: string;
}> {
  const explanationMatch = block.match(/([\s\S]*?)해설\s*[:：]\s*([\s\S]*)/);

  if (explanationMatch === null) {
    return {
      mainContent: block,
      explanation: ""
    };
  }

  return {
    mainContent: explanationMatch[1]?.trim() ?? block,
    explanation: explanationMatch[2]?.trim() ?? ""
  };
}

function parseQuestionBlock(block: string): RawImportedQuestionCandidate {
  const warnings: string[] = [];
  const answerText = extractAnswerText(block);
  const { mainContent, explanation } = splitExplanation(
    block.replace(/정답\s*[:：]?\s*(①|②|③|④|⑤|⑥|[1-6]).*/g, "").trim()
  );
  const lines = normalizeChoiceLines(mainContent);
  const promptLines: string[] = [];
  const choices: string[] = [];

  lines.forEach((line, lineIndex) => {
    if (CHOICE_LINE_PATTERN.test(line)) {
      choices.push(stripChoicePrefix(line));
      return;
    }

    if (lineIndex === 0) {
      promptLines.push(stripQuestionPrefix(line));
      return;
    }

    if (choices.length === 0) {
      promptLines.push(line);
      return;
    }

    const lastChoiceIndex = choices.length - 1;
    choices[lastChoiceIndex] = `${choices[lastChoiceIndex]} ${line}`.trim();
  });

  if (promptLines.join(" ").trim().length === 0) {
    warnings.push("문제 본문을 자동으로 분리하지 못했습니다.");
  }

  if (choices.length < 2) {
    warnings.push("선택지를 충분히 추출하지 못했습니다.");
  }

  if (answerText === null) {
    warnings.push("정답 표기를 찾지 못했습니다.");
  }

  return {
    prompt: promptLines.join(" ").trim(),
    choices,
    answerText,
    explanation,
    sourceExcerpt: block.slice(0, 240),
    warnings
  };
}

function buildFallbackCandidate(readableText: string): RawImportedQuestionCandidate {
  return {
    prompt: readableText.slice(0, 400).trim(),
    choices: [],
    answerText: null,
    explanation: "",
    sourceExcerpt: readableText.slice(0, 400).trim(),
    warnings: [
      "문항 경계를 자동으로 분리하지 못했습니다.",
      "직접 문항 내용을 보정해야 할 수 있습니다."
    ]
  };
}

export async function extractPdfImportCandidates(
  pdfImportInput: PdfImportInput
): Promise<readonly RawImportedQuestionCandidate[]> {
  const fileBuffer = await pdfImportInput.file.arrayBuffer();
  const pdfBytesText = new TextDecoder("latin1").decode(fileBuffer);
  const readableText = buildReadablePdfText(pdfBytesText);
  const questionBlocks = splitQuestionBlocks(readableText);

  if (questionBlocks.length === 0) {
    const fallbackCandidate = buildFallbackCandidate(readableText);
    return fallbackCandidate.prompt.length > 0 ? [fallbackCandidate] : [];
  }

  return questionBlocks.map((questionBlock) => parseQuestionBlock(questionBlock));
}
