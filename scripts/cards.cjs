// 카드 일러스트 교체 도구
//   node scripts/cards.cjs prompts   → art/card-prompts.md (카드별 GPT 이미지 프롬프트)
//   node scripts/cards.cjs import    → art/card-gen/<카드ID>.png 를 카드 규격(144×96 도트)으로 변환해 assets/cards/ 에 적용
// 기존 카드 그림은 처음 한 번 art/backup-cards/ 에 백업한다.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.join(__dirname,'..'),CARDS=path.join(root,'assets/cards');

// 원작 외형 요약(공식 원화 관찰 기준, 팬아트용 설명)
const LOOK={
  rov:'Rover (female): short black bob hair with silver-white strands, black sleeveless high-neck top, grey asymmetric waist cloth, black thigh-high boots, slim black sword with small glowing blue accents',
  aem:'Aemeath: very long pink hair, white and silver futuristic dress with navy-blue accents and thin gold trim, cyan glowing energy sword, often with a sleek white-silver mecha companion with cyan lights',
  sk:'Shorekeeper: long pale blue-teal hair, flowing white dress, serene expression, glowing cyan butterflies around her, starry ocean motifs',
  lyn:'Lynae: long wavy blonde hair, headphones, white shirt, black jacket and short black skirt, mint and teal neon spray-paint graffiti effects',
  mor:'Mornye: long silver-white hair covering one eye, one visible red eye, long white coat over indigo-navy inner outfit, celestial orbit diagrams and planets, large white blade',
  chi:'Chisa: long straight black hair with a red ribbon, black jacket and black pleated skirt, dark blade with red accents, crimson thread-like slash effects',
  cam:'Camellya: white hair with crimson tips, red and black dress decorated with camellia flowers, crimson petals and thorny vines, vine-like whip blade',
};
const POSE={공격:'dynamic attack action, mid-strike with motion trails',스킬:'defensive or support stance, protective glowing barrier or graceful evasive motion',
  파워:'powerful aura awakening, energy swirling around the character, close-up heroic shot',상태:'',저주:''};
const ABSTRACT={상태:'glitchy corrupted energy, static and dark purple noise, ominous abstract shapes, no character',
  저주:'distorted echo noise waveform, eerie dark abstract shapes, no character'};
const STYLE='Pixel art card illustration, landscape 3:2 (1536x1024), 16-bit SNES style, crisp pixels, limited palette, dark blue night atmosphere, inspired by the game Wuthering Waves. No text, no letters, no card frame, no border.';

function cards(){const src=fs.readFileSync(path.join(root,'index.html'),'utf8');
  return fs.readdirSync(CARDS).filter(f=>f.endsWith('.png')&&!f.startsWith('node')).map(f=>{const id=f.slice(0,-4);
    const m=src.match(new RegExp(`[ ,{]${id}:\\{n:'([^']*)',o:'([^']*)'[^}]*?t:'([^']*)'`));assert(m,'카드 정의 없음: '+id);
    return{id,n:m[1],o:m[2],t:m[3]}})}

function prompt(c){
  const who=LOOK[c.o]||'a mysterious resonator silhouette with glowing echo energy';
  const body=ABSTRACT[c.t]||`${who}. ${POSE[c.t]}. Theme: "${c.n}".`;
  return `${STYLE} ${body} Character centered, full scene fills the frame.`;
}

function writePrompts(){const L=cards();let md=`# 카드 일러스트 GPT 프롬프트 (${L.length}장)\n\n`+
  `1. 아래 프롬프트를 GPT 이미지 생성에 그대로 붙여 넣어요. (가로형 1536×1024 권장)\n`+
  `2. 결과를 \`art/card-gen/<카드ID>.png\` 이름으로 저장해요. 예: \`art/card-gen/aem_a.png\`\n`+
  `3. \`node scripts/cards.cjs import\` 를 실행하면 도트로 줄여서 게임에 적용돼요. 일부만 넣어도 돼요.\n\n`;
  let cur='';for(const c of L){if(c.o!==cur){cur=c.o;md+=`\n## ${cur}\n\n`}
    md+=`### ${c.id} · ${c.n} (${c.t})\n\n\`\`\`\n${prompt(c)}\n\`\`\`\n\n`}
  fs.writeFileSync(path.join(root,'art/card-prompts.md'),md);console.log('작성: art/card-prompts.md',L.length+'장')}

async function importGen(){const sharp=require('sharp'),gen=path.join(root,'art/card-gen'),bak=path.join(root,'art/backup-cards');
  if(!fs.existsSync(gen)){fs.mkdirSync(gen,{recursive:true});console.log('art/card-gen/ 폴더를 만들었어요. 생성한 이미지를 넣고 다시 실행하세요.');return}
  const ids=new Set(cards().map(c=>c.id));let n=0;
  for(const f of fs.readdirSync(gen).filter(f=>/\.(png|jpe?g|webp)$/i.test(f))){const id=f.replace(/\.\w+$/,'');
    if(!ids.has(id)){console.log('건너뜀(카드 ID 아님):',f);continue}
    const dst=path.join(CARDS,id+'.png'),b=path.join(bak,id+'.png');
    if(!fs.existsSync(b)){fs.mkdirSync(bak,{recursive:true});fs.copyFileSync(dst,b)}
    // 3:2 중앙 자르기 → 144×96 축소 → 48색 팔레트로 도트 질감 통일
    await sharp(path.join(gen,f)).resize(144,96,{fit:'cover',position:'attention'}).png({palette:true,colors:48,dither:0}).toFile(dst);
    const meta=await sharp(dst).metadata();assert(meta.width===144&&meta.height===96);n++;console.log('적용',id)}
  console.log(`완료 ${n}장. 원본 백업: art/backup-cards/`)}

const cmd=process.argv[2];
if(cmd==='prompts')writePrompts();else if(cmd==='import')importGen().catch(e=>{console.error(e);process.exit(1)});
else console.log('사용: node scripts/cards.cjs prompts | import');
