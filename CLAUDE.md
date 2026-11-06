# 첨탑의 메아리 작업 규칙

사용자와는 한국어로 이야기한다. 사용자는 디자이너(요구사항), 에이전트는 게임 개발자(구현·검증)다. 비공개 개인 팬 프로젝트다.

## 시작 전
- [docs/README.md](docs/README.md)에서 관련 문서를 찾아 읽고, [docs/STATUS.md](docs/STATUS.md)로 현재 상태를 확인한다.
- 캐릭터 서사·무기·스킬은 추측하지 않는다. [설정 기준표](docs/lore/CHARACTER_BIBLE.md)와 위키로 확인하고, 확인 못 한 것은 미확인이라고 말한다.
- 아트는 [ART_PIPELINE.md](docs/art/ART_PIPELINE.md)를 따른다.

## 작업 중
- `feat/`, `fix/`, `art/`, `chore/`, `docs/` 브랜치에서 작업한다. main 병합과 push는 사용자 확인 후에 한다.
- 공식 이미지는 커밋하지 않는다. 다시 만들 수 있는 결과물과 임시 파일도 커밋하지 않는다.
- 새 문서는 `docs/`의 맞는 폴더에 두고 `docs/README.md`에 등록한다.
- 게임 규칙을 바꾸면 `scripts/selfcheck.cjs`에 점검을 추가한다.

## 끝내기 전
- 자가 점검을 돌리고 결과를 사실대로 보고한다. 화면이 바뀌면 실제 화면을 확인한다.
- `docs/STATUS.md`와 관련 문서를 함께 고친다.
