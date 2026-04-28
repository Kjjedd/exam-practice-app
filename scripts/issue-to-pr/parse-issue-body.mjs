import fs from "node:fs";

const REQUIRED_META_KEYS = [
  "version",
  "kind",
  "questionSetId",
  "questionSetTitle",
  "questionId",
  "questionNumber"
];

function readEventPayload() {
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (!eventPath) {
    throw new Error("GITHUB_EVENT_PATH is required");
  }

  return JSON.parse(fs.readFileSync(eventPath, "utf8"));
}

function parseMetadata(body) {
  const metadataMatch = body.match(/<!--\s*exammate-meta\s*([\s\S]*?)-->/);

  if (!metadataMatch) {
    return null;
  }

  const block = metadataMatch[1];
  const entries = block
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separatorIndex = line.indexOf(":");

      if (separatorIndex === -1) {
        return null;
      }

      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();

      return [key, value];
    })
    .filter((entry) => entry !== null);

  return Object.fromEntries(entries);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function extractSection(body, heading) {
  const escapedHeading = escapeRegExp(heading);
  const match = body.match(
    new RegExp(`##\\s+${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n##\\s+|$)`)
  );

  if (!match) {
    return "";
  }

  return match[1].trim();
}

function normalizeMultilineText(value) {
  return value.replace(/\r\n/g, "\n").trim();
}

function ensureValidMetadata(metadata) {
  if (!metadata) {
    return {
      ok: false,
      reason:
        "자동 처리용 메타데이터가 없습니다. 웹앱에서 생성된 이슈인지 확인이 필요합니다."
    };
  }

  for (const key of REQUIRED_META_KEYS) {
    if (!metadata[key]) {
      return {
        ok: false,
        reason: `필수 메타데이터가 누락되었습니다: ${key}`
      };
    }
  }

  if (metadata.version !== "1") {
    return {
      ok: false,
      reason: `지원하지 않는 메타데이터 버전입니다: ${metadata.version}`
    };
  }

  const questionNumber = Number(metadata.questionNumber);

  if (!Number.isInteger(questionNumber)) {
    return {
      ok: false,
      reason: `문제 번호가 정수가 아닙니다: ${metadata.questionNumber}`
    };
  }

  return {
    ok: true,
    questionNumber
  };
}

function writeOutputs(entries) {
  const githubOutputPath = process.env.GITHUB_OUTPUT;

  if (githubOutputPath) {
    const lines = [];

    for (const [key, value] of Object.entries(entries)) {
      lines.push(`${key}<<__EXAMMATE__`);
      lines.push(String(value));
      lines.push("__EXAMMATE__");
    }

    fs.appendFileSync(githubOutputPath, `${lines.join("\n")}\n`, "utf8");
    return;
  }

  const lines = Object.entries(entries).map(([key, value]) => `${key}=${value}`);
  process.stdout.write(lines.join("\n"));
}

function main() {
  const payload = readEventPayload();
  const issue = payload.issue;

  if (!issue) {
    throw new Error("issue payload is missing");
  }

  const body = String(issue.body ?? "");
  const metadata = parseMetadata(body);
  const metadataValidation = ensureValidMetadata(metadata);

  if (!metadataValidation.ok) {
    writeOutputs({
      mode: "invalid",
      reason: metadataValidation.reason
    });
    return;
  }

  const kind = metadata.kind;
  const proposalText =
    kind === "explanation-improvement"
      ? extractSection(body, "제안하는 해설")
      : extractSection(body, "제안 내용");
  const referenceText = extractSection(body, "근거 / 참고 자료");

  if (kind !== "explanation-improvement") {
    writeOutputs({
      mode: "manual-review",
      reason: "해설 보완 이슈만 자동 PR 대상입니다.",
      kind,
      question_number: String(metadataValidation.questionNumber)
    });
    return;
  }

  if (!proposalText.trim()) {
    writeOutputs({
      mode: "invalid",
      reason: "제안하는 해설이 비어 있습니다.",
      kind,
      question_number: String(metadataValidation.questionNumber)
    });
    return;
  }

  const normalizedProposal = normalizeMultilineText(proposalText);
  const normalizedReference = normalizeMultilineText(referenceText);
  const safeTitle = `docs: apply issue #${issue.number} explanation improvement for question ${metadataValidation.questionNumber}`;
  const safeBranch = `auto/issue-${issue.number}-explanation-${metadataValidation.questionNumber}`;

  writeOutputs({
    mode: "auto-pr",
    kind,
    issue_number: String(issue.number),
    question_set_id: metadata.questionSetId,
    question_set_title: metadata.questionSetTitle,
    question_id: metadata.questionId,
    question_number: String(metadataValidation.questionNumber),
    proposal: normalizedProposal,
    reference: normalizedReference,
    branch_name: safeBranch,
    commit_title: safeTitle
  });
}

main();
