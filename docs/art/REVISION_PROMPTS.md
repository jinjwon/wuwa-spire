# 도트 수정 프롬프트

마지막 갱신 2026-11-06. 생성한 시트의 문제를 고칠 때 쓴다. 끝난 항목은 지운다. 새로 만드는 시트는 [HERO_PROMPTS.md](HERO_PROMPTS.md)를 쓴다.

## 공명자 수정
각 프롬프트에 해당 시트 1장을 첨부한다(`art/source-v2/`). 결과는 같은 파일명으로 덮어쓴다.

### 모니에 · `hero_mor.png`
- 칸 3의 베기가 칸 4로 넘어감
- 전신에 파란 번짐
- 해방의 궤도가 칸 오른쪽에 닿음

```
Attachment 1 is the current sprite sheet of Mornye. Keep the same character, outfit, weapon, poses and 4 by 2 cell layout. Fix only these problems: Row 1 col 3: shorten the slash arc so it does not reach col 4. Remove the blue outer glow around her in every cell. Row 2 col 4: shrink the orbit rings so they stay inside the cell. Same rules: 7-head adult proportions, same body size and foot line in all cells, uniform 16-bit pixel grid, at most 48 colors, true alpha transparency, solid hard-edged effects only. No soft glow, outer glow, haze, colored fringe, specks, text, grid lines or background. Everything stays at least 8% away from every cell edge.
```

### 히유키 · `hero_hiy.png`
- 칸 3의 베기가 가장자리에 닿음
- 칸 사이 파란 잡티
- 시전의 분신이 반투명

```
Attachment 1 is the current sprite sheet of Hiyuki. Keep the same character, outfit, weapon, poses and 4 by 2 cell layout. Fix only these problems: Row 1 col 3: shorten the ice slash. Remove all blue specks between cells and the outer glow. Row 2 col 3: draw the ice second self as solid hard-edged pixels, smaller, inside the cell. Same rules: 7-head adult proportions, same body size and foot line in all cells, uniform 16-bit pixel grid, at most 48 colors, true alpha transparency, solid hard-edged effects only. No soft glow, outer glow, haze, colored fringe, specks, text, grid lines or background. Everything stays at least 8% away from every cell edge.
```

### 린네 · `hero_lyn.png`
- 공격 불꽃이 가장자리에 닿음
- 방어·시전·해방에 번짐
- 해방 이펙트가 몸을 가림

```
Attachment 1 is the current sprite sheet of Lynae. Keep the same character, outfit, weapon, poses and 4 by 2 cell layout. Fix only these problems: Row 1 col 3: make both muzzle bursts small and solid. Remove the rainbow glow in row 2. Row 2 col 4: keep the paint burst behind her and leave her body fully visible. Same rules: 7-head adult proportions, same body size and foot line in all cells, uniform 16-bit pixel grid, at most 48 colors, true alpha transparency, solid hard-edged effects only. No soft glow, outer glow, haze, colored fringe, specks, text, grid lines or background. Everything stays at least 8% away from every cell edge.
```

### 에이메스 · `hero_aem.png`
- 대기의 검 끝이 왼쪽 칸 경계에 닿음
- 칸 3 베기가 가장자리에 닿음
- 해방의 메카가 칸 밖으로 나감

```
Attachment 1 is the current sprite sheet of Aemeath. Keep the same character, outfit, weapon, poses and 4 by 2 cell layout. Fix only these problems: Row 1 col 1 and col 4: angle the sword so its tip stays inside the cell. Row 1 col 3: shorten the slash. Row 2 col 4: make the mech smaller and fully inside the cell, keeping her body at the same size. Remove the outer glow. Same rules: 7-head adult proportions, same body size and foot line in all cells, uniform 16-bit pixel grid, at most 48 colors, true alpha transparency, solid hard-edged effects only. No soft glow, outer glow, haze, colored fringe, specks, text, grid lines or background. Everything stays at least 8% away from every cell edge.
```

### 에이메스 메카 · `hero_aemMecha.png`
- 칸 사이가 파랑·흰색 노이즈로 가득함
- 날개가 칸 가장자리에 닿음
- 다른 캐릭터와 키 기준이 다름

```
Attachment 1 is the current sprite sheet of Aemeath's mech form. Keep the same character, outfit, weapon, poses and 4 by 2 cell layout. Fix only these problems: Remove all blue and white noise between cells. Shrink the wings so they stay inside each cell. Keep the armor design. Mech body height is about 10% taller than Aemeath; use the same foot line. Same rules: 7-head adult proportions, same body size and foot line in all cells, uniform 16-bit pixel grid, at most 48 colors, true alpha transparency, solid hard-edged effects only. No soft glow, outer glow, haze, colored fringe, specks, text, grid lines or background. Everything stays at least 8% away from every cell edge.
```

## 적 재제작
적은 아직 128px이고 예전 축소 방식이라 공명자보다 거칠다. 2마리씩 14장이다. 프롬프트의 `[ENEMY A]`, `[ENEMY B]`를 표의 이름으로 바꾼다. 첨부는 해당 적이 있는 `art/source-v2/enemiesA.png`, `enemiesB.png`, `enemiesC.png` 중 하나다. 저장 이름은 `art/source-v2/enemy_sheet_<번호>.png`다.

| 번호 | ENEMY A | ENEMY B |
|---|---|---|
| 1 | Snip Snap | Zig Zag |
| 2 | Tick Tack | Gulpuff |
| 3 | Chirpuff | Vanguard Junrock |
| 4 | Fission Junrock | Cruisewing |
| 5 | Fusion Dreadmane | Hoartoise |
| 6 | Cyan-Feathered Heron | Violet-Feathered Heron |
| 7 | Havoc Dreadmane | Spearback |
| 8 | Viridblaze Saurian | Tambourinist |
| 9 | Autopuppet Scout | Crownless |
| 10 | Tempest Mephis | Mourning Aix |
| 11 | Nameless Explorer | Inferno Rider |
| 12 | Feilian Beringal | Dreamless |
| 13 | Bell-Borne Geochelone | Hecate |
| 14 | Leviathan | Aleph-One |

```
Attachment 1 shows the current look of these Wuthering Waves enemies: keep their designs. Create a sprite sheet with EXACTLY 4 columns by 2 rows of equal cells. Row 1 is [ENEMY A], row 2 is [ENEMY B]. Columns: IDLE, ATTACK lunging LEFT, CAST charging element, HIT recoiling RIGHT, no gore. All poses face LEFT. In each row the enemy keeps the same size and ground line. Normal enemies fill about 60% of the cell height, elites 70%, bosses 80%. Authentic 16-bit pixel art on a uniform pixel grid, crisp 1-pixel dark outline, at most 48 colors, no anti-aliasing, no painterly texture. True alpha transparency, solid hard-edged effects only. No soft glow, haze, colored fringe, specks, text, grid lines, floor shadow or background. Everything stays at least 8% away from every cell edge, because the sheet is cut mechanically.
```
