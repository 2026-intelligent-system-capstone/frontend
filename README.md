# Frontend

## Import 규칙

이 프로젝트는 FSD 기준으로 import를 사용합니다.

- **같은 slice 내부**에서는 `./`, `../` 같은 **relative import**를 사용합니다.
- **다른 slice 또는 다른 layer**를 참조할 때는 `@/...` **alias import**를 사용합니다.
- **slice 바깥**에서는 내부 파일을 직접 import하지 않고, 각 slice의 **public API (`index.ts`)** 를 우선 사용합니다.
- **자기 slice 내부 구현 파일**에서 자기 자신의 barrel(`index.ts`)을 다시 import하지 않습니다. 순환 의존 위험이 있기 때문입니다.

### 예시

- 같은 widget 내부 파일 참조: `./questions-table`
- 다른 layer 참조: `@/entities/exam`
- app에서 widget 사용: `@/widgets/classroom`

### 현재 원칙

이 프로젝트에서는 FSD 원칙과 충돌하는 eslint 규칙을 제거했습니다.
경계 강제는 추후 `eslint-plugin-boundaries` 등 slice/layer 인식이 가능한 규칙으로 보강할 수 있습니다.
