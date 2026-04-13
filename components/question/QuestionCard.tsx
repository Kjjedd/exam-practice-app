import type { Question } from "../../lib/types";

type QuestionCardProps = Readonly<{
  question: Question;
  questionNumber: number;
}>;

export function QuestionCard({
  question,
  questionNumber
}: QuestionCardProps) {
  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-6 shadow-sm sm:px-8 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-sm font-medium text-ink/75">
            Question {questionNumber}
          </span>
          <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-tight text-ink sm:text-3xl">
            {question.question}
          </h2>
        </div>
        <span className="inline-flex w-fit rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          {question.category}
        </span>
      </div>
    </section>
  );
}
