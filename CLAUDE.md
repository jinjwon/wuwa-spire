# 첨탑의 메아리 작업 규칙

사용자와는 한국어로 이야기한다. 사용자는 디자이너(요구사항), 에이전트는 게임 개발자(구현·검증)다. 공개 저장소의 비상업 개인 팬 프로젝트다. 저장소가 공개라서 공식 이미지·개인 정보는 커밋하지 않는다.

## 시작 전
- [docs/README.md](docs/README.md)에서 관련 문서를 찾아 읽고, [docs/STATUS.md](docs/STATUS.md)로 현재 상태를 확인한다.
- 캐릭터 서사·무기·스킬은 추측하지 않는다. [설정 기준표](docs/lore/CHARACTER_BIBLE.md)와 위키로 확인하고, 확인 못 한 것은 미확인이라고 말한다.
- 아트는 [ART_PIPELINE.md](docs/art/ART_PIPELINE.md)를 따른다.

## 작업 중
- 브랜치는 `main`(핵심 공통·문서·구조), `art`(일러스트·에셋), `dev`(기능·오류 수정) 3개다. 작업 종류에 맞는 브랜치에서 일하고, 시작할 때 `main`을 가져온다. main 병합과 push는 사용자 확인 후에 한다.
- 공식 이미지는 커밋하지 않는다. 다시 만들 수 있는 결과물과 임시 파일도 커밋하지 않는다.
- 새 문서는 `docs/`의 맞는 폴더에 두고 `docs/README.md`에 등록한다.
- 코드 위치와 브랜치 절차는 [docs/MAINTENANCE.md](docs/MAINTENANCE.md)를 따른다.
- 게임 규칙을 바꾸면 `scripts/selfcheck.cjs`에 점검을 추가한다.
- 사용자가 교체를 요청한 그림은 적용한다. 그 밖의 새 그림은 `art/candidates/<키>/`에 넣고 사용자가 `npm run board`에서 고른다.
- 업로드 그림은 먼저 누구·어느 자리인지 확인한다. 요청과 다르면(예: 린네라고 했는데 에이메스) 적용하지 말고 묻는다. 박힌 체크무늬 배경은 지우고 쓴다(`node scripts/unchecker.cjs`).
- 시트 프롬프트 작성과 업로드 시트 반영은 프로젝트 스킬 `wuwa-sheet-prompts`를 따른다. 프롬프트는 md 대신 에셋 보드(`npm run board`, HTML)로 보여 준다.
- 도트는 정수 배율로만 보여 준다. 크기는 `calc(<px>*var(--k,1))`로 쓰고, 공명자 프레임 320px·몸 208px, 배경 640×360 규격을 바꾸지 않는다([ART_PIPELINE.md](docs/art/ART_PIPELINE.md)).
- 공명자 재처리 뒤 프레임이 테두리에 닿지 않는지 확인한다. `CARDS=1` 없이 돌리고, 붙였으면 `node scripts/cards.cjs import`로 단품 카드를 되살린다.

## 끝내기 전
- 자가 점검을 돌리고 결과를 사실대로 보고한다. 화면이 바뀌면 실제 화면을 확인한다.
- `docs/STATUS.md`와 관련 문서를 함께 고친다.
