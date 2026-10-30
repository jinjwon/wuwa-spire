# 명조 스타일 UI/UX 개편 + 독창 시스템 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 전투·지도 UI의 불편 요소를 고치고 명조 스타일을 강화하며, 슬더스 코어 위에 명조 고유 시스템 2종(에코 스킬, 공진·진동 파괴)을 추가한다.

**Architecture:** 단일 파일 `index.html`(상태 `S`, 렌더 `render()`/`updateCombat()`, 데이터 `CD/EN/ECHO`) 구조를 유지한다. 새 로직은 기존 훅(`playCard`, `dmgEnemy`, `startTurn`, `endTurn`, `updateCombat`, `cardHTML`)에 붙인다. 검증은 `scripts/selfcheck.cjs`(Electron CDP로 게임 함수 호출 후 assert)로 한다.

**Tech Stack:** HTML/CSS/JS 단일 파일, Electron 33, Chrome DevTools Protocol(Node 24 내장 WebSocket).

**Spec:** 사용자 요청(2026-10-31): "UI/UX 불편 개선, 전체적으로 명조 스타일, 시스템은 슬더스 + 독창적 시스템 추가".

## Global Constraints

- 슬더스 코어(에너지 3, 드로우 5, 의도 표시, 지도 경로, 보상 3택1)는 바꾸지 않는다.
- 중간 저장 없음(로그라이크). 새 상태는 `S.c`(전투) 또는 `S`(판) 안에만 둔다.
- 1280×720 창에서 카드 본문·적 체력·의도·에너지·턴 종료가 스크롤 없이 모두 보여야 한다.
- 텍스트는 한국어, 명조 용어(공명자·에코·잔상·명식·협주·변주·해방·공진) 사용.
- 새 의존성 추가 금지.

## Review Focus

- 손패 10장: 카드끼리 겹쳐도 숫자키 번호·비용이 모두 보여야 한다 → Task 1 selfcheck에 10장 손패 케이스.
- 창 너비 960px: 하단 HUD와 손패가 겹치지 않아야 한다 → Task 1에서 960×640 스크린샷 확인.
- 에코 스킬을 쿨다운 중이나 적 처치 후(대상 없음) 누를 때 → 무시되고 오류 없음(Task 3 테스트).
- 공진 파괴된 적이 같은 턴에 다시 파괴되지 않음, 파괴 중 행동 건너뜀 → Task 4 테스트.
- 보스(명식)는 진동 게이지가 더 크고 파괴 시 1턴만 기절 → Task 4 테스트.

---

### Task 1: 전투 UI 가독성·레이아웃 정리

**Files:**
- Modify: `index.html` (CSS `.hand .card`, `.bottom`, `.stage`, `.uhud`, `.hpb`, `.card .tx`; `renderHand()`)
- Create: `scripts/selfcheck.cjs`

**문제(현재 화면 기준):** 카드 하단(효과·주인 이름)이 화면 밖으로 잘림, 체력바·상태칩이 작아 읽기 어려움, 손패가 많으면 숫자키 배지가 가려짐, 스테이지 로그가 좌상단을 가림.

- [ ] Step 1: `scripts/selfcheck.cjs` 작성 — 포트 9334의 Electron 페이지에 `Runtime.evaluate`로 식을 보내고 `{name, pass}` 배열을 출력, 하나라도 실패하면 exit 1.
- [ ] Step 2: 실패 테스트 `card_body_visible`: 손패 첫 카드의 `.tx` `getBoundingClientRect().bottom <= innerHeight`; `hand10_badges`: 손패 10장일 때 모든 `.hk` 요소의 중심점에서 `elementFromPoint`가 그 카드 안.
- [ ] Step 3: 실행 `node scripts/selfcheck.cjs` → FAIL 확인.
- [ ] Step 4: 구현 — `.hand .card{bottom:6px}`, 손패 영역 높이 = 카드 높이 + 12px, 스테이지 `min-height`를 `calc(100vh - 헤더 - 손패)`로; 호버 시 카드 1.25배 확대·위로; 체력바 높이 18px·글자 13px; 로그를 스테이지 상단 중앙 한 줄 토스트로; 카드 수 >7이면 겹침 간격 축소 대신 회전 각 감소.
- [ ] Step 5: 실행 → PASS, 1280×720·960×640 스크린샷 육안 확인.
- [ ] Step 6: Commit `ui: 전투 화면 가독성·손패 레이아웃 정리`.

### Task 2: 명조 스타일 테마 통일

**Files:** Modify `index.html` (`:root` 토큰, `.top`, `.box`, `.btn`, `.endturn`, `.energy`, `.pile`, 턴 배너, 툴팁)

명조 UI 특징: 짙은 남색 반투명 패널 + 얇은 백색 라인, 모서리 사선 컷, 금빛(#e9d9a6) 포인트, 작은 영문 라벨, 마름모 모티프, 공명 파형 장식.

- [ ] Step 1: 테스트 `theme_tokens`: `getComputedStyle(document.documentElement).getPropertyValue('--wu-acc').trim()==='#e9d9a6'` 그리고 `.endturn`의 `clip-path`가 `none`이 아님.
- [ ] Step 2: 실패 확인.
- [ ] Step 3: 구현 — 에너지 구슬을 마름모+파형 링으로, 턴 종료를 사선 컷 버튼(영문 라벨 `END TURN`)으로, 뽑을/버린 카드 더미를 마름모 카운터로, 턴 배너에 수평 파형 라인, 툴팁·상단바를 같은 패널 토큰으로.
- [ ] Step 4: PASS + 스크린샷 확인.
- [ ] Step 5: Commit `ui: 명조 스타일 HUD 테마`.

### Task 3: 독창 시스템 ① 에코 스킬 (명조 에코 장착)

흡수한 에코 중 하나를 **주 에코**로 장착 → 전투 중 버튼으로 발동하는 액티브 스킬(쿨다운). 명조의 에코 스킬을 카드 게임에 옮긴 것.

**Files:** Modify `index.html` (`ECHO` 항목에 `skill`, `S.mainEcho`, `startCombat`, `startTurn`, `updateCombat`, 보상·에코 바 UI)

**Interfaces:**
- Produces: `ECHO[id].skill = {n:string, cd:number, run:(T)=>void, tg:boolean}`; `S.mainEcho:string|null`; `S.c.echoCd:number`; `useEcho(T?)`; `equipEcho(id)`.

- [ ] Step 1: 테스트 `echo_skill`: 주 에코 `crown` 장착 → `useEcho(alive()[0])` 후 대상 체력 감소, `S.c.echoCd===skill.cd`; 쿨다운 중 재호출 시 체력 변화 없음; `startTurn` 후 `echoCd`가 1 감소; 적이 없을 때 `useEcho()` 오류 없음.
- [ ] Step 2: 실패 확인.
- [ ] Step 3: 구현 — 정예·보스 에코 9종(crown, mephis, aix, explorer, rider, gorilla, dreamless, turtle, hecate, levia)에 skill 정의(예: 크라운리스 「처단」 적 하나 14 피해·cd 3, 타종 거북이 「종소리 방벽」 보호막 15·cd 3). 에코 바에서 클릭 → `equipEcho`. 전투 HUD 에너지 위에 원형 에코 버튼(쿨다운 숫자·회색), 단축키 `Q`. 대상형은 기존 드래그 화살표(`dragStart(ev,'echo')`) 재사용.
- [ ] Step 4: PASS.
- [ ] Step 5: Commit `feat: 에코 스킬(주 에코 장착·쿨다운)`.

### Task 4: 독창 시스템 ② 공진·진동 파괴

적마다 **진동 게이지**(명조 공진 수치). 공격 카드 타격 1회당 1, 협주→변주·해방은 3 누적. 가득 차면 **공진 파괴**: 다음 행동 1회 건너뜀 + 받는 피해 +50% (1턴).

**Files:** Modify `index.html` (`spawn`, `hit`/`dmgEnemy`, `endTurn` 적 행동 루프, `intro`/`doLib`, 적 HUD)

**Interfaces:**
- Produces: `e.vib:number`, `e.vibMax:number` (일반 6, 정예 10, 보스 16), `e.broken:number`(남은 턴); `addVib(T,n)`.

- [ ] Step 1: 테스트 `vibration`: 일반 적에 `addVib(T,6)` → `T.broken===1`, `T.vib===0`; 같은 턴 `addVib` 추가 시 다시 파괴되지 않음; `endTurn` 후 그 적의 체력 피해/행동 로그 없음; 보스 `vibMax===16`.
- [ ] Step 2: 실패 확인.
- [ ] Step 3: 구현 — 적 체력바 아래 얇은 노란 진동 바, 파괴 시 「공진 파괴!」 배너·큰 히트스톱·의도 아이콘을 「기절」로 교체. `hit` 피해 배율에 `T.broken>0 ? 1.5`. 키워드 툴팁 `공진` 추가.
- [ ] Step 4: PASS + 자동 플레이 30판 오류 0 확인.
- [ ] Step 5: Commit `feat: 공진·진동 파괴 시스템`.

### Task 5: 지도·보상·설명 화면 UX

**Files:** Modify `index.html` (`mapHTML`, `rewardHTML`, `helpHTML`, 첫 전투 튜토리얼)

- [ ] Step 1: 테스트 `map_focus`: 지도 진입 시 선택 가능한 노드가 화면 안에 있음(`getBoundingClientRect` 범위); `help_new_systems`: 설명 화면에 「에코 스킬」「공진」 섹션 존재.
- [ ] Step 2: 실패 확인.
- [ ] Step 3: 구현 — 지도 진입 시 현재 층으로 자동 스크롤·노드 호버 시 다음 경로 미리 강조, 보상 카드 비교(덱 동일 카드 수 표시), 설명 화면에 STEP 7·8(에코 스킬·공진) 추가, 첫 전투 1회 말풍선 가이드(끌기·의도·턴 종료 3단계, `OPT.tut`로 1회만).
- [ ] Step 4: PASS.
- [ ] Step 5: Commit `ux: 지도 포커스·보상 비교·튜토리얼·설명 갱신`.

### Task 6: 밸런스 확인 + 배포

- [ ] Step 1: 자동 플레이(교체·해방·에코 스킬 사용 봇) 난이도별 70판, 보통 승률 30~50% 범위 확인. 벗어나면 `ECHO.skill` 수치·`vibMax`만 조정.
- [ ] Step 2: `npm version 0.6.0`, 태그 `v0.6.0` 푸시, Actions 성공 확인.
- [ ] Step 3: Commit/Release `v0.6.0`.
