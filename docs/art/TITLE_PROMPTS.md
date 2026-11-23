# 메인 타이틀 기획·프롬프트

마지막 갱신 2026-11-23. 결과는 `art/candidates/<키>/`에 넣고 `npm run board`에서 고른다. 화면 연결(`titleHTML`, `src/styles.css`의 `.titlescr`)은 `dev` 일이다.

## 기획
참고: 명조 3.0 로그인 화면(사용자 스크린샷, 2026-11-23). 유튜브 영상은 에이전트가 볼 수 없어서 스크린샷 한 장만 기준으로 했다. 움직임(카메라, 입자, 빛줄기 흐름)을 영상처럼 맞추려면 영상의 장면을 스크린샷이나 말로 더 받아야 한다(미확인).

스크린샷에서 본 짜임(추정 아님, 화면에 보이는 것):
- 가운데 아래를 큰 검은 바위 언덕이 차지하고, 왼쪽 비탈에 한 사람이 뒤돌아 서 있고 오른쪽 비탈에 한 사람이 앉아 있다. 두 사람 모두 화면 가운데(왼쪽)를 향한다.
- 양옆 설산 비탈에 청록 와이어프레임 격자가 덮여 있고, 멀리 얼음 평원이 펼쳐진다.
- 하늘 위쪽을 청록 빛줄기가 사선으로 가르고, 가운데 위에 큰 바위 덩어리와 잔돌이 떠 있다.
- UI: 왼쪽 위 로고, 오른쪽 위 버전 글자, 오른쪽 세로 아이콘 줄(종료·공지·툴·계정), 아래 가운데 서버 상자와 "솔라리스 연결" 시작 띠.

이 게임에 맞춘 화면(도트는 정수 배율 규칙을 지킨다):
| 층 | 내용 | 만드는 법 |
|---|---|---|
| 1 배경 | 설산·와이어프레임·빛줄기·가운데 바위 언덕. 인물 없음 | `title_bg` 프롬프트 → 640×360 격자(`prepare-battle-bg.cjs`와 같은 처리) |
| 2 떠 있는 바위 | 큰 바위 덩어리와 잔돌, 투명 배경. 천천히 위아래로 떠다니게 | `title_rocks` 프롬프트 |
| 3 캐릭터 | 왼쪽 비탈: 에이메스 서 있음(뒤돌아봄). 오른쪽 비탈: 방랑자 앉음. 방랑자는 타이틀의 "방랑자 외형" 설정(남/여)을 따른다 | `title_pose_*` 프롬프트, 4칸 숨쉬기·바람 반복 |
| 4 UI | 왼쪽 위 "첨탑의 메아리" 로고, 오른쪽 위 버전, 오른쪽 아이콘 줄(전체 화면·기록·도움말·외형·종료), 아래 가운데 이어하기/새 게임 상자와 "첨탑에 오르기" 시작 띠. 지금의 원형 파티 얼굴 줄은 뺀다 | 코드(그림 없음) |

캐릭터 고르기 이유: 에이메스는 라하이로이(3.0 지역) 캐릭터이고 방랑자는 주인공이다(설정 기준표). 다른 캐릭터로 바꾸려면 아래 프롬프트 틀에서 외형 문장과 첨부만 바꾼다. 외형 문장은 [HERO_PROMPTS.md](HERO_PROMPTS.md)에 확정된 것만 쓴다(남성 방랑자는 확정 문장이 없어 첨부로만 맞춘다).

## 배경

### title_bg.png · 메인 타이틀 배경
- 첨부: 없음(공식 그림·로고는 첨부하지 않는다).
```
OBJECTIVE: Title-screen background for a fan-made pixel-art deckbuilder: a vast, quiet frozen valley at dusk where two travelers will rest on a dark rock hill. Characters are added later as separate sprites, so draw none.
COMPOSITION (must):
- A large dark grey-black rocky hill fills the lower center, from about 25% to 80% of the width, rising to a rounded peak near the center at about 45% of the height. It has two flat-topped ledges for characters: a LEFT ledge at about 27% of the width and 62% of the height, and a RIGHT ledge at about 70% of the width and 66% of the height; keep both ledges plain and empty.
- Snow-covered mountain slopes rise on the left and right edges; thin glowing cyan wireframe mesh lines wrap over their slopes like a 3D scan grid.
- Behind the hill, a wide icy plain with frozen lakes and drifting snow streaks recedes to a low horizon.
- A broad diagonal band of pale teal-green light crosses the sky from the upper left toward the upper right, with streaks of small rock specks along it.
- Leave the sky area just above the hill peak EMPTY: a separate floating rock layer is placed there later.
LAYOUT: keep the top-left 25% x 20% corner and the bottom-center strip (35% to 65% of the width, bottom 18%) dark and low in detail for the logo and the start button; keep the right edge strip (last 10% of the width) simple for a column of icons.
PALETTE: slate blue and steel grey sky, cold white snow, near-black rock with blue-grey highlights, cyan wireframe lines, one teal-green light band. No warm colors.
STYLE & CONSTRAINTS: Authentic 16-bit pixel art, as if drawn at 640x360 pixels and scaled up by whole numbers: uniform pixel grid, crisp clusters, at most 64 colors, no anti-aliasing, no dithering noise, no painterly brush texture, no blur, no smooth gradients; light is drawn as flat stepped bands of solid color. No characters, no creatures, no logo, no text, no letters, no UI, no frame, no watermark.
OUTPUT: Landscape 1536x1024; keep the top 8% and bottom 8% free of important details because the image is cropped to 16:9.
VALIDATION: two empty ledges on the rock hill at the stated places; wireframe mesh on both mountain slopes; diagonal teal light band; empty sky above the peak; logo corner and start-button strip are calm; no text or characters anywhere; uniform pixel grid. CLEAN LOCK (prevents noisy, muddy output): every art pixel is a clearly visible solid square of equal size; one clear subject and at most two supporting elements; large flat color areas with only 2-3 shade steps per material; no texture noise, no speckles, no scattered sparkles or glitter particles (a few single-pixel stars in a night sky are fine), no translucent overlapping layers, no ghosted, doubled or giant background faces, no afterimages, no lens flare, no bloom or glow halos; light and energy are a few bold solid pixel shapes with hard edges; background simplified into big chunky blocks, darker and lower in contrast than the subject; clear readable silhouette; use fewer colors than the limit allows.
```

### title_rocks.png · 떠 있는 바위 층
- 첨부: `title_bg` 결과(색·도트 크기 맞춤용). 결과를 받은 뒤 만든다.
```
OBJECTIVE: A separate floating-rock layer placed over the title background (Attachment 1) and animated to drift slowly.
REFERENCES: Attachment 1 is the background it sits on: match its palette, light direction and pixel size exactly.
REQUIREMENTS (must): one large jagged rock cluster made of 4-6 broken grey-black chunks, lit from the upper left with blue-grey highlights, plus 12-20 small rock specks scattered diagonally from upper left to lower right around it.
CONSTRAINTS: Authentic 16-bit pixel art on a uniform pixel grid, at most 32 colors, no anti-aliasing, no dithering noise, no painterly texture, no blur. True alpha transparency: no checkerboard, no sky, no light beam, no glow; every pixel fully opaque or fully transparent. Keep everything at least 10% away from the image edges. No text.
OUTPUT: Landscape 1536x1024, the rock cluster centered.
VALIDATION: only rocks on a transparent background; colors match Attachment 1; hard pixel edges with no halo. CLEAN LOCK (prevents noisy, muddy output): every art pixel is a clearly visible solid square of equal size; one clear subject and at most two supporting elements; large flat color areas with only 2-3 shade steps per material; no texture noise, no speckles, no scattered sparkles or glitter particles (a few single-pixel stars in a night sky are fine), no translucent overlapping layers, no ghosted, doubled or giant background faces, no afterimages, no lens flare, no bloom or glow halos; light and energy are a few bold solid pixel shapes with hard edges; background simplified into big chunky blocks, darker and lower in contrast than the subject; clear readable silhouette; use fewer colors than the limit allows.
```

## 캐릭터 포즈 (2×2 4칸, 숨쉬기·바람 반복)
- 첨부: 1. 공식 이미지(공식 그림은 커밋하지 않는다) 2. `art/source-v2/hero_<id>.png`(지금 도트 시트).
- 게임 재생(예정): 4칸을 0.5초씩 반복. 크기는 공명자 몸 208px 규격과 같은 배율로 보여 준다.

### title_pose_aem.png · 에이메스 · 왼쪽 비탈에 서서 뒤돌아봄
```
OBJECTIVE: Title-screen pose sprite of Aemeath for a fan-made pixel-art deckbuilder, shown sitting on top of a pixel-art background like a game's login screen.
REFERENCES: Attachment 1 is the OFFICIAL art of Aemeath from Wuthering Waves (outfit and colors). Attachment 2 is Aemeath's current pixel sprite sheet: copy its design, pixel density, proportions and style exactly. Attachments are the only source; do not invent parts that are not visible. Do not redesign: Aemeath: knee-length rose-pink high ponytail with peach tips, golden eyes, white sleeveless leotard with gold trim, metal device at the waist, navy-to-sky-blue starry gradient skirt tails, white gloves from the elbow, white thigh-highs with gold bands, white heels, sword. 
REQUIREMENTS (must): Full-body STANDING pose seen from a three-quarter BACK view, facing LEFT and slightly away from the viewer, looking down over a far valley; weight on one leg, arms relaxed, weapon sheathed or held low at the side. Cells in row-major order: 1 the pose; 2 same pose, shoulders 1 pixel lower (breath); 3 same as 2 with hair and cloth tips pushed 1-2 pixels to the left by a cold wind; 4 same as 1 with hair and cloth tips returning. Only hair, cloth and breathing move; the body outline stays in place so the 4 cells loop as a calm idle.
PREFERENCES (optional): quiet, distant mood; cold blue rim light drawn as a single row of lighter pixels on the right edge of hair and shoulders.
CONSTRAINTS: realistic adult 7-head proportions, never chibi; same size and same position in all 4 cells, head-to-foot height (or head-to-seat height when seated) 70% of the cell height, lowest point on the same line near the cell bottom; everything stays at least 12% away from every cell edge. Authentic 16-bit pixel art on a uniform pixel grid, crisp 1-pixel dark navy outline, at most 48 colors, no anti-aliasing, no dithering noise, no painterly texture. True alpha transparency: no checkerboard, no background, no floor shadow. EDGE LOCK: every pixel is fully opaque or fully transparent; no cyan, red, yellow or white rim around the outline and no semi-transparent shadow. No weapon effects, no speed lines, no afterimages, no text.
OUTPUT: square image 1024x1024, exactly 2 columns by 2 rows of 4 equal cells, no gaps, labels, numbers or grid lines.
VALIDATION: 4 cells show one pose with only tiny hair/cloth/breath changes; identical face, outfit and colors to Attachment 2; transparent background with no checkerboard; nothing touches a cell edge. CLEAN LOCK (prevents noisy, muddy output): every art pixel is a clearly visible solid square of equal size; one clear subject and at most two supporting elements; large flat color areas with only 2-3 shade steps per material; no texture noise, no speckles, no scattered sparkles or glitter particles (a few single-pixel stars in a night sky are fine), no translucent overlapping layers, no ghosted, doubled or giant background faces, no afterimages, no lens flare, no bloom or glow halos; light and energy are a few bold solid pixel shapes with hard edges; background simplified into big chunky blocks, darker and lower in contrast than the subject; clear readable silhouette; use fewer colors than the limit allows.
```

### title_pose_rov.png · 방랑자(여) · 오른쪽 비탈에 앉음
```
OBJECTIVE: Title-screen pose sprite of female Rover for a fan-made pixel-art deckbuilder, shown sitting on top of a pixel-art background like a game's login screen.
REFERENCES: Attachment 1 is the OFFICIAL art of female Rover from Wuthering Waves (outfit and colors). Attachment 2 is female Rover's current pixel sprite sheet: copy its design, pixel density, proportions and style exactly. Attachments are the only source; do not invent parts that are not visible. Do not redesign: Rover (female): short black bob hair with silver-white strands, black sleeveless high-neck top, grey asymmetric waist cloth, black thigh-high boots, slim black sword with small glowing blue accents. 
REQUIREMENTS (must): SEATED pose seen from the side, facing LEFT: sitting on flat ground (the rock is in the background image, so draw nothing under the character), one knee raised with a forearm resting on it, the other leg folded, head slightly lowered, weapon laid beside or across the lap. Cells in row-major order: 1 the pose; 2 same pose, shoulders 1 pixel lower (breath); 3 same as 2 with hair and cloth tips pushed 1-2 pixels to the left by a cold wind; 4 same as 1 with hair and cloth tips returning. Only hair, cloth and breathing move; the body outline stays in place so the 4 cells loop as a calm idle.
PREFERENCES (optional): quiet, distant mood; cold blue rim light drawn as a single row of lighter pixels on the right edge of hair and shoulders.
CONSTRAINTS: realistic adult 7-head proportions, never chibi; same size and same position in all 4 cells, head-to-foot height (or head-to-seat height when seated) 70% of the cell height, lowest point on the same line near the cell bottom; everything stays at least 12% away from every cell edge. Authentic 16-bit pixel art on a uniform pixel grid, crisp 1-pixel dark navy outline, at most 48 colors, no anti-aliasing, no dithering noise, no painterly texture. True alpha transparency: no checkerboard, no background, no floor shadow. EDGE LOCK: every pixel is fully opaque or fully transparent; no cyan, red, yellow or white rim around the outline and no semi-transparent shadow. No weapon effects, no speed lines, no afterimages, no text.
OUTPUT: square image 1024x1024, exactly 2 columns by 2 rows of 4 equal cells, no gaps, labels, numbers or grid lines.
VALIDATION: 4 cells show one pose with only tiny hair/cloth/breath changes; identical face, outfit and colors to Attachment 2; transparent background with no checkerboard; nothing touches a cell edge. CLEAN LOCK (prevents noisy, muddy output): every art pixel is a clearly visible solid square of equal size; one clear subject and at most two supporting elements; large flat color areas with only 2-3 shade steps per material; no texture noise, no speckles, no scattered sparkles or glitter particles (a few single-pixel stars in a night sky are fine), no translucent overlapping layers, no ghosted, doubled or giant background faces, no afterimages, no lens flare, no bloom or glow halos; light and energy are a few bold solid pixel shapes with hard edges; background simplified into big chunky blocks, darker and lower in contrast than the subject; clear readable silhouette; use fewer colors than the limit allows.
```

### title_pose_rovM.png · 방랑자(남) · 오른쪽 비탈에 앉음
```
OBJECTIVE: Title-screen pose sprite of male Rover for a fan-made pixel-art deckbuilder, shown sitting on top of a pixel-art background like a game's login screen.
REFERENCES: Attachment 1 is the OFFICIAL art of male Rover from Wuthering Waves (outfit and colors). Attachment 2 is male Rover's current pixel sprite sheet: copy its design, pixel density, proportions and style exactly. Attachments are the only source; do not invent parts that are not visible. 
REQUIREMENTS (must): SEATED pose seen from the side, facing LEFT: sitting on flat ground (the rock is in the background image, so draw nothing under the character), one knee raised with a forearm resting on it, the other leg folded, head slightly lowered, weapon laid beside or across the lap. Cells in row-major order: 1 the pose; 2 same pose, shoulders 1 pixel lower (breath); 3 same as 2 with hair and cloth tips pushed 1-2 pixels to the left by a cold wind; 4 same as 1 with hair and cloth tips returning. Only hair, cloth and breathing move; the body outline stays in place so the 4 cells loop as a calm idle.
PREFERENCES (optional): quiet, distant mood; cold blue rim light drawn as a single row of lighter pixels on the right edge of hair and shoulders.
CONSTRAINTS: realistic adult 7-head proportions, never chibi; same size and same position in all 4 cells, head-to-foot height (or head-to-seat height when seated) 70% of the cell height, lowest point on the same line near the cell bottom; everything stays at least 12% away from every cell edge. Authentic 16-bit pixel art on a uniform pixel grid, crisp 1-pixel dark navy outline, at most 48 colors, no anti-aliasing, no dithering noise, no painterly texture. True alpha transparency: no checkerboard, no background, no floor shadow. EDGE LOCK: every pixel is fully opaque or fully transparent; no cyan, red, yellow or white rim around the outline and no semi-transparent shadow. No weapon effects, no speed lines, no afterimages, no text.
OUTPUT: square image 1024x1024, exactly 2 columns by 2 rows of 4 equal cells, no gaps, labels, numbers or grid lines.
VALIDATION: 4 cells show one pose with only tiny hair/cloth/breath changes; identical face, outfit and colors to Attachment 2; transparent background with no checkerboard; nothing touches a cell edge. CLEAN LOCK (prevents noisy, muddy output): every art pixel is a clearly visible solid square of equal size; one clear subject and at most two supporting elements; large flat color areas with only 2-3 shade steps per material; no texture noise, no speckles, no scattered sparkles or glitter particles (a few single-pixel stars in a night sky are fine), no translucent overlapping layers, no ghosted, doubled or giant background faces, no afterimages, no lens flare, no bloom or glow halos; light and energy are a few bold solid pixel shapes with hard edges; background simplified into big chunky blocks, darker and lower in contrast than the subject; clear readable silhouette; use fewer colors than the limit allows.
```

## 검수 체크리스트
- [ ] 배경: 바위 언덕의 두 턱이 비어 있고, 캐릭터를 얹었을 때 발(앉은 자리)이 턱에 맞는다
- [ ] 배경: 로고 자리(왼쪽 위)와 시작 띠 자리(아래 가운데)가 어둡고 단순하다
- [ ] 바위 층: 투명 배경, 테두리 번짐 없음, 배경과 색이 맞는다
- [ ] 포즈: 4칸이 같은 자세이고 머리카락·옷자락·숨만 조금 움직인다
- [ ] 포즈: 얼굴·옷·색이 지금 도트 시트와 같다. 7등신이고 머리가 크지 않다
- [ ] 모두: 글자·로고·워터마크가 없다
