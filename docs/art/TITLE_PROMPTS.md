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
| 1 배경 | 설산·와이어프레임 능선·빛줄기와 바위·뒤집힌 격자·거울 호수·아래 눈 둑. 인물 없음 | `title_bg`(플로우) → `node scripts/prepare-battle-bg.cjs`가 `assets/maps/title-bg.png`(640×360)로 만든다 |
| 2 떠 있는 바위 | (선택) 지금 배경 빛줄기에 바위가 이미 있다. 움직이게 하고 싶을 때만 만든다 | `title_rocks` 프롬프트 |
| 3 캐릭터 | 아래 눈 둑 왼쪽: 에이메스 서 있음(뒤돌아봄). 오른쪽: 방랑자 앉음. 방랑자는 타이틀의 "방랑자 외형" 설정(남/여)을 따른다 | `title_pose_*` 프롬프트, 4칸 숨쉬기·바람 반복 |
| 1-1 움직이는 배경(선택) | 같은 배경을 8초 무음 반복 영상으로. 빛줄기·바위·격자·눈발만 천천히 움직임 | `title_bg.mp4` 영상 프롬프트(플로우) |
| 4 UI | 왼쪽 위 "첨탑의 메아리" 로고, 오른쪽 위 버전, 오른쪽 아이콘 줄(전체 화면·기록·도움말·외형·종료), 아래 가운데 이어하기/새 게임 상자와 "첨탑에 오르기" 시작 띠. 지금의 원형 파티 얼굴 줄은 뺀다 | 코드(그림 없음) |

캐릭터 고르기 이유: 에이메스는 라하이로이(3.0 지역) 캐릭터이고 방랑자는 주인공이다(설정 기준표). 다른 캐릭터로 바꾸려면 아래 프롬프트 틀에서 외형 문장과 첨부만 바꾼다. 외형 문장은 [HERO_PROMPTS.md](HERO_PROMPTS.md)에 확정된 것만 쓴다(남성 방랑자는 확정 문장이 없어 첨부로만 맞춘다).

## 배경

### title_bg.png · 메인 타이틀 배경 (플로우)
- 도구: 구글 플로우(나노바나나), 16:9로 바로 받는다. 첨부 없음. 짧게 쓴다: 긴 배치 지시(퍼센트 좌표·여러 빈자리)는 플로우가 무시했다(2026-11-23 결과).
- 지금 쓰는 그림(2026-11-23, 사용자 선택): 양옆 설산과 와이어프레임 능선, 왼쪽 위에서 떨어지는 청록 빛줄기와 바위, 위쪽 뒤집힌 격자, 가운데 거울 호수, 아래 눈 둑. 바위 언덕은 없어서 캐릭터는 아래 눈 둑에 세운다.
- 오른쪽 아래 모서리에 플로우 워터마크(별 모양)가 작게 있다. 지우지 않는다.
```
16-bit pixel art landscape, wide 16:9. A frozen mirror lake in a snowy mountain valley at night. Snowy peaks on the left and right edges with thin cyan wireframe lines along their ridges. One wide pale teal light beam falls diagonally from the upper left to the center of the horizon, with a few dark rocks floating along it. An upside-down cyan wireframe grid hangs at the top center. The lake mirrors everything. A flat snow bank runs across the bottom. Colors: navy, ice blue, white, cyan, one teal-green. Big flat color areas, hard pixel edges, no gradients, no glow. Calm, dark center. Nothing in the corners. No people, no text, no logo.
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

## 움직이는 배경 (영상)

명조 로그인 화면처럼 배경이 천천히 살아 움직이게 한다: 빛줄기가 흐르고, 바위가 떠다니고, 격자가 깜빡이고, 눈발이 날린다. 캐릭터는 영상에 넣지 않는다(도트 포즈 그림을 위에 따로 얹는다).
- 도구: 구글 플로우(Veo) 이미지→영상. 시작 프레임과 끝 프레임에 **같은 타이틀 배경 그림**을 넣으면 처음과 끝이 이어져 끊김 없이 반복된다. 16:9, 8초.
- 소리: 프롬프트에서 무음을 요청한다. 그래도 소리가 붙어 나오면 게임에서는 `muted`로 재생하고, 파일에서도 소리 트랙을 뺀다(`ffmpeg -i in.mp4 -an -c:v copy out.mp4`).
- 주의: 영상 모델은 도트를 뭉개기 쉽다. 결과가 흐리면 움직임 수를 줄여(빛줄기·눈발만) 다시 만든다. 한국에서는 보이는 워터마크가 붙는다(지우지 않는다).
- 결과: `art/source-v2/title_bg.mp4`(커밋 여부는 용량을 보고 정한다). 게임 연결(타이틀 배경을 영상으로, 첫 프레임 그림을 대체 이미지로)은 `dev` 일.

### title_bg.mp4 · 타이틀 움직이는 배경 (플로우)
```
Animate the attached 16-bit pixel art title background into a calm, seamless 8-second loop for a game login screen. Keep the camera completely still and keep every shape, color and the pixel-art look of the image: crisp square pixels, no smoothing, no blur, no new objects. Gentle motion only: the diagonal teal light beam slowly shimmers and drifts along its length; the floating rocks bob up and down a few pixels and turn very slightly; the cyan wireframe lines pulse softly in brightness; a few small snow pixels drift sideways in the wind; the frozen lake reflection ripples faintly. The last frame matches the first frame exactly so it loops. No people, no text, no logo, no camera movement, no zoom, no cuts. Audio: none. Completely silent video: no music, no sound effects, no ambience, no voices.
```

검수 체크리스트(영상)
- [ ] 소리가 없다(있으면 소리 트랙 제거)
- [ ] 카메라가 움직이지 않고, 처음과 끝이 이어져 반복할 때 튀지 않는다
- [ ] 도트가 뭉개지거나 흐려지지 않았다. 새 물체·인물·글자가 생기지 않았다
- [ ] 움직임이 느리고 작아서 로고·메뉴를 읽는 데 방해가 안 된다

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
- [ ] 배경: 아래 눈 둑이 평평해서 캐릭터 발(앉은 자리)을 얹을 수 있다
- [ ] 배경: 로고 자리(왼쪽 위)와 시작 띠 자리(아래 가운데)가 어둡고 단순하다
- [ ] 바위 층: 투명 배경, 테두리 번짐 없음, 배경과 색이 맞는다
- [ ] 포즈: 4칸이 같은 자세이고 머리카락·옷자락·숨만 조금 움직인다
- [ ] 포즈: 얼굴·옷·색이 지금 도트 시트와 같다. 7등신이고 머리가 크지 않다
- [ ] 모두: 글자·로고·워터마크가 없다
