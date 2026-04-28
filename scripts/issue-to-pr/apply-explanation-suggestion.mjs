import fs from "node:fs";
import path from "node:path";

const DATA_FILES = [
  "/Users/jongeon/Desktop/Study/exam-practice-app/data/default-question-set-base-1-725.json",
  "/Users/jongeon/Desktop/Study/exam-practice-app/data/default-question-set-verified-726-1019.json"
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, value) {
  const formatted = `${JSON.stringify(value, null, 2)}\n`;
  fs.writeFileSync(filePath, formatted, "utf8");
}

function buildExplanation(proposal, reference) {
  const normalizedProposal = proposal.trim();
  const normalizedReference = reference.trim();

  if (!normalizedReference) {
    return normalizedProposal;
  }

  return `${normalizedProposal}\n\n## 참고 자료\n${normalizedReference}`;
}

function main() {
  const questionNumber = Number(process.env.QUESTION_NUMBER);
  const proposal = process.env.PROPOSAL_TEXT ?? "";
  const reference = process.env.REFERENCE_TEXT ?? "";

  if (!Number.isInteger(questionNumber)) {
    throw new Error("QUESTION_NUMBER must be an integer");
  }

  if (!proposal.trim()) {
    throw new Error("PROPOSAL_TEXT must not be empty");
  }

  const expectedQuestionId = `aws-saa-${questionNumber}`;
  const nextExplanation = buildExplanation(proposal, reference);
  let matchedFilePath = null;
  let matchedQuestion = null;

  for (const filePath of DATA_FILES) {
    const data = readJson(filePath);
    const question = data.questions.find((entry) => entry.id === expectedQuestionId);

    if (!question) {
      continue;
    }

    question.explanation = nextExplanation;
    writeJson(filePath, data);
    matchedFilePath = filePath;
    matchedQuestion = question;
    break;
  }

  if (!matchedFilePath || !matchedQuestion) {
    throw new Error(`Question ${expectedQuestionId} was not found in editable datasets`);
  }

  const result = {
    filePath: matchedFilePath,
    fileName: path.basename(matchedFilePath),
    questionId: matchedQuestion.id,
    questionNumber
  };

  if (process.env.GITHUB_OUTPUT) {
    const lines = Object.entries(result).flatMap(([key, value]) => [
      `${key}<<__EXAMMATE__`,
      String(value),
      "__EXAMMATE__"
    ]);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `${lines.join("\n")}\n`, "utf8");
    return;
  }

  process.stdout.write(JSON.stringify(result, null, 2));
}

main();
