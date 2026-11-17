# 유지보수 안내

코드가 어디에 있는지, 브랜치를 어떻게 쓰는지, 무엇을 정리해야 하는지 적는다. 구조나 절차가 바뀌면 같은 작업에서 이 문서를 고친다.

## 코드 구조

`index.html`은 뼈대만 있다. 스타일과 코드는 `src/`에 있고, 아래 순서대로 불러온다. 모듈이 아닌 일반 스크립트라서 전역 변수를 함께 쓴다. **불러오는 순서를 바꾸지 않는다.**

| 파일 | 내용 | 주요 이름 |
|---|---|---|
| `src/styles.css` | 모든 스타일. 뒤쪽 층이 앞쪽을 덮는다. 규칙은 [DESIGN.md](../DESIGN.md) | `--wu-*` 토큰 |
| `src/js/util.js` | 공용 도구 | `rnd`, `pick` |
| `src/js/data.js` | 공명자·카드·적·에코·구역·약제 데이터 | `CH`, `CD`, `EN`, `ECHO`, `ACTS`, `POT`, `EL` |
| `src/js/run.js` | 한 판의 상태, 지도 | `S`, `newGame` |
| `src/js/combat.js` | 전투 규칙 | `startCombat`, `playCard`, `dmgEnemy`, `endTurn` |
| `src/js/screens.js` | 사건, 휴식, 상점, 모달 | `EVENTS` |
| `src/js/art.js` | 이미지 불러오기, 연출 | `loadArt`, `artOf`, `flushFx` |
| `src/js/render.js` | 화면 그리기, 영입 | `render`, `updateCombat` |
| `src/js/input.js` | 카드 드래그, 단축키 | |
| `src/js/multiplayer.js` | 같은 와이파이 협동, 게임 시작 코드 | `MP`, `mpPush` |

그 밖의 파일:

| 파일 | 내용 |
|---|---|
| `main.js`, `preload.js` | 데스크톱 앱(Electron) 창과 멀티 서버. 서버는 `index.html`, `src/`, `assets/`만 내보낸다 |
| `scripts/selfcheck.cjs` | 게임 자가 점검 |
| `scripts/prepare-heroes-v3.cjs`, `cards.cjs`, `make-vfx.cjs`, `prepare-battle-bg.cjs` | 지금 쓰는 에셋 처리 도구 ([절차](art/ART_PIPELINE.md)) |
| `scripts/prepare-sprites.cjs`, `prepare-art-v2.cjs`, `build-art-review.cjs`, `check-sprites.cjs` | 초기 제작 도구. 앞의 둘은 덮어쓰기 방지로 막혀 있다 |
| `build/` | 앱 아이콘과 맥 서명 |

새 폴더나 파일을 `src/` 밖에 두고 게임이 읽게 하려면 세 곳을 함께 고친다: `package.json`의 `build.files`, `main.js`의 정적 파일 허용 경로, `index.html`.

카드 데이터를 읽는 도구(`cards.cjs`, `prepare-art-v2.cjs`, `build-art-review.cjs`)는 `src/js/data.js`를 글자 그대로 읽는다. 카드 정의의 줄 모양(`  아이디:{n:'이름',o:'주인',…`)을 바꾸면 이 도구들이 깨진다.

## 점검

```
env -u ELECTRON_RUN_AS_NODE npx electron . --remote-debugging-port=9334
node scripts/selfcheck.cjs            # 전체
node scripts/selfcheck.cjs mp_guard   # 하나만
```

- `mp_guard`는 다른 프로그램이 7777 포트를 쓰고 있으면 실패한다. `lsof -nP -iTCP:7777 -sTCP:LISTEN`으로 확인한다.
- 화면이 바뀌면 실제 화면을 열어 본다. 기준 해상도는 1600×900과 1265×712다.

## 브랜치

| 접두사 | 용도 |
|---|---|
| `feat/` | 새 기능·게임 규칙 |
| `fix/` | 버그 수정 |
| `art/` | 이미지와 에셋 처리 |
| `chore/` | 구조 정리, 설정 |
| `docs/` | 문서만 |

1. `main`에서 새 브랜치를 만든다. 한 브랜치에는 한 가지 일만 담는다.
2. 끝내기 전에 자가 점검을 돌리고 `docs/STATUS.md`를 고친다.
3. 사용자 확인을 받고 `main`에 병합하고 push한다.
4. 병합한 브랜치는 바로 지운다: `git branch -d <이름>`. `-d`는 병합되지 않은 브랜치를 지우지 않으므로 안전하다.
5. 배포는 `package.json`의 버전을 올리고 `v버전` 태그를 push한다. 태그가 올라가면 GitHub Actions가 설치 파일을 만든다.

남은 브랜치 확인: `git branch --merged main`에 `main` 말고 다른 이름이 보이면 지운다.

## 저장소에 넣지 않는 것

`.gitignore`가 막는다. 새 종류가 생기면 `.gitignore`에 추가한다.

- 공식 이미지(`art/*/references/` 안의 공식 자료)
- 다시 만들 수 있는 결과물: 미리보기 PNG, `art/preview-v3/`, `dist/`
- 백업 폴더(`art/backup-*/`). 이전 버전은 git 기록에서 꺼낸다: `git show <커밋>:<경로> > 파일`
- BGM mp3

## 남은 정리 후보

급하지 않다. 관련 작업을 할 때 함께 한다.

| 후보 | 이유 | 주의 |
|---|---|---|
| `src/styles.css`의 덮어쓰기 층 합치기 | 같은 부품의 규칙이 여러 층에 흩어져 있다 | 층 순서가 결과를 정한다. 화면별로 나눠서 확인하며 합친다 |
| 하드코딩 색을 토큰으로 바꾸기 | [DESIGN.md](../DESIGN.md) 남은 과제 | |
| `assets/` 최상위 PNG 약 100개를 `heroes/`, `enemies/`로 나누기 | 한 폴더에 섞여 있다 | 불러오는 경로(`src/js/art.js`), 처리 도구, `assets/README.md`를 함께 고쳐야 한다 |
| `art/source/`(이름이 `exec-…`인 초기 원본)와 초기 도구 4개 지우기 | 새 절차에서는 쓰지 않는다 | `prepare-heroes-v3.cjs`가 아직 `art/source/`를 읽는지 먼저 확인한다 ([ART_PIPELINE](art/ART_PIPELINE.md)) |
| 원본 시트(`art/source-v2/`, 약 89MB) | 저장소 용량의 대부분 | 지우면 재처리를 못 한다. 그대로 둔다 |
