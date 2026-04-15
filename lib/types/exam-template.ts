export type ExamTemplateId = string;

export type ExamTemplate = Readonly<{
  id: ExamTemplateId;
  code: string;
  title: string;
  level: "Foundational" | "Associate" | "Professional" | "Specialty";
  totalQuestionCount: number;
  scoredQuestionCount: number;
  unscoredQuestionCount: number;
  passingScaledScore: number;
  practicePassingPercentage: number;
  officialScoringSummary: string;
  practiceScoringSummary: string;
  responseTypeSummary: string;
}>;
