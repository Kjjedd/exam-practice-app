# deploy/aws-s3-cloudfront Plan

## Branch Intent

이 문서는 ExamMate 웹앱을 `AWS S3 + CloudFront` 구조로 배포하기 위한 실전 계획 문서다.  
목표는 다음 세 가지를 동시에 만족하는 것이다.

1. 월 비용을 거의 들이지 않는 수준으로 유지한다.
2. HTTPS가 적용된 실제 운영 도메인으로 접속 가능하게 만든다.
3. 현재 앱의 데이터 구조를 그대로 유지한다.

특히 이 프로젝트는 서버 DB가 아니라 브라우저 `localStorage`/`sessionStorage`를 중심으로 동작하므로, 배포 후에도 다음 원칙을 유지해야 한다.

- 기본 활성 문제 세트는 모든 사용자에게 동일하다.
- 사용자가 업로드한 PDF 기반 문제 세트는 각 사용자 브라우저에만 저장된다.
- 다른 사용자의 업로드 데이터와 섞이지 않는다.

## Deployment Goal

최종적으로 사용자는 아래 흐름으로 앱을 사용한다.

1. 커스텀 도메인으로 앱에 접속한다.
2. 내장 기본 활성 문제 세트를 바로 볼 수 있다.
3. 필요하면 PDF를 업로드해 자신의 브라우저에만 별도 문제 세트를 저장한다.
4. 다른 사용자도 같은 도메인에 접속하지만, 업로드한 개인 문제 세트는 공유되지 않는다.

즉 이번 배포는 “공통 기본 세트 + 브라우저별 개인 저장” 구조를 유지하는 정적 프런트엔드 배포다.

## Detailed Scope

이번 배포 단계에서 다룰 범위는 아래와 같다.

- Next.js 앱을 정적 export 가능한 상태로 정리
- `out/` 정적 산출물 생성
- S3 버킷 준비
- CloudFront 배포 준비
- ACM 인증서 준비
- 커스텀 도메인 연결 준비
- 실제 배포 갱신 절차 정의

이번 단계에서 다루지 않는 범위는 아래와 같다.

- 사용자 로그인 시스템
- 서버 DB 저장
- 사용자 업로드 세트의 서버 동기화
- 다중 사용자 간 세트 공유
- 백엔드 API 서버 운영

## Architecture Decision

권장 배포 구조는 아래와 같다.

1. Next.js App Router 프로젝트를 정적 export
2. `out/` 폴더를 S3에 업로드
3. CloudFront가 S3를 origin으로 사용
4. ACM 인증서를 CloudFront에 연결
5. 커스텀 도메인을 CloudFront로 연결

이 구조를 쓰는 이유는 다음과 같다.

- S3 단독 정적 호스팅은 HTTPS가 부족하므로 운영용으로는 CloudFront가 필요하다.
- 사용자 수가 적으면 비용이 매우 낮다.
- 서버 없는 구조라 유지비가 거의 없다.
- 현재 앱은 클라이언트 중심 로직이라 정적 배포에 잘 맞는다.

## Static Export Requirements

이 앱을 S3에 배포하려면 Next.js를 정적 export 모드로 빌드해야 한다.

필수 확인 항목:

- `next.config.ts`에서 `output: "export"` 설정
- 필요 시 `trailingSlash: true` 적용
- App Router 경로가 정적 export를 막지 않는지 확인
- 런타임 서버 기능(예: 서버 액션, 동적 API route, Edge 전용 기능) 의존 여부 확인
- 브라우저 저장소 기반 기능이 정적 배포 후에도 동일하게 작동하는지 확인

## Deployment Principles

- 배포 전에는 항상 로컬 정적 빌드를 먼저 검증한다.
- `out/`이 실제 배포 산출물이다.
- S3는 정적 파일 저장소 역할만 맡는다.
- HTTPS 및 커스텀 도메인 처리는 CloudFront가 맡는다.
- 브라우저 저장 데이터는 배포 산출물에 포함되지 않는다.
- 배포 후 버전 갱신은 `S3 sync + CloudFront invalidation`으로 처리한다.

## AWS Resource Plan

### 1. S3

권장:

- 운영용 정적 파일 버킷 1개
  - 예: `www.example.com`

선택:

- 루트 도메인 리다이렉트 버킷 1개
  - 예: `example.com`
  - `example.com -> www.example.com` 리다이렉트용

권장 운영 형태:

- 가능하면 S3 public website endpoint 대신 CloudFront origin 전용으로 사용
- S3 직접 공개보다 CloudFront 경유 접근을 우선

### 2. CloudFront

CloudFront는 다음 책임을 가진다.

- HTTPS 제공
- 커스텀 도메인 연결
- 전 세계 캐시 제공
- 정적 자산 전달 최적화
- 필요 시 `403/404 -> index.html` fallback 제공

### 3. ACM

CloudFront에 연결할 TLS 인증서는 반드시 `us-east-1` 리전에 발급해야 한다.

권장 도메인 조합:

- `www.example.com`
- 필요 시 `example.com`

### 4. DNS

DNS는 다음 둘 중 하나로 연결한다.

- Route 53
- 현재 사용 중인 외부 DNS 제공업체

가장 쉬운 시작은 `www` 서브도메인만 먼저 연결하는 것이다.

## Deployment Execution Phases

### Phase 1. Local Readiness

목표:

- 정적 export가 실제로 가능한지 확인

세부 작업:

- `next.config.ts` 확인 및 수정
- `npm run build` 실행
- `out/` 생성 여부 확인
- 가능하면 로컬 정적 서버로 기본 동작 확인

완료 기준:

- 오류 없이 `out/` 생성
- 홈, 퀴즈, 결과, PDF 업로드 흐름 확인 가능

### Phase 2. AWS Resource Preparation

목표:

- S3, ACM, CloudFront 배포 준비

세부 작업:

- S3 버킷 생성
- ACM 인증서 발급 요청
- DNS 검증 레코드 추가
- CloudFront distribution 생성

완료 기준:

- 인증서 `Issued`
- CloudFront 배포 생성 완료

### Phase 3. Domain Connection

목표:

- 보유한 도메인을 CloudFront로 연결

세부 작업:

- `www` 도메인을 CloudFront에 연결
- 필요 시 apex 도메인 리다이렉트 정책 설계
- HTTPS 접속 확인

완료 기준:

- 실제 도메인에서 앱 정상 접속

### Phase 4. Deployment Update Flow

목표:

- 이후 변경사항 배포 절차 정리

세부 작업:

- `npm run build`
- `aws s3 sync out/ s3://BUCKET --delete`
- `aws cloudfront create-invalidation --distribution-id ... --paths "/*"`

완료 기준:

- 새 버전 반영 절차가 문서화됨

## Route Handling Notes

정적 배포에서는 라우팅이 중요하다.

확인해야 할 항목:

- `/quiz`
- `/result`
- `/review`
- `/favorites`
- `/dashboard`
- `/import`
- `/import/review`
- `/exam`

필요하면 CloudFront custom error response로 아래 fallback을 둔다.

- `403 -> /index.html (200)`
- `404 -> /index.html (200)`

단, `trailingSlash: true`와 정적 export 결과를 먼저 확인한 뒤 적용 여부를 판단한다.

## Data Persistence Notes

현재 데이터 저장 구조는 배포 후에도 다음처럼 유지된다.

- 기본 문제 세트:
  - 앱 번들에 포함
  - 모든 사용자 공통
- 업로드 문제 세트:
  - 각 사용자 브라우저 저장소에만 저장
  - 다른 사용자와 공유되지 않음

즉, 배포는 앱 코드와 기본 세트만 전달하고, 업로드 데이터는 사용자 환경에 남는다.

## Risks

### 1. Static Export Incompatibility

일부 App Router 기능이 정적 export와 충돌할 수 있다.  
배포 전에 반드시 `next build`로 확인해야 한다.

### 2. Deep Link Routing

CloudFront fallback이 없으면 경로 직접 접근 시 403/404가 날 수 있다.

### 3. Domain DNS Mismatch

도메인 DNS 제공업체와 CloudFront 연결 방식이 맞지 않으면 인증서 검증이나 접속이 실패할 수 있다.

### 4. User Data Misunderstanding

사용자가 업로드한 PDF 세트가 “계정 저장”이 아니라 “브라우저 저장”이라는 점을 이해하지 못할 수 있다.

### 5. Cache Staleness

CloudFront 캐시 무효화를 하지 않으면 이전 정적 자산이 남아 보일 수 있다.

## Validation

- [ ] `next.config.ts`가 정적 export 기준에 맞다.
- [ ] `npm run build`가 통과한다.
- [ ] `out/` 폴더가 생성된다.
- [ ] 정적 결과물에서 홈 화면이 열린다.
- [ ] 기본 활성 문제 세트가 보인다.
- [ ] 업로드 흐름이 브라우저 저장 기반으로 유지된다.
- [ ] S3 업로드가 완료된다.
- [ ] ACM 인증서가 `Issued` 상태다.
- [ ] CloudFront 배포가 정상 동작한다.
- [ ] 커스텀 도메인에서 HTTPS 접속이 된다.

## Success Criteria

- 사용자가 커스텀 도메인으로 앱에 접속할 수 있다.
- 모든 사용자에게 동일한 기본 문제 세트가 보인다.
- 각 사용자의 PDF 업로드 세트는 각자 브라우저에만 저장된다.
- 운영 비용이 매우 낮은 수준으로 유지된다.
- 코드 수정 후 재배포 절차가 단순하다.

## Recommended First Execution Step

실제 배포를 시작할 때 첫 단계는 AWS 콘솔이 아니라 로컬 정적 export 검증이다.

권장 순서:

1. `next.config.ts`를 정적 export 기준으로 맞춘다.
2. `npm run build`를 실행한다.
3. `out/`이 생성되는지 확인한다.
4. 그 뒤 AWS 리소스 생성으로 넘어간다.
