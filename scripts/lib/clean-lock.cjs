// GPT 이미지 생성의 "자글자글·뭉개짐"(정보 과다) 막는 공통 문장.
// 생성 스크립트(cards.cjs, motion-prompts.cjs)는 require해서 붙이고,
// 손으로 쓴 GPT 문서는 `node scripts/lib/clean-lock.cjs`로 모든 코드 블록 끝에 넣는다(이미 있으면 새 문장으로 바꾼다).
// PixelLab 문서는 도구가 달라(2000자 제한, 칸 구조) 넣지 않는다.
const fs=require('node:fs'),path=require('node:path');
const CLEAN='CLEAN LOCK (prevents noisy, muddy output): every art pixel is a clearly visible solid square of equal size; one clear subject and at most two supporting elements; large flat color areas with only 2-3 shade steps per material; no texture noise, no speckles, no scattered sparkles or glitter particles (a few single-pixel stars in a night sky are fine), no translucent overlapping layers, no ghosted, doubled or giant background faces, no afterimages, no lens flare, no bloom or glow halos; light and energy are a few bold solid pixel shapes with hard edges; background simplified into big chunky blocks, darker and lower in contrast than the subject; clear readable silhouette; use fewer colors than the limit allows.';
const DOCS=['docs/art/BG_PROMPTS.md','docs/art/TITLE_PROMPTS.md','docs/art/HERO_PROMPTS.md','docs/art/REVISION_PROMPTS.md'];
function apply(root){let n=0;
  for(const f of DOCS){const p=path.join(root,f);if(!fs.existsSync(p))continue;
    const s=fs.readFileSync(p,'utf8').replace(/```\n([\s\S]*?)\n```/g,(m,body)=>{n++;return '```\n'+body.replace(/ ?CLEAN LOCK \(.*?limit allows\./,'').trimEnd()+' '+CLEAN+'\n```'});
    fs.writeFileSync(p,s)}
  return n}
module.exports={CLEAN,DOCS,apply};
if(require.main===module)console.log('CLEAN LOCK 추가:',apply(path.resolve(__dirname,'../..')),'개 블록');
