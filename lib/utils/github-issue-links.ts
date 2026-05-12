import type { Question, QuestionSet } from "../types";
import { getQuestionNumber } from "../quiz/question-range";
import { buildStaticRoute } from "./static-routes";

const GITHUB_ISSUE_BASE_URL =
  "https://github.com/Kjjedd/exam-practice-app/issues/new";

type SuggestionKind = "question-error" | "explanation-improvement";

type BuildQuestionSuggestionIssueUrlParams = Readonly<{
  kind: SuggestionKind;
  question: Question;
  questionSet: QuestionSet;
  appOrigin: string | null;
}>;

const MAX_QUESTION_PREVIEW_LENGTH = 160;

function truncateText(value: string, maxLength: number): string {
  const normalizedValue = value.replace(/\n{3,}/g, "\n\n").trim();

  if (normalizedValue.length <= maxLength) {
    return normalizedValue;
  }

  return `${normalizedValue.slice(0, maxLength - 1).trimEnd()}…`;
}

function formatAnswers(question: Question): string {
  if (question.answers.length === 0) {
    return "알 수 없음";
  }

  return question.answers
    .map((answerIndex) => String.fromCharCode(65 + answerIndex))
    .join(", ");
}

function createIssueTitle(
  kind: SuggestionKind,
  questionNumber: number | null
): string {
  const prefix =
    kind === "question-error" ? "[Question Error]" : "[Explanation]";
  const numberLabel = questionNumber === null ? "번호 미상" : `문제 #${questionNumber}`;
  const suffix =
    kind === "question-error" ? "검토 요청" : "해설 보완 제안";

  return `${prefix} ${numberLabel} - ${suffix}`;
}

function createIssueBody({
  kind,
  question,
  questionSet,
  appOrigin
}: BuildQuestionSuggestionIssueUrlParams): string {
  const questionNumber = getQuestionNumber(question);
  const questionTitle = questionNumber === null ? question.id : String(questionNumber);
  const questionPreview = truncateText(question.question, MAX_QUESTION_PREVIEW_LENGTH);
  const appUrl =
    appOrigin === null
      ? "알 수 없음"
      : `${appOrigin}${buildStaticRoute("/quiz", new URLSearchParams({
          questionId: question.id
        }))}`;
  const metadataBlock = [
    "<!-- exammate-meta",
    "version: 1",
    `kind: ${kind}`,
    `questionSetId: ${questionSet.id}`,
    `questionSetTitle: ${questionSet.title}`,
    `questionId: ${question.id}`,
    `questionNumber: ${questionTitle}`,
    `appUrl: ${appUrl}`,
    "-->"
  ].join("\n");

  const sections = [
    metadataBlock,
    "",
    "## 문제 정보",
    `- 문제 세트 ID: ${questionSet.id}`,
    `- 문제 세트 이름: ${questionSet.title}`,
    `- 문제 번호: ${questionTitle}`,
    `- 앱 화면: ${appUrl}`,
    "",
    "## 현재 문제 본문",
    questionPreview,
    "",
    "## 현재 정답",
    `${formatAnswers(question)} (참고용, 자동 변경되지 않음)`,
    "",
    kind === "question-error"
      ? "## 제안 내용\n문제 본문, 보기, 구조 이상 또는 정답 의심 근거를 적어 주세요."
      : "## 제안하는 해설\n현재 해설을 어떻게 보완하면 좋은지 적어 주세요. 이 영역만 수정하면 자동 PR 생성 대상이 됩니다.",
    "",
    "## 근거 / 참고 자료",
    "- 공식 문서, 스크린샷, 예시가 있다면 함께 남겨 주세요.",
    "",
    "## 참고",
    "- 현재 해설 전문은 앱 화면에서 직접 확인해 주세요."
  ];

  return sections.join("\n");
}

export function buildQuestionSuggestionIssueUrl(
  params: BuildQuestionSuggestionIssueUrlParams
): string {
  const questionNumber = getQuestionNumber(params.question);
  const issueUrl = new URL(GITHUB_ISSUE_BASE_URL);

  issueUrl.searchParams.set(
    "template",
    params.kind === "question-error"
      ? "question-error.md"
      : "explanation-improvement.md"
  );
  issueUrl.searchParams.set("title", createIssueTitle(params.kind, questionNumber));
  issueUrl.searchParams.set("body", createIssueBody(params));

  return issueUrl.toString();
}
