# 신규 공명자 아트 생성 프롬프트 (2026-11-06)

캐릭터 1명당 **이미지 2장**. 기존 방식(ChatGPT/Codex 이미지 생성)으로 뽑고, 아래 파일명으로 `art/source-v2/`에 저장하면 에이전트가 자르고 연결한다.

- 첨부(참고 이미지)로 기존 `art/source-v2/heroesB.png`를 같이 올리면 화풍·크기가 맞는다(필수 권장).
- 잘라내기는 칸 단위 기계 절단이다. 칸 경계를 넘거나 글자가 들어가면 다시 뽑는다.

| 캐릭터 | 속성 · 효과 | 이미지 1 (모션 4×2) | 이미지 2 (카드 3×3) |
|---|---|---|---|
| 음림 | 전도 · 과부하 | `hero_yin.png` | `cards_yin.png` |
| 산화 | 응결 · 서리 | `hero_san.png` | `cards_san.png` |
| 카르티시아 | 기류 · 풍식 | `hero_car.png` | `cards_car.png` |

이미지 1 칸 배치(공통): 1행 = 대기 · 준비 · 공격 · 회복 / 2행 = 방어 · 피격 · 시전 · 해방.
첫 칸(대기)이 컷인 초상과 기본 스프라이트로도 쓰인다.

---

## 음림 (Yinlin)

### hero_yin.png
```
Use attached sprites ONLY as style, pixel density, body scale and proportion reference. NEW CHARACTER SPRITE ATLAS for a Wuthering Waves fan pixel-art deckbuilder. EXACT 4 columns by 2 rows of equal square cells, whole image 2:1, eight full-body poses of ONE heroine: Yinlin, long crimson-magenta hair in a high ponytail, violet and black fitted outfit with red accents, black thigh-high stockings, one gloved hand controlling a small floating mechanical puppet with glowing purple electro strings. Facing RIGHT. Row1: col1 IDLE relaxed stance puppet hovering beside her; col2 ANTICIPATION hand pulled back, strings tightening; col3 STRIKE puppet lunges forward with violet lightning crack; col4 RECOVERY strings slack, settling. Row2: col1 GUARD puppet in front as shield, arms crossed; col2 HIT recoil leaning backward, arm guarding face, no gore; col3 CAST hand raised, purple lightning mark sigil above palm; col4 ULTIMATE dramatic upright release, puppet huge behind her, violet thunder chains raining down. FULL BODY in every cell; each silhouette fits inside central 65% of its cell leaving 17% transparent padding on all sides. NO touching adjacent cells. Same body scale and consistent foot baseline in every cell. Authentic chunky 16-bit PIXEL ART not smooth anime painting, crisp dark outline, limited palette violet magenta black. True transparent background. No labels, text, grid, border or scenery. This is mechanically cut as 4x2 so precision matters.
```

### cards_yin.png
```
Finished collectible card ILLUSTRATION atlas for Wuthering Waves pixel-art deckbuilder. EXACT 3 columns x 3 rows, 9 panels, each panel a landscape 4:3 illustration, full bleed, clean straight boundaries; no gaps. Whole image aspect 12:9. Hero identity: Yinlin crimson-magenta high ponytail, violet black outfit, floating mechanical puppet on purple electro strings. Use attached hero atlas only as costume and hair reference. Panels in row-major order: 1. Yinlin flicking strings, puppet slashing an enemy with violet sparks; 2. Yinlin stepping back behind puppet shield; 3. glowing purple judgment mark stamped on a dark enemy; 4. violet lightning chaining between three dark enemies; 5. close-up gloved hand pulling taut glowing strings; 6. puppet spinning, throwing electric arcs in a circle; 7. Yinlin smiling coldly, cards and strings fanned out; 8. thunder pillar striking down on marked enemy; 9. wide night city rooftop crackling with purple storm. Every panel UNIQUE, dramatic readable action with strong central focal object, medium closeup or detail, full scenic colored background. Crisp chunky 16-bit pixel clusters, limited palette, dark navy outlines, luminous violet accent. Displays at 150x84 so avoid tiny details; make subjects large. No card frame, no numbers, NO text or typography, no logos, no UI. Professional cohesive game card art.
```

## 산화 (Sanhua)

### hero_san.png
```
Use attached sprites ONLY as style, pixel density, body scale and proportion reference. NEW CHARACTER SPRITE ATLAS for a Wuthering Waves fan pixel-art deckbuilder. EXACT 4 columns by 2 rows of equal square cells, whole image 2:1, eight full-body poses of ONE heroine: Sanhua, short silver-white bob hair, calm expression, white and pale ice-blue elegant attendant dress with dark trim, straight sword, ice crystal motifs. Facing RIGHT. Row1: col1 IDLE sword lowered at side; col2 ANTICIPATION sword drawn back, frost gathering; col3 STRIKE forward slash leaving ice shards; col4 RECOVERY sword flicked down, mist fading. Row2: col1 GUARD sword vertical with ice wall fragment; col2 HIT recoil leaning backward, arm guarding face, no gore; col3 CAST palm forward, ice glacier crystal forming; col4 ULTIMATE upright release, giant ice lotus blooming and shattering behind her. FULL BODY in every cell; each silhouette fits inside central 65% of its cell leaving 17% transparent padding on all sides. NO touching adjacent cells. Same body scale and consistent foot baseline in every cell. Authentic chunky 16-bit PIXEL ART not smooth anime painting, crisp dark outline, limited palette white ice-blue navy. True transparent background. No labels, text, grid, border or scenery. This is mechanically cut as 4x2 so precision matters.
```

### cards_san.png
```
Finished collectible card ILLUSTRATION atlas for Wuthering Waves pixel-art deckbuilder. EXACT 3 columns x 3 rows, 9 panels, each panel a landscape 4:3 illustration, full bleed, clean straight boundaries; no gaps. Whole image aspect 12:9. Hero identity: Sanhua short silver-white bob, white ice-blue attendant dress, straight sword, ice crystals. Use attached hero atlas only as costume and hair reference. Panels in row-major order: 1. Sanhua quick sword slash scattering ice shards; 2. Sanhua guarding behind a translucent ice wall; 3. frost creeping over a dark monster's claws, freezing its attack; 4. giant ice crystal exploding into fragments; 5. close-up blade edge coated in frost; 6. Sanhua bowing calmly as snowflakes swirl; 7. three ice glaciers erupting from ground under enemies; 8. frozen enemy cracking apart; 9. wide snowy shrine courtyard under pale moon. Every panel UNIQUE, dramatic readable action with strong central focal object, medium closeup or detail, full scenic colored background. Crisp chunky 16-bit pixel clusters, limited palette, dark navy outlines, luminous ice-blue accent. Displays at 150x84 so avoid tiny details; make subjects large. No card frame, no numbers, NO text or typography, no logos, no UI. Professional cohesive game card art.
```

## 카르티시아 (Cartethyia)

### hero_car.png
```
Use attached sprites ONLY as style, pixel density, body scale and proportion reference. NEW CHARACTER SPRITE ATLAS for a Wuthering Waves fan pixel-art deckbuilder. EXACT 4 columns by 2 rows of equal square cells, whole image 2:1, eight full-body poses of ONE heroine: Cartethyia, very long pale platinum hair, small hat, white and teal-blue noble knightly dress with gold trim, elegant sword, swirling aero wind ribbons and green-teal gale. Facing RIGHT. Row1: col1 IDLE sword held low, hair drifting in wind; col2 ANTICIPATION sword raised, wind spiraling; col3 STRIKE wide horizontal slash with teal wind blade; col4 RECOVERY spin follow-through, ribbons settling. Row2: col1 GUARD sword across chest inside wind barrier; col2 HIT recoil leaning backward, arm guarding face, no gore; col3 CAST hand raised, three small wind swords orbiting; col4 ULTIMATE upright release, huge tornado and giant wind sword behind her. FULL BODY in every cell; each silhouette fits inside central 65% of its cell leaving 17% transparent padding on all sides. NO touching adjacent cells. Same body scale and consistent foot baseline in every cell. Authentic chunky 16-bit PIXEL ART not smooth anime painting, crisp dark outline, limited palette white teal gold. True transparent background. No labels, text, grid, border or scenery. This is mechanically cut as 4x2 so precision matters.
```

### cards_car.png
```
Finished collectible card ILLUSTRATION atlas for Wuthering Waves pixel-art deckbuilder. EXACT 3 columns x 3 rows, 9 panels, each panel a landscape 4:3 illustration, full bleed, clean straight boundaries; no gaps. Whole image aspect 12:9. Hero identity: Cartethyia very long platinum hair, small hat, white teal noble knight dress, elegant sword, teal wind. Use attached hero atlas only as costume and hair reference. Panels in row-major order: 1. Cartethyia teal wind slash cutting through an enemy; 2. Cartethyia inside a spinning wind barrier; 3. green-teal erosion wind eating at a dark monster's armor; 4. three floating wind swords diving at a target; 5. close-up of sword tip with spiral gale; 6. Cartethyia's hair and ribbons sweeping in a storm; 7. tornado lifting rubble and enemies; 8. eroded enemy shattering into wind particles; 9. wide seaside cliff cathedral under a stormy sky. Every panel UNIQUE, dramatic readable action with strong central focal object, medium closeup or detail, full scenic colored background. Crisp chunky 16-bit pixel clusters, limited palette, dark navy outlines, luminous teal accent. Displays at 150x84 so avoid tiny details; make subjects large. No card frame, no numbers, NO text or typography, no logos, no UI. Professional cohesive game card art.
```

---

## 확인 체크리스트 (뽑은 뒤)
- 칸 수가 정확한가(4×2 / 3×3), 칸 경계를 넘은 부분이 없는가
- 배경이 진짜 투명인가(체크무늬가 그려진 가짜 투명 X) — 모션 시트만 해당
- 8칸 모두 같은 인물·같은 크기·같은 발 높이인가
- 글자·숫자·테두리가 없는가
