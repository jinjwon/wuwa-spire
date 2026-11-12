# 공명자 도트 제작 절차

## 규격
| 항목 | 기준 |
|---|---|
| 비율 | 7등신, 치비 금지 |
| 원본 시트 | 4열×2행. 1행 대기·준비·공격·회복, 2행 방어·피격·시전·해방 |
| 원본 크기 | 칸 높이의 72%, 8칸 동일. 발 높이 동일 |
| 게임 프레임 | 256×256(새 시트), 투명 배경, 오른쪽 방향. 이전 디자인과 적은 128×128 |
| 몸 크기 | 대기 자세 208px, 메카 184px (`prepare-heroes-v3.cjs`) |
| 색 | 프레임 64색 이하, 디더링 없음 |
| 표시 크기 | 전투 256px 고정. 256px 프레임은 1배, 128px 프레임은 2배. 일반 적은 재제작 전까지 192px(1.5배, 부드럽게), 정예 256px, 보스 384px, 벤치 0.5배 |
| 대기 모션 | 정수 픽셀 이동만. 회전·미세 확대 금지 |
| 전투 배경 | 1280×720, `scripts/prepare-battle-bg.cjs` |
| 축소 | 블록 최빈색(lanczos 대신). 가짜 도트 원본의 윤곽선을 흐리지 않음 |
| 스킬 임팩트 | `scripts/make-vfx.cjs`가 코드로 찍음. 64×64 6프레임, 속성당 4색, 화면 2배(치명·큰 피해 3배) |
| 카드 | 144×96. 칸 안쪽 6px을 잘라 줄임 |

## 절차
1. [CHARACTER_BIBLE.md](../lore/CHARACTER_BIBLE.md)에서 설정과 무기를 확인한다. 없으면 먼저 추가한다.
2. [HERO_PROMPTS.md](HERO_PROMPTS.md)의 프롬프트에 공식 이미지와 `art/source-v2/hero_mor.png`(승인된 비율 기준)를 순서대로 첨부해 생성한다.
3. 결과를 `art/source-v2/hero_<id>.png`, `cards_<id>.png`로 저장한다.
4. `scripts/prepare-heroes-v3.cjs`의 `HEROES`에 id를 넣는다.
5. `IDS=<id> node scripts/prepare-heroes-v3.cjs preview`로 `art/preview-v3/`에서 먼저 본다.
6. 문제없으면 `IDS=<id> node scripts/prepare-heroes-v3.cjs write`로 적용한다.
7. 예전 색 보정이 있는 캐릭터는 `scripts/recolor.cjs` 규칙을 지운다.
8. 게임 화면에서 대기·공격·해방을 확인한다.

## 검수 항목
- [ ] 칸 수가 맞고 경계를 넘은 부분이 없다
- [ ] 7등신이고 8칸의 몸 크기가 같다. 해방 칸에서도 작아지지 않았다
- [ ] 얼굴·머리·의상·무기가 8칸 모두 같고 공식 이미지와 맞다
- [ ] 무기가 [설정 기준표](../lore/CHARACTER_BIBLE.md)와 맞다
- [ ] 진짜 투명 배경이고 글로우 번짐·잡티가 없다
- [ ] 글자·숫자·테두리가 없다

## 주의
- `prepare-sprites.cjs`, `prepare-art-v2.cjs`는 새 도트를 덮어쓰므로 막아 두었다. 쓰지 않는다.
- 공식 이미지는 커밋하지 않는다.
- 이전 디자인 원본(`art/source/`의 공명자 시트, `heroesA/B`)은 방랑자·파수인·치사·카멜리아 교체가 끝나면 지운다. 그 전에 지우면 재처리가 불가능하다.
