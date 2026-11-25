// 카드 일러스트 교체 도구
//   node scripts/cards.cjs prompts   → art/card-prompts.md (카드별 GPT 이미지 프롬프트)
//   node scripts/cards.cjs import    → art/card-gen/<카드ID>.png 를 카드 규격(144×96 도트)으로 변환해 assets/cards/ 에 적용
// 기존 카드 그림은 처음 한 번 art/backup-cards/ 에 백업한다.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.join(__dirname,'..'),CARDS=path.join(root,'assets/cards');

// 원작 외형 요약(공식 원화 관찰 기준, 팬아트용 설명)
const LOOK={
  rov:'Rover (female): short black bob hair with silver-white strands, black sleeveless high-neck top, grey asymmetric waist cloth, black thigh-high boots, slim black sword with small glowing blue accents',
  aem:'Aemeath: knee-length rose-pink high ponytail with peach tips, golden eyes, white sleeveless leotard with gold trim, metal device at the waist, navy-to-sky-blue starry gradient skirt tails, white gloves from the elbow, white thigh-highs with gold bands, white heels, sword',

  sk:'Shorekeeper: shoulder-length sky-blue hair with dark blue tips, pink-purple eyes, white translucent hood with navy and yellow butterfly ornaments, navy starry veil, short white dress with frilled collar, silver straps and bracelets, bare legs, glowing butterflies around her',
  lyn:'Lynae: long wavy blonde hair, headphones, white shirt, black jacket and short black skirt, mint and teal neon spray-paint graffiti effects',
  mor:'Mornye: very long silver-lavender hair with bangs covering her right eye, one visible pink-red eye, a thin halo ring of small dots above her head, open long white lab coat, black high-neck inner top with a violet translucent crystal tie, glossy white tights, white high-heeled boots, large crystalline broadblade; white, silver and lavender palette with violet accents, not navy; no floating planets or orbs',
  chi:'Chisa: long straight black hair with one red ribbon, short black jacket over a sailor top with red scarf, black pleated skirt, scissor-shaped greatsword, crimson thread-like slash effects',
  cam:'Camellya: white twin-tail hair with black streaks, dark grey eyes with red diamond pupils, dark red flower on her head, red and black dress decorated with camellia flowers, crimson petals and thorny vines, sword',
  hiy:'Hiyuki: white high ponytail with a red ribbon, red and white shrine maiden outfit with cherry blossom pattern, sword, ice and snow effects',
};
// 메카 외형은 메카가 나오는 카드에만 붙인다(전 카드에 붙이면 GPT가 모든 카드에 메카를 그림)
const MECHA='Her mecha form: silver-white armor, round helmet with teal visor, golden crest swept back, teal chest core, floating white blade wings.';
// 카드별 장면(카드 효과 문구 기준). [장면, 메카 등장 여부]. 없으면 종류별 공통 포즈를 쓴다
const SCENE={
  aem_a:['Aemeath alone, one quick forward sword slash with a short pink-white arc. No mecha in this image',0],
  aem_b:['Aemeath sidestepping lightly to dodge, starry skirt tails trailing a stardust afterimage. No mecha in this image',0],
  aem_s:['transformation moment: Aemeath stepping into a column of starlight while her mecha form assembles around her',1],
  aem_dash:['Aemeath and her mecha fusing their weapons into one huge glowing blade and dashing forward together',1],
  aem_shard:['three bright star shards striking one dark enemy in rapid succession, Aemeath pointing her sword at it. No mecha in this image',0],
  aem_wing:['the floating white blade wings of her mecha fanning out behind Aemeath, glowing and empowering her',1],
  aem_star:['a rain of morning-star streaks hitting several dark enemies at once, Aemeath mid-leap above them. No mecha in this image',0],
  aem_sync:['Aemeath with eyes closed, hand on her chest, a glowing ring linking her to the teal chest core of her mecha',1],
  aem_break:['her mecha delivering a huge overhead strike, starlight shattering a cracked barrier, Aemeath small in the foreground',1],
  aem_ghost:['Aemeath drawn only as a dashed solid pale-blue pixel outline standing guard behind an ally, an invisible companion. No mecha in this image',0],
};
const POSE={공격:'dynamic attack action, mid-strike, one bold solid slash shape',스킬:'calm defensive or support stance with one simple solid barrier shape, or a graceful evasive motion',
  파워:'powerful awakening stance with a few bold solid energy shapes around the character, close-up heroic shot',상태:'',저주:''};
const ABSTRACT={상태:'glitchy corrupted energy drawn as a few broken solid dark purple pixel blocks, ominous abstract shapes, no character',
  저주:'a distorted echo waveform drawn as one bold jagged solid line, eerie dark abstract shapes, no character'};
const {CLEAN}=require('./lib/clean-lock.cjs');
const STYLE='Pixel art card illustration, landscape 3:2 (1536x1024), 16-bit SNES style, drawn as if at about 144x96 pixels and scaled up so each art pixel is a large crisp block, at most 32 colors, dark blue night atmosphere, inspired by the game Wuthering Waves. No text, no letters, no card frame, no border.';

function cards(){const src=fs.readFileSync(path.join(root,'src/js/data.js'),'utf8'),cd=src.slice(src.indexOf('const CD={'),src.indexOf('const REWARD_POOL='));
  const L=[...cd.matchAll(/^  (\w+):\{n:'([^']*)',o:'([^']*)'[^}]*?t:'([^']*)'/gm)].map(m=>({id:m[1],n:m[2],o:m[3],t:m[4],duo:m[0].match(/duo:\['(\w+)','(\w+)'\]/)?.slice(1)}));
  assert(L.length>=70,'카드 정의를 읽지 못했어요: '+L.length);return L}

function prompt(c){
  const who=c.duo?.every(k=>LOOK[k])?`Two characters together. ${LOOK[c.duo[0]]}. And ${LOOK[c.duo[1]]}`:LOOK[c.o]||'a mysterious hooded resonator shown as a clear dark silhouette with a few solid echo-energy accents';
  const sc=SCENE[c.id],body=ABSTRACT[c.t]||(sc?`${who}. ${sc[0]}.${sc[1]?' '+MECHA:''}`:`${who}. ${POSE[c.t]}. Theme: "${c.n}".`);
  return `${STYLE} ${body} Character centered, full scene fills the frame. ${CLEAN}`;
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
    const r=await sharp(path.join(gen,f)).resize(144,96,{fit:'cover',position:'attention'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    await sharp(require('./lib/pixel.cjs').limitColors(r.data,48),{raw:r.info}).png({palette:true,colours:256,dither:0}).toFile(dst); // colors:48은 sharp가 16색으로 깎음
    const meta=await sharp(dst).metadata();assert(meta.width===144&&meta.height===96);n++;console.log('적용',id)}
  console.log(`완료 ${n}장. 원본 백업: art/backup-cards/`)}

const cmd=process.argv[2];
if(cmd==='prompts')writePrompts();else if(cmd==='import')importGen().catch(e=>{console.error(e);process.exit(1)});
else console.log('사용: node scripts/cards.cjs prompts | import');
