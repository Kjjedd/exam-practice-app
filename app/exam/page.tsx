import { Suspense } from "react";

import { ExamSelectionPageContent } from "../../components/exam/ExamSelectionPageContent";

export default function ExamSelectionPage() {
  return (
    <Suspense fallback={null}>
      <ExamSelectionPageContent />
    </Suspense>
  );
}
