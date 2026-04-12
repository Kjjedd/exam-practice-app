# feature/domain-types Plan

## Goal

문제, 세션, 결과, 모드에 관한 핵심 타입 체계를 정의한다.  
이 단계의 목적은 이후 브랜치들이 같은 도메인 모델을 기준으로 구현될 수 있게, 앱의 공통 언어를 먼저 고정하는 것이다.

## Branch Intent

이 브랜치는 "기능 구현에 들어가기 전에 타입 경계를 먼저 명확히 한다"는 목적만 담당한다.

- [x] 문제 데이터 구조를 표현할 기준 타입을 정한다.
- [x] 문제풀이 과정에서 공통으로 사용할 결과 타입을 정한다.
- [x] 세션 상태를 표현할 최소 구조를 정한다.
- [x] 모드와 통계에서 재사용할 도메인 타입을 정한다.

이 단계에서는 타입만 설계하고, 실제 화면 로직이나 저장 로직은 구현하지 않는다.  
현재 브랜치에서는 이 원칙을 지킨 상태로 도메인 타입 정의만 완료했다.

## Scope

- `Question`: 문제 본문, 보기, 정답, 해설, 분류 정보를 표현하는 기본 타입
- `QuizMode`: 일반 모드, 랜덤 모드, 시험 모드, 오답 복습 모드를 표현하는 타입
- `QuestionResult`: 단일 문제 풀이 결과를 표현하는 타입
- `QuizSession`: 현재 퀴즈 흐름을 위한 최소 세션 상태 타입
- `StudyStats`: 누적 학습 통계를 표현하는 타입

## Detailed Scope

이번 단계에서 정의해야 하는 핵심 관심사는 아래와 같다.

- 문제 원본 데이터의 최소 필수 필드
- 문제 ID 기반 추적 구조
- 선택 답안과 정답 판정 결과를 담는 구조
- 세션 전체 흐름에서 필요한 최소 상태
- 이후 저장/통계 기능이 의존할 수 있는 타입 기반

이번 단계에서는 "타입 구조의 방향성"을 잡는 것이 핵심이며, 구현 편의를 위해 너무 많은 세부 상태를 미리 넣지는 않는다.

## Type Design Principles

이번 브랜치에서 타입을 설계할 때 지켜야 할 원칙은 다음과 같다.

- 타입은 문제 ID 중심으로 추적 가능해야 한다.
- 배열 인덱스에만 의존하는 구조를 피한다.
- UI 전용 상태와 도메인 상태를 섞지 않는다.
- 저장소 구현 세부사항(LocalStorage 키 구조 등)을 타입에 직접 섞지 않는다.
- 이후 `feature/question-data`, `feature/question-ui`, `feature/answer-checking`에서 그대로 재사용 가능해야 한다.
- `any`와 `unknown`을 사용하지 않는다.

## Proposed Types

이번 단계에서 최소한 아래 타입들을 정리하는 것이 적절하다.

### 1. Question

역할:

- 문제 데이터 원본 1개를 표현한다.

필드 후보:

- `id`
- `question`
- `choices`
- `answer`
- `explanation`
- `category`

고려사항:

- `answer`는 선택지 인덱스 기준으로 일관되게 유지한다.
- 이후 과목/난이도 확장을 고려하더라도 현재는 최소 필드만 우선한다.

### 2. QuizMode

역할:

- 현재 세션이 어떤 방식으로 진행되는지 구분한다.

값 후보:

- `normal`
- `random`
- `exam`
- `review`

고려사항:

- 문자열 유니온 또는 동등한 단순 구조가 적절하다.
- 모드가 늘어나더라도 UI와 로직에서 일관되게 분기할 수 있어야 한다.

### 3. QuestionResult

역할:

- 한 문제에 대한 제출 결과를 표현한다.

필드 후보:

- `questionId`
- `selectedAnswer`
- `isCorrect`
- `submittedAt`

고려사항:

- 즐겨찾기 상태는 문제 결과 타입에 넣지 않는 편이 더 안정적일 수 있다.
- 이후 저장 구조가 분리되더라도 재사용 가능한 형태가 좋다.

### 4. QuizSession

역할:

- 현재 문제풀이 흐름 전체를 표현한다.

필드 후보:

- `mode`
- `questionIds`
- `currentQuestionIndex`
- `results`
- `startedAt`
- `completedAt`

고려사항:

- 실제 UI 상태 전체를 넣지 않고, 도메인 관점의 최소 세션 정보만 담는다.
- 문제 목록 전체 객체보다 문제 ID 목록을 우선할지 검토할 필요가 있다.

### 5. StudyStats

역할:

- 누적 학습 현황을 표현한다.

필드 후보:

- `totalSolved`
- `correctCount`
- `wrongCount`
- `correctRate`
- `favoriteCount`
- `lastStudiedAt`

고려사항:

- 이 타입은 계산 결과를 담는 구조이지, 계산 로직 자체를 포함하지 않는다.
- LocalStorage 저장 구조와 1:1로 묶지 않는다.

## Out of Scope

- 실제 UI 구현
- JSON 데이터 작성
- 저장소 로직 구현
- LocalStorage 구조 정의
- 통계 계산 로직 구현
- 컴포넌트 상태 설계
- 제출/이동/채점 함수 구현

## File Plan

이번 단계에서 예상하는 파일 구조는 아래와 같다.

## Deliverables

- [x] `lib/types/question.ts`
- [x] `lib/types/quiz-mode.ts`
- [x] `lib/types/question-result.ts`
- [x] `lib/types/quiz-session.ts`
- [x] `lib/types/study-stats.ts`
- [x] `lib/types/index.ts`
- [x] 타입 간 참조 관계 정리

## Dependency Notes

이 단계는 다음 브랜치들의 선행 조건이다.

- `feature/question-data`는 `Question` 타입에 직접 의존한다.
- `feature/question-ui`는 `Question`과 `QuizMode`에 의존할 가능성이 크다.
- `feature/answer-checking`은 `QuestionResult`에 의존한다.
- `feature/result-summary`와 `feature/wrong-answer-review`는 `QuizSession`과 `QuestionResult`를 재사용하게 된다.
- `feature/statistics-dashboard`는 `StudyStats` 또는 이에 준하는 집계 타입에 의존한다.

따라서 이번 단계에서 타입 경계를 잘못 잡으면 이후 여러 브랜치에서 연쇄 수정이 발생할 수 있다.

## Validation

- [x] TypeScript 타입 오류가 없어야 한다.
- [x] 타입 간 책임이 중복되지 않아야 한다.
- [x] 이후 `feature/question-data` 브랜치에서 재사용 가능해야 한다.
- [x] UI, 저장소, 통계 계산 로직에 종속되지 않는 순수 도메인 타입이어야 한다.
- [x] `npm run typecheck` 기준으로 새 오류를 만들지 않아야 한다.
- [x] 타입 이름과 파일 이름만 보고도 책임이 드러나야 한다.

## Success Criteria

아래 조건을 만족하면 `feature/domain-types` 단계가 완료된 것으로 본다.

- [x] 핵심 도메인 타입 파일이 `lib/types/` 아래에 정리된다.
- [x] 문제, 모드, 결과, 세션, 통계의 책임이 서로 겹치지 않는다.
- [x] 다음 브랜치가 타입 변경 없이 바로 데이터 파일 작성을 시작할 수 있다.
- [x] 불필요한 저장소 세부사항이 도메인 타입에 섞이지 않는다.
- [x] `any`와 `unknown` 없이 타입 정의가 완료된다.

## Risks

이번 단계에서 특히 주의해야 할 위험은 다음과 같다.

- 결과 타입에 즐겨찾기나 저장소 구조를 섞어 넣으면 책임이 흐려질 수 있다.
- 세션 타입에 UI 전용 상태를 과도하게 넣으면 다음 단계에서 분리가 필요해질 수 있다.
- 통계 타입을 저장 구조처럼 설계하면 대시보드 단계에서 오히려 유연성이 떨어질 수 있다.
- 너무 이른 확장을 위해 복잡한 제네릭 구조를 도입하면 유지보수성이 나빠질 수 있다.

## Notes

- 타입은 현재 요구사항을 충족하는 최소 구조로 설계한다.
- 이후 확장 가능성은 열어 두되, 지금 단계에서 과도한 추상화는 피한다.
- 데이터 구조 변경이 필요하다면 구현 전에 이유를 설명할 수 있어야 한다.
- 이번 브랜치에서는 문서화된 책임 분리가 가장 중요하다.

## Completion Status

`feature/domain-types` 단계의 계획된 작업은 완료되었다.  
현재 저장소는 다음 브랜치인 `feature/question-data`에서 문제 JSON과 데이터 연결 작업을 시작할 수 있는 타입 기반을 갖춘 상태다.

## Next

다음 브랜치는 `feature/question-data`
