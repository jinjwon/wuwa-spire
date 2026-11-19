# 전투 배경 프롬프트

마지막 갱신 2026-11-19. 결과는 `art/candidates/<키>/`에 넣고 `npm run board`에서 고른다([절차](ART_PIPELINE.md)). 지역 설정은 [설정 기준표](../lore/CHARACTER_BIBLE.md)의 확인된 내용만 쓴다. 지역의 공식 모습은 대조하지 않았다(미확인).

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
