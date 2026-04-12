# ExamMate

## Overview

ExamMate는 시험 대비를 위한 예상문제풀이 웹앱 프로젝트입니다.  
사용자는 객관식 문제를 풀고, 정답 여부를 확인하고, 해설을 읽고, 오답을 다시 복습할 수 있도록 설계되어 있습니다.

## Status

현재 이 저장소는 기획과 초기 구조 설계 단계에 있습니다.  
아직 실제 앱 구현은 시작 전이며, 요구사항 문서화와 개발 계획 정리가 먼저 진행된 상태입니다.

## Features

이 프로젝트에서 구현하려는 핵심 기능은 다음과 같습니다.

- 객관식 문제풀이
- 보기 선택과 제출
- 정답/오답 판정
- 해설 확인
- 결과 요약
- 오답 복습
- 랜덤 모드
- 시험 모드
- 즐겨찾기
- 학습 통계
- LocalStorage 기반 학습 기록 유지

## Stack

프로젝트는 아래 기술 스택을 기준으로 진행합니다.

- Next.js
- TypeScript
- Tailwind CSS
- LocalStorage

## Documents

저장소에는 현재 아래 문서들이 정리되어 있습니다.

- `codex-project-guidelines-exam-webapp.md`: 프로젝트 요구사항과 작업 원칙
- `research.md`: 프로젝트 구조와 동작 방식에 대한 분석 문서
- `plan.md`: 현재 브랜치에서 수행할 작업 계획 문서

## Branch Strategy

이 프로젝트는 작은 단위의 브랜치 전략을 사용합니다.

- `main`: 비교적 안정적인 상태 유지
- `feature/*`: 기능 단위 개발
- `fix/*`: 버그 수정
- `refactor/*`: 구조 개선

현재 작업은 `feature/project-bootstrap` 브랜치 기준으로 진행됩니다.

## Direction

이 프로젝트는 단순한 퀴즈 페이지가 아니라,  
문제풀이 흐름, 오답 복습, 학습 기록 저장, 통계 확인까지 포함하는 학습용 웹앱을 목표로 합니다.
