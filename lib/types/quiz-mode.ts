export const quizModes = ["normal", "random", "exam", "review"] as const;

export type QuizMode = (typeof quizModes)[number];
