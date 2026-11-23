# 전투 배경 프롬프트

마지막 갱신 2026-11-23. 결과는 `art/candidates/<키>/`에 넣고 `npm run board`에서 고른다([절차](ART_PIPELINE.md)). 지역 설정은 [설정 기준표](../lore/CHARACTER_BIBLE.md)의 확인된 내용만 쓴다. 지역의 공식 모습은 대조하지 않았다(미확인).

## 규격
- GPT에 가로형 1536×1024로 요청한다. 위아래를 잘라 16:9로 쓴다. 위 8%와 아래 8%에는 중요한 것을 두지 않는다.
- 도트 격자는 640×360 기준이다. 1080p에서는 3배, 4K에서는 6배로 정수 확대해서 깨지지 않게 하려는 것이다.
- 화면 아래 35%는 평평한 바닥으로 비운다. 아군은 왼쪽, 적은 오른쪽에 선다.
- 인물, 글자, UI는 넣지 않는다.

## 공통 규칙
모든 배경 프롬프트 끝에 붙는다.

```
Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

메인 타이틀 배경은 [TITLE_PROMPTS.md](TITLE_PROMPTS.md)로 옮겼다.

## 지역

### battle_coast.png · 검은 해안
```
Black Shores: a dark night coastline with black sand and calm deep-blue water, faint glowing tide lines, ruined white stone structures and a distant lighthouse-like tower on the horizon, starry sky with a large pale moon. Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

### battle_forest.png · 무음 지대
```
Silent zone: a hushed night forest clearing where no wind moves, tall dark trees with pale blue-grey leaves, drifting motes of faint light frozen in the air, mossy stone path, thin mist low on the ground drawn as solid pixel bands. Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

### battle_spire.png · 별빛 첨탑
```
Starlit spire: the top floor of an ancient white stone tower open to the night sky, broken arches and pillars around a polished reflective floor, a huge starry sky with constellations and a pale moon, faint violet star dust. Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

### battle_lahai.png · 라하이로이
```
Lahai-Roi after a void storm: a futuristic academy city at night, sleek white buildings and launch towers in the distance, a swirling dark violet storm in the sky with thin bright cracks, scattered debris on a wide paved plaza. Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

## 정예·보스 전투 (신규, 2026-11-23)

지금은 한 구역의 일반·정예·보스 전투가 모두 같은 배경 하나를 쓴다. 구역마다 정예용·보스용을 따로 만든다. 장소는 구역 이름(`src/js/data.js` `ACTS`)에서 지은 이 게임의 설정이고, 원작 지역 모습과 대조하지 않았다(미확인). 보스 생김새는 넣지 않는다(배경에 인물·괴물 없음).

- 첨부: 없음 · 공통 규칙이 끝에 붙어 있다. 게임 연결(전투 종류별 배경 고르기, `prepare-battle-bg.cjs` 목록 추가)은 `dev` 일.

### battle_elite1.png · 1구역 정예 · 잠긴 해안의 탑 아래
```
Beneath the sealed coastal tower: the flooded base of a huge ancient white stone tower on a night shore, its heavy sealed gate glowing faintly with thin cyan lines, broken stone steps leading into shallow black water, chains and fallen pillars half sunk, dark sea and a pale moon behind. Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

### battle_boss1.png · 1구역 보스 · 해안 탑의 수문
```
Sealed sea gate of the coastal tower: a vast circular stone floodgate chamber open to the stormy night sea, enormous cracked arch framing towering dark waves frozen mid-crash, wet reflective stone floor, scattered glowing tide pools, cold blue and teal palette with a single pale lightning flash in the far sky. Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

### battle_elite2.png · 2구역 정예 · 첨탑 중층 회랑
```
Middle gallery of the starlit spire: a long open-air colonnade high on an ancient white tower, rows of slender arches with starry night sky between them, floating stone fragments drifting slowly outside, faint violet star dust, polished tiles reflecting the stars. Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

### battle_boss2.png · 2구역 보스 · 별빛 관측대
```
Starlit observatory at the spire summit: a giant broken armillary ring of white stone and pale gold metal hanging above a circular platform, constellations drawn as thin bright pixel lines across a deep violet night sky, a huge pale moon low behind the ring, wind-swept clouds far below the edge. Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

### battle_elite3.png · 3구역 정예 · 심연으로 가는 길
```
Path toward the abyss: a narrow bridge of broken white stone floating in a dark void, upside-down ruins hanging overhead, thin cracks of violet and cyan light splitting the black sky, small rock fragments suspended in mid-air, no visible ground below the bridge edges. Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

### battle_boss3.png · 3구역 보스 · 심연의 정점
```
Apex of the abyss: a wide shattered stone platform at the very top of the world, the sky torn open into a swirling black-violet vortex with a cold white core, rings of floating debris orbiting slowly, faint wireframe grid lines bending into the vortex, tense and silent. Authentic 16-bit pixel art battle background, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients. Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9. The bottom 35% is a flat, readable ground plane where characters will stand: party on the left, enemies on the right, so keep the center and both sides open. Dark night palette so pixel characters stay readable in front. No characters, no creatures, no text, no UI, no frame.
```

검수 체크리스트
- [ ] 아래 35%가 평평하고 읽기 쉬운 바닥이다(3구역 다리도 화면 폭 가득)
- [ ] 인물·괴물·글자가 없다
- [ ] 같은 구역 일반 배경과 색은 이어지고 장소는 확실히 다르다
- [ ] 도트 격자가 균일하고 부드러운 그라데이션이 없다
