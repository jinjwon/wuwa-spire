// 카드 일러스트 교체 도구
//   node scripts/cards.cjs prompts   → art/card-prompts.md (카드별 GPT 이미지 프롬프트)
//   node scripts/cards.cjs import    → art/card-gen/<카드ID>.png 를 카드 규격(144×96 도트)으로 변환해 assets/cards/ 에 적용
// 기존 카드 그림은 처음 한 번 art/backup-cards/ 에 백업한다.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.join(__dirname,'..'),CARDS=path.join(root,'assets/cards');

// 원작 외형 요약(공식 원화 관찰 기준, 팬아트용 설명)
const LOOK={
  rov:'Rover (female): short black bob hair with silver-white strands, black sleeveless high-neck top, grey asymmetric waist cloth, black thigh-high boots, slim black sword with small glowing blue accents',
  aem:'Aemeath: knee-length rose-pink high ponytail with peach tips, golden eyes, white sleeveless leotard with gold trim, metal device at the waist, navy-to-sky-blue starry gradient skirt tails, white gloves from the elbow, white thigh-highs with gold bands, white heels, sword. Her mecha form: silver-white armor, round helmet with teal visor, golden crest swept back, teal chest core, floating white blade wings',
  sk:'Shorekeeper: shoulder-length sky-blue hair with dark blue tips, pink-purple eyes, white translucent hood with navy and yellow butterfly ornaments, navy starry veil, short white dress with frilled collar, silver straps and bracelets, bare legs, glowing butterflies around her',
  lyn:'Lynae: long wavy blonde hair, headphones, white shirt, black jacket and short black skirt, mint and teal neon spray-paint graffiti effects',
  mor:'Mornye: long silver-white hair covering one eye, one visible red eye, long white coat over indigo-navy inner outfit, celestial orbit diagrams and planets, large white blade',
  chi:'Chisa: long straight black hair with one red ribbon, short black jacket over a sailor top with red scarf, black pleated skirt, scissor-shaped greatsword, crimson thread-like slash effects',
  cam:'Camellya: white twin-tail hair with black streaks, dark grey eyes with red diamond pupils, dark red flower on her head, red and black dress decorated with camellia flowers, crimson petals and thorny vines, sword',
  hiy:'Hiyuki: white high ponytail with a red ribbon, red and white shrine maiden outfit with cherry blossom pattern, sword, ice and snow effects',
};
const POSE={공격:'dynamic attack action, mid-strike with motion trails',스킬:'defensive or support stance, protective glowing barrier or graceful evasive motion',
  파워:'powerful aura awakening, energy swirling around the character, close-up heroic shot',상태:'',저주:''};
const ABSTRACT={상태:'glitchy corrupted energy, static and dark purple noise, ominous abstract shapes, no character',
  저주:'distorted echo noise waveform, eerie dark abstract shapes, no character'};
const STYLE='Pixel art card illustration, landscape 3:2 (1536x1024), 16-bit SNES style, crisp pixels, limited palette, dark blue night atmosphere, inspired by the game Wuthering Waves. No text, no letters, no card frame, no border.';

function cards(){const src=fs.readFileSync(path.join(root,'src/js/data.js'),'utf8'),cd=src.slice(src.indexOf('const CD={'),src.indexOf('const REWARD_POOL='));
  const L=[...cd.matchAll(/^  (\w+):\{n:'([^']*)',o:'([^']*)'[^}]*?t:'([^']*)'/gm)].map(m=>({id:m[1],n:m[2],o:m[3],t:m[4]}));
  assert(L.length>=70,'카드 정의를 읽지 못했어요: '+L.length);return L}

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
