<!-- Context: project-intelligence/technical | Priority: critical | Version: 2.0 | Updated: 2026-03-27 -->

# Technical Domain

프론트엔드 구현의 기준이 되는 기술 스택, API 연동 방식, 컴포넌트 규칙을 정리한다. 이 프로젝트는 Next.js App Router 기반 학습 역량 평가 UI이며, 백엔드 OpenAPI와 JWT 쿠키 인증 흐름에 맞춰 화면과 상태를 구성한다.

## Quick Reference

- **Core Concept**: Next.js 16 + React 19 + TypeScript strict 기반 프론트엔드
- **Key Points**:
  - App Router 구조를 사용하고 `src/app/`를 진입점으로 둔다.
  - UI는 Tailwind CSS 4와 HeroUI 조합을 기본으로 한다.
  - 서버 상태는 TanStack Query, 로컬 UI 상태는 컴포넌트 단위로 분리한다.
  - 인증은 JWT Cookie(`access_token`, `refresh_token`) 흐름을 전제로 한다.
  - API는 RESTful 리소스 구조와 `message/data/meta` 응답 래퍼를 따른다.

## Primary Stack

| Layer | Technology | Version | Notes |
|------|------------|---------|-------|
| Framework | Next.js | 16.2.1 | App Router 기반 프론트엔드 |
| UI Runtime | React | 19.2.4 | 함수형 컴포넌트 중심 |
| Language | TypeScript | 5.x | `strict: true` |
| Styling | Tailwind CSS | 4.x | 유틸리티 우선 스타일링 |
| UI Library | HeroUI | 3.x | 공통 UI 프리미티브 |
| Data Fetching | TanStack Query | lint plugin configured | 서버 상태 관리 |
| Global State | Zustand | project convention | UI 전역 상태 및 클라이언트 상호작용 상태 |

## API and Auth Pattern

- **Routing**: 리소스 중심 REST + 중첩 경로 (`/classrooms/{id}/materials`, `/exams/{id}/sessions`)
- **Responses**: 주로 `{ message, data, meta }` 구조
- **Validation**: 잘못된 입력은 `422` 응답 기준
- **Auth**: JWT Cookie 기반, `access_token` + `refresh_token`
- **Transport**: 파일 업로드는 `multipart/form-data`, 식별자는 주로 `uuid`

## Component Pattern

- 함수형 React 컴포넌트를 사용한다.
- props는 TypeScript `interface` 또는 `type`으로 명시한다.
- 재사용 UI는 HeroUI 기반으로 감싸고, 도메인 UI는 별도 컴포넌트로 분리한다.
- Tailwind 유틸리티 클래스 우선으로 스타일링한다.

```tsx
interface PageSectionProps {
  title: string;
  children: React.ReactNode;
}

export function PageSection({ title, children }: PageSectionProps) {
  return <section className="rounded-2xl p-6">{children}</section>;
}
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Files | kebab-case | `user-profile-card.tsx` |
| Components | PascalCase | `UserProfileCard` |
| Functions | camelCase | `fetchExamResults` |

## Code Standards

- TypeScript strict mode를 유지한다.
- App Router 기준으로 화면 구조를 만든다.
- Tailwind 유틸리티 우선, HeroUI는 필요 시 래핑해서 사용한다.
- 상대경로보다 `@/*` alias import를 우선한다.
- 서버 상태와 UI 상태를 분리한다.
- 전역 클라이언트 상태는 Zustand로 관리한다.
- JWT 토큰은 Zustand를 포함한 클라이언트 상태 저장소에 넣지 않는다.
- 폼과 사용자 입력은 호출 경계에서 검증한다.
- API 호출은 TanStack Query를 우선 사용한다.
- 필요 시 `suspensive` 라이브러리를 사용한다.

## Security Requirements

- 사용자 입력은 API 요청 전에 최소 검증을 수행한다.
- JWT 토큰은 쿠키 인증 흐름을 전제로 하며 클라이언트 저장소 남용을 피한다.
- `access_token`, `refresh_token` 같은 JWT는 Zustand에 저장하지 않는다.
- 인증이 필요한 요청은 쿠키 포함 전송을 기준으로 설계한다.
- 민감한 값은 localStorage/sessionStorage에 저장하지 않는다.
- 권한 의존 UI는 서버 응답과 인증 상태를 기준으로 노출한다.

## 📂 Codebase References

- `package.json` - Next.js, React, HeroUI, Tailwind, Yarn 버전
- `tsconfig.json` - `strict: true`, `@/*` alias 설정
- `eslint.config.mjs` - TanStack Query 규칙, no-relative-import-paths 규칙
- `next.config.ts` - `output: 'standalone'` 설정
- `src/app/layout.tsx` - App Router 루트 레이아웃, 로컬 폰트 적용
- `src/app/page.tsx` - 현재 최소 페이지 구조
- `https://dialearn.presso.ac/api/openapi.json` - 백엔드 API 계약 참조

## References

- `.opencode/context/project-intelligence/navigation.md`
- `.opencode/context/project-intelligence/business-domain.md`
- `https://dialearn.presso.ac/api/openapi.json`
