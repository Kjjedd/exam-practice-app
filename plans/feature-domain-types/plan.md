# feature/domain-types Plan

## Goal

문제, 세션, 결과, 모드에 관한 핵심 타입 체계를 정의한다.

## Scope

- `Question`
- `QuizMode`
- `QuestionResult`
- `QuizSession`
- `StudyStats`

## Out of Scope

- 실제 UI 구현
- JSON 데이터 작성
- 저장소 로직 구현

## Deliverables

- `lib/types/` 하위 타입 파일
- 타입 간 관계 정리

## Validation

- 타입 충돌이 없는지
- 이후 브랜치가 재사용 가능한지

## Next

다음 브랜치는 `feature/question-data`

