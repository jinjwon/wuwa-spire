/* ============ 아트 ============
 우선순위: assets/<id>_idle.png(가로 스프라이트 시트) → assets/<id>.png(초상) → 위키 프로필 → 기본 실루엣
 적은 파일명 앞에 enemy_ 를 붙입니다. 예) assets/enemy_levia_idle.png */
const WIKI='https://static.wikia.nocookie.net/wutheringwaves/images/';
const WEB_ART={lyn:WIKI+'3/34/Resonator_Lynae.png/revision/latest',mor:WIKI+'2/25/Resonator_Mornye.png/revision/latest',chi:WIKI+'d/d7/Resonator_Chisa.png/revision/latest',cam:WIKI+'9/9f/Resonator_Camellya.png/revision/latest',rov:WIKI+'4/47/Resonator_Rover.png/revision/latest',aem:WIKI+'e/e8/Resonator_Aemeath.png/revision/latest',sk:WIKI+'d/da/Resonator_Shorekeeper.png/revision/latest'};
const ARTS={};
const FULL_ART={aem:'6/60/Aemeath_Full_Sprite.png',sk:'8/8c/Shorekeeper_Full_Sprite.png',lyn:'7/72/Lynae_Full_Sprite.png',mor:'d/db/Mornye_Full_Sprite.png',chi:'8/8a/Chisa_Full_Sprite.png',cam:'d/d4/Camellya_Full_Sprite.png',rovF:'a/ad/Female_Rover_Model.png',rovM:'0/05/Male_Rover_Model.png'};
const fullUrl=k=>WIKI+FULL_ART[k]+'/revision/latest/scale-to-width-down/600';
let ROVER_SKIN=(()=>{try{return localStorage.getItem('wuwa-rover-skin')||'F'}catch(e){return 'F'}})();
function toggleRover(){ROVER_SKIN=ROVER_SKIN==='F'?'M':'F';try{localStorage.setItem('wuwa-rover-skin',ROVER_SKIN)}catch(e){}render()}
function loadImg(src){return new Promise(r=>{const i=new Image();i.referrerPolicy='no-referrer';const t=setTimeout(()=>r(null),6000);
  i.onload=()=>{clearTimeout(t);r(i)};i.onerror=()=>{clearTimeout(t);r(null)};i.src=src})}
const stripOf=i=>i&&i.naturalHeight>0&&i.naturalWidth%i.naturalHeight===0?{src:i.src,frames:i.naturalWidth/i.naturalHeight}:null;
const artKey=id=>id==='rov'&&ROVER_SKIN==='M'?'rovM':id==='aem'&&S?.screen==='combat'&&S.c?.mecha?'aemMecha':id;
const artOf=id=>ARTS[EN[id]?.art]||ARTS[artKey(id)]||ARTS[id]||{};
async function loadArt(){
  await Promise.all([...ALL,'rovM','aemMecha',...Object.keys(EN).filter(k=>!EN[k].art)].map(async id=>{
    const pre=CH[id]||id==='rovM'||id==='aemMecha'?'':'enemy_';
    const [idle,atk,local]=await Promise.all([loadImg(`assets/${pre}${id}_idle.png`),loadImg(`assets/${pre}${id}_attack.png`),loadImg(`assets/${pre}${id}.png`)]);
    let portrait=local?local.src:null;
    const web=WEB_ART[id]||(ENEMY_ART[id]&&WIKI+ENEMY_ART[id]+'/revision/latest');
    if(!portrait&&web){const w=await loadImg(web);if(w)portrait=w.src}
    const A={idle:stripOf(idle),attack:stripOf(atk),portrait};
    const states=pre?['attack','cast','hit']:['guard','cast','hit','ultimate'];
    await Promise.all(states.map(async state=>{const image=await loadImg(`assets/motion/${pre}${id}_${state}.png`);if(image)A[state]=stripOf(image)}));
    if(CH[id]&&!idle){
      if(id==='rov'){const [f,m]=await Promise.all([loadImg(fullUrl('rovF')),loadImg(fullUrl('rovM'))]);A.fullF=f&&f.src;A.fullM=m&&m.src}
      else if(FULL_ART[id]){const f=await loadImg(fullUrl(id));A.full=f&&f.src}
    }
    ARTS[id]=A;
  }));
}
// fps: 대기 루프 8fps. 8장 이상 동작 스트립(16칸 시트)은 playSprite가 16fps로 재생
function spriteImg(s,once,fps=8){
  const n=s.frames;
  return `<img src="${s.src}" alt="" draggable="false" style="width:${n*100}%;--spr-end:${-100*(n-1)/n}%;${n>1?`animation-duration:${(n/fps).toFixed(2)}s;animation-timing-function:steps(${n},jump-none);${once?'animation-iteration-count:1;animation-fill-mode:forwards;':''}`:'animation:none;'}">`;
}
function partySVG(id){
  const c=CH[id].color;
  return `<svg class="ph" viewBox="0 0 100 125"><defs><linearGradient id="pg-${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity=".2"/></linearGradient></defs>
    <circle cx="50" cy="26" r="17" fill="url(#pg-${id})"/><path d="M20 124 L28 62 Q50 44 72 62 L80 124Z" fill="url(#pg-${id})"/>
    <text x="50" y="98" text-anchor="middle" font-size="24" font-weight="900" fill="#111">${CH[id].ini}</text></svg>`;
}
function enemySVG(id,uid){
  const d=EN[id];const c=EL[d.el];const k=d.boss?14:d.elite?11:8;let pts='';
  for(let i=0;i<k*2;i++){const a=Math.PI*i/k-Math.PI/2;const r=i%2?30:(d.boss?46:42);pts+=`${50+Math.cos(a)*r},${54+Math.sin(a)*r} `}
  return `<svg class="ph" viewBox="0 0 100 104"><defs><radialGradient id="eg${uid}"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".3" stop-color="${c}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs>
    <circle cx="50" cy="54" r="48" fill="url(#eg${uid})" opacity=".45"/>
    <polygon points="${pts}" fill="#0b0f1d" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/>
    <circle cx="50" cy="54" r="22" fill="none" stroke="${c}" stroke-opacity=".4"/>
    <text x="50" y="64" text-anchor="middle" font-size="${d.boss?30:26}" fill="${c}">${d.sym}</text></svg>`;
}
function figHTML(id,uid){
  const a=artOf(id);
  if(a.idle)return `<div class="sprite" data-art="${artKey(id)}">${spriteImg(a.idle)}</div>`;
  const full=!uid&&(id==='rov'?(ROVER_SKIN==='M'?a.fullM:a.fullF):a.full);
  if(full)return `<div class="full"><img src="${full}" referrerpolicy="no-referrer" alt="" draggable="false"></div>`;
  if(a.portrait&&uid)return `<div class="eimg"><img src="${a.portrait}" referrerpolicy="no-referrer" alt=""></div>`;
  if(a.portrait)return `<div class="stand"><img src="${a.portrait}" referrerpolicy="no-referrer" alt=""><i></i></div>`;
  return uid?enemySVG(id,uid):partySVG(id);
}
function artStyle(owner){
  const a=artOf(owner);
  if(a.portrait)return `background-image:url('${a.portrait}');background-size:cover;background-position:50% 28%`;
  if(a.idle)return `background-image:url('${a.idle.src}');background-size:${a.idle.frames*100*1.0}% auto;background-position:0 20%;image-rendering:pixelated`;
  return '';
}

/* ============ 연출 ============ */
const $=s=>document.querySelector(s);
let FXQ=[],AQ=[],FXDELAY=0;
function pop(target,text,cls){FXQ.push({target:typeof target==='string'?target:'e'+target.uid,text,cls,delay:FXDELAY})}
function anim(key,cls,delay){AQ.push({key,cls,delay:delay??0})}
const ACLS=['atk','jab','hit','cast','ult','block','enter'];
const MOTION_STATE={atk:'attack',jab:'attack',hit:'hit',cast:'cast',ult:'ultimate',block:'guard',enter:'cast'};
function resetSprite(sp,id){
  if(!sp.isConnected)return;
  const art=artOf(id),down=sp.closest('.down,.dead');
  sp.dataset.art=artKey(id);delete sp.dataset.motion;
  sp.innerHTML=spriteImg(down&&art.hit?art.hit:art.idle,!!down);
  if(down){const img=sp.firstElementChild;img.style.animation='none';img.style.transform='translateX(-25%)'}
}
function playSprite(sp,id,state){
  const art=artOf(id),strip=art[state]||(state==='ultimate'?art.cast:state==='guard'?art.cast:null);
  if(!strip||!art.idle)return;
  clearTimeout(sp._restore);sp.dataset.motion=state;sp.dataset.art=artKey(id);
  const fps=strip.frames>=8?16:8;sp.innerHTML=spriteImg(strip,true,fps);
  sp._restore=setTimeout(()=>resetSprite(sp,id),strip.frames/fps*1000);
}
function bodyOf(key){return key.startsWith('u-')?document.querySelector(`#${key} .body`):document.querySelector(`#e-${key.slice(1)} .body`)}
function flushFx(){
  const vq=VQ;VQ=[];vq.forEach(v=>setTimeout(()=>runVfx(v),v.delay||0));
  const layer=$('#fx');const fq=FXQ;FXQ=[];const aq=AQ;AQ=[];
  const per={};
  fq.forEach(f=>{const k=per[f.target]=(per[f.target]||0)+1;setTimeout(()=>{
    let el=document.querySelector(`[data-fx="${f.target}"]`);
    if(!el&&S&&S.c)el=document.querySelector(`[data-fx="p-${S.c.active}"]`);
    if(!el)return;const r=el.getBoundingClientRect();const s=document.createElement('div');
    s.className='pop '+f.cls;s.textContent=f.text;
    s.style.left=(r.left+r.width/2+((k%3)-1)*22)+'px';s.style.top=(r.top+r.height*.28-(k>1?(k-1)*6:0))+'px';
    if(f.cls==='dmg'){const n=parseInt(f.text.slice(1))||0;s.style.fontSize=Math.min(56,20+n*1.2)+'px';s.style.setProperty('--dx',((k%2?1:-1)*(20+Math.random()*30))+'px');const st=$('#stage');if(st&&n>=8){const k2=n>=18?'shake2':'shake';st.classList.remove('shake','shake2');void st.offsetWidth;st.classList.add(k2)}}
    layer.appendChild(s);setTimeout(()=>s.remove(),950)},f.delay+(k-1)*90)});
  aq.forEach(a=>setTimeout(()=>{
    const el=bodyOf(a.key);if(!el)return;
    el.classList.remove(...ACLS);void el.offsetWidth;el.classList.add(a.cls);
    // 공격 잔상(반투명 복제 3장)은 뺐다: 움직임 시트 전체가 복제돼 화면에 흩어졌고, 도트 규칙(잔상 금지)과도 안 맞음
    const done=e=>{if(e.target!==el)return;el.classList.remove(a.cls);el.removeEventListener('animationend',done)};
    el.addEventListener('animationend',done);
    // 공격 스프라이트가 있으면 한 번 재생
    const id=a.key.startsWith('u-')?a.key.slice(2):(S.c&&(S.c.enemies.find(e=>'e'+e.uid===a.key)||{}).id);
    const sp=el.querySelector('.sprite');
    if(sp&&MOTION_STATE[a.cls])playSprite(sp,id,MOTION_STATE[a.cls]);
  },a.delay));
}
let VQ=[],HITSEQ=0;
const FXFILE={회절:'spectro',용융:'fusion',응결:'glacio',전도:'electro',기류:'aero',인멸:'havoc'};
const WEAPON={rov:'sword',aem:'sword',sk:'orb',lyn:'shot',mor:'heavy',chi:'heavy',cam:'sword',hiy:'sword'};
function vfx(type,key,o,delay){VQ.push({type,key,o:o||{},delay:delay??FXDELAY})}
function centerOf(key){const el=bodyOf(key);if(!el)return null;const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height*.45,w:r.width,h:r.height,b:r.bottom}}
function fxEl(html,cls,x,y,style,life){const d=document.createElement('div');d.className='vfx '+cls;d.innerHTML=html;d.style.left=x+'px';d.style.top=y+'px';if(style)d.setAttribute('style',d.getAttribute('style')+';'+style);$('#fx').appendChild(d);setTimeout(()=>d.remove(),life||700);return d}
function sparks(x,y,c,n,spread){for(let i=0;i<n;i++){const a=Math.random()*Math.PI*2,r=spread*(.5+Math.random()*.7);fxEl('','spark',x,y,`--c:${c};--dx:${Math.cos(a)*r}px;--dy:${Math.sin(a)*r}px`,600)}}
function runVfx(v){
  const t=centerOf(v.key);if(!t)return;const c=v.o.c||'#fff';const S0=Math.max(90,t.w*(v.o.big?1.3:1));
  // 속성 도트 임팩트(scripts/make-vfx.cjs). 64px 시트를 1·2배 × 화면 배율(--k)로 키운다
  if(FXFILE[v.o.el])fxEl('','pfx',t.x,t.y,`background-image:url('assets/fx/${FXFILE[v.o.el]}.png');--s:${v.o.big?128:64}px`,480);
  if(v.type==='sword'||v.type==='heavy'){
    const n=v.type==='heavy'?1:(Math.random()<.5?1:2);
    // 도트 칼베기(CC0 tbbk, make-vfx.cjs가 속성색으로 칠함). 도트라 회전 대신 뒤집기만, 크기는 정수 배율
    const sf=FXFILE[v.o.el]||'spectro',z=v.type==='heavy'||v.o.big?4:3,fx=Math.random()<.5?-1:1;
    for(let i=0;i<n;i++)fxEl('','pslash',t.x,t.y,`background-image:url('assets/fx/slash_${sf}.png');--z:${z};--fx:${i?-fx:fx};--fy:${i?-1:1};animation-delay:${i*70}ms`,420+i*70);
    if(v.type==='heavy')fxEl('','ring',t.x,t.y,`--c:${c};--s:${S0*1.3}px`,600);
    sparks(t.x,t.y,c,v.o.big?7:4,S0*.55);
  }else if(v.type==='shot'){
    const f=centerOf(v.o.from);
    if(f){const dx=t.x-f.x,dy=t.y-f.y;fxEl('','tracer',f.x+f.w*.3,f.y,`--c:${c};width:${Math.hypot(dx,dy)-f.w*.3}px;--a:${Math.atan2(dy,dx)}rad`,350)}
    if(!FXFILE[v.o.el])fxEl('','ring',t.x,t.y,`--c:${c};--s:${S0*.6}px`,450);sparks(t.x,t.y,c,4,S0*.4);
  }else if(v.type==='orb'){
    if(!FXFILE[v.o.el])fxEl('','ring',t.x,t.y,`--c:${c};--s:${S0}px`,600);sparks(t.x,t.y,c,5,S0*.5);
  }else if(v.type==='burst'){
    if(!FXFILE[v.o.el])fxEl('','ring',t.x,t.y,`--c:${c};--s:${S0*.7}px`,500);sparks(t.x,t.y,c,4,S0*.35);
  }else if(v.type==='claw'){
    // 적 공격도 도트 칼베기 두 겹(적 속성색, 물리는 회절 시트). 예전 SVG 할퀴기 대체
    const sf=FXFILE[v.o.el]||'spectro',z=v.o.big?4:3,fx=Math.random()<.5?-1:1;
    for(let i=0;i<2;i++)fxEl('','pslash',t.x,t.y,`background-image:url('assets/fx/slash_${sf}.png');--z:${z};--fx:${i?-fx:fx};--fy:${i?-1:1};animation-delay:${i*60}ms`,420+i*60);
    sparks(t.x,t.y,c,v.o.big?5:3,S0*.4);
  }else if(v.type==='shield'){
    fxEl(`<svg viewBox="0 0 100 100"><polygon points="50,4 92,27 92,73 50,96 8,73 8,27" fill="rgba(111,182,255,.18)" stroke="#8cc8ff" stroke-width="3"/></svg>`,'shield',t.x,t.y,`--s:${t.w*1.25}px`,650);
  }else if(v.type==='circle'){
    fxEl(`<svg viewBox="0 0 100 40"><ellipse cx="50" cy="20" rx="46" ry="15" fill="none" stroke="${c}" stroke-width="2.5" stroke-dasharray="6 5"/><ellipse cx="50" cy="20" rx="32" ry="10" fill="none" stroke="${c}" stroke-width="1.5"/></svg>`,'magic',t.x,t.b-4,`--s:${t.w*1.4}px`,800);
  }else if(v.type==='death'){
    fxEl('','ring',t.x,t.y,`--c:${c};--s:${S0*1.8}px`,700);fxEl('','ring',t.x,t.y,`--c:#fff;--s:${S0*1.1}px`,500);
    for(let i=0;i<10;i++){const a=-Math.PI/2+(Math.random()-.5)*2.4,r=S0*(.5+Math.random()*.9);fxEl('','spark',t.x+(Math.random()-.5)*t.w*.5,t.y,`--c:${i%3?c:'#fff'};--dx:${Math.cos(a)*r*.6}px;--dy:${Math.sin(a)*r}px`,700)}
  }else if(v.type==='heal'){
    for(let i=0;i<5;i++)fxEl('+','plus',t.x+(Math.random()-.5)*t.w*.7,t.y+(Math.random()-.2)*t.h*.4,`animation-delay:${i*80}ms`,1000);
  }
}
function cutIn(id){sfx('ult');
  const C=CH[id];const name=C.lib.split(':')[0].replace('공명 해방 ','');
  const a=artOf(id);const img=a.portrait?`background-image:url('${a.portrait}')`:'';
  const d=document.createElement('div');d.className='cutin';d.style.setProperty('--c',C.color);
  d.innerHTML=`<div class="band"></div><div class="img" style="${img}">${img?'':C.ini}</div><div class="txt"><small>${C.name}</small><b>${name}</b><i>RESONANCE LIBERATION</i></div>`;
  document.body.appendChild(d);setTimeout(()=>d.remove(),1260);
  const st=$('#stage');if(st){st.classList.remove('shake');void st.offsetWidth;setTimeout(()=>st.classList.add('shake'),850)}
}
// 해방이 끝날 때 툭 끊기지 않게: 충격파 → 잔광 → 떠오르는 입자로 1.6초 여운
function libFinale(id){if(window.FAST)return;
  const c=CH[id].color,st=$('#stage'),r=st?st.getBoundingClientRect():{left:0,top:0,width:innerWidth,height:innerHeight};
  const x=r.left+r.width*.62,y=r.top+r.height*.45;flash(c);
  [0,140].forEach(t=>setTimeout(()=>{const w=document.createElement('div');w.className='libwave';w.style.cssText=`left:${x}px;top:${y}px;--c:${t?'#fff':c}`;document.body.appendChild(w);setTimeout(()=>w.remove(),920)},t));
  const g=document.createElement('div');g.className='afterglow';g.style.setProperty('--c',c);document.body.appendChild(g);setTimeout(()=>g.remove(),1620);
  for(let i=0;i<28;i++){const m=document.createElement('div');m.className='libmote';m.style.cssText=`left:${r.left+Math.random()*r.width}px;top:${r.top+r.height*(.4+Math.random()*.6)}px;--c:${c};--dx:${(Math.random()-.5)*60}px;--dy:${-80-Math.random()*160}px;animation-delay:${Math.random()*300}ms`;document.body.appendChild(m);setTimeout(()=>m.remove(),1950)}
  if(st){st.classList.remove('shake','shake2');void st.offsetWidth;st.classList.add('shake2')}
}
function ghost(body,op){
  const img=body.querySelector('.fig img, .fig svg');if(!img||!img.isConnected)return;const r=img.getBoundingClientRect();
  const g=img.cloneNode(true);g.className='ghost';Object.assign(g.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',opacity:op});
  $('#fx').appendChild(g);g.animate([{opacity:op},{opacity:0}],{duration:260,fill:'forwards'});setTimeout(()=>g.remove(),280);
}
function banner(t){const b=document.createElement('div');b.className='banner';b.textContent=t;document.body.appendChild(b);setTimeout(()=>b.remove(),1150)}
function flyCard(uid,T){
  const el=document.querySelector(`[data-card="${uid}"]`);if(!el)return;
  const r=el.getBoundingClientRect();const cl=el.cloneNode(true);cl.classList.add('flycard');cl.removeAttribute('onclick');
  cl.style.left=r.left+'px';cl.style.top=r.top+'px';cl.style.width=r.width+'px';cl.style.height=r.height+'px';cl.style.transform='none';
  $('#fx').appendChild(cl);
  let tx=window.innerWidth/2,ty=window.innerHeight*.4;
  const tb=T?bodyOf('e'+T.uid):null;const st=$('#stage');
  if(tb){const b=tb.getBoundingClientRect();tx=b.left+b.width/2;ty=b.top+b.height/2}else if(st){const b=st.getBoundingClientRect();tx=b.left+b.width*.45;ty=b.top+b.height*.4}
  requestAnimationFrame(()=>{cl.style.transform=`translate(${tx-r.left-r.width/2}px,${ty-r.top-r.height/2}px) scale(.35) rotate(${T?12:-8}deg)`;cl.style.opacity='0'});
  setTimeout(()=>cl.remove(),360);
}

