# PixelLab 캐릭터 프롬프트

마지막 갱신 2026-11-20. 이 문서는 `scripts/pixellab-prompts.cjs`가 만든다(직접 고치지 말고 스크립트를 고쳐 다시 돌린다). [PixelLab Character Creator](https://www.pixellab.ai/create-character/new)에 넣을 값이다. GPT용 16칸 시트 프롬프트([MOTION_PROMPTS.md](MOTION_PROMPTS.md))와 달리, 캐릭터를 한 번 만들고 동작을 하나씩 붙인다.

## 쓰는 법
1. **캐릭터 만들기**: 아래 설정을 고르고, 첫 블록(외형)을 Description에, 둘째 블록(금지)을 Negative description에 붙인다. 참조 이미지 칸이 있으면 `art/pixellab-ref/<id>.png`를 올린다(외형을 지금 도트에 맞추는 데 가장 효과가 크다).
2. **동작 붙이기**: 만든 캐릭터에서 Animate(텍스트로 동작)를 열고, 동작 블록을 Action description에 붙인다. 프레임 수와 방향은 블록 위에 적었다. 대기는 템플릿(breathing idle 류)이 있으면 그것을 먼저 써 본다.
3. **받기**: 동작별 PNG(가로 스트립 또는 프레임 묶음)를 내려받아 `art/pixellab/<id>/<동작>.png`에 둔다. 게임 연결(`assets/motion/`로 2배 정수 확대)은 `dev`에서 한다.

## 공통 설정
| 항목 | 값 | 이유 |
|---|---|---|
| View | **side** | 횡 전투 화면. top-down이면 위에서 본 모습이 된다 |
| Directions | 4 | 오른쪽(공명자 east)과 왼쪽(적 west)만 쓴다. 4방향이 가장 싸다 |
| Size | 공명자 **160**, 경파급·거랑급 **96**, 노도급·해일급 **128**, 명식 **192** | 게임에서 2배로 키우면 320·192·256·384로 지금 규격과 같다(정수 배율) |
| Body type | 공명자 humanoid. 적은 아래 표기대로 | 사람형이 아닌 적은 참조 이미지가 있어야 모양이 맞는다(없으면 두 발 인물로 그린다) |
| Proportions | 공명자 realistic female(방랑자 남 realistic male, 에이메스 메카 heroic) | 7등신, 머리 큰 비율 금지 |
| Outline | single color black outline | 지금 도트와 같은 1px 어두운 윤곽 |
| Shading / Detail | medium shading / high detail | 약한 힌트라 모델에 따라 무시될 수 있다 |
| Frames | 4~16 짝수 | PixelLab 제한 |

확인한 것: 위 항목 이름과 값 범위는 PixelLab 문서·MCP 설명 기준이다. 웹 화면의 실제 칸 이름과 위치, 참조 이미지 칸 유무는 로그인 화면이라 직접 보지 못했다(미확인).

## 공명자
### 에이메스 · `aem`
Size 160 · humanoid · realistic female · 참조 `art/pixellab-ref/aem.png`

외형(Description)
```
Aemeath: knee-length rose-pink high ponytail with peach tips, golden eyes, white sleeveless leotard with gold trim, metal device at the waist, navy-to-sky-blue starry gradient skirt tails, white gloves from the elbow, white thigh-highs with gold bands, white heels, sword. Adult with realistic slim 7-head proportions, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 에이메스 메카 · `aemMecha`
Size 160 · humanoid · heroic · 참조 `art/pixellab-ref/aemMecha.png`

외형(Description)
```
silver-white armor, round helmet with teal visor, golden crest swept back, teal chest core, floating white blade wings. Adult with realistic slim 7-head proportions, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 파수인 · `sk`
Size 160 · humanoid · realistic female · 참조 `art/pixellab-ref/sk.png`

외형(Description)
```
Shorekeeper: shoulder-length sky-blue hair with dark blue tips, pink-purple eyes, white translucent hood with navy and yellow butterfly ornaments, navy starry veil, short white dress with frilled collar, silver straps and bracelets, bare legs, glowing butterflies around her. Adult with realistic slim 7-head proportions, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
thrusts one hand forward to the right releasing a compact burst of energy, then pulls back
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 방랑자(여) · `rov`
Size 160 · humanoid · realistic female · 참조 `art/pixellab-ref/rov.png`

외형(Description)
```
Rover (female): short black bob hair with silver-white strands, black sleeveless high-neck top, grey asymmetric waist cloth, black thigh-high boots, slim black sword with small glowing blue accents. Adult with realistic slim 7-head proportions, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 방랑자(남) · `rovM`
Size 160 · humanoid · realistic male · 참조 `art/pixellab-ref/rovM.png` · 외형 문장 미확정: 참조 이미지에 의존

외형(Description)
```
male Rover from Wuthering Waves, follow the reference image exactly. Adult with realistic slim 7-head proportions, sword, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 치사 · `chi`
Size 160 · humanoid · realistic female · 참조 `art/pixellab-ref/chi.png`

외형(Description)
```
Chisa: long straight black hair with one red ribbon, short black jacket over a sailor top with red scarf, black pleated skirt, scissor-shaped greatsword, crimson thread-like slash effects. Adult with realistic slim 7-head proportions, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
lifts the greatsword and swings it down hard to the right, then recovers
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 카멜리아 · `cam`
Size 160 · humanoid · realistic female · 참조 `art/pixellab-ref/cam.png`

외형(Description)
```
Camellya: white twin-tail hair with black streaks, dark grey eyes with red diamond pupils, dark red flower on her head, red and black dress decorated with camellia flowers, crimson petals and thorny vines, sword. Adult with realistic slim 7-head proportions, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 모니에 · `mor`
Size 160 · humanoid · realistic female · 참조 `art/pixellab-ref/mor.png`

외형(Description)
```
Mornye: long silver-white hair covering one eye, one visible red eye, long white coat over indigo-navy inner outfit, celestial orbit diagrams and planets, large white blade. Adult with realistic slim 7-head proportions, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
lifts the greatsword and swings it down hard to the right, then recovers
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 린네 · `lyn`
Size 160 · humanoid · realistic female · 참조 `art/pixellab-ref/lyn.png`

외형(Description)
```
Lynae: long wavy blonde hair, headphones, white shirt, black jacket and short black skirt, mint and teal neon spray-paint graffiti effects. Adult with realistic slim 7-head proportions, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
raises the pistols to the right and fires twice with recoil, then lowers them
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 히유키 · `hiy`
Size 160 · humanoid · realistic female · 참조 `art/pixellab-ref/hiy.png`

외형(Description)
```
Hiyuki: white high ponytail with a red ribbon, red and white shrine maiden outfit with cherry blossom pattern, sword, ice and snow effects. Adult with realistic slim 7-head proportions, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 카르티시아 · `car`
Size 160 · humanoid · realistic female · 참조 `art/pixellab-ref/car.png` · 외형 문장 미확정: 참조 이미지에 의존

외형(Description)
```
Cartethyia from Wuthering Waves, follow the reference image exactly. Adult with realistic slim 7-head proportions, sword, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 음림 · `yin`
Size 160 · humanoid · realistic female · 참조 `art/pixellab-ref/yin.png` · 외형 문장 미확정: 참조 이미지에 의존

외형(Description)
```
Yinlin from Wuthering Waves, follow the reference image exactly. Adult with realistic slim 7-head proportions, no weapon in hand, side view facing right.
```

금지(Negative)
```
chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 east(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임 · 방향 east(오른쪽)
```
thrusts one hand forward to the right releasing a compact burst of energy, then pulls back
```

동작 막기(`guard`) · 4프레임 · 방향 east(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임 · 방향 east(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임 · 방향 east(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임 · 방향 east(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임 · 방향 east(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임 · 방향 east(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임 · 방향 east(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임 · 방향 east(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

## 적
외형 설명은 지금 도트(칵찰찰·아즈즈는 2026-11-20 새 디자인)를 보고 적었다. 공식 모습과는 대조하지 않았다(미확인). 사람형이 아닌 적은 참조 이미지를 꼭 올린다.

### 칵찰찰 · `snip`
경파급 · 용융 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/snip.png`

외형(Description)
```
Snip Snap, a Wuthering Waves enemy: crab monster with a black spiked carapace, cream face plate, one glowing orange eye and orange-red fire-tipped claws. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a pincer jab forward, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
its shell heating up with small embers, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 아즈즈 · `zig`
경파급 · 회절 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/zig.png`

외형(Description)
```
Zig Zag, a Wuthering Waves enemy: four-legged spirit beast with a flowing white and gold mane, long curled tail and dark navy body markings. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a bouncing hop that flicks a spark of light, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
a twinkling flash gathering on its body, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 우글글 · `tick`
경파급 · 인멸 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/tick.png`

외형(Description)
```
Tick Tack, a Wuthering Waves enemy: round dark purple creature that is mostly a huge toothy mouth, with violet spikes. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a lunging bite, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
a low growl with dark energy rising, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 꾹꾹복어 · `gulp`
경파급 · 응결 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/gulp.png`

외형(Description)
```
Gulpuff, a Wuthering Waves enemy: round blue pufferfish covered in pale ice spikes. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a bump forward while sprouting short ice spikes, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
puffing up round, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 쮸쮸복어 · `chirp`
경파급 · 기류 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/chirp.png`

외형(Description)
```
Chirpuff, a Wuthering Waves enemy: round mint-green puffer bird with small golden wings. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
spitting a small gust of wind, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
flapping its fins to gather wind, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 선봉 암괴 · `vjun`
경파급 · 물리 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/vjun.png`

외형(Description)
```
Vanguard Junrock, a Wuthering Waves enemy: hulking grey rock golem with a glowing golden core. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a downward rock smash, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
hardening its rocky body, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 분열 암괴 · `fjun`
경파급 · 물리 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/fjun.png`

외형(Description)
```
Fission Junrock, a Wuthering Waves enemy: grey golem made of stacked boulders with a small golden spark core. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
throwing a rock shard, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
curling up to roll, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 순회나비 · `cruise`
경파급 · 회절 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/cruise.png`

외형(Description)
```
Cruisewing, a Wuthering Waves enemy: large golden butterfly with glowing wing patterns. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a wing slash, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
scattering glowing dust from its wings, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 갈기늑대 · 불꽃 · `fdread`
경파급 · 용융 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/fdread.png`

외형(Description)
```
Fusion Dreadmane, a Wuthering Waves enemy: black wolf with a blazing red fiery mane. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a flaming bite with claws forward, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
a roar with its fiery mane flaring, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 서릿땅거북 · `hoar`
경파급 · 응결 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/hoar.png`

외형(Description)
```
Hoartoise, a Wuthering Waves enemy: pale blue tortoise with a jagged ice crystal shell. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a headbutt, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
frost breath gathering in its mouth, shell braced, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 초록색 왜가리 · `cheron`
거랑급 · 기류 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/cheron.png`

외형(Description)
```
Cyan-Feathered Heron, a Wuthering Waves enemy: tall cyan-feathered heron with a long beak. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a diving peck, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
rising with wings spread, feathers ready to rain down, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 보라색 왜가리 · `vheron`
거랑급 · 전도 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/vheron.png`

외형(Description)
```
Violet-Feathered Heron, a Wuthering Waves enemy: tall violet-feathered heron crackling with small lightning. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a lightning peck, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
charging lightning along its feathers, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 갈기늑대 · 암흑 · `hdread`
거랑급 · 인멸 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/hdread.png`

외형(Description)
```
Havoc Dreadmane, a Wuthering Waves enemy: black wolf with dark violet crystal spikes and mane. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a pouncing bite, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
a dark roar with its mane flaring, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 화살곰 · `spear`
거랑급 · 물리 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/spear.png`

외형(Description)
```
Spearback, a Wuthering Waves enemy: dark brown bear with long quill spikes along its back. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a body slam, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
curling up with back spines raised, ready to launch them, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 그린멜팅카멜레온 · `saur`
거랑급 · 용융 · Size 96 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/saur.png`

외형(Description)
```
Viridblaze Saurian, a Wuthering Waves enemy: green and orange chameleon-like reptile with a curled tail. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a flaming tongue lash, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
spitting lava, body shimmering as it camouflages, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 초혼의 악사 · `tamb`
거랑급 · 인멸 · Size 96 · humanoid · 참조 `art/pixellab-ref/tamb.png`

외형(Description)
```
Tambourinist, a Wuthering Waves enemy: pale robed figure holding a large round golden drum. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
striking its drum with a pulse of sound, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
raising the drum to summon spirits, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 경전차 로봇 · `scout`
거랑급 · 응결 · Size 96 · humanoid · 참조 `art/pixellab-ref/scout.png`

외형(Description)
```
Autopuppet Scout, a Wuthering Waves enemy: white armored mech robot with blue joints. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a forward charge, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
aiming its cooling cannon, armor plates opening, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 크라운리스 · `crown`
노도급 · 인멸 · Size 128 · humanoid · 참조 `art/pixellab-ref/crown.png`

외형(Description)
```
Crownless, a Wuthering Waves enemy: tall dark armored knight with black wings and gold trim. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a wide blade strike, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
an ominous dark aura gathering, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 천둥의 비늘 · `mephis`
노도급 · 전도 · Size 128 · humanoid · 참조 `art/pixellab-ref/mephis.png`

외형(Description)
```
Tempest Mephis, a Wuthering Waves enemy: dark violet armored dragon-like warrior with lightning spikes. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a lightning strike called down, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
raising a curtain of lightning, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 애곡하는 아익스 · `aix`
노도급 · 회절 · Size 128 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/aix.png`

외형(Description)
```
Mourning Aix, a Wuthering Waves enemy: white and gold phoenix-like bird with long fan tail feathers. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a beam of light from its body, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
a mournful cry with wings forming a barrier, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 이름없는 탐색자 · `explorer`
노도급 · 기류 · Size 128 · humanoid · 참조 `art/pixellab-ref/explorer.png`

외형(Description)
```
Nameless Explorer, a Wuthering Waves enemy: bulky astronaut-like armored figure with a dark round visor and teal energy trails. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a quick gust-powered shot, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
a fast evasive maneuver gathering wind, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 지옥불 기사 · `rider`
노도급 · 용융 · Size 128 · humanoid · 참조 `art/pixellab-ref/rider.png`

외형(Description)
```
Inferno Rider, a Wuthering Waves enemy: armored rider on a flaming black motorcycle. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a charging blade combo, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
flaming armor flaring up, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 폭주의 고릴라 · `gorilla`
노도급 · 기류 · Size 128 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/gorilla.png`

외형(Description)
```
Feilian Beringal, a Wuthering Waves enemy: massive gorilla covered in mossy green rock. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a whirlwind punch, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
a roar before a downward smash, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 무망자 · `dreamless`
해일급 · 인멸 · Size 128 · humanoid · 참조 `art/pixellab-ref/dreamless.png`

외형(Description)
```
Dreamless, a Wuthering Waves enemy: pale ghostly swordsman with long white hair and tattered violet wings. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a chaotic blade strike, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
a shadow veil gathering around it, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 타종 거북이 · `turtle`
해일급 · 응결 · Size 128 · 사람형 아님: 참조 이미지 필수 · 참조 `art/pixellab-ref/turtle.png`

외형(Description)
```
Bell-Borne Geochelone, a Wuthering Waves enemy: giant blue stone tortoise carrying a bronze bell tower on its back. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
slamming its bell down, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
a ringing bell barrier forming, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 헤카테 · `hecate`
해일급 · 인멸 · Size 128 · humanoid · 참조 `art/pixellab-ref/hecate.png`

외형(Description)
```
Hecate, a Wuthering Waves enemy: crimson-robed woman with a tall crown and a long red scythe-staff. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a moonlight scythe swing, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
opening a gate of dark light with a three-way curse, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 레비아탄 · `levia`
명식 · 인멸 · Size 192 · humanoid · 참조 `art/pixellab-ref/levia.png`

외형(Description)
```
Leviathan, a Wuthering Waves enemy: tall dark-blue sea siren with long flowing hair and robes. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a crashing tidal wave strike, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
an abyssal roar with deep-sea pressure gathering, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 알레프-원의 창조물 · `aleph`
명식 · 인멸 · Size 192 · humanoid · 참조 `art/pixellab-ref/aleph.png`

외형(Description)
```
Aleph-One, a Wuthering Waves enemy: dark violet armored void construct with a dark halo. Menacing, side view facing left.
```

금지(Negative)
```
cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text
```

동작 대기(`idle`) · 4프레임 · 방향 west(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임 · 방향 west(왼쪽)
```
a void spear thrust, moving to the left, then recovers
```

동작 시전(`cast`) · 6프레임 · 방향 west(왼쪽)
```
a void barrage gathering, then releases a compact burst
```

동작 피격(`hit`) · 4프레임 · 방향 west(왼쪽)
```
recoils to the right from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임 · 방향 west(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임 · 방향 west(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```
