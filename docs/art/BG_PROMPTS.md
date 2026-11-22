# 배경 프롬프트 (타이틀·전투)

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

## 메인 타이틀

지금 타이틀은 1구역 전투 배경(검은 해안)을 그대로 쓴다. 타이틀 전용 그림을 따로 만든다. 구도는 명조 실행 화면(사용자 스크린샷, 2026-11-23)의 짜임만 참고한다: 양옆 설산이 가운데 계곡을 감싸고, 계곡에 거울 같은 얼음 호수가 하늘을 비추고, 하늘을 왼쪽 위에서 가운데로 사선 빛줄기가 가르며 부서진 바위 조각이 떠 있고, 화면 위쪽에 청록 와이어프레임 격자가 산맥 모양으로 걸려 있다. 로고·글자·공식 그림은 넣지도 첨부하지도 않는다(공식 이미지 비사용). 첨부 없이 글로만 요청한다.

- 첨부: 없음 · 용도: 타이틀 화면 배경(`titleHTML`). 게임 연결(그림 교체)은 `dev` 일.
- 화면 가운데 세로 띠에 로고와 메뉴 버튼이 올라가므로 가운데는 어둡고 단순하게 둔다. 바닥 35% 규칙은 쓰지 않는다(캐릭터가 서지 않음).

### title_bg.png · 메인 타이틀
```
OBJECTIVE: Title-screen background for a fan-made pixel-art deckbuilder. A vast, quiet, awe-inspiring frozen valley at night that feels like the opening of a long journey.
COMPOSITION (must):
- Snow-covered mountain ranges rise on the left and right edges and slope down toward the center, framing a wide valley that recedes to a low horizon at about 55% of the height.
- The valley floor is a perfectly still frozen lake that mirrors the sky and mountains as a clean vertical reflection in the lower 40% of the image.
- A broad diagonal beam of pale teal-green light cuts across the sky from the upper left toward the center horizon, with a trail of broken floating rock fragments drifting along it; the largest fragments cluster just above the center horizon.
- Along the top 20%, a thin glowing cyan wireframe grid hangs in the sky shaped like an upside-down mountain range, as if the world is being scanned.
- Mountain ridges have thin cyan glowing contour lines on their snow, matching the wireframe.
LAYOUT: Keep a calm, dark, low-detail vertical band in the middle 40% of the width from 20% to 90% height, because a game logo and a column of menu buttons are placed there; the light beam and rocks may pass behind it but stay soft in value.
PALETTE: deep navy and midnight blue sky, cold white and ice-blue snow, cyan accent lines, one pale teal-green light beam. No warm colors.
STYLE & CONSTRAINTS: Authentic 16-bit pixel art, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients; light and reflections are drawn as flat stepped bands of solid color. No characters, no creatures, no logo, no text, no letters, no UI, no frame, no watermark.
OUTPUT: Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9.
VALIDATION: mountains frame both sides; lake reflection visible in the lower part; diagonal beam with floating rocks; wireframe grid at top; center band calm enough for white text; no text anywhere; pixel grid uniform with no soft gradients.
```

검수 체크리스트
- [ ] 글자·로고·인물이 하나도 없다
- [ ] 가운데 세로 띠가 어둡고 단순해서 흰 로고·메뉴가 읽힌다
- [ ] 양옆 설산, 호수 반사, 사선 빛줄기와 떠 있는 바위, 위쪽 격자가 모두 있다
- [ ] 빛줄기·반사가 부드러운 그라데이션이 아니라 계단식 단색 띠다
- [ ] 16:9로 잘라도 빛줄기 중심과 바위 무리가 남는다

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
