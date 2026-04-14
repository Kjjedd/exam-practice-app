# fix/result-summary-bug Plan

## Goal

결과 화면 집계와 관련된 오류를 독립적으로 수정하고, 일반 모드/랜덤 모드/시험 모드/오답 복습 흐름에서 결과 숫자와 문제별 표시가 일관되게 맞도록 안정화한다.

## Branch Intent

이 브랜치는 "이미 구현된 결과 요약 흐름에서 잘못된 집계, 세션 불일치, 결과 표시 오류를 보정하는 것"만 담당한다.

- 결과 숫자와 문제별 결과 목록이 같은 기준으로 계산되도록 맞춘다.
- 세션 저장 시점과 결과 화면 복원 시점의 기준이 어긋나지 않도록 정리한다.
- 랜덤/시험/복습 모드에서도 결과 집계가 흔들리지 않도록 보정한다.
- 신규 기능을 추가하지 않고, 현재 동작의 정확성과 일관성을 높인다.

이번 단계의 핵심은 "결과 화면이 대충 맞아 보이는 것"이 아니라, "세션 데이터와 결과 요약이 구조적으로 같은 사실을 말하도록 맞추는 것"이다.

## Scope

- 결과 집계 로직 점검 및 수정
- 문제별 결과 목록 생성 기준 점검
- 세션 모드별 결과 설명과 집계 일관성 점검
- 활성 문제 세트와 최신 세션의 관계 점검
- 결과 화면 빈 상태 오탐 방지
- 필요한 경우 세션 저장 시점/구조 보정

## Detailed Scope

이번 단계에서 다뤄야 하는 핵심은 아래와 같다.

- `totalQuestions`, `correctCount`, `wrongCount`, `accuracyRate` 계산식이 실제 세션 결과와 항상 일치하는지 확인하기
- `quizSession.questionIds`와 `quizSession.results`의 관계를 기준으로 문제별 결과 목록이 올바르게 만들어지는지 확인하기
- 랜덤 모드처럼 문제 순서가 바뀐 세션에서도 결과 번호와 문제 텍스트가 정확히 대응되는지 확인하기
- 오답 복습이나 특정 문제 진입 같은 흐름이 최신 세션 결과를 의도치 않게 덮어쓰지 않는지 확인하기
- 활성 문제 세트가 바뀌었을 때 결과 화면이 불필요하게 비어 버리거나 잘못된 데이터를 보여주지 않는지 확인하기
- 문제 결과가 누락되거나 중복되었을 때 어떤 기준으로 안전하게 처리할지 결정하기

이번 브랜치의 핵심은 "숫자를 예쁘게 보여주는 것"이 아니라, "세션 데이터와 결과 해석 규칙의 모순을 없애는 것"이다.

## Bug-Fix Principles

- 집계 로직과 표시 로직은 같은 원천 데이터를 기준으로 해야 한다.
- 결과 화면은 저장된 `QuizSession`을 신뢰하되, 복원 가능한 범위만 안전하게 보여줘야 한다.
- 숨기기보다 명시적인 빈 상태 또는 복구 가능한 표시를 우선한다.
- 잘못된 세션을 억지로 정상처럼 보이게 만들지 않는다.
- 모드별 차이는 설명 문구 수준인지, 실제 집계 규칙 수준인지 분리해서 다뤄야 한다.

## Current Risk Areas

현재 구조에서 특히 점검해야 할 위험 지점은 아래와 같다.

### 1. Summary Count Drift

- `correctCount`는 `quizSession.results`를 기준으로 계산된다.
- `totalQuestions`는 `quizSession.questionIds.length`를 기준으로 계산된다.
- 이 둘의 기준이 다르면 `wrongCount = total - correct`가 실제 오답 제출 수와 다를 수 있다.

### 2. Missing Result Handling

- 특정 문제에 대해 `QuestionResult`가 없으면 현재는 `isCorrect: false`처럼 해석될 여지가 있다.
- 이 경우 "미응답"과 "오답"이 같은 값으로 취급될 수 있다.

### 3. Active Question Set Dependency

- 결과 화면은 최신 세션과 현재 활성 문제 세트 ID가 일치할 때만 요약을 만들고 있다.
- 하지만 사용자가 문제 세트를 교체한 뒤 직전 결과를 다시 보려 하면, 실제로는 세션 데이터가 있는데도 결과가 없는 것처럼 보일 수 있다.

### 4. Session Ordering Risks

- 랜덤 모드나 특정 문제 진입 흐름에서는 `questionIds` 순서와 활성 세트 원본 순서가 다를 수 있다.
- 결과 목록과 정답/오답 표시가 반드시 세션 순서를 따라야 한다.

### 5. Review Session Ambiguity

- 오답 복습 세션은 일반 세션과 목적이 다르다.
- 결과 화면에서 복습 세션을 어떻게 해석할지, 저장할지, 표시할지 기준이 불명확하면 원 세션과 혼선이 날 수 있다.

## Investigation Checklist

구현 전후로 최소한 아래 케이스를 확인해야 한다.

1. 일반 모드에서 모든 문제를 제출하고 결과가 정확한지
2. 랜덤 모드에서 결과 번호와 문제 텍스트가 세션 순서와 일치하는지
3. 시험 모드에서 결과 집계가 일반 모드와 같은 규칙으로 맞는지
4. 오답 복습 세션 뒤 결과 화면이 의도한 세션을 보여주는지
5. 활성 문제 세트를 다른 세트로 바꾼 뒤 결과 화면이 어떻게 동작하는지
6. 결과가 부분적으로 누락된 세션에 대해 빈 상태 또는 보정 표시가 안전하게 동작하는지

## Proposed Fix Areas

이번 브랜치에서 실제 수정이 들어갈 가능성이 높은 영역은 아래와 같다.

- `lib/quiz/summarize-results.ts`
- `components/result/ResultPageContent.tsx`
- 필요 시 `lib/quiz/session-storage.ts`
- 필요 시 `components/result/ResultQuestionList.tsx`
- 필요 시 결과 요약 타입 정의 파일

핵심은 결과 집계 핵심 로직을 한 곳에서 해석하고, 화면은 그 해석 결과를 표시만 하도록 유지하는 것이다.

## Proposed Result Rules

결과 집계는 아래 기준을 따르는 편이 안전하다.

- `totalQuestions`:
  - 세션 기준 문제 수
- `answeredCount`:
  - 실제 제출 결과가 있는 문제 수
- `correctCount`:
  - 제출 결과 중 `isCorrect === true`
- `wrongCount`:
  - 제출 결과 중 `isCorrect === false`
- 필요 시 `unansweredCount`:
  - `totalQuestions - answeredCount`
- `accuracyRate`:
  - 정책을 분명히 고정해야 한다.
  - 권장: `correctCount / totalQuestions`

핵심은 "오답"과 "미응답"을 같은 개념으로 섞지 않는 것이다.  
만약 현재 제품 정책상 미응답이 존재할 수 없다면, 그 전제 역시 코드와 문서에 명확히 반영돼야 한다.

## UI Principles

- 숫자 요약과 문제별 목록은 서로 모순되면 안 된다.
- 결과가 없는 상태와 결과를 복원할 수 없는 상태는 구분하는 편이 좋다.
- 세션 모드 설명은 집계 규칙을 바꾸지 않는다면 문구 수준에서만 달라져야 한다.
- 사용자가 "결과가 사라졌다"고 느끼지 않도록 빈 상태 이유를 명확히 설명해야 한다.

## Out of Scope

- 신규 학습 기능 추가
- PDF 업로드/검수 흐름 변경
- 즐겨찾기, 대시보드, 홈 화면 기능 확장
- 디자인 전면 개편

## Deliverables

- [x] 재현 가능한 결과 집계 문제 목록
- [x] 수정된 결과 집계 규칙
- [x] 수정된 결과 화면 복원/표시 로직
- [x] 모드별 결과 일관성 확인
- [x] 회귀 위험 정리

## File Plan

- `plans/fix-result-summary-bug/plan.md`
- `lib/quiz/summarize-results.ts`
- `components/result/ResultPageContent.tsx`
- 필요 시 `lib/quiz/session-storage.ts`
- 필요 시 `components/result/ResultQuestionList.tsx`

## Dependency Notes

- `feature/result-summary`의 기본 구조를 유지한 채 수정해야 한다.
- `feature/wrong-answer-review`, `feature/random-quiz-mode`, `feature/exam-mode`가 이미 결과 데이터에 의존하므로, 수정은 이 흐름과 충돌하지 않아야 한다.
- 결과 화면 수정은 대시보드/복습/홈 진입과 간접적으로 연결되므로, 세션 저장 기준을 건드릴 때는 파급 범위를 의식해야 한다.

## Validation

- [x] 일반 모드 결과 집계가 정확해야 한다.
- [x] 랜덤 모드 결과 집계와 문제 순서가 정확해야 한다.
- [x] 시험 모드 결과 집계가 정확해야 한다.
- [x] 오답 복습 흐름과 결과 화면이 서로 모순되지 않아야 한다.
- [x] 결과 화면 빈 상태가 의도치 않게 뜨지 않아야 한다.
- [x] `npm run typecheck` 기준으로 새 오류를 만들지 않아야 한다.

## Success Criteria

아래 조건을 만족하면 `fix/result-summary-bug` 단계가 완료된 것으로 본다.

- [x] 결과 숫자 요약과 문제별 결과 목록이 같은 사실을 말한다.
- [x] 모드가 달라도 결과 집계 규칙이 일관된다.
- [x] 최신 세션 결과가 불필요하게 사라지거나 잘못 숨겨지지 않는다.
- [x] 수정 이후에도 기존 문제풀이 흐름이 깨지지 않는다.

## Risks

- 결과 화면만 고치고 세션 저장 구조를 그대로 두면 근본 원인이 남을 수 있다.
- 반대로 세션 구조를 과도하게 바꾸면 복습/대시보드까지 연쇄 영향이 갈 수 있다.
- "오답"과 "미응답" 정책을 애매하게 두면 버그를 고쳐도 다시 혼선이 생길 수 있다.

## Notes

- 이 브랜치는 신규 기능 브랜치가 아니라 안정화 브랜치다.
- 구현 전에 "현재 제품 정책상 미응답이 가능한가"를 먼저 분명히 하고 가는 것이 좋다.
- 결과 화면의 신뢰도는 학습 경험 전체의 신뢰도와 직접 연결된다.

## Completion Status

완료. 결과 집계가 `answered / correct / wrong / unanswered` 기준으로 일관되게 계산되도록 정리했고, 활성 문제 세트가 바뀐 경우에도 최신 세션 결과가 불필요하게 비어 보이지 않도록 결과 복원 로직을 보정했다. 타입 점검도 통과했다.

## Next

필요 시 결과 집계 안정화 이후 관련 흐름 브랜치로 재연결한다.
