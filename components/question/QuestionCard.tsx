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
    <section className="rounded-[1.5rem] border border-ink/10 bg-white px-4 py-4 shadow-sm sm:rounded-[1.75rem] sm:px-9 sm:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-5">
        <div className="max-w-4xl">
          <span className="inline-flex rounded-full border border-ink/10 bg-mist px-3 py-1 text-xs font-medium text-ink/75 sm:text-sm">
            {questionNumber}
          </span>
          <div className="mt-3 space-y-2.5 text-ink sm:mt-5 sm:space-y-3.5">
            {questionParagraphs.map((paragraph, index) => (
              <p
                key={`${question.id}-paragraph-${index + 1}`}
                className={`whitespace-pre-wrap tracking-tight text-ink ${
                  isExamMode
                    ? "text-[0.98rem] font-medium leading-6.5 sm:text-[1.28rem] sm:leading-8.5"
                    : "text-[1rem] font-semibold leading-6.5 sm:text-[1.35rem] sm:leading-8.5"
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
        <span className="inline-flex w-fit rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white sm:text-xs">
          {question.category}
        </span>
      </div>
    </section>
  );
}
