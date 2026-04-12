# ExamMate

ExamMate is a responsive web app for exam practice and review.  
It is designed for personal study use and focuses on solving multiple-choice questions, checking answers instantly, reading explanations, reviewing incorrect answers, and tracking learning progress over time.

## Project Status

This repository is currently in the planning and bootstrap stage.

- Project requirements are documented
- Research and architecture notes are documented
- Development plan and branch breakdown are documented
- Application implementation has not started yet

## Planned Core Features

- Multiple-choice question solving
- Choice selection and answer submission
- Instant answer checking
- Explanation view after submission
- Result summary with score breakdown
- Incorrect answer review flow
- Random quiz mode
- Exam mode
- Favorites
- Learning statistics dashboard
- LocalStorage-based progress persistence

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- LocalStorage

## Repository Documents

- `codex-project-guidelines-exam-webapp.md`: project rules and implementation requirements
- `research.md`: deep analysis of product structure, flows, and architecture
- `plan.md`: development phases, feature breakdown, and branch strategy

## Development Strategy

This project follows a small-scope feature branch workflow.

- `main` is kept as the most stable branch
- work is done on separate feature branches
- one branch should focus on one purpose
- changes are planned before implementation
- major structure or data changes should be explained before being made

Example branches:

- `feature/project-bootstrap`
- `feature/domain-types`
- `feature/question-data`
- `feature/question-ui`
- `feature/answer-checking`
- `feature/localstorage-progress`

## Planned App Structure

```text
app/
  page.tsx
  quiz/page.tsx
  result/page.tsx
  review/page.tsx
  dashboard/page.tsx
  favorites/page.tsx
components/
  common/
  question/
  result/
  review/
  dashboard/
data/
  questions.json
lib/
  storage/
  quiz/
  utils/
  types/
```

## Product Direction

ExamMate is not intended to be just a simple quiz page.  
The goal is to build a local-state-based study system with clear quiz session flow, review loops, and persistent learning records.

The implementation priorities are:

1. Establish stable project structure
2. Define data and type models
3. Build the quiz-solving flow
4. Add result and review flows
5. Extend with modes, favorites, persistence, and statistics

## Next Step

The first implementation target is `feature/project-bootstrap`, which will set up the Next.js App Router project structure, Tailwind, and the base route/layout skeleton for later features.

