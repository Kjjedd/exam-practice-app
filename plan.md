# ExamMate Development Plan Index

## Overview

이 문서는 ExamMate 프로젝트 전체 개발 단계의 개요와 브랜치별 계획 문서 위치를 정리한 인덱스 문서다.  
실제 구현은 기능 단위 브랜치로 나누어 진행하며, 각 브랜치의 세부 계획은 별도 `plan.md` 문서로 관리한다.

## Development Principles

- 한 브랜치는 하나의 작업 목적만 담당한다.
- 기능은 의존성을 고려해 단계적으로 구현한다.
- 구조 변경은 설명 가능해야 한다.
- UI, 로직, 데이터, 저장 계층은 분리해 다룬다.
- 구현 전에 계획을 먼저 정리한다.

## Development Sequence

1. `feature/project-bootstrap`
2. `feature/domain-types`
3. `feature/question-data`
4. `feature/home-page`
5. `feature/question-ui`
6. `feature/answer-selection`
7. `feature/answer-checking`
8. `feature/explanation-panel`
9. `feature/quiz-navigation`
10. `feature/result-summary`
11. `feature/wrong-answer-review`
12. `feature/random-quiz-mode`
13. `feature/exam-mode`
14. `feature/favorites`
15. `feature/localstorage-progress`
16. `feature/statistics-dashboard`
17. `refactor/storage-model`
18. `fix/result-summary-bug`

## Branch Plan Documents

- `feature/project-bootstrap`: [plans/feature-project-bootstrap/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-project-bootstrap/plan.md)
- `feature/domain-types`: [plans/feature-domain-types/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-domain-types/plan.md)
- `feature/question-data`: [plans/feature-question-data/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-question-data/plan.md)
- `feature/home-page`: [plans/feature-home-page/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-home-page/plan.md)
- `feature/question-ui`: [plans/feature-question-ui/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-question-ui/plan.md)
- `feature/answer-selection`: [plans/feature-answer-selection/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-answer-selection/plan.md)
- `feature/answer-checking`: [plans/feature-answer-checking/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-answer-checking/plan.md)
- `feature/explanation-panel`: [plans/feature-explanation-panel/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-explanation-panel/plan.md)
- `feature/quiz-navigation`: [plans/feature-quiz-navigation/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-quiz-navigation/plan.md)
- `feature/result-summary`: [plans/feature-result-summary/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-result-summary/plan.md)
- `feature/wrong-answer-review`: [plans/feature-wrong-answer-review/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-wrong-answer-review/plan.md)
- `feature/random-quiz-mode`: [plans/feature-random-quiz-mode/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-random-quiz-mode/plan.md)
- `feature/exam-mode`: [plans/feature-exam-mode/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-exam-mode/plan.md)
- `feature/favorites`: [plans/feature-favorites/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-favorites/plan.md)
- `feature/localstorage-progress`: [plans/feature-localstorage-progress/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-localstorage-progress/plan.md)
- `feature/statistics-dashboard`: [plans/feature-statistics-dashboard/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-statistics-dashboard/plan.md)
- `refactor/storage-model`: [plans/refactor-storage-model/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/refactor-storage-model/plan.md)
- `fix/result-summary-bug`: [plans/fix-result-summary-bug/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/fix-result-summary-bug/plan.md)

## Notes

현재 브랜치는 `feature/project-bootstrap`이며, 구현은 아직 시작하지 않고 문서와 계획을 먼저 정리하는 단계다.

