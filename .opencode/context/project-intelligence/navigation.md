<!-- Context: project-intelligence/nav | Priority: high | Version: 1.1 | Updated: 2026-03-27 -->

# Project Intelligence

이 디렉터리는 프로젝트의 비즈니스 맥락과 프론트엔드 구현 규칙을 빠르게 파악하기 위한 진입점이다.

## Quick Routes

| What You Need | File | Description |
|---------------|------|-------------|
| 프론트엔드 기술 기준 | `technical-domain.md` | Next.js, API 연동, 컴포넌트/보안 패턴 |
| 서비스 목적과 사용자 | `business-domain.md` | 실시간 AI 평가 목적, 사용자 여정, 가치 제안 |
| 비즈니스-기술 연결 | `business-tech-bridge.md` | 요구사항과 구현 방향 연결 |
| 의사결정 배경 | `decisions-log.md` | 주요 결정과 이유 |
| 진행 중 메모 | `living-notes.md` | 열린 이슈와 후속 작업 |

## Deep Dives

| File | Priority | Use When |
|------|----------|----------|
| `technical-domain.md` | critical | UI 패턴, API 호출, 인증 규칙이 필요할 때 |
| `business-domain.md` | critical | 제품 목적, 역할별 여정, 실시간 평가 맥락이 필요할 때 |
| `business-tech-bridge.md` | high | 요구사항을 기능 설계로 옮길 때 |

## 📂 Codebase References

- `src/app/` - App Router 진입점
- `package.json` - 현재 프론트엔드 스택과 스크립트
- `tsconfig.json` - 타입스크립트/alias 규칙
- `eslint.config.mjs` - 코드 품질 및 TanStack Query 규칙

## Related Files

- `.opencode/context/core/standards/project-intelligence-management.md`
- `.opencode/context/core/context-system/standards/mvi.md`
