import questionsSource from "../../data/questions.json";
import type { Question, QuestionId } from "../types";

function validateQuestions(questions: readonly Question[]): readonly Question[] {
  const seenIds = new Set<QuestionId>();

  questions.forEach((question) => {
    if (seenIds.has(question.id)) {
      throw new Error(`Duplicate question id found: ${question.id}`);
    }

    seenIds.add(question.id);

    if (question.choices.length < 2) {
      throw new Error(`Question must have at least two choices: ${question.id}`);
    }

    if (question.answer < 0 || question.answer >= question.choices.length) {
      throw new Error(`Question answer is out of range: ${question.id}`);
    }

    if (question.explanation.trim().length === 0) {
      throw new Error(`Question explanation is required: ${question.id}`);
    }
  });

  return questions;
}

const questions = validateQuestions(questionsSource);

export function loadQuestions(): readonly Question[] {
  return questions;
}

export function getQuestionById(questionId: QuestionId): Question | undefined {
  return questions.find((question) => question.id === questionId);
}
