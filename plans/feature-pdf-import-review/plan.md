# feature/pdf-import-review Plan

## Goal

업로드된 PDF를 앱 내부에서 자동으로 문제 JSON 후보로 변환하고, 사용자가 그 결과를 검수 및 수정한 뒤 저장 가능한 문제 세트로 확정할 수 있는 흐름을 만든다.

## Branch Intent

이 브랜치는 "PDF 입력 상태를 자동 변환 결과와 검수 가능한 문제 후보 목록으로 바꾸고, 저장 직전의 확정 데이터까지 연결하는 것"만 담당한다.

- [x] 업로드된 PDF를 내부 문제 후보 JSON 구조로 변환한다.
- [x] 사용자가 문제/보기/정답/해설을 빠르게 검수하고 수정할 수 있게 한다.
- [x] 검수 완료된 결과만 저장 단계로 넘길 수 있게 한다.
- [x] 자동 변환 결과와 최종 확정 데이터의 경계를 분명히 유지한다.

이번 단계의 핵심은 "PDF를 바로 문제풀이에 연결하는 것"이 아니라, "PDF를 자동 변환하되 사람이 검수해 신뢰 가능한 문제 세트로 만드는 것"이다.

## Scope

- `/import/review` 실제 검수 화면
- PDF 입력 상태 읽기
- PDF -> 문제 후보 JSON 자동 변환 흐름
- 자동 변환 결과 정규화
- 문제 후보 목록 렌더링
- 문제 단위 수정 UI
- 저장 전 유효성 검사
- 저장 가능 상태 요약 및 확정 CTA

## Detailed Scope

이번 단계에서 다뤄야 하는 핵심은 아래와 같다.

- 이전 단계에서 준비한 `PdfImportInput`을 읽어 변환 시작 조건을 확정하기
- PDF 텍스트 또는 구조를 내부 문제 후보 배열로 자동 변환하는 인터페이스 정리
- 변환 결과를 화면에 그대로 노출하지 않고, 검수 가능한 후보 구조로 한 번 정규화하기
- 자동 변환이 불완전할 수 있다는 전제를 반영해, 누락/불확실/형식 오류 항목을 사용자가 빠르게 식별할 수 있게 만들기
- 사용자가 문제 텍스트, 보기, 정답, 해설을 직접 수정하고 저장 직전 상태로 고칠 수 있게 하기
- 저장 버튼을 누르기 전에 최소 유효성 검사를 통과해야만 다음 단계로 갈 수 있게 하기
- 변환 실패 또는 입력 만료 상태에서도 사용자가 무엇을 해야 하는지 이해할 수 있게 하기

이번 브랜치의 핵심은 "완전 자동화"가 아니라 "자동 변환 + 빠른 검수 + 안전한 확정"이다.

## Review Principles

- 자동 변환 결과는 완성본이 아니라 초안으로 취급한다.
- 사용자는 문항 전체를 새로 작성하는 대신, 잘못 인식된 부분만 빠르게 수정할 수 있어야 한다.
- 어떤 항목이 불완전한지 드러나야 한다.
- 저장 전 검증 실패 항목은 구체적으로 안내되어야 한다.
- 검수 화면은 "문항 편집기"이면서 동시에 "가져오기 품질 점검기" 역할을 해야 한다.
- 자동 변환이 성공했더라도 검수 과정을 생략하지 않는 것이 기본 원칙이다.

## Import Architecture Notes

현재 제품 기준선은 아래 흐름을 따른다.

1. 사용자가 `/import`에서 PDF를 선택한다.
2. 앱이 PDF를 자동 변환해 문제 후보 JSON을 만든다.
3. 사용자가 `/import/review`에서 후보를 검수 및 수정한다.
4. 검수 완료된 결과만 저장 가능한 문제 세트로 확정된다.
5. 이후 홈, 퀴즈, 결과, 복습, 통계는 저장된 활성 문제 세트를 기준으로 동작한다.

즉, 이번 브랜치는 제품의 "데이터 생성 파이프라인 중심부"다.  
여기서 후보 구조와 검수 품질이 흔들리면 이후 전 기능이 연쇄적으로 불안정해진다.

## Extraction Strategy

이번 단계의 자동 변환은 아래 원칙을 따라야 한다.

- 앱은 PDF를 입력으로 받아 내부 문제 후보 JSON 배열을 생성해야 한다.
- 변환 결과는 직접 `Question[]`로 확정하지 않고, 먼저 검수용 후보 타입으로 보관해야 한다.
- 변환 함수는 "가능한 한 많이 추출"하는 역할을 하고, 검증 함수는 "저장 가능한지 판단"하는 역할을 분리해야 한다.
- 대용량 PDF를 고려해, 변환 상태는 `idle / parsing / ready / failed`처럼 명확히 관리하는 편이 좋다.
- 추출 규칙이 완벽하지 않더라도, 문제 경계/보기 분리/정답 표기 해석의 실패를 후보 상태에 드러낼 수 있어야 한다.

### Recommended Interpretation

구현 시에는 아래 구조를 권장한다.

- `extractPdfImportCandidates(input)`:
  - PDF 입력을 받아 원시 추출 결과를 만든다.
- `normalizePdfImportCandidates(rawResult)`:
  - 화면이 안정적으로 다룰 수 있는 검수용 후보 구조로 정리한다.
- `validateImportedCandidates(candidates)`:
  - 저장 가능한지 판단한다.

핵심은 "추출", "정규화", "검증"을 한 단계에 섞지 않는 것이다.

## Proposed Candidate State

이번 단계에서는 최소한 아래 수준의 상태가 필요할 가능성이 높다.

- `importStatus: "idle" | "parsing" | "ready" | "failed"`
- `importErrorMessage: string | null`
- `sourceDraft: PdfImportDraft | null`
- `candidates: ImportedQuestionCandidate[]`
- `validationSummary: ImportValidationSummary`
- `canSave: boolean`

가능한 후보 타입 예시:

- `ImportedQuestionCandidate`
  - `tempId: string`
  - `question: string`
  - `choices: string[]`
  - `answer: number | null`
  - `explanation: string`
  - `warnings: string[]`
  - `sourceExcerpt?: string`

가능한 저장 직전 타입 예시:

- `ConfirmedImportedQuestionSet`
  - `title`
  - `questions: Question[]`
  - `sourceFileName`
  - `importedAt`

핵심은 "검수용 후보 타입"과 "저장 가능한 최종 타입"을 분리하는 것이다.

## Candidate Data Rules

검수 단계에서 다루는 문제 후보는 최소한 아래 조건을 검토해야 한다.

- `question`은 빈 문자열이 아니어야 한다.
- `choices`는 최소 2개 이상이어야 한다.
- `choices` 각 항목은 비어 있지 않아야 한다.
- `answer`는 `choices` 범위 안이어야 하며, 미확정 상태는 `null`로 표현할 수 있어야 한다.
- `explanation`은 비어 있을 수 있지만, 저장 정책상 필수 여부는 명확히 정해야 한다.
- 후보 단계에서는 `id`를 임시 값으로 쓸 수 있지만, 저장 직전에는 안정적인 `Question.id`가 생성돼야 한다.

## Validation Rules

저장 전 최종 검증은 최소한 아래를 만족해야 한다.

- 문제 텍스트 누락 문항은 저장할 수 없어야 한다.
- 선택지가 2개 미만인 문항은 저장할 수 없어야 한다.
- 비어 있는 선택지가 있으면 저장할 수 없어야 한다.
- 정답 인덱스가 없거나 범위를 벗어나면 저장할 수 없어야 한다.
- 저장 직전에는 모든 문항이 `Question` 타입에 맞게 정규화돼야 한다.
- 검증 실패 시, 전체 실패가 아니라 어떤 문항이 왜 막혔는지 보여줘야 한다.

이 단계의 검증은 "완벽한 PDF 인식"을 보장하는 것이 아니라, "잘못된 문제 세트가 저장되지 않도록 막는 것"이 목적이다.

## Interaction Design

이번 단계에서 기대하는 상호작용은 다음과 같다.

### 1. Review Entry

- 사용자가 `/import/review`에 들어온다.
- 이전 단계에서 선택한 PDF 입력 상태가 있는지 확인한다.
- 입력이 없거나 만료됐으면 업로드 단계로 되돌아갈 수 있어야 한다.

### 2. Parsing State

- 앱이 자동 변환을 진행하는 동안 현재 상태를 분명히 보여준다.
- 대용량 PDF여도 "멈춘 것처럼" 보이지 않도록 처리 상태가 드러나야 한다.

### 3. Candidate Review State

- 변환된 문제 후보 목록이 렌더링된다.
- 각 문제에서 본문, 보기, 정답, 해설을 확인하고 수정할 수 있다.
- 문제가 의심스럽거나 불완전한 항목은 시각적으로 강조돼야 한다.

### 4. Validation Feedback State

- 저장할 수 없는 이유를 문항 단위와 전체 요약 단위 둘 다에서 확인할 수 있어야 한다.
- 사용자는 오류가 있는 문항을 수정하고 다시 저장 가능 상태를 만들 수 있어야 한다.

### 5. Confirm State

- 모든 문항이 저장 가능 상태가 되면, 사용자는 문제 세트 저장을 확정할 수 있다.
- 저장 확정은 다음 브랜치의 저장 계층으로 넘길 준비 단계여야 한다.

## UI Principles

- 자동 변환 결과가 "완성"처럼 보이면 안 되고, "검수 필요 초안"처럼 보여야 한다.
- 문항 목록과 현재 편집 중 문항 정보는 빠르게 스캔 가능해야 한다.
- 오류와 경고는 구분돼야 한다.
- 한 문항 안에서 문제/보기/정답/해설의 관계가 직관적으로 보여야 한다.
- 대용량 PDF에서 문항 수가 많아도 검수 흐름이 무너지지 않도록 목록 구조가 안정적이어야 한다.

## Data Flow Notes

현재 기준 데이터 흐름은 아래처럼 해석한다.

1. `/import`에서 PDF 입력 상태가 준비된다.
2. `/import/review`가 그 입력을 읽는다.
3. PDF를 자동 변환해 검수용 후보 배열을 만든다.
4. 사용자가 후보를 수정한다.
5. 저장 전 검증을 통과한 후보만 `Question[]` 기반 최종 구조로 정규화된다.
6. 이 최종 구조가 다음 단계 저장 계층으로 전달된다.

즉, 이번 브랜치의 직접 산출물은 "문제 세트 저장" 그 자체가 아니라, "저장 가능한 문제 세트 확정 데이터"다.

## Out of Scope

- 실제 퀴즈 진행
- 결과/오답/통계 계산
- 즐겨찾기 기능
- 서버 동기화
- 장기적인 다중 세트 관리 대시보드
- PDF 업로드 첫 단계 UI 재설계

## Deliverables

- [x] PDF 자동 변환 시작/실패/완료 상태
- [x] 검수용 문제 후보 상태 구조
- [x] 문제 후보 목록 검수 화면
- [x] 문제/보기/정답/해설 수정 UI
- [x] 저장 전 유효성 검사
- [x] 저장 가능한 최종 데이터 구조

## File Plan

- `app/import/review/page.tsx`
- `components/import/ImportReviewPageContent.tsx`
- `components/import/ImportReviewList.tsx`
- `components/import/ImportQuestionEditor.tsx`
- 필요 시 `components/import/ImportValidationSummary.tsx`
- `lib/import/extract-pdf-import-candidates.ts`
- `lib/import/normalize-pdf-import-candidates.ts`
- `lib/import/validate-imported-candidates.ts`
- 필요 시 `lib/import/build-confirmed-question-set.ts`

현재 `/import/review` placeholder를 실제 자동 변환 + 검수 화면으로 대체하는 것이 이 브랜치의 직접 산출물이다.

## Dependency Notes

- `feature/pdf-upload-intake`에서 준비한 `PdfImportInput`이 필요하다.
- 다음 브랜치인 `feature/question-data`는 이 단계에서 확정된 문제 세트를 저장하고 활성 데이터로 읽게 된다.
- `feature/home-page`와 `feature/question-ui`는 결국 여기서 확정되고 저장된 활성 문제 세트를 기준으로 동작한다.
- 대용량 PDF를 다루더라도, 이번 단계는 저장 이전의 검수 흐름에만 집중하고 영구 저장 정책은 다음 단계로 넘긴다.

## Validation

- [x] PDF 입력 상태가 없을 때 안전한 빈 상태가 보여야 한다.
- [x] 자동 변환 상태가 `idle / parsing / ready / failed` 중 하나로 명확히 드러나야 한다.
- [x] 자동 변환 결과가 검수용 문제 후보 배열 형태로 정리돼야 한다.
- [x] 사용자가 문제 텍스트, 보기, 정답, 해설을 수정할 수 있어야 한다.
- [x] 유효하지 않은 문제는 저장 확정 전에 차단돼야 한다.
- [x] 저장 가능한 최종 데이터가 다음 단계에 전달될 수 있어야 한다.
- [x] `npm run typecheck` 기준으로 새 오류를 만들지 않아야 한다.

## Success Criteria

아래 조건을 만족하면 `feature/pdf-import-review` 단계가 완료된 것으로 본다.

- [x] 웹앱이 업로드된 PDF를 내부 문제 후보 JSON으로 자동 변환할 수 있다.
- [x] 자동 변환이 완벽하지 않아도 사용자가 검수해 문제 세트를 완성할 수 있다.
- [x] 저장 가능한 최종 문제 세트만 다음 단계로 넘길 수 있다.
- [x] 사용자는 "PDF 업로드 -> 자동 변환 -> 검수 -> 저장" 흐름을 명확히 이해할 수 있다.

## Risks

- 자동 변환과 검수 UI를 한 파일에 몰아넣으면 유지보수가 급격히 어려워진다.
- 후보 타입과 최종 저장 타입을 섞으면 이후 저장 계층이 불안정해질 수 있다.
- 저장 전 검증이 약하면 잘못된 문제 세트가 이후 전 기능을 오염시킨다.
- 수정 경험이 불편하면 PDF 업로드 기반 구조의 장점이 크게 줄어든다.
- 대용량 PDF에서 변환 중 상태가 불분명하면 사용자가 실패로 오해할 수 있다.

## Notes

- 이 브랜치는 제품 전체의 데이터 품질을 결정하는 핵심 단계다.
- 사용자는 PDF를 올린 뒤 자동 변환 결과를 반드시 한 번 검수한다는 전제를 유지하는 편이 안전하다.
- "앱이 JSON으로 자동 변환한다"와 "검수 없이 바로 저장한다"는 같은 의미가 아니다.
- PDF가 크고 문제 수가 많아도, 저장 후에는 구조화된 문제 세트를 기준으로 문제풀이가 이뤄져야 한다.

## Completion Status

완료. `/import/review`가 실제 자동 변환 + 검수 화면으로 동작하도록 바뀌었고, PDF 입력 만료 상태, 변환 중 상태, 후보 목록, 문항 편집, 저장 전 검증, 활성 문제 세트 저장까지 연결했다. 타입 점검도 통과했다.

## Next

다음 브랜치는 `feature/question-data`
