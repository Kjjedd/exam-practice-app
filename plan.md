# ExamMate Development Plan Index

## Overview

이 문서는 ExamMate 프로젝트 전체 개발 단계의 개요와 브랜치별 계획 문서 위치를 정리한 인덱스 문서다.  
실제 구현은 기능 단위 브랜치로 나누어 진행하며, 각 브랜치의 세부 계획은 별도 `plan.md` 문서로 관리한다.

현재 계획은 기존의 "정적 샘플 문제 JSON 준비" 중심 흐름에서 아래 구조를 우선하는 방향으로 조정되었다.

1. 사용자가 문제와 답이 포함된 PDF를 업로드한다.
2. 앱이 PDF를 내부 문제 데이터 후보로 변환한다.
3. 사용자가 추출 결과를 검수하고 수정한다.
4. 확정된 문제 세트를 브라우저에 저장하고 활성 문제 세트로 지정한다.
5. 이후 문제풀이, 결과, 복습, 통계 기능은 저장된 활성 문제 세트를 기준으로 동작한다.

즉, 앞으로의 제품 기준선은 "저장소에 포함된 샘플 문제 파일"이 아니라 "사용자가 가져와서 확정한 문제 세트"다.

## Development Principles

- 한 브랜치는 하나의 작업 목적만 담당한다.
- 기능은 의존성을 고려해 단계적으로 구현한다.
- 구조 변경은 설명 가능해야 한다.
- UI, 로직, 데이터, 저장 계층은 분리해 다룬다.
- 구현 전에 계획을 먼저 정리한다.
- PDF는 앱이 직접 문제풀이 엔진에 연결하지 않고, 내부 `Question[]` 구조로 정규화한 뒤 검수 후 저장한다.
- 검수 이전의 추출 후보와 검수 완료 후의 저장 데이터는 다른 상태로 본다.

## Development Sequence

1. `feature/project-bootstrap`
2. `feature/domain-types`
3. `feature/pdf-upload-intake`
4. `feature/pdf-import-review`
5. `feature/question-data`
6. `feature/home-page`
7. `feature/question-ui`
8. `feature/answer-selection`
9. `feature/answer-checking`
10. `feature/explanation-panel`
11. `feature/quiz-navigation`
12. `feature/result-summary`
13. `feature/wrong-answer-review`
14. `feature/random-quiz-mode`
15. `feature/exam-mode`
16. `feature/favorites`
17. `feature/localstorage-progress`
18. `feature/statistics-dashboard`
19. `refactor/storage-model`
20. `fix/result-summary-bug`
21. `feature/community-contribution-flow`
22. `feature/issue-to-pr-automation`

## Branch Plan Documents

- `feature/project-bootstrap`: [plans/feature-project-bootstrap/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-project-bootstrap/plan.md)
- `feature/domain-types`: [plans/feature-domain-types/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-domain-types/plan.md)
- `feature/pdf-upload-intake`: [plans/feature-pdf-upload-intake/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-pdf-upload-intake/plan.md)
- `feature/pdf-import-review`: [plans/feature-pdf-import-review/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-pdf-import-review/plan.md)
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
- `feature/community-contribution-flow`: [plans/feature-community-contribution-flow/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-community-contribution-flow/plan.md)
- `feature/issue-to-pr-automation`: [plans/feature-issue-to-pr-automation/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/feature-issue-to-pr-automation/plan.md)
- `refactor/storage-model`: [plans/refactor-storage-model/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/refactor-storage-model/plan.md)
- `fix/result-summary-bug`: [plans/fix-result-summary-bug/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/fix-result-summary-bug/plan.md)

## Notes

현재 문서는 PDF 업로드 기반 제품 흐름으로 재정렬된 최신 인덱스다.  
이미 완료된 초기 브랜치가 있더라도, 이후 구현과 리비전은 이 문서에 정의된 순서를 기준으로 진행한다.

## Deployment Plans

- `deploy/aws-s3-cloudfront`: [plans/deploy-aws-s3-cloudfront/plan.md](/Users/jongeon/Desktop/Study/exam-practice-app/plans/deploy-aws-s3-cloudfront/plan.md)
