// GPT 이미지 생성의 "자글자글·뭉개짐"(정보 과다) 막는 공통 문장.
// 생성 스크립트(cards.cjs, motion-prompts.cjs)는 require해서 붙이고,
// 손으로 쓴 GPT 문서는 `node scripts/lib/clean-lock.cjs`로 모든 코드 블록 끝에 넣는다(이미 있으면 새 문장으로 바꾼다).
// PixelLab 문서는 도구가 달라(2000자 제한, 칸 구조) 넣지 않는다. 제목(###)에 '플로우'가 있는 항목도 넣지 않는다(나노바나나는 자글거림이 적고 짧은 프롬프트가 잘 먹힘).
const fs=require('node:fs'),path=require('node:path');
const CLEAN='CLEAN LOCK (prevents noisy, muddy output): every art pixel is a clearly visible solid square of equal size; one clear subject and at most two supporting elements; large flat color areas with only 2-3 shade steps per material; no texture noise, no speckles, no scattered sparkles or glitter particles (a few single-pixel stars in a night sky are fine), no translucent overlapping layers, no ghosted, doubled or giant background faces, no afterimages, no lens flare, no bloom or glow halos; light and energy are a few bold solid pixel shapes with hard edges; background simplified into big chunky blocks, darker and lower in contrast than the subject; clear readable silhouette; use fewer colors than the limit allows.';
// 공명자 시트 공통 비율: 누구를 그려도 같은 키·같은 머리 크기로 나오게 한다(게임은 대기 자세 키를 208px로 맞추므로, 비율이 다르면 머리·몸 크기가 캐릭터마다 달라 보인다). 메카는 사람 비율이 아니라 뺀다
const PROP='PROPORTION LOCK (identical scale for every resonator): adult 7-heads-tall body (head height = 1/7 of standing height), never chibi, never a big head; standing idle height = 72% of the cell height, feet on the same ground line in every cell; slim realistic limbs and shoulders; the weapon keeps the same length in every cell; if a sheet of another resonator is attached as a scale reference, match its head size and standing height exactly.';
const DOCS=['docs/art/BG_PROMPTS.md','docs/art/TITLE_PROMPTS.md','docs/art/HERO_PROMPTS.md','docs/art/REVISION_PROMPTS.md'];
function apply(root){let n=0;
  for(const f of DOCS){const p=path.join(root,f);if(!fs.existsSync(p))continue;
    const strip=b=>b.replace(/ ?PROPORTION LOCK \(.*?exactly\./,'').replace(/ ?CLEAN LOCK \(.*?limit allows\./,'').trimEnd();
    const s=fs.readFileSync(p,'utf8').split(/(?=^### )/m).map(sec=>{const flow=/^### .*플로우/.test(sec),hero=/^### .*hero_(?!aemMecha)\w+\.png/.test(sec);
      return sec.replace(/```\n([\s\S]*?)\n```/g,(m,body)=>flow?'```\n'+strip(body)+'\n```':(n++,'```\n'+strip(body)+(hero?' '+PROP:'')+' '+CLEAN+'\n```'))}).join('');
    fs.writeFileSync(p,s)}
  return n}
module.exports={CLEAN,PROP,DOCS,apply};
if(require.main===module)console.log('CLEAN LOCK(공명자 시트는 PROPORTION LOCK도) 추가:',apply(path.resolve(__dirname,'../..')),'개 블록');
