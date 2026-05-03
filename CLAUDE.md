# Frontend CLAUDE.md

## 역할과 범위

`frontend/`는 Dialearn의 Next.js 웹 UI다. 교수자의 강의실/시험 관리, 학생의 시험 목록/상세/응시/결과 화면, 인증 화면, 공용 레이아웃과 API 연동을 담당한다.

이 디렉터리는 독립 Git 리포지토리다. Git 명령은 워크스페이스 루트가 아니라 반드시 `frontend/` 안에서 실행한다.

## 스택

- Next.js 16 App Router, React 19, TypeScript 5
- Yarn 4.13.0
- Tailwind CSS v4, HeroUI v3, `@heroui/styles`
- TanStack Query v5, Zustand v5
- KaTeX / react-katex, dayjs
- ESLint 9, eslint-config-next, TanStack Query ESLint plugin
- Prettier 3, import sort, Tailwind/classnames/merge plugins

Yarn 명령은 Corepack으로 감싸지 말고 직접 실행한다.

## 명령어

모든 명령은 `cd /Users/user/Desktop/dev/univ/grade_4/intelligent-system-capstone/frontend && yarn ...` 형식으로 실행한다.

<!-- SOURCE-DERIVED: frontend commands from package.json -->

| 명령           | 용도                                     |
| -------------- | ---------------------------------------- |
| `yarn install` | Yarn 4 의존성 설치                       |
| `yarn dev`     | `next dev --turbopack` 개발 서버 실행    |
| `yarn build`   | production build 및 Next/TypeScript 검증 |
| `yarn start`   | production server 실행                   |
| `yarn lint`    | ESLint 검사                              |

<!-- /SOURCE-DERIVED -->

현재 `package.json`에는 테스트 스크립트가 없다. 테스트 추가 시 Playwright 기반 E2E와 유틸/훅 단위 테스트 스크립트를 함께 정의한다.

## 환경과 빌드 설정

- `next.config.ts`는 `output: 'standalone'`을 사용한다.
- `experimental.optimizePackageImports`는 `@heroui/react`, `@heroui/styles`에 적용되어 있다.
- `tsconfig.json`은 `strict: true`, `noEmit: true`, `moduleResolution: bundler`, `jsx: react-jsx`를 사용한다.
- `@/*` alias는 `src/*`를 가리킨다.
- `src/app/globals.css`에서 Tailwind와 HeroUI styles를 import한다.

## 아키텍처

Feature-Sliced Design 기준으로 `src/`를 구성한다.

```text
src/app/       # Next.js route, layout, server entry
src/entities/  # domain entity model, API, public exports
src/features/  # user action and interaction flow
src/widgets/   # composed page sections and screens
src/shared/    # API client, providers, UI primitives, shared libs
src/proxy.ts   # request proxy/middleware-like entry
```

현재 주요 slice는 다음과 같다.

- `entities`: `classroom`, `classroom-material`, `exam`, `organization`, `user`, `viewer`
- `features`: `sign-in`, `create-classroom`, `create-exam`, `generate-exam-questions`, `upsert-exam-question`, `delete-exam-question`, `take-exam-session`
- `widgets`: `layout`, `classroom`, `exam-management`, `student-exam-list`, `student-exam-detail`, `student-exam-session`, `student-exam-result`
- `shared`: `api/client.ts`, `api/types.ts`, `ui/providers.tsx`, `lib/dayjs.ts`, icons

## Layer 책임

- `app/`: route composition만 담당한다. 데이터/상태/상호작용이 커지면 widget/feature로 내린다.
- `entities/<name>/model`: 도메인 타입, 상태 모델, query key 등 엔티티 중심 모델.
- `entities/<name>/api`: 해당 엔티티 API 함수와 서버 통신.
- `features/<name>`: 사용자가 수행하는 하나의 행동 단위. mutation, form state, action UI를 포함할 수 있다.
- `widgets/<name>`: 여러 entity/feature/shared 조합으로 만든 화면 단위 섹션.
- `shared/api`: 공용 HTTP client, envelope, error, 공통 타입.
- `shared/ui`: provider, primitive, icon 등 도메인 의미가 없는 UI.

## Import 규칙

- 같은 slice 내부에서는 `./`, `../` relative import를 사용한다.
- 다른 slice나 다른 layer를 참조할 때는 `@/...` alias를 사용한다.
- slice 외부에서는 내부 파일을 직접 import하지 말고 각 slice의 public API인 `index.ts`를 우선 사용한다.
- 자기 slice 내부 구현 파일에서 자기 자신의 `index.ts` barrel을 다시 import하지 않는다.
- App Router page/layout에서 widget을 가져올 때는 widget public API를 사용한다.

예시:

- 같은 widget 내부: `./exam-card`
- entity 참조: `@/entities/exam`
- feature 참조: `@/features/create-exam`
- shared client: `@/shared/api/client`

## App Router 지침

`app/**/page.tsx`는 특별한 이유가 없는 한 서버 컴포넌트로 유지한다. 브라우저 API, local state, event handler, Zustand, TanStack Query client hook이 필요하면 하위 컴포넌트에만 `"use client"`를 둔다.

Route file은 다음에 집중한다.

- URL segment와 layout 조합
- 서버에서 가능한 인증/viewer 확인
- widget 전달을 위한 최소 props 구성

상호작용, form, client query/mutation은 feature/widget 하위 client component로 분리한다.

## 상태 관리와 API 연동

- 서버 상태는 TanStack Query를 우선 사용한다.
- 클라이언트 전용 UI 상태는 Zustand 또는 지역 state를 사용한다.
- 서버 상태를 Zustand에 복제하지 않는다.
- 공유 가능한 필터, 정렬, 페이지, 탭 상태는 가능한 URL/search params에 둔다.
- query key는 entity/feature 가까이에 두고, mutation 성공 시 명시적으로 invalidate/update한다.
- `@tanstack/query/exhaustive-deps`는 error로 설정되어 있으므로 query/mutation dependency를 정확히 유지한다.

## UI와 디자인 품질

기본 방향은 `DESIGN.md`의 Mintlify-inspired 문서형 제품 디자인이다.

- 밝고 공기감 있는 white canvas를 기본으로 한다.
- 브랜드 accent는 emerald/green 계열을 절제해서 사용한다.
- 정보 위계는 큰 타이포그래피 대비, 충분한 whitespace, 얇은 border로 만든다.
- card는 과한 shadow보다 1px subtle border와 넉넉한 padding을 우선한다.
- button/input/badge는 필요한 경우 full-pill radius를 사용한다.
- hover/focus/active 상태를 반드시 설계한다.
- generic dashboard template, 무의미한 gradient blob, 균일 카드 grid만으로 끝내지 않는다.

Tailwind는 기본 scale을 우선 사용한다. 임의 px class를 남발하지 말고, 반복되는 custom 값은 `globals.css`의 CSS 변수나 theme token으로 올린다.

## Styling 규칙

- Tailwind CSS v4와 `@heroui/styles`를 함께 사용한다.
- HeroUI v3 component 사용 전에는 현재 v3 문서를 확인한다.
- `tailwind-merge`나 기존 `cn`/merge 유틸이 있으면 class 병합에 사용한다.
- animation은 `transform`, `opacity`, `clip-path`, 제한적 `filter`처럼 compositor-friendly 속성을 우선한다.
- layout-bound 속성(`width`, `height`, `top`, `left`, `margin`, `padding`, `font-size`) animation은 피한다.
- 이미지에는 명시적 크기와 적절한 loading 전략을 둔다.

## TypeScript와 React 스타일

- exported function, public model, component props에는 명시적 타입을 둔다.
- local variable은 TypeScript 추론을 활용한다.
- `any`를 피하고 외부 입력은 `unknown`에서 좁힌다.
- component props는 named `interface` 또는 `type`으로 둔다.
- 특별한 이유 없이 `React.FC`를 사용하지 않는다.
- object/array state는 mutation하지 않고 새 객체를 반환한다.
- production code에 `console.log`를 남기지 않는다.

## 포맷과 린트

Prettier 설정은 다음을 따른다.

- print width 120
- tab width 4, tabs 사용
- semicolon 사용, single quote, trailing comma
- import sort plugin, Tailwind/classnames/merge plugin 사용

ESLint는 Next core-web-vitals, Next TypeScript, Prettier, TanStack Query recommended rule을 사용한다. `react/react-in-jsx-scope`, `react/prop-types`는 꺼져 있다.

## 테스트와 검증

프론트엔드 변경 후 최소한 다음을 실행한다.

```bash
cd /Users/user/Desktop/dev/univ/grade_4/intelligent-system-capstone/frontend && yarn lint
cd /Users/user/Desktop/dev/univ/grade_4/intelligent-system-capstone/frontend && yarn build
```

UI 변경은 가능하면 dev server를 띄우고 브라우저에서 직접 확인한다.

- 주요 breakpoint: 320, 375, 768, 1024, 1440
- keyboard navigation과 focus ring 확인
- loading, empty, error, disabled 상태 확인
- 학생 시험 응시 흐름은 답변 입력, 이동, 완료 정책, 결과 진입을 확인
- 교수자 시험/문항 생성 흐름은 생성 중, 실패, 재시도, 수정 상태를 확인

테스트 스크립트가 추가되면 새 기능은 TDD로 작성하고, critical user flow는 Playwright E2E로 보호한다.

## 접근성과 보안

- semantic HTML을 우선 사용한다.
- interactive element는 키보드로 접근 가능해야 한다.
- focus visible 상태를 숨기지 않는다.
- 색만으로 상태를 전달하지 않는다.
- 사용자 입력을 HTML로 주입하지 않는다. `dangerouslySetInnerHTML`은 sanitizer 없이 사용하지 않는다.
- 인증/권한 관련 UI는 서버 응답과 viewer 권한을 기준으로 방어적으로 렌더링한다.

## 참고 문서

- `DESIGN.md`: 시각 디자인 방향, palette, typography, component styling
- `package.json`: 스크립트와 주요 의존성
- `eslint.config.mjs`: lint rule source of truth
- `.prettierrc.js`: formatting source of truth
