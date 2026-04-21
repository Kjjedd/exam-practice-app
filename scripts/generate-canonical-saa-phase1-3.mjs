import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const PROJECT_ROOT = "/Users/jongeon/Desktop/Study/exam-practice-app";
const DEFAULT_SET_PATH = resolve(PROJECT_ROOT, "data/default-question-set.json");
const PLUS_SET_PATH = resolve(PROJECT_ROOT, "data/default-question-set-saa-600-plus.json");
const REPORT_PATH = resolve(PROJECT_ROOT, "data/canonical-saa-phase1-3-report.json");
const CANONICAL_SET_PATH = resolve(
  PROJECT_ROOT,
  "data/default-question-set-canonical-base-1-725.json"
);

const BASE_RANGE_START = 1;
const BASE_RANGE_END = 725;
const OVERLAP_RANGE_START = 600;
const OVERLAP_RANGE_END = 725;
const GENERATED_AT = "2026-04-21T00:00:00.000Z";

function readJson(pathname) {
  return JSON.parse(readFileSync(pathname, "utf8"));
}

function extractQuestionNumber(questionId) {
  const matched = String(questionId).match(/(\d+)(?!.*\d)/);
  return matched === null ? null : Number(matched[1]);
}

function normalizeText(value) {
  return String(value)
    .replace(/```[a-zA-Z0-9_-]*\n?/g, "``` ")
    .replace(/```/g, " ")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function normalizeChoices(choices) {
  return choices.map((choice) => normalizeText(choice));
}

function arraysEqual(left, right) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function createQuestionMap(questionSet) {
  return new Map(
    questionSet.questions
      .map((question) => [extractQuestionNumber(question.id), question])
      .filter(([questionNumber]) => questionNumber !== null)
  );
}

function compareOverlapEntry(questionNumber, defaultQuestion, plusQuestion) {
  if (defaultQuestion === undefined) {
    return {
      questionNumber,
      status: "missing_in_default",
      defaultQuestionId: null,
      plusQuestionId: plusQuestion.id,
      sameNormalizedQuestion: false,
      sameNormalizedChoices: false,
      sameAnswers: false,
      defaultAnswers: [],
      plusAnswers: [...plusQuestion.answers]
    };
  }

  if (plusQuestion === undefined) {
    return {
      questionNumber,
      status: "missing_in_600_plus",
      defaultQuestionId: defaultQuestion.id,
      plusQuestionId: null,
      sameNormalizedQuestion: false,
      sameNormalizedChoices: false,
      sameAnswers: false,
      defaultAnswers: [...defaultQuestion.answers],
      plusAnswers: []
    };
  }

  const sameNormalizedQuestion =
    normalizeText(defaultQuestion.question) === normalizeText(plusQuestion.question);
  const sameNormalizedChoices = arraysEqual(
    normalizeChoices(defaultQuestion.choices),
    normalizeChoices(plusQuestion.choices)
  );
  const sameAnswers = arraysEqual(defaultQuestion.answers, plusQuestion.answers);
  const exactMatch =
    defaultQuestion.question === plusQuestion.question &&
    arraysEqual(defaultQuestion.choices, plusQuestion.choices) &&
    sameAnswers &&
    defaultQuestion.explanation === plusQuestion.explanation;

  let status = "question_mismatch_same_number";

  if (exactMatch) {
    status = "match_exact";
  } else if (sameNormalizedQuestion && sameNormalizedChoices && sameAnswers) {
    status = "match_text_variant_same_answer";
  } else if (sameNormalizedQuestion && sameNormalizedChoices && !sameAnswers) {
    status = "match_text_variant_different_answer";
  }

  return {
    questionNumber,
    status,
    defaultQuestionId: defaultQuestion.id,
    plusQuestionId: plusQuestion.id,
    sameNormalizedQuestion,
    sameNormalizedChoices,
    sameAnswers,
    defaultAnswers: [...defaultQuestion.answers],
    plusAnswers: [...plusQuestion.answers]
  };
}

function createPhaseOneSummary(defaultQuestionMap, plusQuestionMap) {
  const defaultPresentNumbers = [];
  const defaultMissingNumbersWithin1To725 = [];
  const candidateBackfillNumbers = [];
  const unresolvedMissingNumbers = [];

  for (let questionNumber = BASE_RANGE_START; questionNumber <= BASE_RANGE_END; questionNumber += 1) {
    if (defaultQuestionMap.has(questionNumber)) {
      defaultPresentNumbers.push(questionNumber);
      continue;
    }

    defaultMissingNumbersWithin1To725.push(questionNumber);

    if (plusQuestionMap.has(questionNumber)) {
      candidateBackfillNumbers.push(questionNumber);
    } else {
      unresolvedMissingNumbers.push(questionNumber);
    }
  }

  return {
    presentCount: defaultPresentNumbers.length,
    defaultPresentNumbers,
    defaultMissingNumbersWithin1To725,
    candidateBackfillNumbers,
    unresolvedMissingNumbers
  };
}

function createPhaseTwoSummary(defaultQuestionMap, plusQuestionMap) {
  const overlapAuditEntries = [];

  for (
    let questionNumber = OVERLAP_RANGE_START;
    questionNumber <= OVERLAP_RANGE_END;
    questionNumber += 1
  ) {
    overlapAuditEntries.push(
      compareOverlapEntry(
        questionNumber,
        defaultQuestionMap.get(questionNumber),
        plusQuestionMap.get(questionNumber)
      )
    );
  }

  const counts = {
    match_exact: 0,
    match_text_variant_same_answer: 0,
    match_text_variant_different_answer: 0,
    question_mismatch_same_number: 0,
    missing_in_default: 0,
    missing_in_600_plus: 0
  };

  for (const entry of overlapAuditEntries) {
    counts[entry.status] += 1;
  }

  const overlapVerifiedMatches = overlapAuditEntries.filter(
    (entry) =>
      entry.status === "match_exact" || entry.status === "match_text_variant_same_answer"
  );
  const overlapAnswerConflicts = overlapAuditEntries.filter(
    (entry) =>
      entry.status === "match_text_variant_different_answer" ||
      (entry.status === "question_mismatch_same_number" && !entry.sameAnswers)
  );
  const overlapQuestionConflicts = overlapAuditEntries.filter(
    (entry) =>
      entry.status === "question_mismatch_same_number" ||
      entry.status === "missing_in_default" ||
      entry.status === "missing_in_600_plus"
  );

  const comparedOverlapEntries = overlapAuditEntries.filter(
    (entry) =>
      entry.status !== "missing_in_default" && entry.status !== "missing_in_600_plus"
  );
  const answerAgreementCount = comparedOverlapEntries.filter((entry) => entry.sameAnswers).length;
  const answerAgreementRate =
    comparedOverlapEntries.length === 0
      ? 0
      : Number((answerAgreementCount / comparedOverlapEntries.length).toFixed(4));

  return {
    overlapAuditEntries,
    overlapVerifiedMatches,
    overlapAnswerConflicts,
    overlapQuestionConflicts,
    overlapReliabilitySummary: {
      comparedQuestionCount: comparedOverlapEntries.length,
      exactMatchCount: counts.match_exact,
      normalizedSameAnswerCount: counts.match_text_variant_same_answer,
      normalizedDifferentAnswerCount: counts.match_text_variant_different_answer,
      questionMismatchCount: counts.question_mismatch_same_number,
      missingInDefaultCount: counts.missing_in_default,
      missingIn600PlusCount: counts.missing_in_600_plus,
      answerAgreementCount,
      answerAgreementRate,
      trustDecision:
        answerAgreementRate >= 0.9
          ? "candidate_for_tail_import"
          : "do_not_globally_trust_600_plus_answers"
    }
  };
}

function createCanonicalBackfilledQuestion(questionNumber, sourceQuestion) {
  return {
    ...sourceQuestion,
    id: `aws-saa-canonical-${questionNumber}`
  };
}

function createPhaseThreeSummary(defaultQuestionSet, plusQuestionMap, phaseOneSummary) {
  const questionsWithinRange = defaultQuestionSet.questions
    .filter((question) => {
      const questionNumber = extractQuestionNumber(question.id);
      return questionNumber !== null && questionNumber >= BASE_RANGE_START && questionNumber <= BASE_RANGE_END;
    })
    .map((question) => ({ questionNumber: extractQuestionNumber(question.id), question }))
    .filter(({ questionNumber }) => questionNumber !== null);

  const canonicalQuestions = [...questionsWithinRange];
  const backfilledQuestions = [];

  for (const questionNumber of phaseOneSummary.candidateBackfillNumbers) {
    const sourceQuestion = plusQuestionMap.get(questionNumber);

    if (sourceQuestion === undefined) {
      continue;
    }

    const backfilledQuestion = createCanonicalBackfilledQuestion(questionNumber, sourceQuestion);

    backfilledQuestions.push({
      questionNumber,
      fromQuestionId: sourceQuestion.id,
      newQuestionId: backfilledQuestion.id
    });
    canonicalQuestions.push({
      questionNumber,
      question: backfilledQuestion
    });
  }

  canonicalQuestions.sort((left, right) => left.questionNumber - right.questionNumber);

  return {
    canonicalBaseQuestionSet1To725: {
      id: "aws-saa-canonical-base-1-725",
      title: "AWS SAA 1~725 기준 복구 세트",
      sourceLabel: "AWS SAA Canonical Merge Phase 1~3",
      createdAt: GENERATED_AT,
      questions: canonicalQuestions.map(({ question }) => question)
    },
    backfilledQuestions,
    backfilledQuestionNumbers: backfilledQuestions.map((item) => item.questionNumber),
    unresolvedMissingQuestionNumbers: phaseOneSummary.unresolvedMissingNumbers
  };
}

function main() {
  const defaultQuestionSet = readJson(DEFAULT_SET_PATH);
  const plusQuestionSet = readJson(PLUS_SET_PATH);
  const defaultQuestionMap = createQuestionMap(defaultQuestionSet);
  const plusQuestionMap = createQuestionMap(plusQuestionSet);

  const phaseOneSummary = createPhaseOneSummary(defaultQuestionMap, plusQuestionMap);
  const phaseTwoSummary = createPhaseTwoSummary(defaultQuestionMap, plusQuestionMap);
  const phaseThreeSummary = createPhaseThreeSummary(
    defaultQuestionSet,
    plusQuestionMap,
    phaseOneSummary
  );

  const report = {
    generatedAt: GENERATED_AT,
    phase1: {
      rangeStart: BASE_RANGE_START,
      rangeEnd: BASE_RANGE_END,
      ...phaseOneSummary
    },
    phase2: {
      overlapRangeStart: OVERLAP_RANGE_START,
      overlapRangeEnd: OVERLAP_RANGE_END,
      overlapAuditEntries: phaseTwoSummary.overlapAuditEntries,
      overlapVerifiedMatches: phaseTwoSummary.overlapVerifiedMatches.map((entry) => entry.questionNumber),
      overlapAnswerConflicts: phaseTwoSummary.overlapAnswerConflicts.map((entry) => entry.questionNumber),
      overlapQuestionConflicts: phaseTwoSummary.overlapQuestionConflicts.map((entry) => entry.questionNumber),
      overlapReliabilitySummary: phaseTwoSummary.overlapReliabilitySummary
    },
    phase3: {
      canonicalQuestionCount: phaseThreeSummary.canonicalBaseQuestionSet1To725.questions.length,
      backfilledQuestions: phaseThreeSummary.backfilledQuestions,
      backfilledQuestionNumbers: phaseThreeSummary.backfilledQuestionNumbers,
      unresolvedMissingQuestionNumbers: phaseThreeSummary.unresolvedMissingQuestionNumbers
    }
  };

  writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  writeFileSync(
    CANONICAL_SET_PATH,
    `${JSON.stringify(phaseThreeSummary.canonicalBaseQuestionSet1To725, null, 2)}\n`,
    "utf8"
  );
}

main();
