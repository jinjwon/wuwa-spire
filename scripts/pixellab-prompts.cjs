// PixelLab Character Creator(pixellab.ai/create-character)용 입력값을 만든다.
// 1) docs/art/PIXELLAB_PROMPTS.md: 캐릭터마다 설정·외형 설명·금지 설명·동작 설명(복사 블록)
// 2) art/pixellab-ref/<id>.png: 참조 이미지(지금 도트를 PixelLab 캔버스 크기로 맞춤, 다시 만들 수 있어 커밋 안 함)
// 사용: node scripts/pixellab-prompts.cjs   문서를 직접 고치지 말고 이 파일을 고쳐 다시 돌린다.
const fs=require('fs'),path=require('path'),sharp=require('sharp'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),{HEROES,ENEMIES}=require('./motion-prompts.cjs');
const REF=path.join(root,'art/pixellab-ref');

// 캔버스: 게임에서 2배로 키우면 지금 규격(공명자 320 프레임·몸 208, 적 192/256/384)과 정확히 맞는다
const HERO_SIZE=160,ENEMY_SIZE={경파급:96,거랑급:96,노도급:128,해일급:128,명식:192};
// 무기별 공격 동작(CHARACTER_BIBLE 무기 기준). 동작 설명은 외형이 아니라 움직임만 적는다
const WEAPON={rov:'sword',rovM:'sword',aem:'sword',aemMecha:'sword',cam:'sword',car:'sword',hiy:'sword',mor:'greatsword',chi:'greatsword',lyn:'pistol',sk:'rectifier',yin:'rectifier'};
const ATTACK={
  sword:'steps forward and slashes the sword horizontally to the right, then returns to stance',
  greatsword:'lifts the greatsword and swings it down hard to the right, then recovers',
  pistol:'raises the pistols to the right and fires twice with recoil, then lowers them',
  rectifier:'thrusts one hand forward to the right releasing a compact burst of energy, then pulls back',
};
const BUILD={rovM:'realistic male',aemMecha:'heroic'};
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
const HUMANOID={tamb:1,scout:1,crown:1,mephis:1,explorer:1,dreamless:1,hecate:1,levia:1,aleph:1,rider:1};
const NEG_HERO='chibi, big head, oversized eyes, child, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text';
const NEG_ENEMY='cute, chibi, extra limbs, blurry, anti-aliasing, soft glow, background, floor shadow, text';

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
  const anims=(list,dir)=>list.map(([k,ko,n,a])=>`동작 ${ko}(\`${k}\`) · ${n}프레임 · 방향 ${dir}\n`+block(a)).join('\n');
  let md=`# PixelLab 캐릭터 프롬프트

마지막 갱신 2026-11-20. 이 문서는 \`scripts/pixellab-prompts.cjs\`가 만든다(직접 고치지 말고 스크립트를 고쳐 다시 돌린다). [PixelLab Character Creator](https://www.pixellab.ai/create-character/new)에 넣을 값이다. GPT용 16칸 시트 프롬프트([MOTION_PROMPTS.md](MOTION_PROMPTS.md))와 달리, 캐릭터를 한 번 만들고 동작을 하나씩 붙인다.

## 쓰는 법
1. **캐릭터 만들기**: 아래 설정을 고르고, 첫 블록(외형)을 Description에, 둘째 블록(금지)을 Negative description에 붙인다. 참조 이미지 칸이 있으면 \`art/pixellab-ref/<id>.png\`를 올린다(외형을 지금 도트에 맞추는 데 가장 효과가 크다).
2. **동작 붙이기**: 만든 캐릭터에서 Animate(텍스트로 동작)를 열고, 동작 블록을 Action description에 붙인다. 프레임 수와 방향은 블록 위에 적었다. 대기는 템플릿(breathing idle 류)이 있으면 그것을 먼저 써 본다.
3. **받기**: 동작별 PNG(가로 스트립 또는 프레임 묶음)를 내려받아 \`art/pixellab/<id>/<동작>.png\`에 둔다. 게임 연결(\`assets/motion/\`로 2배 정수 확대)은 \`dev\`에서 한다.

## 공통 설정
| 항목 | 값 | 이유 |
|---|---|---|
| View | **side** | 횡 전투 화면. top-down이면 위에서 본 모습이 된다 |
| Directions | 4 | 오른쪽(공명자 east)과 왼쪽(적 west)만 쓴다. 4방향이 가장 싸다 |
| Size | 공명자 **${HERO_SIZE}**, 경파급·거랑급 **96**, 노도급·해일급 **128**, 명식 **192** | 게임에서 2배로 키우면 320·192·256·384로 지금 규격과 같다(정수 배율) |
| Body type | 공명자 humanoid. 적은 아래 표기대로 | 사람형이 아닌 적은 참조 이미지가 있어야 모양이 맞는다(없으면 두 발 인물로 그린다) |
| Proportions | 공명자 realistic female(방랑자 남 realistic male, 에이메스 메카 heroic) | 7등신, 머리 큰 비율 금지 |
| Outline | single color black outline | 지금 도트와 같은 1px 어두운 윤곽 |
| Shading / Detail | medium shading / high detail | 약한 힌트라 모델에 따라 무시될 수 있다 |
| Frames | 4~16 짝수 | PixelLab 제한 |

확인한 것: 위 항목 이름과 값 범위는 PixelLab 문서·MCP 설명 기준이다. 웹 화면의 실제 칸 이름과 위치, 참조 이미지 칸 유무는 로그인 화면이라 직접 보지 못했다(미확인).

## 공명자
`;
  for(const h of HEROES){const w=WEAPON[h.id];assert(w,h.id);
    const look=(h.intro.match(/Do not redesign: (.*)$/)||[])[1];
    const desc=(look?look.replace(/\.$/,''):`${h.who} from Wuthering Waves, follow the reference image exactly`)+`. Adult with realistic slim 7-head proportions${look?'':`, ${w==='rectifier'?'no weapon in hand':w}`}, side view facing right.`;
    md+=`### ${h.ko} · \`${h.id}\`\nSize ${HERO_SIZE} · humanoid · ${BUILD[h.id]||'realistic female'} · 참조 ${refs[h.id]?'`art/pixellab-ref/'+h.id+'.png`':'없음(공식 이미지 사용)'}${look?'':' · 외형 문장 미확정: 참조 이미지에 의존'}\n\n외형(Description)\n${block(desc)}\n금지(Negative)\n${block(NEG_HERO)}\n${anims(HERO_ANIMS(w),'east(오른쪽)')}\n`;
  }
  md+=`## 적
외형 설명은 지금 도트(칵찰찰·아즈즈는 2026-11-20 새 디자인)를 보고 적었다. 공식 모습과는 대조하지 않았다(미확인). 사람형이 아닌 적은 참조 이미지를 꼭 올린다.

`;
  for(const [id,en,ko,g,el,atk,cast] of ENEMIES){const size=ENEMY_SIZE[g];
    const desc=`${en}, a Wuthering Waves enemy: ${LOOK[id]}. Menacing, side view facing left.`;
    const list=[['idle','대기',4,'idle stance, breathing slowly with small motion of tail, wings or limbs'],['attack','공격',8,`${atk}, moving to the left, then recovers`],['cast','시전',6,`${cast}, then releases a compact burst`],['hit','피격',4,'recoils to the right from a blow, then regains balance'],['guard','막기',4,'braces in a defensive pose'],['death','처치',8,'collapses and breaks apart into a few large fragments that vanish']];
    md+=`### ${ko} · \`${id}\`\n${g} · ${el} · Size ${size} · ${HUMANOID[id]?'humanoid':'사람형 아님: 참조 이미지 필수'} · 참조 \`art/pixellab-ref/${id}.png\`\n\n외형(Description)\n${block(desc)}\n금지(Negative)\n${block(NEG_ENEMY)}\n${anims(list,'west(왼쪽)')}\n`;
  }
  fs.writeFileSync(path.join(root,'docs/art/PIXELLAB_PROMPTS.md'),md.trimEnd()+'\n');
  const long=[...md.matchAll(/외형\(Description\)\n```\n([^\n]+)/g)].map(m=>m[1].length);
  assert(Math.max(...long)<=500,'외형 설명이 500자를 넘음: '+Math.max(...long));
  console.log('PASS',HEROES.length,'공명자',ENEMIES.length,'적, 참조',Object.keys(refs).length,'장, 외형 최대',Math.max(...long),'자');
})();
