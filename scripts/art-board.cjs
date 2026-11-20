// 프롬프트 보드: 프롬프트 문서를 한 화면에 모으고, 현재 그림과 후보 그림을 나란히 보여 준다.
//   node scripts/art-board.cjs                    → art/board.html 을 만든다 (후보를 넣은 뒤 다시 실행)
//   node scripts/art-board.cjs apply <키> <파일>  → art/candidates/<키>/<파일> 을 원본 자리에 넣는다
// 후보 그림은 art/candidates/<키>/ 에 아무 이름으로 넣는다. 키는 보드의 각 항목에 적혀 있다.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.join(__dirname,'..'),ART=path.join(root,'art'),CAND=path.join(ART,'candidates');
const DOCS=[['수정 프롬프트','docs/art/REVISION_PROMPTS.md'],['새 시트 프롬프트','docs/art/HERO_PROMPTS.md'],['카드 한 장 프롬프트','art/card-prompts.md'],['전투 배경 프롬프트','docs/art/BG_PROMPTS.md'],['추가 모션 프롬프트','docs/art/MOTION_PROMPTS.md'],['PixelLab 캐릭터 프롬프트','docs/art/PIXELLAB_PROMPTS.md']];
const IMG=/\.(png|jpe?g|webp)$/i;
const exists=p=>fs.existsSync(path.join(root,p));

// 키 → 지금 쓰는 그림, 적용할 자리
function slot(key){
  // 추가 모션·이펙트: 처리 코드가 아직 없어 원본 자리에만 둔다(docs/art/MOTION_PROMPTS.md)
  if(/^fx_\w+$/.test(key))return{cur:`art/fx-src/${key}.png`,dst:`art/fx-src/${key}.png`,next:'dev에서 make-vfx.cjs 연결 필요 (docs/art/MOTION_PROMPTS.md)'};
  if(/^(enemy_full_\w+|hero_\w+_extra)$/.test(key))return{cur:`art/source-v2/${key}.png`,dst:`art/source-v2/${key}.png`,next:'dev에서 자르기·재생 코드 연결 필요 (docs/art/MOTION_PROMPTS.md)'};
  if(/^(hero|cards|enemies|enemy_sheet|battle)_?\w*$/.test(key)&&!exists(`assets/cards/${key}.png`))return{cur:`art/source-v2/${key}.png`,dst:`art/source-v2/${key}.png`,
    next:key.startsWith('battle_')?'node scripts/prepare-battle-bg.cjs':key.startsWith('cards_')||key.startsWith('enem')?'docs/art/ART_PIPELINE.md 의 절차대로 처리':'node scripts/prepare-heroes-v3.cjs preview  (확인 후 write)'};
  return{cur:`assets/cards/${key}.png`,dst:`art/card-gen/${key}.png`,next:'node scripts/cards.cjs import'};
}

// 보드 필터용 종류: 키가 있으면 키로, 없으면 제목·속한 ## 제목·문서로 정한다
function kindOf(it,file){const k=it.key||'',t=it.title+' '+it.sec;
  if(/^fx_/.test(k)||/이펙트/.test(t))return '이펙트';if(/^battle_/.test(k)||/BG_PROMPTS/.test(file))return '배경';
  if(/^cards_/.test(k)||/카드/.test(t)||/card-prompts/.test(file))return '카드';if(/^enem/.test(k)||/(^|[\s.])적(\s|$)/.test(it.sec))return '적';
  if(/^hero_/.test(k)||/공명자|모션|동작/.test(t))return '공명자';return '공통'}

// 마크다운을 제목 단위 항목으로 나눈다: 제목, 설명 글, 코드 블록(프롬프트)
function parse(file){
  const items=[];let it=null,code=null,sec='';
  for(const line of fs.readFileSync(path.join(root,file),'utf8').split('\n')){
    if(code){if(line.startsWith('```')){it.prompts.push(code.join('\n'));code=null}else code.push(line);continue}
    const h=line.match(/^(#{1,3}) (.*)/);
    if(h){if(h[1].length<=2)sec=h[2];it={level:h[1].length,title:h[2],sec,notes:[],prompts:[]};items.push(it);continue}
    if(!it)continue;
    if(line.startsWith('```'))code=[];else it.notes.push(line);
  }
  for(const it of items){
    it.notes=it.notes.join('\n').trim();
    const f=it.title.match(/`?((?:hero|cards|battle|enemy_full|fx)_\w+)\.png`?/),c=it.title.match(/^(\w+) · /);
    it.key=f?f[1]:c&&exists(`assets/cards/${c[1]}.png`)?c[1]:null;
    if(it.level===2&&exists(`assets/${it.title}.png`))it.face=`assets/${it.title}.png`;
  }
  return items;
}

function build(){
  const groups=DOCS.map(([name,file])=>({name,file,ai:/PIXELLAB/.test(file)?'PixelLab':'GPT',items:parse(file)}));
  for(const g of groups)for(const it of g.items)it.kind=kindOf(it,g.file);
  for(const g of groups)for(const it of g.items)if(it.key){
    const s=slot(it.key);it.cur=exists(s.cur)?s.cur:null;
    const dir=path.join(CAND,it.key);it.cands=fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>IMG.test(f)).sort():[];
  }
  const prompts=groups.flatMap(g=>g.items).reduce((n,it)=>n+it.prompts.length,0);
  assert(prompts>0,'프롬프트를 하나도 찾지 못했어요');
  const rel=p=>path.relative(ART,path.join(root,p)).split(path.sep).join('/');
  const data=JSON.stringify(groups.map(g=>({...g,items:g.items.map(it=>({...it,cur:it.cur&&rel(it.cur),face:it.face&&rel(it.face)}))}))).replace(/</g,'\\u003c');
  fs.writeFileSync(path.join(ART,'board.html'),PAGE.replace('__DATA__',()=>data));
  const cands=groups.flatMap(g=>g.items).reduce((n,it)=>n+(it.cands||[]).length,0);
  console.log(`작성: art/board.html (프롬프트 ${prompts}개, 후보 그림 ${cands}장)`);
}

async function apply(key,file){
  assert(key&&file,'사용: node scripts/art-board.cjs apply <키> <파일>');
  assert(/^\w+$/.test(key)&&path.basename(file)===file,'키와 파일 이름만 적어요(경로 없이)');
  const src=path.join(CAND,key,file),s=slot(key),dst=path.join(root,s.dst);
  assert(fs.existsSync(src),'후보 그림이 없어요: '+path.relative(root,src));
  fs.mkdirSync(path.dirname(dst),{recursive:true});
  await require('sharp')(src).png().toFile(dst);  // 이전 원본은 git 기록에 남는다
  console.log(`넣음: ${s.dst}\n다음: ${s.next}`);
}

const PAGE=`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>프롬프트 보드</title>
<style>
:root{--bg:#0b0c0f;--panel:#1c1e24;--line:rgba(255,255,255,.16);--ink:#eceae4;--sub:#9b9a94;--acc:#e6d3a3}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px/1.6 system-ui,sans-serif;padding:0 16px 96px}
header{position:sticky;top:0;z-index:2;background:var(--bg);padding:12px 0;border-bottom:1px solid var(--line);display:flex;gap:12px;flex-wrap:wrap;align-items:center}
header b{font-size:16px}header input{flex:1;min-width:180px;padding:8px 10px;background:var(--panel);color:var(--ink);border:1px solid var(--line)}
header a{color:var(--acc);text-decoration:none}
h2{margin:28px 0 4px;color:var(--acc);font-size:18px}h3{margin:22px 0 4px;font-size:15px;display:flex;gap:8px;align-items:center}
h4{margin:0 0 6px;font-size:15px}h4 code{color:var(--sub);font-weight:400}
.face{width:48px;height:48px;object-fit:contain;image-rendering:pixelated;background:var(--panel)}
.item{background:var(--panel);border:1px solid var(--line);padding:12px;margin:10px 0}
.notes{white-space:pre-wrap;color:var(--sub);margin:0 0 8px;overflow-wrap:anywhere}
textarea{width:100%;min-height:120px;background:#0f1013;color:var(--ink);border:1px solid var(--line);padding:8px;font:12px/1.5 ui-monospace,monospace;resize:vertical}
.row{display:flex;gap:8px;margin:6px 0 10px;align-items:center;flex-wrap:wrap}
button{background:var(--acc);color:#17150f;border:0;padding:8px 14px;font:inherit;font-weight:600;cursor:pointer;min-height:36px}
button.ghost{background:none;color:var(--sub);border:1px solid var(--line)}
.imgs{display:flex;gap:10px;overflow-x:auto;padding-bottom:6px}
figure{margin:0;flex:0 0 auto;border:2px solid transparent;padding:4px;background:#0f1013;cursor:pointer}
figure.cur{cursor:default}figure.on{border-color:var(--acc)}
figure img{display:block;height:260px;max-width:none;image-rendering:pixelated}
figure.big img{height:auto;max-height:80vh;max-width:92vw}
figcaption{color:var(--sub);font-size:12px;padding-top:4px}
.hint{color:var(--sub);font-size:12px}
#filters{display:flex;gap:14px;flex-wrap:wrap;align-items:center;width:100%}#filters fieldset{border:0;margin:0;padding:0;display:flex;gap:4px;flex-wrap:wrap;align-items:center}
#filters legend{float:left;color:var(--sub);font-size:12px;margin-right:4px}
.chip{background:none;color:var(--sub);border:1px solid var(--line);padding:4px 10px;min-height:32px;font-weight:400}.chip[aria-pressed=true]{background:var(--acc);color:#17150f;border-color:var(--acc);font-weight:600}
#count{color:var(--acc);font-size:12px}body.filtering .gnote{display:none}body.compact .item textarea{min-height:0;height:4.6em}
.tag{font-size:11px;color:var(--sub);border:1px solid var(--line);padding:0 6px;font-weight:400}
#bar{position:fixed;left:0;right:0;bottom:0;background:#15161a;border-top:1px solid var(--acc);padding:10px 16px;display:none;gap:10px;align-items:center;flex-wrap:wrap}
#bar code{flex:1;min-width:200px;overflow-wrap:anywhere;color:var(--acc)}
</style>
<header><b>프롬프트 보드</b><input id="q" placeholder="찾기: 이름, 키(aem, hero_mor), 내용" aria-label="찾기"><span id="nav"></span><div id="filters"></div></header>
<main id="main"></main>
<div id="bar"><span>고른 그림 적용 명령</span><code id="cmd"></code><button id="cp">복사</button></div>
<script>
const G=__DATA__;
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}}};
const el=(t,p={},...c)=>{const e=Object.assign(document.createElement(t),p);e.append(...c);return e};
const copy=(text,btn)=>navigator.clipboard.writeText(text).then(()=>{const o=btn.textContent;btn.textContent='복사됨';setTimeout(()=>btn.textContent=o,900)});
const main=document.getElementById('main'),nav=document.getElementById('nav');
G.forEach((g,gi)=>{
  nav.append(el('a',{href:'#g'+gi,textContent:g.name}),' · ');
  const grp=el('section',{className:'grp'});main.append(grp);
  grp.append(el('h2',{id:'g'+gi,textContent:g.name+'  '},el('span',{className:'tag',textContent:g.ai})),el('div',{className:'hint gnote',textContent:'원본 문서: '+g.file}));
  g.items.forEach((it,ii)=>{
    if(it.level<3&&!it.prompts.length){
      if(it.level===2){const h=el('h3',{className:'gnote'},it.title);if(it.face)h.prepend(el('img',{className:'face',src:it.face,alt:''}));grp.append(h)}
      if(it.notes)grp.append(el('div',{className:'notes gnote',textContent:it.notes}));return}
    const box=el('section',{className:'item'});box.dataset.text=(it.title+' '+(it.key||'')+' '+it.notes+' '+it.prompts.join(' ')).toLowerCase();
    box.dataset.ai=g.ai;box.dataset.kind=it.kind;box.dataset.state=it.cands&&it.cands.length?'후보 있음':it.cur?'그림 있음':'그림 없음';
    box.append(el('h4',{},it.title.replace(/\`/g,''),' ',el('span',{className:'tag',textContent:g.ai+' · '+it.kind}),it.key?el('code',{textContent:'  키: '+it.key}):''));
    if(it.notes)box.append(el('div',{className:'notes',textContent:it.notes}));
    it.prompts.forEach((p,pi)=>{
      const k='board:'+g.file+':'+it.title+':'+pi,ta=el('textarea',{value:store.get(k)??p,spellcheck:false});ta.setAttribute('aria-label',it.title+' 프롬프트');
      const mark=el('span',{className:'hint'}),sync=()=>mark.textContent=ta.value===p?'':'이 브라우저에만 저장된 수정본';
      ta.oninput=()=>{store.set(k,ta.value===p?null:ta.value);sync()};sync();
      const cp=el('button',{textContent:'프롬프트 복사'});cp.onclick=()=>copy(ta.value,cp);
      const rs=el('button',{className:'ghost',textContent:'원래대로'});rs.onclick=()=>{ta.value=p;ta.oninput()};
      box.append(ta,el('div',{className:'row'},cp,rs,mark))});
    if(it.key){
      const imgs=el('div',{className:'imgs'});
      const fig=(src,cap,cur)=>{const f=el('figure',{className:cur?'cur':''},el('img',{src,alt:cap,loading:'lazy'}),el('figcaption',{textContent:cap}));
        f.ondblclick=()=>f.classList.toggle('big');return f};
      if(it.cur)imgs.append(fig(it.cur,'지금 쓰는 그림',true));
      it.cands.forEach(c=>{const f=fig('candidates/'+it.key+'/'+encodeURIComponent(c),'후보: '+c);
        f.onclick=()=>{document.querySelectorAll('figure.on').forEach(x=>x.classList.remove('on'));f.classList.add('on');
          document.getElementById('cmd').textContent='node scripts/art-board.cjs apply '+it.key+' "'+c+'"';document.getElementById('bar').style.display='flex'};
        imgs.append(f)});
      box.append(imgs,el('div',{className:'hint',textContent:it.cands.length?'후보를 누르면 아래에 적용 명령이 나와요. 두 번 누르면 크게 보여요.':'후보 넣는 곳: art/candidates/'+it.key+'/  (넣은 뒤 node scripts/art-board.cjs 다시 실행)'}));
    }
    grp.append(box)})});
document.getElementById('cp').onclick=e=>copy(document.getElementById('cmd').textContent,e.target);
// 필터: AI·종류·상태 칩 + 찾기. 고른 값은 이 브라우저에 기억한다
const F={ai:store.get('board:f:ai')||'전체',kind:store.get('board:f:kind')||'전체',state:store.get('board:f:state')||'전체'};
const OPTS={ai:['전체','GPT','PixelLab'],kind:['전체','공명자','적','이펙트','카드','배경','공통'],state:['전체','후보 있음','그림 있음','그림 없음']};
const LABEL={ai:'AI',kind:'종류',state:'상태'},fbox=document.getElementById('filters'),q=document.getElementById('q');
for(const k of Object.keys(OPTS)){const fs=el('fieldset',{},el('legend',{textContent:LABEL[k]}));
  OPTS[k].forEach(v=>{const b=el('button',{className:'chip',type:'button',textContent:v});b.setAttribute('aria-pressed',F[k]===v);
    b.onclick=()=>{F[k]=v;store.set('board:f:'+k,v==='전체'?null:v);fs.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));apply()};fs.append(b)});fbox.append(fs)}
const cmp=el('button',{className:'chip',type:'button',textContent:'프롬프트 접기'});cmp.setAttribute('aria-pressed',store.get('board:f:compact')==='1');
cmp.onclick=()=>{const on=cmp.getAttribute('aria-pressed')!=='true';cmp.setAttribute('aria-pressed',on);store.set('board:f:compact',on?'1':null);document.body.classList.toggle('compact',on)};
document.body.classList.toggle('compact',cmp.getAttribute('aria-pressed')==='true');
const count=el('span',{id:'count'});fbox.append(cmp,count);
function apply(){const t=q.value.trim().toLowerCase();let n=0;
  document.querySelectorAll('.item').forEach(b=>{const ok=(!t||b.dataset.text.includes(t))&&['ai','kind','state'].every(k=>F[k]==='전체'||b.dataset[k]===F[k]);b.style.display=ok?'':'none';n+=ok});
  document.querySelectorAll('.grp').forEach(g=>g.style.display=g.querySelector('.item:not([style*="none"])')?'':'none');
  document.body.classList.toggle('filtering',!!t||Object.values(F).some(v=>v!=='전체'));count.textContent=n+'개 표시'}
q.oninput=apply;apply();
</script></html>
`;

if(process.argv[2]==='apply')apply(process.argv[3],process.argv[4]).catch(e=>{console.error(e.message);process.exit(1)});
else build();
