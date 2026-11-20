# 프로젝트 문서 안내

작업 전에 해당 문서를 먼저 읽는다. 내용이 바뀌면 같은 작업에서 문서도 고친다.

| 알고 싶은 것 | 문서 |
|---|---|
| 지금 어디까지 됐고 다음에 무엇을 하나 | [STATUS.md](STATUS.md) |
| 캐릭터 서사·무기·소속·세계관 용어 | [lore/CHARACTER_BIBLE.md](lore/CHARACTER_BIBLE.md) |
| 도트 규격·제작 절차·검수 항목 | [art/ART_PIPELINE.md](art/ART_PIPELINE.md) |
| 이미지 생성 프롬프트 | [art/HERO_PROMPTS.md](art/HERO_PROMPTS.md) |
| 프롬프트 복사, 후보 그림 비교·선택 | [art/ART_PIPELINE.md](art/ART_PIPELINE.md)의 프롬프트 보드 (`npm run board`) |
| 생성한 시트 수정·적 재제작 프롬프트 | [art/REVISION_PROMPTS.md](art/REVISION_PROMPTS.md) |
| 전투 배경 프롬프트 | [art/BG_PROMPTS.md](art/BG_PROMPTS.md) |
| 추가 모션 프롬프트(적 16칸·공명자 추가 동작·이펙트) | [art/MOTION_PROMPTS.md](art/MOTION_PROMPTS.md) |
| 명조 전투 시스템과 이식 설계 | [systems/WUWA_SYSTEMS.md](systems/WUWA_SYSTEMS.md) |
| UI 규칙(색·부품·배치) | [../DESIGN.md](../DESIGN.md) |
| 코드 구조·브랜치·정리 규칙 | [MAINTENANCE.md](MAINTENANCE.md) |
| 끝난 구현 계획(기록용) | [superpowers/plans/](superpowers/plans/) |
| 작업 규칙(에이전트용) | [../CLAUDE.md](../CLAUDE.md) |

## 폴더 구조
| 폴더 | 내용 | git |
|---|---|---|
| `index.html` | 뼈대(스타일·스크립트 불러오기만) | 추적 |
| `src/styles.css`, `src/js/` | 게임 스타일과 코드 ([구조](MAINTENANCE.md)) | 추적 |
| `assets/` | 게임이 읽는 최종 이미지·BGM | 추적(mp3 제외) |
| `art/source/`, `art/source-v2/` | 생성 원본 시트 | 추적 |
| `art/reference-review-*/references/` | 공식 참고 이미지 | 제외 |
| `art/preview-v3/`, 미리보기 PNG | 다시 만들 수 있는 결과물 | 제외 |
| `scripts/` | 에셋 처리·자가 점검 | 추적 |
| `dist/` | 빌드 결과물 | 제외 |
