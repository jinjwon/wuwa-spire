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
| `scripts/prepare-heroes-v3.cjs`, `cards.cjs`, `make-vfx.cjs`, `prepare-battle-bg.cjs`, `art-board.cjs`, `unchecker.cjs`(체크무늬 배경 제거, 흰 장갑·은색 몸이면 `strict`), `motion-prompts.cjs`(추가 모션 프롬프트 생성), `pixellab-prompts.cjs`(PixelLab 프롬프트·참조 이미지 생성), `title-dayparts.cjs`·`title-frames.swift`(타이틀 하루 주기 영상: 640×360 도트로 다시 그리고 끊김 없는 반복, macOS), `branches.sh`(브랜치 상태·동기화·배포), `release-notes.sh`(릴리스 노트) | 지금 쓰는 에셋 처리 도구 ([절차](art/ART_PIPELINE.md)) |
| `scripts/prepare-sprites.cjs`, `prepare-art-v2.cjs`, `check-sprites.cjs` | 초기 제작 도구. 앞의 둘은 덮어쓰기 방지로 막혀 있다 |
| `build/` | 앱 아이콘과 맥 서명 |

새 폴더나 파일을 `src/` 밖에 두고 게임이 읽게 하려면 세 곳을 함께 고친다: `package.json`의 `build.files`, `main.js`의 정적 파일 허용 경로, `index.html`.

카드 데이터를 읽는 도구(`cards.cjs`, `prepare-art-v2.cjs`, `art-board.cjs`)는 `src/js/data.js`를 글자 그대로 읽는다. 카드 정의의 줄 모양(`  아이디:{n:'이름',o:'주인',…`)을 바꾸면 이 도구들이 깨진다.

## 점검

```
env -u ELECTRON_RUN_AS_NODE npx electron . --remote-debugging-port=9334
node scripts/selfcheck.cjs            # 전체
node scripts/selfcheck.cjs mp_guard   # 하나만
```

- `mp_guard`는 다른 프로그램이 7777 포트를 쓰고 있으면 실패한다. `lsof -nP -iTCP:7777 -sTCP:LISTEN`으로 확인한다.
- 화면이 바뀌면 실제 화면을 열어 본다. 기준 해상도는 1600×900과 1265×712다.

## 브랜치

오래 쓰는 브랜치 3개만 둔다. 업무별로 나눈다: 이미지 수정은 `art`, 개발 수정은 `dev`, 통합 내용은 `main`. 작업 종류에 맞는 브랜치에서 일하고 그 브랜치에 커밋·push한다.

| 브랜치 | 용도 | 주로 고치는 곳 |
|---|---|---|
| `main` | 핵심 공통. 항상 실행되는 기준본. 문서, 구조, 작업 규칙, 설정 | `docs/`, `CLAUDE.md`, `package.json` |
| `art` | 일러스트·도트·카드 그림, 프롬프트, 에셋 처리 도구 | `assets/`, `art/`, `docs/art/`, 에셋 스크립트 |
| `dev` | 기능 개발, 게임 규칙, 오류 수정 | `src/`, `main.js`, `scripts/selfcheck.cjs` |

한눈에 보기: `npm run branches`(세 브랜치의 main 대비 앞/뒤, push 안 한 커밋, 정리할 브랜치). 아래 1·3·7은 [scripts/branches.sh](../scripts/branches.sh)가 한 줄로 한다.

1. 시작할 때 `main`의 최신 내용을 가져온다: `npm run branches -- sync` (= art·dev 각각 `git merge main` 후 push).
2. 작업 단위가 끝나면 자가 점검을 돌리고 `docs/STATUS.md`를 고친 뒤 커밋한다.
3. `art`·`dev`를 `main`에 합치는 일은 통합 업무다. 사용자가 통합을 요청할 때만 한다: `npm run branches -- ship`. 그 밖의 작업 보고에서는 병합 여부를 말하지 않는다. `art`와 `dev`는 지우지 않고 계속 쓴다(GitHub 규칙으로 세 브랜치는 강제 push·삭제 금지).
4. 새 공명자처럼 그림과 코드가 함께 필요한 일은 `art`에서 그림을 끝내 `main`에 합친 다음, `dev`가 `main`을 가져와 연결한다.
5. `art`와 `dev`를 서로 직접 병합하지 않는다. 항상 `main`을 거친다.
6. 오래 합치지 않으면 충돌이 커진다. 통합 요청이 오면 그때 한꺼번에 합친다.
7. 배포는 `main`에서 `npm run branches -- release 0.12.0`(버전 올림 → 커밋 → `v버전` 태그 push). 태그가 올라가면 GitHub Actions가 설치 파일을 만들고, [scripts/release-notes.sh](../scripts/release-notes.sh)가 커밋 말머리(`feat:`·`fix:`·`art:`·`docs:`·`chore:`)로 묶은 변경 내역을 Releases 본문에 넣는다.
8. 잠깐 쓰는 브랜치(예: `chore/…`)는 main에 합친 뒤 바로 지운다. `npm run branches`의 '정리 후보'에 남은 게 없어야 한다.

## 저장소에 넣지 않는 것

`.gitignore`가 막는다. 새 종류가 생기면 `.gitignore`에 추가한다.

- 공식 이미지(`art/*/references/` 안의 공식 자료)
- 다시 만들 수 있는 결과물: 미리보기 PNG, `art/preview-v3/`, `dist/`
- 에셋 보드(`art/board.html`)와 후보 그림(`art/candidates/`)
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
