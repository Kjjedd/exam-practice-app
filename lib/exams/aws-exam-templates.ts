import type { ExamTemplate, ExamTemplateId } from "../types";

export const awsExamTemplates: readonly ExamTemplate[] = [
  {
    id: "aws-saa-c03",
    code: "SAA-C03",
    title: "AWS Certified Solutions Architect - Associate",
    level: "Associate",
    totalQuestionCount: 65,
    scoredQuestionCount: 50,
    unscoredQuestionCount: 15,
    passingScaledScore: 720,
    practicePassingPercentage: 72,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 미응답은 오답 처리됩니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 72% 이상 정답이면 합격으로 표시합니다.",
    responseTypeSummary: "공식 시험은 단일 선택과 다중 선택 문항이 포함될 수 있습니다."
  }
] as const;

export function getAwsExamTemplateById(
  examTemplateId: string | null
): ExamTemplate | null {
  if (examTemplateId === null) {
    return null;
  }

  return awsExamTemplates.find((template) => template.id === examTemplateId) ?? null;
}

export function isAwsExamTemplateId(value: string): value is ExamTemplateId {
  return awsExamTemplates.some((template) => template.id === value);
}
