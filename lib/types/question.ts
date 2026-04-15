export type QuestionId = string;
export type QuestionChoice = string;
export type ChoiceIndex = number;
export type QuestionCategory = string;

export type Question = Readonly<{
  id: QuestionId;
  question: string;
  choices: readonly QuestionChoice[];
  answers: readonly ChoiceIndex[];
  explanation: string;
  category: QuestionCategory;
}>;
