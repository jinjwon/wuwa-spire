# PixelLab 캐릭터 프롬프트

마지막 갱신 2026-11-20(웹 화면 스크린샷 기준으로 수정). 이 문서는 `scripts/pixellab-prompts.cjs`가 만든다(직접 고치지 말고 스크립트를 고쳐 다시 돌린다). [PixelLab Character Creator](https://www.pixellab.ai/create-character/new)의 **Create from Text** 탭에 넣을 값이다. 캐릭터를 한 번 만들고(정면으로 그린 뒤 8방향으로 돌려 줌) 동작을 하나씩 붙인다.

## 화면 순서대로 고를 값
| 화면 칸 | 고를 값 | 메모 |
|---|---|---|
| 탭 | **Create from Text** | Create from Reference는 정면(South) 그림이 필수다. 지금 도트는 옆모습이라 그대로는 못 쓴다 |
| Character Type | 캐릭터마다 아래 표기(Humanoid / Quadruped / Custom) | Quadruped는 실험, Custom은 베타(생물·물체·특이한 몸) |
| Generation Mode | **v3** | 텍스트에서 만들고 8방향을 자동으로 만든다. Pro는 구독 전용 |
| Character Description | 아래 외형 블록 | 최대 2000자. 저장돼서 나중에 동작을 만들 때도 쓰인다 |
| Camera View | **Sidescroller** | 횡 전투 화면. Low/High Top-Down은 위에서 본 모습이 된다 |
| Sprite Size | 아래 크기 표 | 무료 체험 계정에서는 64px까지만 고를 수 있다(80px 이상 잠김) |
| Detail | **Highly detailed** | |
| Outline | Default로 먼저 만들고, 윤곽이 지금 도트와 다르면 검은 단색 윤곽 계열로 바꾼다 | 목록 값은 화면에서 확인 필요 |
| 방향 | 결과의 8방향 중 공명자 **East**, 적 **West**를 쓴다 | |

웹 화면에 Negative description·체형 비율·Shading 칸은 없다. 피하고 싶은 것(머리 큰 비율 등)은 외형 설명 안에 원하는 모습으로 적었다.

## 크기와 비용
게임은 도트를 정수 배율로만 키운다. 그래서 크기를 게임 규격(공명자 320, 일반 적 192, 정예 256, 보스 384)의 정수분의 1로 맞춘다.

| 대상 | 무료 체험(64px까지) | Tier 1 이상(320px까지) |
|---|---|---|
| 공명자 | 64px(게임 ×5) | 160px(×2, 슬라이더로 맞춤) |
| 경파급·거랑급(17마리) | 48px(×4) | 96px(×2) |
| 노도급·해일급(9마리) | 64px(×4) | 128px(×2) |
| 명식 보스(2마리) | 64px(×6) | 192px(×2) |
| 캐릭터 만들기 비용(40명) | 약 80 생성 | 약 150 생성 |

- 무료 체험 크기는 픽셀이 5~6배로 커져 아주 굵은 레트로 도트가 된다. 지금 도트(320px 원본)보다 훨씬 거칠다.
- 비용 근거: 48px에서 "Costs 2 generations"(화면 확인). 크기별 값은 PixelLab MCP 설명의 v3 표(90px까지 2, 128까지 3, 156까지 4, 181까지 5, 202까지 6)로 계산했다(웹 화면과 같은지는 크기마다 화면 아래 비용 문구로 확인).
- 동작 비용은 확인하지 못했다(미확인). 동작 화면에서 비용 문구를 본다.
- 요금(2026-11-20, pixellab.ai 요금표): 무료 체험 빠른 생성 40회 뒤 하루 5회(최대 20 저장)·이미지 200×200까지 / Tier 1 월 $12·월 2,000회·320×320까지·애니메이션 도구 / Tier 2 월 $24·월 5,000회·512×512까지 / Tier 3 월 $50·월 10,000회.
- 권하는 순서: 무료로 공명자 1명(예: 에이메스)만 만들어 화풍을 본 뒤 정한다. 40명 전부는 무료 빠른 생성(40회)으로 모자란다.

## 참고 자료와 역할
| 자료 | 역할 | 근거 |
|---|---|---|
| 외형 설명(Character Description) | 캐릭터의 유일한 입력. 색·옷·특징·체형을 모두 여기 적는다 | 공명자 9명은 HERO_PROMPTS의 확정 문장(확인됨). 방랑자(남)·카르티시아·음림과 적 전부는 지금 도트를 보고 적음(추정) |
| `art/pixellab-ref/<id>.png` | 결과를 지금 도트와 비교하는 기준(무료 크기에 맞춤). 옆모습이라 Create from Reference의 정면 칸에는 맞지 않는다 | 게임에 쓰는 지금 도트 |
| 화면 설정값 | 위 표 | 스크린샷 4장(확인됨). Outline 목록과 동작 화면은 미확인 |

## 검수 체크리스트 (받은 결과마다)
- [ ] 크기가 표의 값과 같다
- [ ] Sidescroller 시점이고, 공명자는 East·적은 West 방향을 쓴다
- [ ] 모든 프레임에서 키와 발 위치가 같다(쓰러짐·처치 제외)
- [ ] 배경이 투명하고 반투명 테두리·글로우가 없다
- [ ] 얼굴·머리·옷·무기·색이 외형 설명, 지금 도트와 같다
- [ ] 공명자는 7등신이고 머리가 크지 않다
- [ ] 동작 프레임 수가 블록 위 숫자와 같다

## 공명자
동작 화면은 아직 보지 못했다(미확인). 동작 블록은 움직임만 적은 설명이니 동작 화면의 설명 칸에 붙이고, 프레임 수는 화면이 허용하는 값에 가장 가까운 것을 고른다.

### 에이메스 · `aem`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/aem.png` · 외형 근거: 확정 문장

외형(Character Description)
```
Aemeath: knee-length rose-pink high ponytail with peach tips, golden eyes, white sleeveless leotard with gold trim, metal device at the waist, navy-to-sky-blue starry gradient skirt tails, white gloves from the elbow, white thigh-highs with gold bands, white heels, sword. Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 에이메스 메카 · `aemMecha`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/aemMecha.png` · 외형 근거: 확정 문장

외형(Character Description)
```
silver-white armor, round helmet with teal visor, golden crest swept back, teal chest core, floating white blade wings. Slim humanoid mech with realistic 7-head proportions, small head, long legs. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 파수인 · `sk`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/sk.png` · 외형 근거: 확정 문장

외형(Character Description)
```
Shorekeeper: shoulder-length sky-blue hair with dark blue tips, pink-purple eyes, white translucent hood with navy and yellow butterfly ornaments, navy starry veil, short white dress with frilled collar, silver straps and bracelets, bare legs, glowing butterflies around her. Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
thrusts one hand forward to the right releasing a compact burst of energy, then pulls back
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 방랑자(여) · `rov`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/rov.png` · 외형 근거: 확정 문장

외형(Character Description)
```
Rover (female): short black bob hair with silver-white strands, black sleeveless high-neck top, grey asymmetric waist cloth, black thigh-high boots, slim black sword with small glowing blue accents. Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 방랑자(남) · `rovM`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/rovM.png` · 외형 근거: 추정(확정 문장 없음)

외형(Character Description)
```
male Rover from Wuthering Waves, wielding a sword. Adult man with realistic 7-head proportions, small head, long legs. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 치사 · `chi`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/chi.png` · 외형 근거: 확정 문장

외형(Character Description)
```
Chisa: long straight black hair with one red ribbon, short black jacket over a sailor top with red scarf, black pleated skirt, scissor-shaped greatsword, crimson thread-like slash effects. Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
lifts the greatsword and swings it down hard to the right, then recovers
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 카멜리아 · `cam`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/cam.png` · 외형 근거: 확정 문장

외형(Character Description)
```
Camellya: white twin-tail hair with black streaks, dark grey eyes with red diamond pupils, dark red flower on her head, red and black dress decorated with camellia flowers, crimson petals and thorny vines, sword. Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 모니에 · `mor`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/mor.png` · 외형 근거: 확정 문장

외형(Character Description)
```
Mornye: long silver-white hair covering one eye, one visible red eye, long white coat over indigo-navy inner outfit, celestial orbit diagrams and planets, large white blade. Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
lifts the greatsword and swings it down hard to the right, then recovers
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 린네 · `lyn`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/lyn.png` · 외형 근거: 확정 문장

외형(Character Description)
```
Lynae: long wavy blonde hair, headphones, white shirt, black jacket and short black skirt, mint and teal neon spray-paint graffiti effects. Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
raises the pistols to the right and fires twice with recoil, then lowers them
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 히유키 · `hiy`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/hiy.png` · 외형 근거: 확정 문장

외형(Character Description)
```
Hiyuki: white high ponytail with a red ribbon, red and white shrine maiden outfit with cherry blossom pattern, sword, ice and snow effects. Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 카르티시아 · `car`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/car.png` · 외형 근거: 추정(확정 문장 없음)

외형(Character Description)
```
Cartethyia from Wuthering Waves, wielding a sword. Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
steps forward and slashes the sword horizontally to the right, then returns to stance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

### 음림 · `yin`
Character Type **Humanoid** · Sprite Size 무료 64 / 유료 160 · 방향 East · 비교 기준 `art/pixellab-ref/yin.png` · 외형 근거: 추정(확정 문장 없음)

외형(Character Description)
```
Yinlin from Wuthering Waves, wielding a rectifier (no blade). Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 East(오른쪽)
```
standing still in a calm stance, breathing gently, hair and cloth swaying slightly
```

동작 공격(`attack`) · 8프레임(제안) · 방향 East(오른쪽)
```
thrusts one hand forward to the right releasing a compact burst of energy, then pulls back
```

동작 막기(`guard`) · 4프레임(제안) · 방향 East(오른쪽)
```
raises the weapon and arm in front of the body to block, braced
```

동작 피격(`hit`) · 4프레임(제안) · 방향 East(오른쪽)
```
recoils backward to the left from a blow, then regains balance
```

동작 시전(`cast`) · 6프레임(제안) · 방향 East(오른쪽)
```
raises one hand, gathers energy, then releases it forward
```

동작 해방(`ultimate`) · 8프레임(제안) · 방향 East(오른쪽)
```
crouches to gather power, then rises into a dramatic release pose with arms spread
```

동작 쓰러짐(`down`) · 8프레임(제안) · 방향 East(오른쪽)
```
staggers, drops to one knee, then collapses onto the ground and lies still
```

동작 교체 등장(`swap`) · 6프레임(제안) · 방향 East(오른쪽)
```
dashes in from the left, lands, and rises into a ready stance
```

동작 회피(`dodge`) · 4프레임(제안) · 방향 East(오른쪽)
```
leaps backward to the left to evade, then lands in a low crouch
```

동작 승리(`victory`) · 6프레임(제안) · 방향 East(오른쪽)
```
relaxes, then strikes a confident victory pose with the weapon
```

## 적
외형 설명은 지금 도트(칵찰찰·아즈즈는 2026-11-20 새 디자인)를 보고 적었다. 공식 모습과는 대조하지 않았다(미확인). Character Type은 몸 모양으로 골랐다: 두 발이면 Humanoid, 네발 짐승이면 Quadruped(템플릿 칸이 나오면 괄호 안 값), 그 밖(게·물고기·새·곤충·거북·바위·탈것)은 Custom.

### 칵찰찰 · `snip`
경파급 · 용융 · Character Type **Custom** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/snip.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Snip Snap, an enemy from Wuthering Waves: crab monster with a black spiked carapace, cream face plate, one glowing orange eye and orange-red fire-tipped claws. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a pincer jab forward, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
its shell heating up with small embers, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 아즈즈 · `zig`
경파급 · 회절 · Character Type **Quadruped (lion)** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/zig.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Zig Zag, an enemy from Wuthering Waves: four-legged spirit beast with a flowing white and gold mane, long curled tail and dark navy body markings. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a bouncing hop that flicks a spark of light, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
a twinkling flash gathering on its body, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 우글글 · `tick`
경파급 · 인멸 · Character Type **Custom** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/tick.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Tick Tack, an enemy from Wuthering Waves: round dark purple creature that is mostly a huge toothy mouth, with violet spikes. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a lunging bite, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
a low growl with dark energy rising, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 꾹꾹복어 · `gulp`
경파급 · 응결 · Character Type **Custom** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/gulp.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Gulpuff, an enemy from Wuthering Waves: round blue pufferfish covered in pale ice spikes. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a bump forward while sprouting short ice spikes, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
puffing up round, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 쮸쮸복어 · `chirp`
경파급 · 기류 · Character Type **Custom** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/chirp.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Chirpuff, an enemy from Wuthering Waves: round mint-green puffer bird with small golden wings. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
spitting a small gust of wind, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
flapping its fins to gather wind, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 선봉 암괴 · `vjun`
경파급 · 물리 · Character Type **Humanoid** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/vjun.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Vanguard Junrock, an enemy from Wuthering Waves: hulking grey rock golem with a glowing golden core. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a downward rock smash, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
hardening its rocky body, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 분열 암괴 · `fjun`
경파급 · 물리 · Character Type **Custom** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/fjun.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Fission Junrock, an enemy from Wuthering Waves: grey golem made of stacked boulders with a small golden spark core. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
throwing a rock shard, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
curling up to roll, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 순회나비 · `cruise`
경파급 · 회절 · Character Type **Custom** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/cruise.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Cruisewing, an enemy from Wuthering Waves: large golden butterfly with glowing wing patterns. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a wing slash, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
scattering glowing dust from its wings, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 갈기늑대 · 불꽃 · `fdread`
경파급 · 용융 · Character Type **Quadruped (dog)** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/fdread.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Fusion Dreadmane, an enemy from Wuthering Waves: black wolf with a blazing red fiery mane. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a flaming bite with claws forward, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
a roar with its fiery mane flaring, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 서릿땅거북 · `hoar`
경파급 · 응결 · Character Type **Custom** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/hoar.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Hoartoise, an enemy from Wuthering Waves: pale blue tortoise with a jagged ice crystal shell. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a headbutt, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
frost breath gathering in its mouth, shell braced, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 초록색 왜가리 · `cheron`
거랑급 · 기류 · Character Type **Custom** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/cheron.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Cyan-Feathered Heron, an enemy from Wuthering Waves: tall cyan-feathered heron with a long beak. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a diving peck, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
rising with wings spread, feathers ready to rain down, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 보라색 왜가리 · `vheron`
거랑급 · 전도 · Character Type **Custom** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/vheron.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Violet-Feathered Heron, an enemy from Wuthering Waves: tall violet-feathered heron crackling with small lightning. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a lightning peck, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
charging lightning along its feathers, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 갈기늑대 · 암흑 · `hdread`
거랑급 · 인멸 · Character Type **Quadruped (dog)** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/hdread.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Havoc Dreadmane, an enemy from Wuthering Waves: black wolf with dark violet crystal spikes and mane. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a pouncing bite, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
a dark roar with its mane flaring, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 화살곰 · `spear`
거랑급 · 물리 · Character Type **Quadruped (bear)** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/spear.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Spearback, an enemy from Wuthering Waves: dark brown bear with long quill spikes along its back. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a body slam, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
curling up with back spines raised, ready to launch them, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 그린멜팅카멜레온 · `saur`
거랑급 · 용융 · Character Type **Custom** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/saur.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Viridblaze Saurian, an enemy from Wuthering Waves: green and orange chameleon-like reptile with a curled tail. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a flaming tongue lash, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
spitting lava, body shimmering as it camouflages, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 초혼의 악사 · `tamb`
거랑급 · 인멸 · Character Type **Humanoid** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/tamb.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Tambourinist, an enemy from Wuthering Waves: pale robed figure holding a large round golden drum. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
striking its drum with a pulse of sound, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
raising the drum to summon spirits, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 경전차 로봇 · `scout`
거랑급 · 응결 · Character Type **Humanoid** · Sprite Size 무료 48 / 유료 96 · 방향 West · 비교 기준 `art/pixellab-ref/scout.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Autopuppet Scout, an enemy from Wuthering Waves: white armored mech robot with blue joints. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a forward charge, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
aiming its cooling cannon, armor plates opening, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 크라운리스 · `crown`
노도급 · 인멸 · Character Type **Humanoid** · Sprite Size 무료 64 / 유료 128 · 방향 West · 비교 기준 `art/pixellab-ref/crown.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Crownless, an enemy from Wuthering Waves: tall dark armored knight with black wings and gold trim. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a wide blade strike, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
an ominous dark aura gathering, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 천둥의 비늘 · `mephis`
노도급 · 전도 · Character Type **Humanoid** · Sprite Size 무료 64 / 유료 128 · 방향 West · 비교 기준 `art/pixellab-ref/mephis.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Tempest Mephis, an enemy from Wuthering Waves: dark violet armored dragon-like warrior with lightning spikes. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a lightning strike called down, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
raising a curtain of lightning, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 애곡하는 아익스 · `aix`
노도급 · 회절 · Character Type **Custom** · Sprite Size 무료 64 / 유료 128 · 방향 West · 비교 기준 `art/pixellab-ref/aix.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Mourning Aix, an enemy from Wuthering Waves: white and gold phoenix-like bird with long fan tail feathers. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a beam of light from its body, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
a mournful cry with wings forming a barrier, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 이름없는 탐색자 · `explorer`
노도급 · 기류 · Character Type **Humanoid** · Sprite Size 무료 64 / 유료 128 · 방향 West · 비교 기준 `art/pixellab-ref/explorer.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Nameless Explorer, an enemy from Wuthering Waves: bulky astronaut-like armored figure with a dark round visor and teal energy trails. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a quick gust-powered shot, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
a fast evasive maneuver gathering wind, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 지옥불 기사 · `rider`
노도급 · 용융 · Character Type **Custom** · Sprite Size 무료 64 / 유료 128 · 방향 West · 비교 기준 `art/pixellab-ref/rider.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Inferno Rider, an enemy from Wuthering Waves: armored rider on a flaming black motorcycle. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a charging blade combo, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
flaming armor flaring up, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 폭주의 고릴라 · `gorilla`
노도급 · 기류 · Character Type **Humanoid** · Sprite Size 무료 64 / 유료 128 · 방향 West · 비교 기준 `art/pixellab-ref/gorilla.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Feilian Beringal, an enemy from Wuthering Waves: massive gorilla covered in mossy green rock. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a whirlwind punch, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
a roar before a downward smash, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 무망자 · `dreamless`
해일급 · 인멸 · Character Type **Humanoid** · Sprite Size 무료 64 / 유료 128 · 방향 West · 비교 기준 `art/pixellab-ref/dreamless.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Dreamless, an enemy from Wuthering Waves: pale ghostly swordsman with long white hair and tattered violet wings. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a chaotic blade strike, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
a shadow veil gathering around it, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 타종 거북이 · `turtle`
해일급 · 응결 · Character Type **Custom** · Sprite Size 무료 64 / 유료 128 · 방향 West · 비교 기준 `art/pixellab-ref/turtle.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Bell-Borne Geochelone, an enemy from Wuthering Waves: giant blue stone tortoise carrying a bronze bell tower on its back. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
slamming its bell down, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
a ringing bell barrier forming, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 헤카테 · `hecate`
해일급 · 인멸 · Character Type **Humanoid** · Sprite Size 무료 64 / 유료 128 · 방향 West · 비교 기준 `art/pixellab-ref/hecate.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Hecate, an enemy from Wuthering Waves: crimson-robed woman with a tall crown and a long red scythe-staff. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a moonlight scythe swing, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
opening a gate of dark light with a three-way curse, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 레비아탄 · `levia`
명식 · 인멸 · Character Type **Humanoid** · Sprite Size 무료 64 / 유료 192 · 방향 West · 비교 기준 `art/pixellab-ref/levia.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Leviathan, an enemy from Wuthering Waves: tall dark-blue sea siren with long flowing hair and robes. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a crashing tidal wave strike, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
an abyssal roar with deep-sea pressure gathering, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```

### 알레프-원의 창조물 · `aleph`
명식 · 인멸 · Character Type **Humanoid** · Sprite Size 무료 64 / 유료 192 · 방향 West · 비교 기준 `art/pixellab-ref/aleph.png` · 외형 근거: 추정(지금 도트)

외형(Character Description)
```
Aleph-One, an enemy from Wuthering Waves: dark violet armored void construct with a dark halo. Menacing creature design. Pixel art sprite with a crisp dark outline.
```

동작 대기(`idle`) · 4프레임(제안) · 방향 West(왼쪽)
```
idle stance, breathing slowly with small motion of tail, wings or limbs
```

동작 공격(`attack`) · 8프레임(제안) · 방향 West(왼쪽)
```
a void spear thrust, moving forward, then recovers
```

동작 시전(`cast`) · 6프레임(제안) · 방향 West(왼쪽)
```
a void barrage gathering, then releases a compact burst
```

동작 피격(`hit`) · 4프레임(제안) · 방향 West(왼쪽)
```
recoils backward from a blow, then regains balance
```

동작 막기(`guard`) · 4프레임(제안) · 방향 West(왼쪽)
```
braces in a defensive pose
```

동작 처치(`death`) · 8프레임(제안) · 방향 West(왼쪽)
```
collapses and breaks apart into a few large fragments that vanish
```
