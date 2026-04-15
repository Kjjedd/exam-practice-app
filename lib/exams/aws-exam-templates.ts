import type { ExamTemplate, ExamTemplateId } from "../types";

export const awsExamTemplates: readonly ExamTemplate[] = [
  {
    id: "aws-clf-c02",
    code: "CLF-C02",
    title: "AWS Certified Cloud Practitioner",
    level: "Foundational",
    totalQuestionCount: 65,
    scoredQuestionCount: 50,
    unscoredQuestionCount: 15,
    passingScaledScore: 700,
    practicePassingPercentage: 70,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 AWS가 pass/fail을 판정합니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 70% 이상 정답이면 합격으로 표시합니다.",
    responseTypeSummary: "공식 시험은 단일 선택과 다중 선택 문항이 포함될 수 있습니다."
  },
  {
    id: "aws-aif-c01",
    code: "AIF-C01",
    title: "AWS Certified AI Practitioner",
    level: "Foundational",
    totalQuestionCount: 65,
    scoredQuestionCount: 50,
    unscoredQuestionCount: 15,
    passingScaledScore: 700,
    practicePassingPercentage: 70,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 AWS가 pass/fail을 판정합니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 70% 이상 정답이면 합격으로 표시합니다.",
    responseTypeSummary: "공식 시험은 단일 선택과 다중 선택 문항이 포함될 수 있습니다."
  },
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
  },
  {
    id: "aws-dva-c02",
    code: "DVA-C02",
    title: "AWS Certified Developer - Associate",
    level: "Associate",
    totalQuestionCount: 65,
    scoredQuestionCount: 50,
    unscoredQuestionCount: 15,
    passingScaledScore: 720,
    practicePassingPercentage: 72,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 미응답은 오답 처리됩니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 72% 이상 정답이면 합격으로 표시합니다.",
    responseTypeSummary: "공식 시험은 단일 선택과 다중 선택 문항이 포함될 수 있습니다."
  },
  {
    id: "aws-soa-c03",
    code: "SOA-C03",
    title: "AWS Certified CloudOps Engineer - Associate",
    level: "Associate",
    totalQuestionCount: 65,
    scoredQuestionCount: 50,
    unscoredQuestionCount: 15,
    passingScaledScore: 720,
    practicePassingPercentage: 72,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 미응답은 오답 처리됩니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 72% 이상 정답이면 합격으로 표시합니다.",
    responseTypeSummary: "공식 시험은 단일 선택과 다중 선택 문항이 포함될 수 있습니다."
  },
  {
    id: "aws-dea-c01",
    code: "DEA-C01",
    title: "AWS Certified Data Engineer - Associate",
    level: "Associate",
    totalQuestionCount: 65,
    scoredQuestionCount: 50,
    unscoredQuestionCount: 15,
    passingScaledScore: 720,
    practicePassingPercentage: 72,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 미응답은 오답 처리됩니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 72% 이상 정답이면 합격으로 표시합니다.",
    responseTypeSummary: "공식 시험은 단일 선택과 다중 선택 문항이 포함될 수 있습니다."
  },
  {
    id: "aws-mla-c01",
    code: "MLA-C01",
    title: "AWS Certified Machine Learning Engineer - Associate",
    level: "Associate",
    totalQuestionCount: 65,
    scoredQuestionCount: 50,
    unscoredQuestionCount: 15,
    passingScaledScore: 720,
    practicePassingPercentage: 72,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 미응답은 오답 처리됩니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 72% 이상 정답이면 합격으로 표시합니다.",
    responseTypeSummary: "공식 시험은 단일 선택과 다중 선택 문항이 포함될 수 있습니다."
  },
  {
    id: "aws-sap-c02",
    code: "SAP-C02",
    title: "AWS Certified Solutions Architect - Professional",
    level: "Professional",
    totalQuestionCount: 75,
    scoredQuestionCount: 65,
    unscoredQuestionCount: 10,
    passingScaledScore: 750,
    practicePassingPercentage: 75,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 compensatory scoring을 사용합니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 75% 이상 정답이면 합격으로 표시합니다.",
    responseTypeSummary: "공식 시험은 단일 선택과 다중 선택 문항이 포함될 수 있습니다."
  },
  {
    id: "aws-dop-c02",
    code: "DOP-C02",
    title: "AWS Certified DevOps Engineer - Professional",
    level: "Professional",
    totalQuestionCount: 75,
    scoredQuestionCount: 65,
    unscoredQuestionCount: 10,
    passingScaledScore: 750,
    practicePassingPercentage: 75,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 compensatory scoring을 사용합니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 75% 이상 정답이면 합격으로 표시합니다.",
    responseTypeSummary: "공식 시험은 단일 선택과 다중 선택 문항이 포함될 수 있습니다."
  },
  {
    id: "aws-ans-c01",
    code: "ANS-C01",
    title: "AWS Certified Advanced Networking - Specialty",
    level: "Specialty",
    totalQuestionCount: 65,
    scoredQuestionCount: 50,
    unscoredQuestionCount: 15,
    passingScaledScore: 700,
    practicePassingPercentage: 70,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 compensatory scoring을 사용합니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 70% 이상 정답이면 합격으로 표시합니다.",
    responseTypeSummary: "공식 시험은 단일 선택과 다중 선택 문항이 포함될 수 있습니다."
  },
  {
    id: "aws-scs-c03",
    code: "SCS-C03",
    title: "AWS Certified Security - Specialty",
    level: "Specialty",
    totalQuestionCount: 65,
    scoredQuestionCount: 50,
    unscoredQuestionCount: 15,
    passingScaledScore: 750,
    practicePassingPercentage: 75,
    officialScoringSummary: "공식 점수는 scaled score 100-1000 기준이며 compensatory scoring을 사용합니다.",
    practiceScoringSummary: "앱에서는 연습용 기준으로 75% 이상 정답이면 합격으로 표시합니다.",
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
