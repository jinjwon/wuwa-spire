// PixelLab Character Creator(pixellab.ai/create-character)용 입력값을 만든다.
// 1) docs/art/PIXELLAB_PROMPTS.md: 캐릭터마다 설정·외형 설명·금지 설명·동작 설명(복사 블록)
// 2) art/pixellab-ref/<id>.png: 결과 비교 기준(지금 도트를 무료 체험 크기로 맞춤, 다시 만들 수 있어 커밋 안 함)
// 사용: node scripts/pixellab-prompts.cjs   문서를 직접 고치지 말고 이 파일을 고쳐 다시 돌린다.
const fs=require('fs'),path=require('path'),sharp=require('sharp'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),{HEROES,ENEMIES}=require('./motion-prompts.cjs');
const REF=path.join(root,'art/pixellab-ref');

// 캔버스: 게임에서 2배로 키우면 지금 규격(공명자 320 프레임·몸 208, 적 192/256/384)과 정확히 맞는다
// 크기: 게임 규격(공명자 320, 적 192/256/384)의 정수분의 1. 무료 체험은 64px까지(웹 화면 확인), Tier 1부터 320px까지(요금표)
const PLAN={free:{hero:64,enemy:{경파급:48,거랑급:48,노도급:64,해일급:64,명식:64}},paid:{hero:160,enemy:{경파급:96,거랑급:96,노도급:128,해일급:128,명식:192}}};
const HERO_SIZE=PLAN.free.hero,ENEMY_SIZE=PLAN.free.enemy;
// v3 텍스트 생성 비용(PixelLab MCP 설명 표, 48px=2는 웹 화면에서 확인)
const cost=s=>s<=90?2:s<=128?3:s<=156?4:s<=181?5:s<=202?6:s<=221?7:s<=239?8:9;
// 무기별 공격 동작(CHARACTER_BIBLE 무기 기준). 동작 설명은 외형이 아니라 움직임만 적는다
const WEAPON={rov:'sword',rovM:'sword',aem:'sword',aemMecha:'sword',cam:'sword',car:'sword',hiy:'sword',mor:'greatsword',chi:'greatsword',lyn:'pistol',sk:'rectifier',yin:'rectifier'};
const ATTACK={
  sword:'steps forward and slashes the sword horizontally to the right, then returns to stance',
  greatsword:'lifts the greatsword and swings it down hard to the right, then recovers',
  pistol:'raises the pistols to the right and fires twice with recoil, then lowers them',
  rectifier:'thrusts one hand forward to the right releasing a compact burst of energy, then pulls back',
};
const HERO_ANIMS=w=>[
  ['idle','대기',4,'standing still in a calm stance, breathing gently, hair and cloth swaying slightly'],
  ['attack','공격',8,ATTACK[w]],
  ['guard','막기',4,'raises the weapon and arm in front of the body to block, braced'],
  ['hit','피격',4,'recoils backward to the left from a blow, then regains balance'],
  ['cast','시전',6,'raises one hand, gathers energy, then releases it forward'],
  ['ultimate','해방',8,'crouches to gather power, then rises into a dramatic release pose with arms spread'],
  ['down','쓰러짐',8,'staggers, drops to one knee, then collapses onto the ground and lies still'],
  ['swap','교체 등장',6,'dashes in from the left, lands, and rises into a ready stance'],
  ['dodge','회피',4,'leaps backward to the left to evade, then lands in a low crouch'],
  ['victory','승리',6,'relaxes, then strikes a confident victory pose with the weapon'],
];
// 적 외형: 지금 도트(업로드 새 디자인 포함)를 보고 적은 짧은 설명. 공식 모습과는 대조하지 않음(미확인)
const LOOK={
  snip:'crab monster with a black spiked carapace, cream face plate, one glowing orange eye and orange-red fire-tipped claws',
  zig:'four-legged spirit beast with a flowing white and gold mane, long curled tail and dark navy body markings',
  tick:'round dark purple creature that is mostly a huge toothy mouth, with violet spikes',
  gulp:'round blue pufferfish covered in pale ice spikes',
  chirp:'round mint-green puffer bird with small golden wings',
  vjun:'hulking grey rock golem with a glowing golden core',
  fjun:'grey golem made of stacked boulders with a small golden spark core',
  cruise:'large golden butterfly with glowing wing patterns',
  fdread:'black wolf with a blazing red fiery mane',
  hoar:'pale blue tortoise with a jagged ice crystal shell',
  cheron:'tall cyan-feathered heron with a long beak',
  vheron:'tall violet-feathered heron crackling with small lightning',
  hdread:'black wolf with dark violet crystal spikes and mane',
  spear:'dark brown bear with long quill spikes along its back',
  saur:'green and orange chameleon-like reptile with a curled tail',
  tamb:'pale robed figure holding a large round golden drum',
  scout:'white armored mech robot with blue joints',
  crown:'tall dark armored knight with black wings and gold trim',
  mephis:'dark violet armored dragon-like warrior with lightning spikes',
  aix:'white and gold phoenix-like bird with long fan tail feathers',
  explorer:'bulky astronaut-like armored figure with a dark round visor and teal energy trails',
  rider:'armored rider on a flaming black motorcycle',
  gorilla:'massive gorilla covered in mossy green rock',
  dreamless:'pale ghostly swordsman with long white hair and tattered violet wings',
  turtle:'giant blue stone tortoise carrying a bronze bell tower on its back',
  hecate:'crimson-robed woman with a tall crown and a long red scythe-staff',
  levia:'tall dark-blue sea siren with long flowing hair and robes',
  aleph:'dark violet armored void construct with a dark halo',
};
// 웹 Character Type: Humanoid(두 발) / Quadruped(네발, 템플릿 bear·cat·dog·horse·lion) / Custom(그 밖)
const TYPE={snip:'Custom',zig:'Quadruped (lion)',tick:'Custom',gulp:'Custom',chirp:'Custom',vjun:'Humanoid',fjun:'Custom',cruise:'Custom',fdread:'Quadruped (dog)',hoar:'Custom',cheron:'Custom',vheron:'Custom',hdread:'Quadruped (dog)',spear:'Quadruped (bear)',saur:'Custom',tamb:'Humanoid',scout:'Humanoid',crown:'Humanoid',mephis:'Humanoid',aix:'Custom',explorer:'Humanoid',rider:'Custom',gorilla:'Humanoid',dreamless:'Humanoid',turtle:'Custom',hecate:'Humanoid',levia:'Humanoid',aleph:'Humanoid'};

const fit=async(src,size,opt={})=>{ // 투명 여백을 자르고 캔버스 높이의 opt.h 비율로 맞춰 바닥 가운데에 놓는다(도트라 nearest)
  let img=sharp(src);if(opt.crop)img=img.extract(opt.crop);
  const t=await img.png().toBuffer().then(b=>sharp(b).trim({threshold:1}).toBuffer({resolveWithObject:true}));
  const k=Math.min(size*opt.h/t.info.height,size*.9/t.info.width);
  const w=Math.max(1,Math.round(t.info.width*k)),h=Math.max(1,Math.round(t.info.height*k));
  const body=await sharp(t.data).resize(w,h,{kernel:'nearest'}).toBuffer();
  return sharp({create:{width:size,height:size,channels:4,background:{r:0,g:0,b:0,alpha:0}}})
    .composite([{input:body,left:Math.round((size-w)/2),top:Math.round(size*.95-h)}]).png().toBuffer();
};

(async()=>{
  fs.mkdirSync(REF,{recursive:true});const refs={};
  for(const h of HEROES){const src=path.join(root,'assets',h.id+'.png');if(!fs.existsSync(src))continue;
    // 320 프레임을 정확히 반으로: 게임 2배 표시와 같은 자리
    fs.writeFileSync(path.join(REF,h.id+'.png'),await sharp(src).resize(HERO_SIZE,HERO_SIZE,{kernel:'nearest'}).png().toBuffer());refs[h.id]=1}
  for(const [id,,,g] of ENEMIES){const size=ENEMY_SIZE[g],full=path.join(root,'art/source-v2/enemy_full_'+id+'.png');
    // 새 16칸 시트가 있으면 첫 칸(대기)을, 없으면 지금 도트를 쓴다
    const src=fs.existsSync(full)?full:path.join(root,'assets/enemy_'+id+'.png');
    const crop=fs.existsSync(full)?await sharp(full).metadata().then(m=>({left:0,top:0,width:Math.floor(m.width/4),height:Math.floor(m.height/4)})):null;
    fs.writeFileSync(path.join(REF,id+'.png'),await fit(src,size,{h:g==='명식'?.8:g==='노도급'||g==='해일급'?.7:.6,crop}));refs[id]=1}

  const block=t=>'```\n'+t+'\n```\n';
  const anims=(list,dir)=>list.map(([k,ko,n,a])=>`동작 ${ko}(\`${k}\`) · ${n}프레임(제안) · 방향 ${dir}\n`+block(a)).join('\n');
  const cnt={};ENEMIES.forEach(e=>cnt[e[3]]=(cnt[e[3]]||0)+1);
  const sum=p=>HEROES.length*cost(p.hero)+ENEMIES.reduce((s,e)=>s+cost(p.enemy[e[3]]),0);
  let md=`# PixelLab 캐릭터 프롬프트

마지막 갱신 2026-11-20(웹 화면 스크린샷 기준으로 수정). 이 문서는 \`scripts/pixellab-prompts.cjs\`가 만든다(직접 고치지 말고 스크립트를 고쳐 다시 돌린다). [PixelLab Character Creator](https://www.pixellab.ai/create-character/new)의 **Create from Text** 탭에 넣을 값이다. 캐릭터를 한 번 만들고(정면으로 그린 뒤 8방향으로 돌려 줌) 동작을 하나씩 붙인다.

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
| 공명자 | ${PLAN.free.hero}px(게임 ×${320/PLAN.free.hero}) | ${PLAN.paid.hero}px(×${320/PLAN.paid.hero}, 슬라이더로 맞춤) |
| 경파급·거랑급(${cnt.경파급+cnt.거랑급}마리) | ${PLAN.free.enemy.경파급}px(×${192/PLAN.free.enemy.경파급}) | ${PLAN.paid.enemy.경파급}px(×${192/PLAN.paid.enemy.경파급}) |
| 노도급·해일급(${cnt.노도급+cnt.해일급}마리) | ${PLAN.free.enemy.노도급}px(×${256/PLAN.free.enemy.노도급}) | ${PLAN.paid.enemy.노도급}px(×${256/PLAN.paid.enemy.노도급}) |
| 명식 보스(${cnt.명식}마리) | ${PLAN.free.enemy.명식}px(×${384/PLAN.free.enemy.명식}) | ${PLAN.paid.enemy.명식}px(×${384/PLAN.paid.enemy.명식}) |
| 캐릭터 만들기 비용(40명) | 약 ${sum(PLAN.free)} 생성 | 약 ${sum(PLAN.paid)} 생성 |

- 무료 체험 크기는 픽셀이 5~6배로 커져 아주 굵은 레트로 도트가 된다. 지금 도트(320px 원본)보다 훨씬 거칠다.
- 비용 근거: 48px에서 "Costs 2 generations"(화면 확인). 크기별 값은 PixelLab MCP 설명의 v3 표(90px까지 2, 128까지 3, 156까지 4, 181까지 5, 202까지 6)로 계산했다(웹 화면과 같은지는 크기마다 화면 아래 비용 문구로 확인).
- 동작 비용은 확인하지 못했다(미확인). 동작 화면에서 비용 문구를 본다.
- 요금(2026-11-20, pixellab.ai 요금표): 무료 체험 빠른 생성 40회 뒤 하루 5회(최대 20 저장)·이미지 200×200까지 / Tier 1 월 $12·월 2,000회·320×320까지·애니메이션 도구 / Tier 2 월 $24·월 5,000회·512×512까지 / Tier 3 월 $50·월 10,000회.
- 권하는 순서: 무료로 공명자 1명(예: 에이메스)만 만들어 화풍을 본 뒤 정한다. 40명 전부는 무료 빠른 생성(40회)으로 모자란다.

## 참고 자료와 역할
| 자료 | 역할 | 근거 |
|---|---|---|
| 외형 설명(Character Description) | 캐릭터의 유일한 입력. 색·옷·특징·체형을 모두 여기 적는다 | 공명자 9명은 HERO_PROMPTS의 확정 문장(확인됨). 방랑자(남)·카르티시아·음림과 적 전부는 지금 도트를 보고 적음(추정) |
| \`art/pixellab-ref/<id>.png\` | 결과를 지금 도트와 비교하는 기준(무료 크기에 맞춤). 옆모습이라 Create from Reference의 정면 칸에는 맞지 않는다 | 게임에 쓰는 지금 도트 |
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

`;
  for(const h of HEROES){const w=WEAPON[h.id];assert(w,h.id);
    const look=(h.intro.match(/Do not redesign: (.*)$/)||[])[1];
    const body=h.id==='rovM'?'Adult man with realistic 7-head proportions, small head, long legs':h.id==='aemMecha'?'Slim humanoid mech with realistic 7-head proportions, small head, long legs':'Adult woman with realistic slim 7-head proportions, small head, long legs, natural-size eyes';
    const desc=(look?look.replace(/\.$/,''):`${h.who} from Wuthering Waves, wielding a ${w==='rectifier'?'rectifier (no blade)':w}`)+`. ${body}. Pixel art sprite with a crisp dark outline.`;
    md+=`### ${h.ko} · \`${h.id}\`\nCharacter Type **Humanoid** · Sprite Size 무료 ${PLAN.free.hero} / 유료 ${PLAN.paid.hero} · 방향 East · 비교 기준 \`art/pixellab-ref/${h.id}.png\`${look?' · 외형 근거: 확정 문장':' · 외형 근거: 추정(확정 문장 없음)'}\n\n외형(Character Description)\n${block(desc)}\n${anims(HERO_ANIMS(w),'East(오른쪽)')}\n`;
  }
  md+=`## 적
외형 설명은 지금 도트(칵찰찰·아즈즈는 2026-11-20 새 디자인)를 보고 적었다. 공식 모습과는 대조하지 않았다(미확인). Character Type은 몸 모양으로 골랐다: 두 발이면 Humanoid, 네발 짐승이면 Quadruped(템플릿 칸이 나오면 괄호 안 값), 그 밖(게·물고기·새·곤충·거북·바위·탈것)은 Custom.

`;
  for(const [id,en,ko,g,el,atk,cast] of ENEMIES){
    const desc=`${en}, an enemy from Wuthering Waves: ${LOOK[id]}. Menacing creature design. Pixel art sprite with a crisp dark outline.`;
    const list=[['idle','대기',4,'idle stance, breathing slowly with small motion of tail, wings or limbs'],['attack','공격',8,`${atk}, moving forward, then recovers`],['cast','시전',6,`${cast}, then releases a compact burst`],['hit','피격',4,'recoils backward from a blow, then regains balance'],['guard','막기',4,'braces in a defensive pose'],['death','처치',8,'collapses and breaks apart into a few large fragments that vanish']];
    md+=`### ${ko} · \`${id}\`\n${g} · ${el} · Character Type **${TYPE[id]}** · Sprite Size 무료 ${PLAN.free.enemy[g]} / 유료 ${PLAN.paid.enemy[g]} · 방향 West · 비교 기준 \`art/pixellab-ref/${id}.png\` · 외형 근거: 추정(지금 도트)\n\n외형(Character Description)\n${block(desc)}\n${anims(list,'West(왼쪽)')}\n`;
  }
  fs.writeFileSync(path.join(root,'docs/art/PIXELLAB_PROMPTS.md'),md.trimEnd()+'\n');
  const long=[...md.matchAll(/외형\(Character Description\)\n```\n([^\n]+)/g)].map(m=>m[1].length);
  assert(long.length===HEROES.length+ENEMIES.length&&Math.max(...long)<=2000,'외형 설명 수 또는 2000자 초과');
  console.log('PASS',HEROES.length,'공명자',ENEMIES.length,'적, 비교 기준',Object.keys(refs).length,'장, 외형 최대',Math.max(...long),'자, 비용 무료',sum(PLAN.free),'/ 유료',sum(PLAN.paid));
})();
