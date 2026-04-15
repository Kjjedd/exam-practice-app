import type { Question } from "../../lib/types";

type QuestionCardProps = Readonly<{
  question: Question;
  questionNumber: number;
  isExamMode?: boolean;
}>;

function getTextParagraphs(content: string): readonly string[] {
  return content
    .split(/\n\s*\n/g)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

export function QuestionCard({
  question,
  questionNumber,
  isExamMode = false
}: QuestionCardProps) {
  const questionParagraphs = getTextParagraphs(question.question);

  return (
    <section className="rounded-[1.75rem] border border-ink/10 bg-white px-6 py-7 shadow-sm sm:px-9 sm:py-10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-4xl">
          <span className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-sm font-medium text-ink/75">
            Question {questionNumber}
          </span>
          <div className="mt-6 space-y-4 text-ink">
            {questionParagraphs.map((paragraph, index) => (
              <p
                key={`${question.id}-paragraph-${index + 1}`}
                className={`whitespace-pre-wrap tracking-tight text-ink ${
                  isExamMode
                    ? "text-base font-medium leading-8 sm:text-[1.35rem] sm:leading-9"
                    : "text-base font-semibold leading-8 sm:text-[1.45rem] sm:leading-9"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <span className="inline-flex w-fit rounded-full bg-ink px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          {question.category}
        </span>
      </div>
    </section>
  );
}
