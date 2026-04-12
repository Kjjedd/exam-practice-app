# feature/project-bootstrap Plan

## Goal

프로젝트의 실행 가능한 기본 골격을 만든다.  
이 단계의 목적은 이후 기능 브랜치들이 안정적으로 작업할 수 있는 시작점을 만드는 것이며, 실제 퀴즈 기능 구현은 포함하지 않는다.

## Branch Intent

이 브랜치는 "앱이 실행되고, 앞으로 기능을 얹을 수 있는 구조가 준비된 상태"를 만드는 데만 집중한다.

- [x] 실행 가능한 Next.js 앱 골격을 만든다.
- [x] App Router 기준의 최소 라우트 구조를 준비한다.
- [x] TypeScript와 Tailwind CSS가 정상 동작하는지 확인 가능한 상태를 만든다.
- [x] 이후 브랜치에서 사용할 디렉터리를 placeholder 수준으로 준비한다.

문서 메모 기준으로, 이 단계에서는 구조만 준비하고 기능 구현은 하지 않는다.  
현재 브랜치에서는 이 원칙을 유지한 상태로 부트스트랩 작업만 완료했다.

## Scope

- [x] Next.js 프로젝트 초기화
- [x] App Router 기본 구조 준비
- [x] TypeScript 기반 확인
- [x] Tailwind CSS 기반 확인
- [x] 기본 레이아웃 및 엔트리 페이지 준비
- [x] 향후 기능용 디렉터리 생성(placeholder 수준, 기능 구현 없음)

## Detailed Scope

이번 단계에서 허용되는 작업은 아래와 같다.

- 프로젝트 루트 설정 파일 구성
- `app/layout.tsx`와 `app/page.tsx` 준비
- `app/globals.css` 준비
- `app/quiz`, `app/result`, `app/review`, `app/dashboard`, `app/favorites` 디렉터리 생성
- `components`, `lib`, `data`, `public` 디렉터리 생성
- 추후 브랜치를 위한 하위 디렉터리 placeholder 생성
- 최소 홈 페이지 수준의 문구와 레이아웃 구성

이번 단계에서는 "동작 확인을 위한 최소 UI"까지만 허용하고, 실제 서비스 기능은 넣지 않는다.

## Out of Scope

- 문제 타입 설계
- 문제 데이터 작성
- 문제 렌더링 상세 UI
- 보기 선택 상태 관리
- 제출 버튼 동작
- 채점 로직
- 해설 UI
- 결과 집계
- 오답 복습 흐름
- 랜덤/시험 모드
- 즐겨찾기
- 퀴즈 로직 구현
- 저장/통계 기능 구현

## Deliverables

이번 브랜치 종료 시점에 기대하는 산출물은 아래와 같다.

- [x] `app/layout.tsx`
- [x] `app/page.tsx`
- [x] `app/globals.css`
- [x] `app/quiz/`
- [x] `app/result/`
- [x] `app/review/`
- [x] `app/dashboard/`
- [x] `app/favorites/`
- [x] `components/`, `lib/`, `data/`, `public/` 디렉터리 생성
- [x] Next.js / TypeScript / Tailwind 기본 설정 파일 정리
- [x] 최소 홈 페이지 렌더링

## Proposed Directory Skeleton

이번 단계에서는 아래 수준의 뼈대를 준비하는 것을 목표로 한다.

```text
app/
  layout.tsx
  page.tsx
  globals.css
  quiz/
  result/
  review/
  dashboard/
  favorites/
components/
  common/
  question/
  result/
  review/
  dashboard/
lib/
  types/
  quiz/
  storage/
  utils/
data/
public/
```

여기서 핵심은 "기능을 채워 넣는 것"이 아니라 "다음 브랜치가 구조를 흔들지 않고 바로 작업할 수 있게 만드는 것"이다.

## Success Criteria

아래 조건을 만족하면 `feature/project-bootstrap` 단계가 완료된 것으로 본다.

- [x] 프로젝트가 로컬에서 실행된다.
- [x] `/` 경로에서 기본 홈 페이지가 보인다.
- [x] App Router 기반 구조가 정상 동작한다.
- [x] Tailwind 스타일이 실제 화면에 반영된다.
- [x] 이후 브랜치가 사용할 기본 디렉터리 구조가 준비된다.
- [x] 아직 기능 구현 없이도 구조의 방향성이 문서와 일치한다.

## Validation

- [x] `npm run dev` 실행 시 에러 없이 앱이 실행된다.
- [x] `/` 경로에서 기본 홈 페이지가 렌더링된다.
- [x] App Router 구조가 정상 동작한다.
- [x] Tailwind 스타일이 실제 화면에 적용된다.

추가 검증:

- [x] `npm run typecheck`
- [x] `npm run build`

## Notes

- placeholder 디렉터리는 생성하되, 실제 기능 코드까지 미리 넣지 않는다.
- 홈 화면은 "실행 확인용 최소 진입 페이지" 수준이면 충분하다.
- 이 단계에서 너무 많은 구조를 확정하지 않는다.
- 다음 단계인 `feature/domain-types`에서 타입 체계를 구체화할 수 있도록 여지를 남긴다.

## Completion Status

`feature/project-bootstrap` 단계의 계획된 작업은 완료되었다.  
현재 저장소는 다음 브랜치인 `feature/domain-types`로 넘어갈 수 있는 실행 가능한 기본 구조를 갖춘 상태다.

## Next

다음 브랜치는 `feature/domain-types`
