# feature/issue-to-pr-automation

## Goal

ExamMate 퍼블릭 저장소에서 사용자가 올린 GitHub Issue 중 **해설 보완 제안**과 **제한된 범위의 문제 오류 제안**을 기반으로,  
관리자의 반복 작업을 줄이기 위해 **자동 PR 생성 워크플로우**를 구축한다.

이 기능의 최종 목표는 아래와 같다.

1. 사용자가 웹앱 또는 GitHub에서 구조화된 Issue를 제출한다.
2. GitHub Actions가 Issue 본문을 파싱한다.
3. 자동 반영이 허용된 제안만 데이터 파일에 적용한다.
4. 변경 내용을 담은 브랜치와 PR을 자동 생성한다.
5. CI가 문제세트 무결성, 타입, 빌드를 자동 검증한다.
6. 관리자가 PR을 검수하고 승인 후 머지한다.
7. `main` 머지 시 기존 자동 배포 흐름으로 웹앱에 반영한다.

즉, 이 기능은 **자동 머지**가 아니라 **자동 PR 생성 + 수동 승인 + 자동 배포** 구조를 만드는 것이 목적이다.

---

## Why This Structure

현재 저장소는 이미 다음 흐름을 갖고 있다.

- `main` 머지 시 GitHub Actions로 자동 배포
- 퍼블릭 사용자용 GitHub Issue 제안 흐름
- 문제/정답/해설이 JSON 데이터 세트로 관리됨

하지만 아직은 사용자의 제안을 반영하려면 관리자가 직접:

1. 이슈를 읽고
2. 문제 번호를 찾고
3. 데이터 파일을 열고
4. 해설이나 문장을 수정하고
5. 브랜치/PR/배포를 수행해야 한다

이 과정을 전부 수동으로 하면:

- 작은 해설 수정도 반복 비용이 큼
- 리뷰 속도가 느려짐
- 퍼블릭 기여를 많이 받을수록 병목이 생김

반면 정답 변경까지 자동화하면:

- 잘못된 제안이 곧바로 데이터 품질을 오염시킬 수 있음
- 문제세트 신뢰도가 무너질 수 있음

따라서 가장 균형 잡힌 구조는:

- **자동 반영 가능한 범위는 작고 안전하게 제한**
- **자동 PR까지는 생성**
- **최종 병합은 사람 검수**

로 두는 것이다.

---

## Problem Statement

사용자 제안을 GitHub Issue로 수집하는 것만으로는 협업의 출발점은 만들 수 있지만,  
실제 반영 과정은 여전히 수동이다.

현재 부족한 지점은 다음과 같다.

1. Issue 내용을 JSON 데이터 변경으로 변환하는 자동화가 없다.
2. 자동 반영 가능/불가능 제안을 분리하는 규칙이 없다.
3. 정답 보호를 전제로 한 워크플로우가 아직 없다.
4. 자동으로 PR을 만들어 관리자 검토로 넘기는 흐름이 없다.

이번 기능은 이 빈 부분을 메우기 위한 것이다.

---

## Non-Negotiable Safety Rules

이 기능에서 가장 중요한 원칙은 **정답 보호**다.

### Never auto-edit

자동화가 절대 직접 수정하면 안 되는 필드:

- `answers`
- 문제 번호
- 보기 개수
- 문제 세트 ID
- 문제 순서

### Conditionally auto-editable

엄격한 조건 하에서만 자동 수정 가능한 필드:

- `explanation`
- `question` 본문 오타
- 보기 문자열 오타
- 해설 보충 텍스트

### Human-review-only categories

다음 제안은 이슈를 받아도 자동 PR 생성 대상이 아니다.

- 정답 변경 제안
- 복수정답 변경 제안
- 보기 개수 증감
- 문제 번호 교체
- 구조 변경이 필요한 JSON/정책 블록 수정

이런 이슈는 자동으로 라벨링만 하고, PR은 만들지 않거나 `manual-review-required` 상태로 남긴다.

---

## Automation Scope

### In scope

- `해설 보완 제안` Issue를 파싱해 explanation 필드 수정
- `문제 오타/보기 오타` 중 단순 텍스트 교정 반영
- 허용된 변경만 반영한 자동 브랜치 생성
- 자동 PR 생성
- CI 검증
- 라벨 및 코멘트 자동 부착

### Out of scope

- 정답 자동 변경
- 정답 의심 이슈 자동 PR 생성
- 여러 문제를 한 번에 수정하는 대형 일괄 이슈
- 문제 구조 자체를 바꾸는 자동 편집
- 관리자의 승인 없이 `main` 자동 머지

---

## User and Maintainer Stories

### Story 1: 외부 사용자 해설 보완 제안

사용자는 특정 문제에서 해설이 부족하다고 느낀다.  
Issue 템플릿으로 문제 번호와 제안 해설을 남긴다.  
Actions가 이를 읽고 해당 문제의 해설만 수정한 PR을 자동 생성한다.

### Story 2: 외부 사용자 문제 오타 제안

사용자는 보기나 본문 오타를 발견한다.  
Issue에 수정 제안을 남긴다.  
만약 단순 문자열 교정으로 판단 가능하면 자동 PR을 만들고, 아니면 수동 검토 대상으로 남긴다.

### Story 3: 외부 사용자 정답 의심 제안

사용자는 정답이 잘못되었다고 제안한다.  
이슈는 생성되지만 자동 PR은 만들지 않는다.  
대신 `answer-review`, `manual-review-required` 라벨을 달아 관리자가 별도로 다룬다.

### Story 4: 관리자 검수

관리자는 자동 PR을 열어 diff와 CI 결과만 보고 빠르게 승인 여부를 결정할 수 있어야 한다.

---

## High-level Workflow

### Phase A. Issue intake

1. 사용자가 Issue 템플릿으로 제안 제출
2. Issue에 문제 번호, 문제 세트, 제안 유형, 제안 내용이 구조적으로 들어감

### Phase B. Workflow trigger

3. 특정 라벨 또는 특정 템플릿의 `issues` 이벤트가 발생
4. Actions 워크플로우가 실행됨

### Phase C. Issue parsing and validation

5. 워크플로우가 이슈 본문 파싱
6. 문제 번호와 세트 ID 확인
7. 제안 유형이 자동 반영 가능한지 판별
8. 허용 범위를 벗어나면 자동 PR 생성 없이 코멘트/라벨만 추가

### Phase D. Safe transformation

9. 허용된 수정만 JSON 데이터에 적용
10. 변경 필드가 보호 범위를 넘지 않는지 재검증

### Phase E. Automated PR generation

11. 전용 브랜치 생성
12. 수정 커밋 생성
13. PR 자동 생성
14. 원본 Issue와 PR를 상호 링크

### Phase F. CI and human review

15. 기존 CI가 `typecheck`, `build`, 데이터 무결성 검사 수행
16. 관리자가 PR 검수 후 머지
17. `main` 머지 시 기존 배포 워크플로우 실행

---

## GitHub Issue Contract

자동화는 자유 텍스트를 다 해석하지 않는다.  
대신 **정해진 필드 구조**를 계약처럼 사용한다.

### Required metadata

이슈 템플릿에는 반드시 아래 필드가 들어 있어야 한다.

- 문제 세트 ID
- 문제 번호
- 제안 유형
- 현재 해설 또는 현재 문장
- 제안하는 새 해설 또는 새 문장
- 근거 또는 설명

### Accepted suggestion types for auto PR

- `explanation-improvement`
- `question-typo`
- `choice-typo`

### Rejected from auto PR

- `answer-review`
- `question-structure-change`
- `choice-count-change`
- `policy-block-missing`

이 경우 워크플로우는:

- PR을 만들지 않고
- 이유를 코멘트로 남기고
- 라벨만 부착한다

---

## Data Update Strategy

현재 문제 데이터는 대형 JSON 세트 파일로 관리된다.

이번 자동화는 다음 파일을 대상으로 동작한다.

- `data/default-question-set-base-1-725.json`
- `data/default-question-set-verified-726-1019.json`

### Resolution rules

1. 문제 번호 기준으로 대상 문항 탐색
2. 자동 반영 허용 필드만 수정
3. 다른 필드는 byte-level 또는 semantic diff로 변경되지 않았는지 검증

### Safe write rules

- 한 이슈는 한 문제만 수정하도록 제한
- 한 PR은 한 이슈와 연결
- 변경 파일 수를 최소화
- 보호 필드 변경이 감지되면 즉시 실패

---

## Branch and PR Naming Convention

자동 PR은 사람이 봐도 맥락이 분명해야 한다.

### Branch naming

- `auto/issue-123-explanation-644`
- `auto/issue-124-question-typo-731`

### Commit message

- `docs: apply explanation suggestion for question 644`
- `fix: apply typo suggestion for question 731`

### PR title

- `docs: apply issue #123 explanation improvement for question 644`
- `fix: apply issue #124 typo correction for question 731`

---

## Workflow Design

### Workflow 1. `issue-to-pr.yml`

트리거:

- `issues` `opened`
- `issues` `edited`
- 필요 시 특정 라벨 추가 이벤트

책임:

- 템플릿 형식 검증
- 자동 반영 가능 여부 판정
- 데이터 수정
- 브랜치/커밋/푸시
- PR 생성
- 이슈에 결과 코멘트 작성

### Workflow 2. existing CI reuse

이미 있는 PR 검증 워크플로우를 그대로 사용한다.

필수 검증:

- `npm run typecheck`
- `npm run build`
- 데이터 무결성 검사 스크립트

### Workflow 3. optional follow-up labeling

머지 불가 또는 수동 검토 대상일 때:

- `manual-review-required`
- `answer-review`
- `needs-source`

같은 라벨을 자동으로 추가할 수 있다.

---

## Validation Rules

자동 PR 생성 전 반드시 통과해야 하는 검증 규칙:

### Issue-level validation

- 문제 번호가 숫자인가
- 문제 번호가 실제 세트에 존재하는가
- 제안 유형이 정의된 값인가
- 제안 텍스트가 비어 있지 않은가

### Data-level validation

- JSON 파싱이 가능한가
- 대상 문항이 정확히 1개인가
- 보호 필드가 바뀌지 않았는가
- 수정 길이가 과도하게 크지 않은가

### Build-level validation

- `npm run typecheck`
- `npm run build`

### Review-level validation

- PR description에 원본 Issue 링크 포함
- 수정 대상 번호 표시
- 변경 필드 표시

---

## Failure Modes and Response Strategy

### Failure 1. Issue format invalid

대응:

- PR 생성하지 않음
- `invalid-issue-format` 라벨 추가
- “필수 필드가 누락되었다”는 코멘트 작성

### Failure 2. Protected field requested

대응:

- PR 생성하지 않음
- `manual-review-required`, `answer-review` 라벨 추가
- “정답 변경은 자동 처리되지 않는다”는 코멘트 작성

### Failure 3. Data file lookup failed

대응:

- PR 생성하지 않음
- `needs-maintainer-triage` 라벨 추가

### Failure 4. Build/typecheck failure

대응:

- PR은 생성할 수 있으나 draft 또는 labeled failure 상태로 둔다
- 코멘트에 실패 이유를 남긴다

### Failure 5. Duplicate automation

동일 이슈에 대해 PR이 이미 열려 있으면:

- 새 PR 생성 금지
- 기존 PR 링크를 코멘트로 안내

---

## Security and Abuse Considerations

퍼블릭 저장소이므로 자동화는 악용 가능성을 고려해야 한다.

### Abuse risks

- 장난성 이슈 대량 생성
- 긴 텍스트를 넣어 워크플로우를 깨뜨리려는 시도
- 정답 변경을 우회하려는 시도
- 여러 문제를 한 이슈에 몰아넣는 시도

### Mitigations

- 한 이슈 = 한 문제 제한
- 허용 필드 화이트리스트
- 문자열 길이 제한
- 문제 번호 범위 제한
- 정답 관련 키워드 감지 시 수동 검토 분기
- 자동 생성 PR 수 상한

---

## Maintainer Review Model

자동화의 목적은 검수를 없애는 것이 아니라 **검수 비용을 줄이는 것**이다.

관리자는 PR에서 아래만 보면 된다.

1. 이슈 링크
2. 변경 문제 번호
3. 변경 필드
4. CI 통과 여부
5. 제안 내용의 타당성

즉, 관리자는 더 이상 JSON 파일을 수동으로 찾아 열 필요 없이  
자동으로 생성된 PR diff와 CI 결과만 확인하면 된다.

---

## README and Public Contribution Docs

퍼블릭 저장소 사용자에게 아래 내용을 문서화해야 한다.

- 어떤 제안이 자동 PR 대상인지
- 어떤 제안은 수동 검토 대상인지
- 정답 변경은 왜 자동화하지 않는지
- 제안 후 어떤 흐름으로 반영되는지

README에는 최소 다음 섹션이 필요하다.

- `How to suggest fixes`
- `What happens after you submit an issue`
- `Why answer changes require review`

---

## Deliverables

이 계획이 구현되면 아래 산출물이 있어야 한다.

1. Issue-to-PR 자동화 워크플로우 YAML
2. 이슈 파싱/검증 스크립트
3. 자동 수정 적용 스크립트
4. 브랜치/커밋/PR 생성 로직
5. 라벨/코멘트 자동화
6. README 공개 기여 가이드 업데이트

---

## Success Criteria

이 기능이 성공했다고 볼 기준:

1. 해설 보완 이슈 하나가 자동으로 PR까지 이어진다
2. PR은 보호 필드를 변경하지 않는다
3. CI가 통과한다
4. 관리자가 PR을 검토 후 `main`에 머지할 수 있다
5. 머지 후 기존 배포 워크플로우가 정상 실행된다
6. 정답 변경 이슈는 자동 PR이 아니라 수동 검토 상태로 남는다

---

## Implementation Phases

### Phase 1. Issue contract hardening `[completed]`

- 현재 이슈 템플릿을 자동화 친화적으로 정리
- 필수 필드 고정
- 자동 반영 가능한 제안 유형 정의

### Phase 2. Parsing and guardrail engine `[completed]`

- 이슈 본문 파싱
- 허용/비허용 제안 분기
- 보호 필드 감지

### Phase 3. Safe patch generation `[completed]`

- 문제 번호 기반 대상 문항 수정
- 해설/오타 자동 반영 로직
- JSON 안전 저장

### Phase 4. Automated PR creation `[completed]`

- 브랜치, 커밋, PR 자동 생성
- 이슈와 PR 링크 연결

### Phase 5. Public docs and review operations `[completed]`

- README 가이드 보강
- 운영 라벨 및 리뷰 규칙 정리

---

## Notes

이 기능의 핵심은 “이슈가 올라오면 자동으로 코드가 배포된다”가 아니다.  
정확한 목표는 다음 한 문장으로 정리할 수 있다.

> 사용자의 구조화된 제안을 자동으로 안전한 PR로 바꾸고, 최종 병합은 항상 사람 검수 후에만 일어나도록 만든다.

이 원칙을 벗어나지 않는 범위에서만 자동화를 확장한다.
