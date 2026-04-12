# feature/localstorage-progress Plan

## Goal

학습 상태와 개인화 상태를 브라우저 저장소에 유지한다.

## Scope

- 풀이 기록 저장
- 최근 세션 저장
- 즐겨찾기 저장
- 새로고침 후 복원
- 초기화 옵션

## Out of Scope

- 대시보드 UI 자체

## Deliverables

- `lib/storage/` 로직

## Validation

- 저장/복원 정확성
- 파싱 오류 시 안전한 기본값 처리

## Next

다음 브랜치는 `feature/statistics-dashboard`

