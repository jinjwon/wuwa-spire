# 공명자 도트 제작 절차

## 규격
| 항목 | 기준 |
|---|---|
| 비율 | 7등신, 치비 금지 |
| 원본 시트 | 4열×2행. 1행 대기·준비·공격·회복, 2행 방어·피격·시전·해방 |
| 원본 크기 | 칸 높이의 72%, 8칸 동일. 발 높이 동일 |
| 게임 프레임 | 128×128, 투명 배경, 오른쪽 방향, 발 위치 y=122 |
| 몸 크기 | 대기 자세 104px, 메카 92px (`prepare-heroes-v3.cjs`) |
| 색 | 프레임 32색, 스트립 48색 이하, 디더링 없음 |
| 카드 | 144×96. 칸 안쪽 6px을 잘라 줄임 |

## 절차
1. [CHARACTER_BIBLE.md](../lore/CHARACTER_BIBLE.md)에서 설정과 무기를 확인한다. 없으면 먼저 추가한다.
2. [HERO_PROMPTS.md](HERO_PROMPTS.md)의 프롬프트에 공식 이미지와 `art/source-v2/hero_yin.png`를 순서대로 첨부해 생성한다.
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
