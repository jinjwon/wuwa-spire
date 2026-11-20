// docs/art/MOTION_PROMPTS.md를 만든다. 문서를 직접 고치지 말고 이 파일을 고쳐 다시 돌린다. 사용: node scripts/motion-prompts.cjs
const fs=require('fs'),root=require('path').resolve(__dirname,'..');
const hero=fs.readFileSync(root+'/docs/art/HERO_PROMPTS.md','utf8');
const HEROES=[];{const re=/### hero_(\w+)_full\.png · ([^\n]+)\n```\n([^\n]*)/g;let m;while(m=re.exec(hero)){
  const intro=m[3].slice(0,m[3].indexOf(' Create ONE')),who=m[3].match(/sprite sheet of (.*?) with 16 frames/)[1];
  const rules=m[3].slice(m[3].indexOf('STRICT RULES'));HEROES.push({id:m[1],ko:m[2],intro,who,rules})}}
if(HEROES.length!==12)throw new Error('heroes '+HEROES.length);

const EL={용융:'Fusion: hard-edged orange-red fire',회절:'Spectro: hard-edged golden-white light',인멸:'Havoc: hard-edged dark crimson and violet energy',응결:'Glacio: hard-edged pale-blue ice',기류:'Aero: hard-edged teal-green wind',전도:'Electro: hard-edged violet lightning',물리:'no elemental glow, only grey rock dust and debris'};
const SIZE={경파급:60,거랑급:60,노도급:70,해일급:70,명식:80};
// [id, 영문 이름, 한국어 이름, 등급, 속성, 공격(2행), 시전(3행)] 공격·시전은 src/js/data.js 기술 이름 기준
const ENEMIES=[
['snip','Snip Snap','칵찰찰','경파급','용융','a pincer jab forward','its shell heating up with small embers'],
['zig','Zig Zag','아즈즈','경파급','회절','a bouncing hop that flicks a spark of light','a twinkling flash gathering on its body'],
['tick','Tick Tack','우글글','경파급','인멸','a lunging bite','a low growl with dark energy rising'],
['gulp','Gulpuff','꾹꾹복어','경파급','응결','a bump forward while sprouting short ice spikes','puffing up round'],
['chirp','Chirpuff','쮸쮸복어','경파급','기류','spitting a small gust of wind','flapping its fins to gather wind'],
['vjun','Vanguard Junrock','선봉 암괴','경파급','물리','a downward rock smash','hardening its rocky body'],
['fjun','Fission Junrock','분열 암괴','경파급','물리','throwing a rock shard','curling up to roll'],
['cruise','Cruisewing','순회나비','경파급','회절','a wing slash','scattering glowing dust from its wings'],
['fdread','Fusion Dreadmane','갈기늑대 · 불꽃','경파급','용융','a flaming bite with claws forward','a roar with its fiery mane flaring'],
['hoar','Hoartoise','서릿땅거북','경파급','응결','a headbutt','frost breath gathering in its mouth, shell braced'],
['cheron','Cyan-Feathered Heron','초록색 왜가리','거랑급','기류','a diving peck','rising with wings spread, feathers ready to rain down'],
['vheron','Violet-Feathered Heron','보라색 왜가리','거랑급','전도','a lightning peck','charging lightning along its feathers'],
['hdread','Havoc Dreadmane','갈기늑대 · 암흑','거랑급','인멸','a pouncing bite','a dark roar with its mane flaring'],
['spear','Spearback','화살곰','거랑급','물리','a body slam','curling up with back spines raised, ready to launch them'],
['saur','Viridblaze Saurian','그린멜팅카멜레온','거랑급','용융','a flaming tongue lash','spitting lava, body shimmering as it camouflages'],
['tamb','Tambourinist','초혼의 악사','거랑급','인멸','striking its drum with a pulse of sound','raising the drum to summon spirits'],
['scout','Autopuppet Scout','경전차 로봇','거랑급','응결','a forward charge','aiming its cooling cannon, armor plates opening'],
['crown','Crownless','크라운리스','노도급','인멸','a wide blade strike','an ominous dark aura gathering'],
['mephis','Tempest Mephis','천둥의 비늘','노도급','전도','a lightning strike called down','raising a curtain of lightning'],
['aix','Mourning Aix','애곡하는 아익스','노도급','회절','a beam of light from its body','a mournful cry with wings forming a barrier'],
['explorer','Nameless Explorer','이름없는 탐색자','노도급','기류','a quick gust-powered shot','a fast evasive maneuver gathering wind'],
['rider','Inferno Rider','지옥불 기사','노도급','용융','a charging blade combo','flaming armor flaring up'],
['gorilla','Feilian Beringal','폭주의 고릴라','노도급','기류','a whirlwind punch','a roar before a downward smash'],
['dreamless','Dreamless','무망자','해일급','인멸','a chaotic blade strike','a shadow veil gathering around it'],
['turtle','Bell-Borne Geochelone','타종 거북이','해일급','응결','slamming its bell down','a ringing bell barrier forming'],
['hecate','Hecate','헤카테','해일급','인멸','a moonlight scythe swing','opening a gate of dark light with a three-way curse'],
['levia','Leviathan','레비아탄','명식','인멸','a crashing tidal wave strike','an abyssal roar with deep-sea pressure gathering'],
['aleph','Aleph-One','알레프-원의 창조물','명식','인멸','a void spear thrust','a void barrage gathering'],
];
if(ENEMIES.length!==28)throw new Error('enemies');

const EDGE=' (8) EDGE LOCK: every pixel is either fully opaque or fully transparent; no semi-transparent pixels, no dark haze around the body, and no cyan, red, yellow or white fringe along the silhouette edge.';
const enemyPrompt=([id,en,,g,el,atk,cast])=>`Attachment 1 shows the current pixel design of the Wuthering Waves enemy ${en}: keep its design, colors and silhouette exactly. Create ONE complete smooth animation sprite sheet of ${en} with 16 frames. Cells in row-major order. Row 1: 1 IDLE calm stance; 2 IDLE BREATH same as cell 1 with the body 1-2 pixels lower; 3 IDLE SWAY small secondary motion of tail, wings, fins or cloth, then back toward cell 1; 4 WIND-UP weight shifting back to the right. Row 2: 5 ANTICIPATION fully drawn back, ready; 6 ATTACK ${atk}, moving LEFT; 7 IMPACT full extension with a short hard-edged impact effect; 8 RECOVERY returning toward idle. Row 3: 9 CAST RISING; 10 CAST ${cast}; 11 CAST RELEASE a compact burst; 12 GUARD braced defensive pose. Row 4: 13 HIT recoiling to the RIGHT, no gore; 14 HIT RETURN regaining balance halfway back to idle; 15 DEFEAT collapsing; 16 DEFEAT FADE the body breaking into a few large hard-edged pixel fragments, half of it already gone. Element look: ${EL[el]}. STRICT RULES, FOLLOW ALL: (1) LAYOUT: square image 1024x1024, exactly 4 columns by 4 rows of 16 equal square cells, no gaps, labels, numbers or grid lines. (2) SCALE LOCK: in all 16 cells the enemy has the SAME size, about ${SIZE[g]}% of the cell height, standing on the same ground line near the cell bottom (flying enemies keep the same height). Never shrink it to fit effects. (3) MARGIN LOCK: body and effects stay at least 10% away from every cell edge, because each cell is cut out mechanically. (4) IDENTITY LOCK: design and colors are identical in all 16 cells and match Attachment 1; do not redesign, add or remove parts. (5) MOTION LOCK: consecutive cells change smoothly like frames of one animation. (6) PIXEL LOCK: authentic 16-bit pixel art on a uniform pixel grid, crisp 1-pixel dark outline, at most 48 colors, no anti-aliasing, no dithering noise, no painterly texture. (7) BACKGROUND LOCK: true alpha transparency; no checkerboard, no background, no floor shadow; effects are solid hard-edged pixel shapes with no soft glow, outer glow, haze or specks; effects use at most 3 flat colors of the element.${EDGE} All poses face LEFT.`;

const extraPrompt=h=>`${h.intro} Create ONE extra animation sprite sheet of ${h.who} with 16 frames, for moves not in the main sheet. Cells in row-major order. Row 1 DOWN: 1 STAGGER bent forward after a heavy blow; 2 KNEEL on one knee, weapon planted or held low; 3 COLLAPSE falling sideways; 4 DOWN lying on the ground, eyes closed, no gore. Row 2 SWAP IN: 5 DASH-IN entering from the left in a low running pose with three thin straight speed lines behind, 2 pixels thick, flat color, no glow; 6 LANDING feet touching down, knees bent; 7 RISING straightening up; 8 READY the normal idle stance. Row 3 DODGE: 9 SIDESTEP leaning back and away; 10 EVADE body leaning far back, NO afterimage, NO ghost silhouette and NO effect; 11 LOW CROUCH ready to counter; 12 RETURN back to the idle stance. Row 4 VICTORY: 13 RELAX shoulders dropping after battle; 14 VICTORY signature pose with the weapon; 15 VICTORY HOLD the same pose with hair and cloth settling; 16 SETTLE calm stance, looking back at the viewer. ${h.rules.replace('feet on the same line near the cell bottom.','feet on the same line near the cell bottom; only in cells 3-4 the body lies along that ground line.')}${EDGE} Cells 1-16 contain only the character, no symbols or marks above the head.`;

const FXRULES=`STRICT RULES, FOLLOW ALL: (1) LAYOUT: square image 1024x1024, exactly 4 columns by 4 rows of 16 equal square cells, row-major order, no gaps, labels, numbers or grid lines. (2) GREYSCALE LOCK: use exactly three flat tones and nothing else: pure white #FFFFFF for the hottest core, light grey #B0B0B0 for the main body, dark grey #505050 for a 1-pixel outline. No other colors, no gradients, because the game recolors each tone to the element palette. (3) PIXEL LOCK: drawn as if at 64x64 pixels per cell and scaled up exactly 4 times, so every pixel is a crisp 4x4 block on a uniform grid; no anti-aliasing, no dithering, no painterly texture. (4) MARGIN LOCK: every shape stays at least 10% away from every cell edge and is centered in its cell, because each cell is cut out mechanically. (5) MOTION LOCK: consecutive frames of one effect change smoothly; the effect stays the same size class across its frames. (6) BACKGROUND LOCK: true alpha transparency; no checkerboard, no background, no characters; no soft glow, outer glow, haze, blur or scattered specks.`;
const FX=[
['fx_claw_bite','C','적 발톱·물기','지금 SVG 발톱 선 3줄 대체. 적 기술 중 할퀴기·물기·찌르기용',`Pixel-art combat effect sprite sheet, 2 effects of 8 frames each. Rows 1-2 CLAW RAKE: three parallel diagonal claw slashes from upper right to lower left appear, extend, then thin out and vanish (1 tiny start marks, 2-3 slashes extending, 4 full three-line rake with a small impact burst, 5-8 lines thinning and breaking into short dashes, then gone). Rows 3-4 BITE: a pair of jagged jaw shapes, upper and lower, snap shut from open to closed with a small impact star, then shatter into a few fragments (1-2 wide open jaws, 3 closing, 4 closed with impact star, 5-8 fragments flying out and shrinking). ${FXRULES}`],
['fx_slam_shot','C','적 내려찍기·투사체','박치기·내려찍기·돌진, 깃털·가시·포격 같은 적 투사체용. 투사체는 왼쪽으로 날아가고, 코드가 방향을 뒤집을 수 있다',`Pixel-art combat effect sprite sheet. Rows 1-2 GROUND SLAM, 8 frames: a short downward impact on the ground line, a flat shockwave ring spreading sideways along the ground, a few rock chips bouncing up, then fading (frames grow then thin out). Row 3 PROJECTILE, 4 frames looping: a compact pointed energy bolt flying LEFT with a short hard-edged tail, the tail flickering between frames. Row 4 PROJECTILE IMPACT, 4 frames: a small star-shaped burst that expands, splits into 4 short spokes, then vanishes. ${FXRULES}`],
['fx_shot_orb','D','아군 총탄·구체','린네 총격(총구 섬광·탄), 파수인 구체 타격용. 지금은 CSS 선과 원',`Pixel-art combat effect sprite sheet. Row 1 MUZZLE FLASH, 4 frames: a sharp four-point flash bursting RIGHT from a gun barrel point, then shrinking. Row 2 BULLET, 4 frames looping: a short capsule bullet flying RIGHT with a short straight hard-edged trail. Rows 3-4 ORB BURST, 8 frames: a round energy orb arrives, flashes, opens into a hollow ring with small diamond shards orbiting, the ring expands, then breaks into fading arcs. ${FXRULES}`],
['fx_shield_heal','D','방어막·회복·방어 파괴','지금 SVG 육각형과 CSS 십자 대체. 방어막은 아군·적 공용',`Pixel-art combat effect sprite sheet. Row 1 SHIELD UP, 4 frames: a hexagonal barrier made of six flat panels assembling around an empty center, ending as a full hexagon outline with a bright edge. Row 2 SHIELD BREAK, 4 frames: the hexagon cracks, then splits into six panel shards flying outward, then shards shrink and vanish. Rows 3-4 HEAL, 8 frames: small plus-shaped sparkles and short vertical light lines rise upward from the bottom of the cell in a gentle column, appearing one by one, floating up, then fading out at the top. ${FXRULES}`],
['fx_frost_break','D','서리·빙결·공진 파괴','히유키 응결 서리 쌓임(4번 쌓이면 빙결)과 공진 파괴용',`Pixel-art combat effect sprite sheet. Row 1 FROST MARK, 4 frames looping: a small six-point snowflake badge that slowly twinkles, one arm brighter each frame. Rows 2-3 FREEZE, 8 frames: angular ice crystals grow from the bottom edge upward into a tall jagged ice block shape (frames 1-4 growing, frame 5 full block with bright edges), then crack and shatter into angular shards flying outward (frames 6-8). Row 4 RESONANCE BREAK, 4 frames: a thick ring cracks in three places, splits into arcs flying apart with small diamond chips, then vanishes. ${FXRULES}`],
];

const DONE={enemy_full_snip:'2026-11-20 업로드 12(새 디자인, 체크무늬 제거)',enemy_full_zig:'2026-11-20 업로드 13(새 디자인)',hero_lyn_extra:'2026-11-20 업로드 14',hero_sk_extra:'2026-11-20 업로드 15'};
let md=`# 추가 모션 프롬프트

마지막 갱신 2026-11-20. 이 문서는 \`scripts/motion-prompts.cjs\`가 만든다(직접 고치지 말고 스크립트를 고쳐 다시 돌린다). 공명자 16칸 전체 동작 시트([HERO_PROMPTS.md](HERO_PROMPTS.md))에 없는 동작과 이펙트를 채운다. 결과는 \`art/candidates/<키>/\`에 넣고 \`npm run board\`에서 고른다([절차](ART_PIPELINE.md)). 공명자 외형 문장은 HERO_PROMPTS.md와 같다.

## 무엇이 비었나 (2026-11-20 기준)
| 묶음 | 지금 상태 | 이 문서에서 채우는 것 |
|---|---|---|
| A. 적 28종 동작 | 대기 1장(CSS 숨쉬기), 공격·시전·피격 4칸, 128px 예전 축소 | 대기 3장·공격 5장·시전 3장·막기·피격 2장·처치 2장, 16칸 |
| B. 공명자 추가 동작 | 쓰러짐·교체 등장·회피·승리 그림 없음 | 4동작 × 4장, 16칸 |
| C. 적 공격 이펙트 | SVG 발톱 선 3줄 하나 | 발톱·물기·내려찍기·투사체 |
| D. 아군 보조 이펙트 | CSS 원·점, SVG 육각형 | 총구 섬광·총탄·구체·방어막·방어 파괴·회복·서리·빙결·공진 파괴 |

적 16칸 시트를 쓰면 [REVISION_PROMPTS.md](REVISION_PROMPTS.md)의 적 4칸 재제작은 하지 않아도 된다.

## 받은 시트
원본 자리 \`art/source-v2/<키>.png\`에 넣었다. 끝난 프롬프트는 이 문서에서 지운다(git 기록에 있다).

| 키 | 내용 |
|---|---|
${Object.entries(DONE).map(([k,v])=>`| \`${k}\` | ${v} |`).join('\n')}

받은 시트에서 본 문제를 프롬프트에 반영했다(2026-11-20): 회피 잔상이 흐린 덩어리로 나옴 → 잔상 금지, 대시 줄이 번지는 빛으로 나옴 → 2px 단색 줄, 윤곽에 청록·빨강·노랑 테두리와 반투명 그림자 → EDGE LOCK 추가, 체크무늬 배경이 박혀 나옴 → \`node scripts/unchecker.cjs <입력> <출력>\`으로 지운다.

## 처리 상태
프롬프트만 있다. 생성한 그림을 게임에 연결하려면 \`dev\`에서 코드 작업이 필요하다.
- 적 16칸: 자르기 스크립트가 아직 없다(\`prepare-heroes-v3.cjs\`는 공명자만 처리). 처치 2장을 쓰는 사망 연출도 아직 없다.
- 공명자 추가 동작: 쓰러짐·교체·회피·승리 상태를 재생하는 코드가 없다.
- 이펙트: 칼베기처럼 \`scripts/make-vfx.cjs\`가 흑백 세 단계를 속성 팔레트로 칠해 \`assets/fx/\`에 쓰도록 연결한다.

## A. 적 16칸 동작 시트
- 크기: **정사각 1024×1024**, 4열×4행 16칸, 칸 256px. 모든 동작은 왼쪽을 본다.
- 첨부: 그 적의 지금 도트 \`assets/enemy_<id>.png\` 1장.
- 크기 비율: 경파급·거랑급 칸 높이의 60%, 노도급·해일급 70%, 명식(보스) 80%.
- 공격·시전 장면은 \`src/js/data.js\`의 기술 이름을 따랐다. 적 외형은 지금 도트를 기준으로 하고 공식 모습과는 대조하지 않았다(미확인).
- 저장: 보드 키 \`enemy_full_<id>\` → \`art/source-v2/enemy_full_<id>.png\`.

`;
for(const e of ENEMIES.filter(e=>!DONE['enemy_full_'+e[0]]))md+=`### enemy_full_${e[0]}.png · ${e[2]}\n${e[3]} · ${e[4]} · 첨부 \`assets/enemy_${e[0]}.png\`\n\`\`\`\n${enemyPrompt(e)}\n\`\`\`\n\n`;
md+=`## B. 공명자 추가 동작 시트
- 크기: **세로 1024×1536**, 4열×4행 16칸. 첫 행 쓰러짐, 둘째 행 교체 등장, 셋째 행 회피, 넷째 행 승리.
- 첨부: 1. 공식 이미지 2. 그 캐릭터의 지금 시트 \`art/source-v2/hero_<id>.png\`(16칸 시트가 있으면 \`hero_<id>_full.png\`가 더 좋다). 음림은 기본 시트가 먼저 나와야 한다.
- 저장: 보드 키 \`hero_<id>_extra\` → \`art/source-v2/hero_<id>_extra.png\`.

`;
for(const h of HEROES.filter(h=>!DONE['hero_'+h.id+'_extra']))md+=`### hero_${h.id}_extra.png · ${h.ko}\n\`\`\`\n${extraPrompt(h)}\n\`\`\`\n\n`;
md+=`## C·D. 이펙트 시트 (흑백 → 코드로 속성색)
- 크기: **정사각 1024×1024**, 4열×4행 16칸. 한 칸은 64px 도트를 4배로 그린 것으로 본다.
- 색: 흰색·밝은 회색·어두운 회색 세 단계만 쓴다. 게임이 속성 팔레트(하이라이트·중간·윤곽)로 바꿔 칠하므로 한 장으로 6속성을 다 쓴다. 칼베기(\`art/fx-src/\`)와 같은 방식이다.
- 첨부: 없음.
- 저장: 보드 키 \`fx_<이름>\` → \`art/fx-src/fx_<이름>.png\`. 게임 표시는 정수 배율(2·3배)만 쓴다.

`;
for(const [k,grp,ko,note,p] of FX)md+=`### ${k}.png · ${grp} ${ko}\n${note}\n\`\`\`\n${p}\n\`\`\`\n\n`;
fs.writeFileSync(root+'/docs/art/MOTION_PROMPTS.md',md.trimEnd()+'\n');
console.log('ok',ENEMIES.length,HEROES.length,FX.length,md.length);
