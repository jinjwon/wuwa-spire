# 프로젝트 문서 안내

작업 전에 해당 문서를 먼저 읽는다. 내용이 바뀌면 같은 작업에서 문서도 고친다.

| 알고 싶은 것 | 문서 |
|---|---|
| 지금 어디까지 됐고 다음에 무엇을 하나 | [STATUS.md](STATUS.md) |
| 캐릭터 서사·무기·소속·세계관 용어 | [lore/CHARACTER_BIBLE.md](lore/CHARACTER_BIBLE.md) |
| 도트 규격·제작 절차·검수 항목 | [art/ART_PIPELINE.md](art/ART_PIPELINE.md) |
| 이미지 생성 프롬프트 | [art/HERO_PROMPTS.md](art/HERO_PROMPTS.md) |
| 생성한 시트 수정·적 재제작 프롬프트 | [art/REVISION_PROMPTS.md](art/REVISION_PROMPTS.md) |
| 명조 전투 시스템과 이식 설계 | [systems/WUWA_SYSTEMS.md](systems/WUWA_SYSTEMS.md) |
| UI 규칙 | [../DESIGN.md](../DESIGN.md) |
| 작업 규칙(에이전트용) | [../CLAUDE.md](../CLAUDE.md) |

## 폴더 구조
| 폴더 | 내용 | git |
|---|---|---|
| `index.html` | 게임 전체(CSS·JS 포함) | 추적 |
| `assets/` | 게임이 읽는 최종 이미지·BGM | 추적(mp3 제외) |
| `art/source/`, `art/source-v2/` | 생성 원본 시트 | 추적 |
| `art/backup-recolor/` | 색 보정 전 도트 | 추적 |
| `art/reference-review-*/references/` | 공식 참고 이미지 | 제외 |
| `art/preview-v3/`, 미리보기 PNG | 다시 만들 수 있는 결과물 | 제외 |
| `scripts/` | 에셋 처리·자가 점검 | 추적 |
| `dist/` | 빌드 결과물 | 제외 |
