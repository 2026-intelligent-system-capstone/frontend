<!-- Context: project-intelligence/business | Priority: critical | Version: 2.0 | Updated: 2026-03-27 -->

# Business Domain

이 서비스는 대학생의 지식 이해도와 사고 과정을 더 깊게 평가하기 위한 대화형 AI 기반 학습 역량 평가 플랫폼이다. 학생은 실시간 대화형 평가를 통해 자신의 사고를 설명하고, 교수자는 강의실 운영과 평가 설계, 결과 분석을 통해 수업 개선 인사이트를 얻는다.

## Quick Reference

- **Core Concept**: 객관식 중심 평가를 실시간 대화형 역량 평가로 전환하는 교육 서비스
- **Key Points**:
  - 학생은 `나의 평가`에서 시험에 입장하고 AI와 실시간으로 평가를 진행한다.
  - 평가는 `gpt-realtime` 기반 실시간 상호작용을 전제로 한다.
  - AI는 답변 맥락을 바탕으로 심층 질문을 3회 이상 이어갈 수 있어야 한다.
  - 교수자는 강의실, 시험 범위, 루브릭, 재응시 정책, 리포트를 관리한다.
  - 결과는 학생 리포트와 학습 대시보드, 교수자 통합 리포트로 이어진다.

## Product Identity

| Item | Detail |
|------|--------|
| Product | 대화형 AI 기반 학습 역량 평가 플랫폼 |
| Category | Education |
| Device | Web |
| Primary Users | 학생, 교수자 |
| Core Mode | 실시간 대화형 평가 + 학습 분석 |

## User Problems

- 객관식·단답형 평가는 암기 위주 성과는 보이지만 사고 과정과 이해 깊이를 드러내기 어렵다.
- 주관식 평가는 평가 품질은 높일 수 있지만 채점 비용과 일관성 문제가 크다.
- 학생은 결과만 받고 왜 틀렸는지, 무엇을 더 학습해야 하는지 알기 어렵다.
- 교수자는 학생별 강점/약점과 수업 차원의 취약 개념을 빠르게 파악하기 어렵다.

## Solution and Differentiation

- 학생 답변을 실시간으로 분석해 AI가 맥락 기반 후속 질문을 이어간다.
- `gpt-realtime` 기반 평가 흐름으로 질문 확인, 음성 상호작용, 즉시 응답성을 제공한다.
- 루브릭, 시험 범위 자료, 시험 유형, 재응시 정책을 교수자가 직접 설계한다.
- 평가 후 학생은 점수, 강점/약점, 문항별 피드백, 학습 추이를 확인한다.
- 교수자는 학생별 리포트와 통합 분포를 통해 수업 개선 포인트를 찾는다.

## Core Journeys

### Student Journey

로그인 후 `나의 평가` 목록에서 시험을 찾고, 범위 자료와 평가 기준을 확인한 뒤 대화형 평가에 입장한다. 평가 중에는 질문 확인(TTS), 답변 입력(STT/텍스트), 마이크 제어, 남은 시간 확인을 수행하고, 제출 후 결과 리포트와 학습 대시보드로 이어진다.

### Professor Journey

로그인 후 강의실을 생성·관리하고 학생을 초대한다. 이후 강의 자료를 업로드하고, 시험 범위·루브릭·시간·재응시 정책을 설정하며, 생성된 문제를 검토한 뒤 결과 리포트를 통해 학생별 성과와 통합 분포를 분석한다.

## Business Scope

| Area | Included |
|------|----------|
| 인증 | 학교 선택 + 학번/비밀번호 기반 로그인, 역할별 접근 제어 |
| 학생 경험 | 나의 평가, 평가 정보 확인, 실시간 대화형 응시, 결과 리포트 |
| 교수자 운영 | 강의실 관리, 학생 초대, 강의 자료 관리, 평가 생성/관리 |
| 분석 | 학생 리포트, 교수자 리포트, 학습 대시보드 |
| AI 평가 엔진 | 심층 질문 생성, 질문 품질 가드레일, 선택적 RAG 활용 |

## Success Metrics

- WAU/MAU로 사용자 참여율을 추적한다.
- 시작한 평가 대비 완료 비율을 본다.
- 학습 만족도와 리포트 유용성 만족도를 측정한다.
- AI 평가 결과와 실제 학습 성과의 상관관계를 본다.
- 재방문 및 재평가 비율을 추적한다.

## Risks and Constraints

- AI 질문과 피드백 품질이 신뢰를 좌우한다.
- 학생 평가 데이터와 결과 리포트는 민감 정보로 다뤄야 한다.
- `gpt-realtime` 기반 실시간 경험은 네트워크 안정성과 지연 시간에 민감하다.
- 새로운 평가 방식에 대한 학생·교수자의 초기 적응 장벽이 존재할 수 있다.

## 📂 Codebase References

**Implementation**:
- `src/app/page.tsx` - 학생/교수자 메인 경험의 현재 시작점
- `src/app/layout.tsx` - 웹 앱 공통 레이아웃과 글로벌 진입점

**Configuration**:
- `package.json` - Next.js 기반 웹 앱 의존성
- `next.config.ts` - 배포 대상 웹 앱 설정

## References

- `.opencode/context/project-intelligence/technical-domain.md`
- `.opencode/context/project-intelligence/business-tech-bridge.md`
- ManyFast PRD / requirements / features / specs
- ManyFast user flow `새 플로우 3`
