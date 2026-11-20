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

// 마크다운을 제목 단위 항목으로 나눈다: 제목, 설명 글, 코드 블록(프롬프트)
function parse(file){
  const items=[];let it=null,code=null;
  for(const line of fs.readFileSync(path.join(root,file),'utf8').split('\n')){
    if(code){if(line.startsWith('```')){it.prompts.push(code.join('\n'));code=null}else code.push(line);continue}
    const h=line.match(/^(#{1,3}) (.*)/);
    if(h){it={level:h[1].length,title:h[2],notes:[],prompts:[]};items.push(it);continue}
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
  const groups=DOCS.map(([name,file])=>({name,file,items:parse(file)}));
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
#bar{position:fixed;left:0;right:0;bottom:0;background:#15161a;border-top:1px solid var(--acc);padding:10px 16px;display:none;gap:10px;align-items:center;flex-wrap:wrap}
#bar code{flex:1;min-width:200px;overflow-wrap:anywhere;color:var(--acc)}
</style>
<header><b>프롬프트 보드</b><input id="q" placeholder="찾기: 이름, 키(aem, hero_mor), 내용" aria-label="찾기"><span id="nav"></span></header>
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
  main.append(el('h2',{id:'g'+gi,textContent:g.name}),el('div',{className:'hint',textContent:'원본 문서: '+g.file}));
  g.items.forEach((it,ii)=>{
    if(it.level<3&&!it.prompts.length){
      if(it.level===2){const h=el('h3',{},it.title);if(it.face)h.prepend(el('img',{className:'face',src:it.face,alt:''}));main.append(h)}
      if(it.notes)main.append(el('div',{className:'notes',textContent:it.notes}));return}
    const box=el('section',{className:'item'});box.dataset.text=(it.title+' '+(it.key||'')+' '+it.notes+' '+it.prompts.join(' ')).toLowerCase();
    box.append(el('h4',{},it.title.replace(/\`/g,''),it.key?el('code',{textContent:'  키: '+it.key}):''));
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
    main.append(box)})});
document.getElementById('cp').onclick=e=>copy(document.getElementById('cmd').textContent,e.target);
document.getElementById('q').oninput=e=>{const q=e.target.value.trim().toLowerCase();document.querySelectorAll('.item').forEach(b=>b.style.display=!q||b.dataset.text.includes(q)?'':'none')};
</script></html>
`;

if(process.argv[2]==='apply')apply(process.argv[3],process.argv[4]).catch(e=>{console.error(e.message);process.exit(1)});
else build();
