import { Suspense } from "react";

import { QuizPageContent } from "../../components/question/QuizPageContent";

export default function QuizPage() {
  return (
    <Suspense fallback={null}>
      <QuizPageContent />
    </Suspense>
  );
}
