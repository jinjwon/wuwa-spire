// 프롬프트 보드: 프롬프트 문서를 한 화면에 모으고, 현재 그림과 후보 그림을 나란히 보여 준다.
//   node scripts/art-board.cjs                    → art/board.html 을 만든다 (후보를 넣은 뒤 다시 실행)
//   node scripts/art-board.cjs apply <키> <파일>  → art/candidates/<키>/<파일> 을 원본 자리에 넣는다
// 후보 그림은 art/candidates/<키>/ 에 아무 이름으로 넣는다. 키는 보드의 각 항목에 적혀 있다.
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.join(__dirname,'..'),ART=path.join(root,'art'),CAND=path.join(ART,'candidates');
const DOCS=[['수정 프롬프트','docs/art/REVISION_PROMPTS.md'],['새 시트 프롬프트','docs/art/HERO_PROMPTS.md'],['카드 한 장 프롬프트','art/card-prompts.md'],['타이틀 프롬프트','docs/art/TITLE_PROMPTS.md'],['전투 배경 프롬프트','docs/art/BG_PROMPTS.md'],['추가 모션 프롬프트','docs/art/MOTION_PROMPTS.md'],['PixelLab 캐릭터 프롬프트','docs/art/PIXELLAB_PROMPTS.md']];
const IMG=/\.(png|jpe?g|webp)$/i;
const exists=p=>fs.existsSync(path.join(root,p));

// 키 → 지금 쓰는 그림, 적용할 자리
function slot(key){
  // 추가 모션·이펙트: 처리 코드가 아직 없어 원본 자리에만 둔다(docs/art/MOTION_PROMPTS.md)
  if(/^fx_\w+$/.test(key))return{cur:`art/fx-src/${key}.png`,dst:`art/fx-src/${key}.png`,next:'dev에서 make-vfx.cjs 연결 필요 (docs/art/MOTION_PROMPTS.md)'};
  if(/^title_\w+$/.test(key))return{cur:`art/source-v2/${key}.png`,dst:`art/source-v2/${key}.png`,next:'dev에서 타이틀 화면(titleHTML) 연결 필요 (docs/art/TITLE_PROMPTS.md)'};
  if(/^battle_(elite|boss)\d$/.test(key))return{cur:`art/source-v2/${key}.png`,dst:`art/source-v2/${key}.png`,next:'dev에서 prepare-battle-bg.cjs 목록·전투 종류별 배경 연결 필요 (docs/art/BG_PROMPTS.md)'};
  if(/^(enemy_full_\w+|hero_\w+_extra)$/.test(key))return{cur:`art/source-v2/${key}.png`,dst:`art/source-v2/${key}.png`,next:'dev에서 자르기·재생 코드 연결 필요 (docs/art/MOTION_PROMPTS.md)'};
  if(/^(hero|cards|enemies|enemy_sheet|battle)_?\w*$/.test(key)&&!exists(`assets/cards/${key}.png`))return{cur:`art/source-v2/${key}.png`,dst:`art/source-v2/${key}.png`,
    next:key.startsWith('battle_')?'node scripts/prepare-battle-bg.cjs':key.startsWith('cards_')||key.startsWith('enem')?'docs/art/ART_PIPELINE.md 의 절차대로 처리':'node scripts/prepare-heroes-v3.cjs preview  (확인 후 write)'};
  return{cur:`assets/cards/${key}.png`,dst:`art/card-gen/${key}.png`,next:'node scripts/cards.cjs import'};
}

// 보드 필터용 종류: 키가 있으면 키로, 없으면 제목·속한 ## 제목·문서로 정한다
function kindOf(it,file){const k=it.key||'',t=it.title+' '+it.sec;
  if(/^fx_/.test(k)||/이펙트/.test(t))return '이펙트';if(/^title_pose_/.test(k))return '공명자';if(/^(battle|title)_/.test(k)||/BG_PROMPTS/.test(file))return '배경';
  if(/^cards_/.test(k)||/카드/.test(t)||/card-prompts/.test(file))return '카드';if(/^enem/.test(k)||/(^|[\s.])적(\s|$)/.test(it.sec))return '적';
  if(/^hero_/.test(k)||/공명자|모션|동작/.test(t))return '공명자';return '공통'}

// 마크다운을 제목 단위 항목으로 나눈다: 제목, 설명 글, 코드 블록(프롬프트)
function parse(file){
  const items=[];let it=null,code=null,sec='',last='';
  for(const line of fs.readFileSync(path.join(root,file),'utf8').split('\n')){
    if(code){if(line.startsWith('```')){it.prompts.push(code.join('\n'));code=null}else code.push(line);continue}
    const h=line.match(/^(#{1,3}) (.*)/);
    if(h){if(h[1].length<=2)sec=h[2];it={level:h[1].length,title:h[2],sec,notes:[],prompts:[],labels:[]};last='';items.push(it);continue}
    if(!it)continue;
    if(line.startsWith('```')){code=[];it.labels.push(last)}else{it.notes.push(line);if(line.trim())last=line.trim()}
  }
  for(const it of items){
    it.notes=it.notes.join('\n').trim();
    const f=it.title.match(/`?((?:hero|cards|battle|enemy_full|fx|title)_\w+)\.png`?/),c=it.title.match(/^(\w+) · /);
    it.key=f?f[1]:c&&(exists(`assets/cards/${c[1]}.png`)||/card-prompts/.test(file))?c[1]:null;
    if(it.level===2&&exists(`assets/${it.title}.png`))it.face=`assets/${it.title}.png`;
  }
  return items;
}

function build(){
  const groups=DOCS.map(([name,file])=>({name,file,ai:/PIXELLAB/.test(file)?'PixelLab':'GPT',items:parse(file)}));
  for(const g of groups)for(const it of g.items){it.kind=kindOf(it,g.file);
    const t=g.ai==='PixelLab'&&it.notes.match(/Character Type \*\*(.+?)\*\* · Sprite Size 무료 (\d+) \/ 유료 (\d+) · 방향 (East|West) · 비교 기준 `art\/([^`]+)`/);
    if(t)it.pl={type:t[1],free:+t[2],paid:+t[3],dir:t[4],ref:exists('art/'+t[5])?t[5]:null,basis:(it.notes.match(/외형 근거: ([^\n]+)/)||[])[1]||''}}
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
#nav a{margin-right:14px}#tabs{display:flex;gap:0;width:100%;border-bottom:1px solid var(--line)}#tabs button{background:none;color:var(--sub);border:0;border-bottom:3px solid transparent;padding:10px 18px;font-size:15px;min-height:44px}
#tabs button[aria-selected=true]{color:var(--acc);border-bottom-color:var(--acc)}#tabs small{display:block;font-weight:400;font-size:11px}
body.tab-pl .gpt-only{display:none!important}.intro{border:1px solid #4fb3a9;background:#16211f;padding:12px 14px;margin:10px 0;line-height:1.8}.intro b{color:#7fd8c8}
#filters{display:flex;gap:14px;flex-wrap:wrap;align-items:center;width:100%}#filters fieldset{border:0;margin:0;padding:0;display:flex;gap:4px;flex-wrap:wrap;align-items:center}
#filters legend{float:left;color:var(--sub);font-size:12px;margin-right:4px}
.chip{background:none;color:var(--sub);border:1px solid var(--line);padding:4px 10px;min-height:32px;font-weight:400}.chip[aria-pressed=true]{background:var(--acc);color:#17150f;border-color:var(--acc);font-weight:600}
#count{color:var(--acc);font-size:12px}body.filtering .gnote{display:none}body.compact .item textarea{min-height:0;height:4.6em}
.tag{font-size:11px;color:var(--sub);border:1px solid var(--line);padding:0 6px;font-weight:400}
.pl{--t:#4fb3a9;display:grid;gap:10px}.pl .step{display:grid;grid-template-columns:28px 1fr;gap:10px;align-items:start;border-top:1px solid var(--line);padding-top:10px}
.pl .n{width:24px;height:24px;border-radius:50%;background:var(--t);color:#0b0c0f;font-weight:700;display:grid;place-items:center;font-size:13px}
.pl .lab{font-weight:600;margin-bottom:6px}.pl .lab small{font-weight:400;color:var(--sub);margin-left:6px}
.pl .opts{display:flex;gap:6px;flex-wrap:wrap}.pl .opt{border:1px solid var(--line);padding:6px 12px;color:var(--sub);background:#141518}
.pl .opt.on{border-color:var(--t);color:var(--t);background:#16211f;font-weight:700}.pl .opt.off{opacity:.35}
.pl .card{border:2px solid var(--line);padding:8px 14px;min-width:120px;text-align:center;color:var(--sub)}.pl .card.on{border-color:var(--t);color:var(--t);background:#16211f}.pl .card b{display:block;font-size:15px}
.pl .say{color:var(--acc);font-size:13px;margin-top:6px}.pl .noimg{color:#7fd8c8}
.pl .ref{display:flex;gap:12px;align-items:center}.pl .ref img{width:calc(var(--rs)*3px);image-rendering:pixelated;background:#2b3044;padding:6px}
.pl details{margin-top:4px}.pl summary{cursor:pointer;color:var(--acc)}.pl .anim{margin:8px 0}.pl .anim textarea{min-height:0;height:3.4em}
#bar{position:fixed;left:0;right:0;bottom:0;background:#15161a;border-top:1px solid var(--acc);padding:10px 16px;display:none;gap:10px;align-items:center;flex-wrap:wrap}
#bar code{flex:1;min-width:200px;overflow-wrap:anywhere;color:var(--acc)}
</style>
<header><b>프롬프트 보드</b><input id="q" placeholder="찾기: 이름, 키(aem, hero_mor), 내용" aria-label="찾기"><div id="tabs" role="tablist" aria-label="AI별 탭"></div><span id="nav"></span><div id="filters"></div></header>
<main id="main"></main>
<div id="bar"><span>고른 그림 적용 명령</span><code id="cmd"></code><button id="cp">복사</button></div>
<script>
const G=__DATA__;
const store={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{v==null?localStorage.removeItem(k):localStorage.setItem(k,v)}catch(e){}}};
const el=(t,p={},...c)=>{const e=Object.assign(document.createElement(t),p);e.append(...c);return e};
const copy=(text,btn)=>navigator.clipboard.writeText(text).then(()=>{const o=btn.textContent;btn.textContent='복사됨';setTimeout(()=>btn.textContent=o,900)});
const main=document.getElementById('main'),nav=document.getElementById('nav');
G.forEach((g,gi)=>{
  const nv=el('a',{href:'#g'+gi,textContent:g.name,className:'nv'});nv.dataset.ai=g.ai;nav.append(nv);
  const grp=el('section',{className:'grp'});grp.dataset.ai=g.ai;main.append(grp);
  if(g.ai==='PixelLab')grp.append(el('div',{className:'intro'},el('b',{textContent:'PixelLab 쓰는 법  '}),'캐릭터 카드 하나를 골라 ① → ⑩ 순서대로 PixelLab 화면에서 똑같이 고르세요. 청록색 칸이 고를 값입니다. 이미지는 올리지 않고, ④의 외형 설명만 복사해 붙여 넣습니다. 크기와 비용은 아래 「요금제」 버튼으로 바꿉니다.'));
  grp.append(el('h2',{id:'g'+gi,textContent:g.name+'  '},el('span',{className:'tag',textContent:g.ai})),el('div',{className:'hint gnote',textContent:'원본 문서: '+g.file}));
  g.items.forEach((it,ii)=>{
    if(it.level<3&&!it.prompts.length){if(g.ai==='PixelLab')return;
      if(it.level===2){const h=el('h3',{className:'gnote'},it.title);if(it.face)h.prepend(el('img',{className:'face',src:it.face,alt:''}));grp.append(h)}
      if(it.notes)grp.append(el('div',{className:'notes gnote',textContent:it.notes}));return}
    const box=el('section',{className:'item'});box.dataset.text=(it.title+' '+(it.key||'')+' '+it.notes+' '+it.prompts.join(' ')).toLowerCase();
    box.dataset.ai=g.ai;box.dataset.kind=it.kind;box.dataset.state=it.cands&&it.cands.length?'후보 있음':it.cur?'그림 있음':'그림 없음';
    box.append(el('h4',{},it.title.replace(/\`/g,''),' ',el('span',{className:'tag',textContent:g.ai+' · '+it.kind}),it.key?el('code',{textContent:'  키: '+it.key}):''));
    if(it.pl){box.append(plCard(it,g));grp.append(box);return}
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
// PixelLab Character Creator 화면을 위에서 아래 순서 그대로 보여 준다(2026-11-20 스크린샷 기준)
function plCard(it,g){
  const plan=store.get('board:pl:plan')==='paid'?'paid':'free',size=it.pl[plan],cost=s=>s<=90?2:s<=128?3:s<=156?4:s<=181?5:s<=202?6:s<=221?7:s<=239?8:9;
  const opts=(list,on,off=[])=>el('div',{className:'opts'},...list.map(v=>el('span',{className:'opt'+(v===on?' on':'')+(off.includes(v)?' off':''),textContent:v})));
  const step=(n,lab,hint,...c)=>el('div',{className:'step'},el('span',{className:'n',textContent:n}),el('div',{},el('div',{className:'lab'},lab,hint?el('small',{textContent:hint}):''),...c));
  const say=t=>el('div',{className:'say',textContent:'→ '+t});
  const type=it.pl.type.split(' ')[0],tmpl=(it.pl.type.match(/\((\w+)\)/)||[])[1];
  const desc=it.prompts[0],dk='board:'+g.file+':'+it.title+':0',ta=el('textarea',{value:store.get(dk)??desc,spellcheck:false});ta.setAttribute('aria-label',it.title+' 외형 설명');
  const cnt=el('span',{className:'hint'});ta.oninput=()=>{store.set(dk,ta.value===desc?null:ta.value);cnt.textContent=ta.value.length+'/2000'+(ta.value===desc?'':' · 이 브라우저에만 저장된 수정본')};ta.oninput();
  const cp=el('button',{textContent:'외형 설명 복사'});cp.onclick=()=>copy(ta.value,cp);
  const sizes=['32px','48px','56px','64px','80px','96px','128px','168px','256px'],preset=sizes.includes(size+'px');
  const anims=el('details',{},el('summary',{textContent:'동작 설명 '+(it.prompts.length-1)+'개 펼치기 (캐릭터를 만든 뒤 동작 추가 화면에서 쓴다. 동작 화면은 아직 확인 못 함)'}),
    ...it.prompts.slice(1).map((p,i)=>{const b=el('button',{className:'ghost',textContent:'복사'});b.onclick=()=>copy(p,b);
      return el('div',{className:'anim'},el('div',{className:'hint',textContent:(it.labels[i+1]||'').replace(/\`/g,'')}),el('textarea',{value:p,readOnly:true}),el('div',{className:'row'},b))}));
  return el('div',{className:'pl'},
    step(1,'맨 위 탭',null,opts(['Create from Text','Create from Reference'],'Create from Text'),el('div',{className:'say noimg',textContent:'→ 이 탭은 이미지를 올리지 않습니다. 글(외형 설명)만 넣어요.'})),
    step(2,'Character Type','큰 카드 3개 중 하나',el('div',{className:'opts'},...['Humanoid','Quadruped','Custom'].map(v=>el('div',{className:'card'+(v===type?' on':'')},el('b',{textContent:v}),{Humanoid:'두 발',Quadruped:'네발 짐승',Custom:'그 밖'}[v]))),tmpl?say('템플릿을 고르라고 하면 '+tmpl):''),
    step(3,'Generation Mode',null,opts(['v3','Pro','Standard'],'v3')),
    step(4,'Character Description','필수 칸. 아래 글을 복사해 붙여 넣기',ta,el('div',{className:'row'},cp,cnt),it.pl.basis?el('div',{className:'hint',textContent:'외형 근거: '+it.pl.basis}):''),
    step(5,'Camera View',null,opts(['Sidescroller','Low Top-Down','High Top-Down','Oblique'],'Sidescroller',['Oblique'])),
    step(6,'Sprite Size',(plan==='free'?'무료 체험: 64px까지':'Tier 1 이상')+' · 위쪽 「요금제」에서 바꿈',opts(sizes,size+'px',plan==='free'?sizes.slice(4):[]),say(preset?size+'px 버튼을 누르기':'버튼에 없음: 아래 Width·Height 슬라이더를 '+size+'으로')),
    step(7,'Detail · Outline',null,el('div',{className:'opts'},el('span',{className:'opt on',textContent:'Detail: Highly detailed'}),el('span',{className:'opt on',textContent:'Outline: Default'})),say('윤곽이 지금 도트와 다르면 Outline을 검은 단색 계열로 바꿔 다시')),
    step(8,'Generate v3 Character',null,say('화면 아래에 「Costs '+cost(size)+' generations」가 보이면 맞게 고른 것 (다르면 크기를 다시 확인)')),
    step(9,'결과 받기',null,say('8방향 중 '+it.pl.dir+(it.pl.dir==='East'?'(오른쪽을 보는 그림)':'(왼쪽을 보는 그림)')+'을 씁니다'),
      it.pl.ref?el('div',{className:'ref',style:'--rs:'+it.pl[plan]/ (plan==='free'?1:2)},el('img',{src:it.pl.ref,alt:'지금 도트',loading:'lazy'}),el('div',{className:'hint',textContent:'지금 게임 도트. 결과를 이것과 비교만 하세요(업로드하지 않음).'})):el('div',{className:'hint',textContent:'비교용 그림이 없어요: node scripts/pixellab-prompts.cjs 를 먼저 실행'})),
    step(10,'동작 붙이기',null,anims))}
// PixelLab 묶음 머리에 요금제 고르기
document.querySelectorAll('.grp').forEach(grp=>{if(!grp.querySelector('.pl'))return;const cur=store.get('board:pl:plan')==='paid'?'paid':'free';
  const sw=el('div',{className:'row'},el('b',{textContent:'요금제'}),...[['free','무료 체험 (64px까지)'],['paid','Tier 1 이상 (크게)']].map(([k,t])=>{const b=el('button',{className:'chip',type:'button',textContent:t});b.setAttribute('aria-pressed',k===cur);b.onclick=()=>{store.set('board:pl:plan',k==='free'?null:k);location.reload()};return b}));
  grp.querySelector('h2').after(sw)});
// 필터: AI·종류·상태 칩 + 찾기. 고른 값은 이 브라우저에 기억한다
const F={ai:store.get('board:f:tab')==='PixelLab'?'PixelLab':'GPT',kind:store.get('board:f:kind')||'전체',state:store.get('board:f:state')||'전체'};
const OPTS={kind:['전체','공명자','적','이펙트','카드','배경','공통'],state:['전체','후보 있음','그림 있음','그림 없음']};
const LABEL={kind:'종류',state:'상태'},fbox=document.getElementById('filters'),q=document.getElementById('q');
const tabs=document.getElementById('tabs');[['GPT','GPT 시트','카드·배경·이펙트·16칸 시트'],['PixelLab','PixelLab 캐릭터','공명자·적 캐릭터 만들기']].forEach(([k,t,sub])=>{
  const b=el('button',{type:'button',role:'tab'},t,el('small',{textContent:sub}));b.setAttribute('aria-selected',F.ai===k);
  b.onclick=()=>{F.ai=k;store.set('board:f:tab',k==='GPT'?null:k);tabs.querySelectorAll('button').forEach(x=>x.setAttribute('aria-selected',x===b));apply();scrollTo(0,0)};tabs.append(b)});
for(const k of Object.keys(OPTS)){const fs=el('fieldset',{className:k==='state'?'gpt-only':''},el('legend',{textContent:LABEL[k]}));
  OPTS[k].forEach(v=>{const b=el('button',{className:'chip'+(k==='kind'&&!['전체','공명자','적'].includes(v)?' gpt-only':''),type:'button',textContent:v});b.setAttribute('aria-pressed',F[k]===v);
    b.onclick=()=>{F[k]=v;store.set('board:f:'+k,v==='전체'?null:v);fs.querySelectorAll('.chip').forEach(x=>x.setAttribute('aria-pressed',x===b));apply()};fs.append(b)});fbox.append(fs)}
const cmp=el('button',{className:'chip gpt-only',type:'button',textContent:'프롬프트 접기'});cmp.setAttribute('aria-pressed',store.get('board:f:compact')==='1');
cmp.onclick=()=>{const on=cmp.getAttribute('aria-pressed')!=='true';cmp.setAttribute('aria-pressed',on);store.set('board:f:compact',on?'1':null);document.body.classList.toggle('compact',on)};
document.body.classList.toggle('compact',cmp.getAttribute('aria-pressed')==='true');
const count=el('span',{id:'count'});fbox.append(cmp,count);
function apply(){const t=q.value.trim().toLowerCase();let n=0;
  document.querySelectorAll('.item').forEach(b=>{const ok=(!t||b.dataset.text.includes(t))&&['ai','kind','state'].every(k=>F[k]==='전체'||b.dataset[k]===F[k]);b.style.display=ok?'':'none';n+=ok});
  document.querySelectorAll('.grp').forEach(g=>g.style.display=g.dataset.ai===F.ai&&g.querySelector('.item:not([style*="none"])')?'':'none');
  document.querySelectorAll('.nv').forEach(a=>a.style.display=a.dataset.ai===F.ai?'':'none');document.body.classList.toggle('tab-pl',F.ai==='PixelLab');
  document.body.classList.toggle('filtering',!!t||F.kind!=='전체'||F.state!=='전체');count.textContent=n+'개 표시'}
q.oninput=apply;apply();
</script></html>
`;

if(process.argv[2]==='apply')apply(process.argv[3],process.argv[4]).catch(e=>{console.error(e.message);process.exit(1)});
else build();
