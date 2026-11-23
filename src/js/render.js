/* ============ 렌더 ============ */
const cardArt=id=>`assets/cards/${id}.png`;
/* 새 카드용 오리지널 문양 일러스트(SVG, 카드 id로 결정적 생성) */
function procArt(id){
  let h=2166136261;for(const ch of id)h=Math.imul(h^ch.charCodeAt(0),16777619)>>>0;const r=k=>((h>>>(k*4))&15)/15;
  const d=CD[id]||{};const base={공격:350,스킬:215,파워:45}[d.t]??240;const hue=(base+Math.round((r(0)-.5)*50)+360)%360;
  const A=`hsl(${hue} 60% 12%)`,B=`hsl(${hue} 80% 62%)`,C=`hsl(${(hue+40)%360} 90% 78%)`;
  const cx=40+r(1)*20,cy=34+r(2)*12,rot=Math.round(r(3)*90);const m=h%6;let art='';
  const star=(n,R1,R2)=>{let p='';for(let i=0;i<n*2;i++){const a=Math.PI*i/n,R=i%2?R2:R1;p+=`${cx+Math.cos(a)*R},${cy+Math.sin(a)*R} `}return `<polygon points='${p}' transform='rotate(${rot} ${cx} ${cy})' fill='${A}' fill-opacity='.75' stroke='${B}' stroke-width='1.6'/>`};
  if(m===0)art=star(5+Math.round(r(4)*4),32,14);
  else if(m===1)art=[30,22,14,7].map((R,i)=>`<circle cx='${cx}' cy='${cy}' r='${R}' fill='none' stroke='${i%2?C:B}' stroke-width='${i?1.4:2.4}' stroke-dasharray='${i%2?'2 3':'none'}'/>`).join('');
  else if(m===2)art=`<path d='M${cx-26} ${cy+14} A30 30 0 1 1 ${cx+26} ${cy+14} A22 22 0 1 0 ${cx-26} ${cy+14}Z' fill='${B}' fill-opacity='.85' transform='rotate(${rot} ${cx} ${cy})'/>`;
  else if(m===3)art=Array.from({length:5},(_,i)=>`<path d='M0 ${18+i*11} Q25 ${8+i*11+r(i)*12} 50 ${18+i*11} T100 ${18+i*11}' fill='none' stroke='${i%2?C:B}' stroke-width='${2.4-i*.3}' stroke-opacity='.85'/>`).join('');
  else if(m===4)art=[[0,-20],[18,0],[0,20],[-18,0],[0,0]].map(([x,y],i)=>`<rect x='${cx+x-7}' y='${cy+y-7}' width='14' height='14' transform='rotate(45 ${cx+x} ${cy+y})' fill='${i===4?C:A}' stroke='${B}' stroke-width='1.4'/>`).join('');
  else art=Array.from({length:7},(_,i)=>{const a=i*0.9+r(5)*3,L=18+r(i)*20;return `<line x1='${cx}' y1='${cy}' x2='${cx+Math.cos(a)*L}' y2='${cy+Math.sin(a)*L}' stroke='${i%2?C:B}' stroke-width='2.4' stroke-linecap='round'/>`}).join('')+`<circle cx='${cx}' cy='${cy}' r='6' fill='${C}'/>`;
  const glyph=d.c==='X'?'X':d.ret?'⟲':d.duo?'✦ ✦':'';
  const sparks=Array.from({length:6},(_,i)=>`<circle cx='${(r(i)*97+i*13)%100}' cy='${(r(i+1)*71+i*11)%80}' r='${.6+r(i+2)}' fill='${C}' fill-opacity='.7'/>`).join('');
  const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 80'><defs><radialGradient id='g' cx='${cx/100}' cy='${cy/80}'><stop offset='0' stop-color='${B}' stop-opacity='.55'/><stop offset='1' stop-color='${A}'/></radialGradient></defs>
    <rect width='100' height='80' fill='url(#g)'/>${sparks}${art}<text x='94' y='74' text-anchor='end' font-size='10' font-weight='800' fill='${C}'>${glyph}</text></svg>`;
  return 'data:image/svg+xml;utf8,'+encodeURIComponent(svg);
}
const TYPESYM={공격:'⚔',스킬:'◈',파워:'✦',저주:'✕',상태:'⚠'};
const KW={
  '용융 폭발':'용융 공명자의 공격으로 쌓여요. 4가 되면 터져서 그 적에게 12, 다른 적에게 4 피해.',
  '속성 이상':'공격 카드를 쓰면 출전 공명자 속성의 상태가 대상에게 쌓여요. 회절 → 회절 잔향, 인멸 → 해체, 용융 → 용융 폭발, 응결 → 서리.',
  '서리':'응결 공명자의 공격으로 쌓여요. 4가 되면 빙결: 그 적에게 8 피해, 다음 행동을 건너뛰고 받는 피해 +50%.',
  '완벽 회피':'적 공격을 보호막으로 전부 막으면 완벽 회피! 그 적에게 반격 3 피해 + 협주 에너지 +1 (턴당 3번까지).',
  '소나타':'같은 속성 에코를 2개 모으면 2세트, 4개면 4세트 효과. 상단 속성 칩에 마우스를 올리면 보여요.',
  '카드 조합':'한 턴에 쓴 카드 종류(공=공격, 스=스킬) 3장의 순서가 레시피와 맞으면 추가 효과가 터져요. 두 공명자 이상의 카드가 섞이면 합주로 효과 ×1.5.',
  '번뜩임':'손패에서 빛나는 카드를 쓰면 효과 3개 중 하나를 골라 그 카드를 영구히 바꿔요(전투당 1번, 카드당 1번).',
  '병합':'손에 같은 카드가 2장 있으면 하나로 합쳐 「융합」 카드로 만들어요. 수치 ×1.5, 비용 그대로. 남은 한 장은 이번 전투에서 소멸해요.',
  '치명타':'공격 타격마다 8% 확률로 피해 ×1.75. 조수 룰렛 「행운의 물결」이나 에코로 확률이 오를 수 있어요.',
  '조수 룰렛':'2턴부터 매 턴 시작 때 조수가 굴러요. 해류·만조·역류·소용돌이… 드물게 ★황금 조수 잭팟!',
  '변이':'가끔 잔상이 변이(황금·거대·재생·광폭·결정 껍질·불안정)를 띠고 나타나요. 황금은 화폐, 불안정은 폭발!',
  '보호막':'적의 공격 피해를 먼저 막아요. 내 턴이 시작되면 사라져요.',
  '취약':'받는 공격 피해가 50% 늘어나요. 턴마다 1씩 줄어요.',
  '약화':'주는 공격 피해가 25% 줄어요. 턴마다 1씩 줄어요.',
  '힘':'공격할 때마다 피해가 그만큼 늘어나요.',
  '회절 잔향':'적의 턴이 시작될 때 수치만큼 방어를 무시하는 피해를 입고 1 줄어요.',
  '해체':'공격받을 때마다(타격마다) 수치만큼 추가 피해를 입어요. 턴마다 1씩 줄어요.',
  '증폭':'주는 피해가 30% 늘어나요. 턴마다 1씩 줄어요.',
  '별의 영역':'턴 시작 시 보호막을 얻고 출전 공명자가 체력 2를 회복해요.',
  '색채':'린네 전용. 색채 2마다 린네의 공격 피해 +1. 일부 카드와 해방이 소모해요.',
  '개화':'카멜리아 전용. 수치만큼 카멜리아의 공격 피해가 늘어나요.',
  '메카스카우트':'에이메스가 메카스카우트 형태일 때 공격 피해 +3.',
  '소멸':'사용하면 이번 전투 동안 덱에서 사라져요.',
  '파워':'사용하면 이번 전투 동안 효과가 계속돼요.',
  '협주 에너지':'카드를 쓰면 1 차요. 3칸이 찬 채 교체하면 협주 → 변주 스킬이 발동해요.',
  '공명 해방':'카드를 쓰면 게이지가 차요. 5칸이 차면 필살기를 쓸 수 있어요.',
  '잡음':'적이 덱에 넣는 상태이상. 사용할 수 없고, 턴 종료 시 손에 있으면 소멸해요.',
  '오염':'적이 덱에 넣는 상태이상. 턴 종료 시 손에 있으면 출전 공명자가 피해 3을 입어요.',
  '공진':'공격할 때마다 적의 진동 게이지(노란 바)가 차요. 협주→변주·공명 해방은 크게 채워요. 가득 차면 공진 파괴: 다음 행동을 건너뛰고 받는 피해 +50%.',
  '보존':'턴이 끝나도 버려지지 않고 손에 남아요.',
  'X 비용':'남은 에너지를 모두 써요. 쓴 에너지(X)만큼 효과가 커져요.',
  '관측':'덱 위 카드를 확인하고 쓸 수 없는 카드(상태이상·저주)를 버려요.',
  '연계':'이번 턴에 다른 공명자의 카드를 먼저 썼다면 추가 효과가 생겨요.',
  '합주':'두 공명자가 함께 쓰는 카드. 둘 다 파티에 있고 쓰러지지 않아야 써요. 대기 비용이 붙지 않아요.',
  '대기 +1':'출전 중이 아닌 공명자의 카드는 비용이 1 늘어나요.',
};
function kwTip(text){const ks=Object.keys(KW).filter(k=>text.includes(k));return ks.map(k=>`<b>${k}</b><br>${KW[k]}`).join('<hr>')}
const tipAttr=t=>t?` data-tip="${t.replace(/"/g,'&quot;')}"`:'';
function stc(label,color,key,extra){return `<span class="st" style="color:${color||'inherit'}"${tipAttr(`<b>${key||label}</b><br>${extra||KW[key||label.replace(/ [+-]?\d+$/,'')]||''}`)}>${label}</span>`}
function cardHTML(card,o={}){
  const d=CD[card.id];const col=d.o==='any'?'var(--any)':CH[d.o].color;
  const inCombat=o.combat;const cost=inCombat?costOf(card):typeof d.c==='string'?d.c:Math.max(0,(Array.isArray(d.c)?d.c[card.up?1:0]:d.c)-(card.ep==='light'?1:0));
  const waiting=inCombat&&d.o!=='any'&&d.o!==S.c.active;
  const off=inCombat&&!canPlay(card);
  const sel=inCombat&&S.c.tgt&&S.c.tgt.uid===card.uid;
  const tipText=kwTip(cardText(card)+(d.ex?' 소멸':'')+(d.pw?' 파워':'')+(waiting?' 대기 +1':''));
  const canMerge=inCombat&&!S.c.busy&&mergeable(card)&&S.c.hand.find(x=>x.id===card.id&&!x.fu&&x.up===card.up)===card;
  return `<div class="card t-${d.t} ${d.r?'rare':''} ${off?'off':''} ${sel?'sel':''} ${card.fu?'fused':''} ${inCombat&&S.c.epiUid===card.uid?'epi':''}" data-card="${card.uid}"${tipAttr(tipText)} style="--c:${col};${o.style||''}" ${o.click?`onclick="${o.click}"`:''} ${o.down?`onpointerdown="${o.down}"`:''}>
    ${d.unplay?'':`<div class="cost ${waiting?'up':''}">${cost}</div>`}
    ${waiting?'<div class="wait">대기 +1</div>':''}
    <div class="nm ${card.up?'u':''}">${card.fu?'융합 ':''}${d.n}${card.up?'+':''}</div>
    ${canMerge?`<button class="mergeb" aria-label="병합" data-tip="<b>카드 병합</b><br>${KW['병합']}" onpointerdown="event.stopPropagation()" onclick="event.stopPropagation();mergeCard(${card.uid})">⧉ 병합 <small>M</small></button>`:''}
    ${o.hk?`<div class="hk">${o.hk}</div>`:''}
    ${card.ench?`<div class="ench" style="--e:${ENCH[card.ench].c}"${tipAttr(`<b>인챈트 · ${ENCH[card.ench].n}</b><br>${ENCH[card.ench].tx}`)}>✦ ${ENCH[card.ench].n}</div>`:''}
    <div class="art pixel-card"><img src="${cardArt(card.id)}" alt="" draggable="false" onerror="this.onerror=null;this.src=procArt('${card.id}');this.style.imageRendering='auto'"></div>
    <div class="ty">${d.t}${d.r?' · 희귀':''}${d.ex?' · 소멸':''}</div>
    <div class="tx">${cardText(card)}</div>
    <div class="ow">${d.duo?d.duo.map(x=>CH[x].name).join(' + '):d.o==='any'?'공용':CH[d.o].name}${inCombat&&d.o!=='any'&&S.party[d.o].down?' (기절)':''}</div>
  </div>`;
}
function topBar(){
  return `<div class="top">
    <b>${AV().name}</b><span class="chip">층 ${S.floor}</span>
    ${T_().map(id=>{const p=S.party[id];return `<span class="chip"><span class="dot" style="background:${CH[id].color}"></span>${CH[id].name} ${p.down?'<span style="color:var(--red)">기절</span>':`${p.hp}/${p.maxHp}`}</span>`}).join('')}
    <span class="chip" style="color:var(--gold)">◎ ${S.gold}</span>
    <span class="grow"></span>
    <span class="pots">${Array.from({length:potSlots()},(_,i)=>{const k=(S.potions||[])[i];return k?`<button class="pot" style="--c:${POT[k].c}" aria-label="${POT[k].n}"${tipAttr(`<b>${POT[k].n}</b><br>${POT[k].tx}<br><small>${S.screen==='combat'?'클릭: 사용 · 우클릭: 버리기':'전투 중에만 사용 · 우클릭: 버리기'}</small>`)} onclick="usePotion(${i})" oncontextmenu="event.preventDefault();dropPotion(${i})">${POT[k].i}</button>`:`<span class="pot empty" aria-label="빈 약제 슬롯"></span>`}).join('')}</span>
    <span class="chip" style="color:#ff9ab0">${DF().n}${S.asc?` · 승천 ${S.asc}`:''}</span>
    ${S.screen!=='map'?`<button class="btn" style="padding:5px 12px" onclick="showMap()">지도</button>`:''}
    <button class="btn" style="padding:5px 12px" onclick="showDeck()">덱 ${S.deck.length}</button>
    <button class="btn" style="padding:5px 12px" title="일시정지" onclick="openPause()">☰</button>
    ${S.echoes.length?`<div class="relics">${S.echoes.map(e=>`<span class="relic ${S.mainEcho===e?'main':''}" ${ECHO_SKILL[e]?`onclick="equipEcho('${e}')"`:''}${tipAttr(`<b>${ECHO[e].n}</b> <span style="color:${EL[echoEl(e)]||'#ccc'}">${echoEl(e)||''}</span><br>${ECHO[e].tx}${ECHO_SKILL[e]?`<hr><b>에코 스킬 · ${ECHO_SKILL[e].n}</b> (쿨다운 ${ECHO_SKILL[e].cd}턴)<br>${ECHO_SKILL[e].tx}<br>${S.mainEcho===e?'주 에코로 장착 중':'클릭해서 주 에코로 장착'}`:''}`)}>${ECHO[e].i}</span>`).join('')}<div class="sonatas">${Object.keys(SONATA).filter(el=>sonata(el)).map(el=>{const n=sonata(el),z=SONATA[el];return `<span class="sona ${n>=2?'on':''}" style="--c:${EL[el]}"${tipAttr(`<b>${z.n}</b> (${el} 에코 ${n}개)<br>${n>=2?'✔':'○'} 2세트: ${z.t2}<br>${n>=4?'✔':'○'} 4세트: ${z.t4}`)}>${el} ${n}</span>`}).join('')}</div></div>`:''}
  </div>`;
}
function render(){
  const app=$('#app');
  if(!$('#screen'))app.innerHTML='<div id="topbar"></div><div id="screen"></div><div id="modal"></div>';
  $('#topbar').innerHTML=S?topBar():'';document.body.classList.toggle('incombat',!!S&&S.screen==='combat');
  const scr=$('#screen');
  if(!S)scr.innerHTML=MENU==='select'?selectHTML():MENU==='help'?helpHTML():MENU==='records'?recordsHTML():titleHTML();
  else if(S.screen==='combat'){const cur=scr.querySelector('.combat');if(!cur||cur.dataset.cid!=S.c.id||S.c.rebuild){HAND_SEEN=cur&&cur.dataset.cid==S.c.id?new Set(S.c.hand.map(x=>x.uid)):new Set();scr.innerHTML=buildCombat();S.c.rebuild=false}updateCombat()}
  else scr.innerHTML={map:mapHTML,ancient:ancientHTML,recruit:recruitHTML,reward:rewardHTML,event:eventHTML,rest:restHTML,shop:shopHTML,msg:msgHTML,over:overHTML,win:winHTML}[S.screen]();
  $('#modal').innerHTML=S&&S.modal?modalHTML():'';
  if(S&&S.screen==='map')saveRun();
  if(S&&S.screen==='map'){const cur=document.querySelector('.mnode.avail,.mboss.avail');if(cur&&!S._scrolled){cur.scrollIntoView({block:'center'});S._scrolled=true}}
  requestAnimationFrame(flushFx);
  playBgm();
}
let MENU='title';
const SAVE_KEY='wuwa-spire-save-v3'; // 지도에 있을 때마다 자동 저장. 전투 중 나가면 직전 지도부터 이어함
function saveRun(){try{const o={...S,c:null,ev:null,modal:null,reward:null,shop:null,screen:'map'};localStorage.setItem(SAVE_KEY,JSON.stringify(o))}catch(e){}}
function loadSave(){try{const t=localStorage.getItem(SAVE_KEY);return t?JSON.parse(t):null}catch(e){return null}}
function clearSave(){try{localStorage.removeItem(SAVE_KEY)}catch(e){}}
function continueRun(){const o=loadSave();if(!o)return;S=o;S.potions=S.potions||[];S.screen='map';S._scrolled=false;UID=Math.max(UID,...S.deck.map(c=>c.uid))+1;render()}
function goMenu(m){S=null;MENU=m;render();window.scrollTo(0,0)}
function saveQuit(){if(S&&S.screen==='map')saveRun();goMenu('title')}
function toTitle(){
  if(S&&!['over','win'].includes(S.screen)){if(!confirm('이번 판을 포기할까요? 저장된 진행이 사라져요.'))return;addRecord('quit')}
  clearSave();goMenu('title');
}
const IS_APP=/Electron/.test(navigator.userAgent);
function openPause(){if(!S)return;S.modal={kind:'pause'};render()}
function quitGame(){if(S&&S.screen==='map')saveRun();window.close()}
addEventListener('keydown',e=>{
  if(S&&S.modal&&S.modal.kind==='epi'&&S.modal.opts[e.key-1]){pickEpiphany(S.modal.opts[e.key-1]);return}
  if(e.key!=='Escape'||DRAG)return;
  if(S&&S.modal){closeModal();return}
  if(S)openPause();
});
function toggleFS(){try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}}
function titleHTML(){
  const sv=loadSave();
  const motes=Array.from({length:22},(_,i)=>`<i class="mote" style="left:${(i*47)%100}%;bottom:${(i*17)%60}%;animation-delay:${(i*.41)%7}s;background:${i%3?'#bfe6ff':'#ffe9a8'}"></i>`).join('');
  return `<div class="titlescr">${battleBackground('title')}${motes}
    <div class="t-logo"><div class="t-sub">WUTHERING WAVES · FAN-MADE DECKBUILDER</div><h1>첨탑의 메아리</h1><div class="t-en">Echoes of the Spire</div></div>
    <div class="t-menu">
      ${sv?`<button class="main" onclick="continueRun()">이어하기<small>${ACTS[sv.act].name} · ${sv.floor}층 · ${sv.team.map(id=>CH[id].name).join(', ')}</small></button>`:''}
      <button class="${sv?'':'main'}" onclick="${sv?`if(confirm('새 게임을 시작하면 저장된 진행이 사라져요. 계속할까요?')){clearSave();goMenu('select')}`:`goMenu('select')`}">새 게임</button>
      ${MP.role?'':`<button onclick="mpHostStart()">멀티 · 방 만들기<small>같은 와이파이 친구와 협동</small></button><button onclick="mpJoin()">멀티 · 참가</button>`}
      <button onclick="goMenu('help')">플레이 방법</button>
      <button onclick="goMenu('records')">게임 기록</button>
      <button onclick="toggleFS()">전체 화면</button>
      <button onclick="toggleRover()">방랑자 외형: ${ROVER_SKIN==='M'?'남성':'여성'}</button>
      ${IS_APP?`<button onclick="quitGame()">게임 종료</button>`:''}
    </div>
    <div class="t-foot">개인용 팬메이드 프로토타입 · 명조: 워더링 웨이브와 모든 캐릭터의 권리는 Kuro Games에 있습니다</div>
  </div>`;
}
function charCardHTML(id,click,label){
  const C=CH[id];const art=ARTS[id]&&(ARTS[id].portrait||ARTS[id].idle);
  return `<div class="pi sel" style="--c:${C.color}" onclick="${click}">
    <div class="av" style="background:${C.color};${artStyle(id)}">${art?'':C.ini}</div>
    <div><b>${C.name}</b> <span class="tag" style="border-color:${EL[C.el]};color:${EL[C.el]}">${C.el}</span></div>
    <div class="dim" style="font-size:12px;margin-top:3px">${C.tag}</div><p>${C.desc}</p>
    <ul class="kit"><li>${C.intro}</li><li>${C.outro}</li><li>${C.lib}</li></ul>
    <div class="pick">${label}</div></div>`;
}
// 명조식 공명자 선택: 왼쪽 목록 · 가운데 전신 도트 · 오른쪽 정보 패널
const EN_NAME={rov:'ROVER',aem:'AEMEATH',sk:'SHOREKEEPER',lyn:'LYNAE',mor:'MORNYE',chi:'CHISA',cam:'CAMELLYA',hiy:'HIYUKI'};
let SEL_HERO='rov';
function selectHTML(){
  const id=SEL_HERO,C=CH[id],a=artOf(id).idle,kit=[['변주',C.intro],['협주',C.outro],['해방',C.lib]];
  return `<div class="selscr">${battleBackground('title')}
    <div class="sel-top"><button class="btn backbtn" onclick="goMenu('title')">← 타이틀</button>
      <div class="sel-ttl"><span class="eng">RESONATOR</span><h2>공명자 선택</h2></div>
      <div class="sel-opts"><div class="diffs">${DIFF.map((x,i)=>`<button class="diff ${SEL_DIFF===i?'on':''}" onclick="SEL_DIFF=${i};render()"><b>${x.n}</b><small>${x.d}</small></button>`).join('')}</div>
      <div class="ascs"><b>승천</b>${Array.from({length:ascMax()+1},(_,i)=>`<button class="asc ${SEL_ASC===i?'on':''}" aria-label="승천 ${i}" data-tip="${i?`<b>승천 ${i}</b><br>${ASC.slice(1,i+1).join('<br>')}`:'승천 없음'}" onclick="SEL_ASC=${i};render()">${i}</button>`).join('')}</div></div></div>
    <div class="sel-body">
      <div class="sel-list" role="listbox" aria-label="공명자 목록">${ALL.map(k=>`<button class="sel-tile ${k===id?'on':''}" role="option" aria-selected="${k===id}" style="--c:${EL[CH[k].el]}" onclick="SEL_HERO='${k}';render()">
        <i class="sel-av" style="${artStyle(k)}"></i><span><b>${CH[k].name}</b><small>${CH[k].el}</small></span></button>`).join('')}</div>
      <div class="sel-stage" style="--c:${EL[C.el]}"><div class="sel-en">${EN_NAME[id]||''}</div>
        ${a?`<div class="sel-hero" style="background-image:url('${a.src}');background-size:${a.frames*100}% 100%"></div>`:`<div class="sel-hero ini">${C.ini}</div>`}</div>
      <div class="sel-info"><span class="eng">${EN_NAME[id]||''}</span>
        <div class="sel-name"><h3>${C.name}</h3><span class="sel-el" style="--c:${EL[C.el]}">◆ ${C.el}</span></div>
        <div class="sel-tag">${C.tag}</div><p>${C.desc}</p>
        <ul class="sel-kit">${kit.map(([k,t])=>`<li><b>${k}</b><span>${t.replace(/^(변주|협주|공명 해방)\s*/,'')}</span></li>`).join('')}</ul>
        <button class="btn primary sel-go" onclick="newGame('${id}')"><span class="eng">START</span>이 공명자로 시작</button>
        <small class="dim">나머지 동료는 탑을 오르며 ✚ 영입 지점과 사건에서 만나요 (최대 3명)</small></div>
    </div></div>`;
}
let REC_F='all';
function clearRecords(){if(!confirm('게임 기록을 모두 지울까요? 되돌릴 수 없어요.'))return;try{localStorage.removeItem(REC_KEY)}catch(e){}render()}
function recDate(t){const d=new Date(t),n=new Date(),day=86400000,dd=Math.floor((new Date(n.toDateString())-new Date(d.toDateString()))/day);
  const hm=d.toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});return dd===0?'오늘 '+hm:dd===1?'어제 '+hm:dd<7?dd+'일 전':d.toLocaleDateString('ko-KR',{month:'long',day:'numeric'})}
function recordsHTML(){
  const L=loadRecords(),W=L.filter(x=>x.r==='win').length,score=x=>x.act*100+x.floor,best=L.reduce((m,x)=>score(x)>score(m)?x:m,L[0]);
  const RL={win:['승리','win','🏆'],lose:['패배','lose','✖'],quit:['중단','quit','⏸']};
  const F=[['all','전체',L.length],['win','승리',W],['lose','패배',L.filter(x=>x.r==='lose').length],['quit','중단',L.filter(x=>x.r==='quit').length]];
  const V=REC_F==='all'?L:L.filter(x=>x.r===REC_F);
  const row=x=>{const[lb,cls,ic]=RL[x.r];return `<div class="rec ${cls}">
    <div class="rec-res"><span>${ic}</span><b>${lb}</b>${x===best?'<em>최고 기록</em>':''}</div>
    <div class="rec-main"><b>${x.act+1}구역 · ${x.floor}층</b><small>${ACTS[x.act]?ACTS[x.act].name.replace(/^\d구역 · /,''):''}</small></div>
    <div class="rec-team">${x.team.map(id=>`<span><i class="hp-av" style="--c:${CH[id].color};${artStyle(id)}"></i><small>${CH[id].name}</small></span>`).join('')}</div>
    <div class="rec-stat"><span>처치 <b>${x.kills}</b></span><span>덱 <b>${x.deck}</b></span><span>에코 <b>${x.echoes}</b></span></div>
    <div class="rec-meta"><span class="rec-diff d${x.d}">${(DIFF[x.d]||DIFF[0]).n}</span><small>${recDate(x.t)}</small></div></div>`};
  return `<div class="title help records">
    <div class="rec-head"><button class="btn backbtn" onclick="goMenu('title')">← 타이틀</button><h2>게임 기록</h2>
      ${L.length?`<button class="btn rec-clear" onclick="clearRecords()">기록 지우기</button>`:'<span></span>'}</div>
    <div class="rec-sum">
      <div><small>플레이</small><b>${L.length}<i>판</i></b></div>
      <div><small>승리</small><b>${W}<i>회</i></b></div>
      <div class="rate"><small>승률</small><b>${L.length?Math.round(W/L.length*100):0}<i>%</i></b><div class="bar"><i style="width:${L.length?W/L.length*100:0}%"></i></div></div>
      <div><small>최고 도달</small><b>${best?`${best.act+1}구역 ${best.floor}<i>층</i>`:'-'}</b></div></div>
    ${L.length?`<div class="rec-tabs">${F.map(([k,n,c])=>`<button class="${REC_F===k?'on':''}" onclick="REC_F='${k}';render()">${n} <small>${c}</small></button>`).join('')}</div>
      <div class="rec-list">${V.length?V.map(row).join(''):'<p class="dim rec-none">이 조건의 기록이 없어요.</p>'}</div>`
    :`<div class="rec-empty"><div>🗼</div><b>아직 기록이 없어요</b><p class="dim">탑에 올라 첫 기록을 남겨 보세요. 승리·패배·중단한 판이 모두 여기에 쌓여요.</p><button class="btn main" onclick="goMenu('select')">새 게임 시작</button></div>`}
  </div>`;
}
function helpHTML(){
  const demo=mk('rov_s');const dc=cardHTML(demo).replace('class="card','class="card demo');
  const node=k=>`<div class="lg" style="--c:${NODE[k].c}"><i><svg viewBox="0 0 24 24">${NODE_SVG[k]}</svg>${nodeImg(k)}</i><b>${NODE[k].l}</b><span>${NODE_TIP[k]}</span></div>`;
  const tile=id=>`<div class="hp-av" style="--c:${CH[id].color};${artStyle(id)}"></div>`;
  return `<div class="title help">
    <button class="btn backbtn" onclick="goMenu('title')">← 타이틀</button>
    <h2>플레이 방법</h2>
    <section class="hs"><small class="eng">STEP 1 · 목표</small><h3>탑 꼭대기의 명식을 쓰러뜨리세요</h3>
      <p>공명자 <b>한 명</b>으로 시작해 지도를 따라 위로 올라가요. <b>✚ 영입</b>에서 동료를 만나 최대 <b>3명</b>까지 파티를 꾸려요. 2구역 꼭대기의 명식을 쓰러뜨리면 승리!</p></section>
    <section class="hs"><small class="eng">STEP 2 · 카드 읽는 법</small><h3>카드를 끌어서 사용해요</h3>
      <div class="hs-row">${dc}<ol class="callout">
        <li><b class="k">①</b> 왼쪽 위 숫자 = <b>에너지 비용</b>. 매 턴 에너지 3이 채워져요.</li>
        <li><b class="k">②</b> 이름 아래 그림 = 소유 공명자의 스킬. 오른쪽 아래 얼굴이 주인이에요.</li>
        <li><b class="k">③</b> 가운데 글 = 효과. 노란 키워드에 마우스를 올리면 설명이 떠요.</li>
        <li><b class="k">④</b> <b>공격 카드</b>는 적에게, <b>스킬 카드</b>는 무대 위로 끌어다 놓아요. 숫자키 <kbd>1</kbd>~<kbd>9</kbd>로도 쓸 수 있어요.</li>
        <li><b class="k">⑤</b> 출전 중이 아닌 공명자의 카드는 <b>비용 +1</b> (빨간 숫자).</li></ol></div></section>
    <section class="hs"><small class="eng">STEP 3 · 적의 다음 행동</small><h3>적 머리 위 아이콘을 보고 대비하세요</h3>
      <div class="hs-icons"><div><span class="in-atk">${ICON.atk}</span> <b>공격</b> 숫자만큼 피해. 보호막으로 막아요.</div><div><span class="in-def">${ICON.def}</span> <b>방어</b> 적이 보호막을 얻어요.</div>
        <div><span class="in-buf">${ICON.buf}</span> <b>강화</b> 적의 힘이 올라가요.</div><div><span class="in-deb">${ICON.deb}</span> <b>약화</b> 디버프나 상태이상 카드를 넣어요.</div></div></section>
    <section class="hs"><small class="eng">STEP 4 · 협주 → 변주</small><h3>교체 타이밍이 핵심이에요</h3>
      <div class="flow">${tile('aem')}<div class="fa"><b>협주 에너지 ■■■</b><span>카드 3장 사용</span></div>${tile('sk')}<div class="fa"><b>교체!</b><span>대기 공명자 클릭</span></div><div class="burst">협주 + 변주<br><small>두 스킬 연속 발동</small></div></div>
      <p>공격은 <b>출전 중인 공명자</b>만 받아요. 다친 공명자는 뒤로 빼 주세요. 해방 게이지(5칸)가 차면 <b>공명 해방</b> 버튼이 떠요.</p></section>
    <section class="hs"><small class="eng">STEP 5 · 지도</small><h3>길을 골라 올라가세요</h3><div class="hs-nodes">${['battle','elite','event','rest','shop','treasure','recruit'].map(node).join('')}</div></section>
    <section class="hs"><small class="eng">STEP 6 · 에코 스킬</small><h3>쓰러뜨린 정예·명식의 힘을 빌려요</h3>
      <p>정예나 명식을 쓰러뜨려 얻은 에코를 상단 아이콘에서 클릭해 <b>주 에코</b>로 장착하면, 전투 중 에너지 위의 마름모 버튼이나 <kbd>Q</kbd>로 <b>에코 스킬</b>을 써요. 쓰고 나면 몇 턴 쿨다운이 있어요.</p></section>
    <section class="hs"><small class="eng">STEP 7 · 공진</small><h3>진동 게이지를 채워 공진 파괴</h3>
      <div class="hs-row"><div style="width:220px"><div class="hpb" style="position:relative"><i class="cur" style="width:70%"></i><span>48 / 70</span></div><div class="vib"><i style="width:80%"></i></div></div>
      <p style="flex:1">체력 바 아래 <b>노란 바</b>가 진동 게이지예요. 공격 한 번에 1, 협주→변주·공명 해방은 3씩 차요. 가득 차면 <b>공진 파괴</b> — 적은 다음 행동을 건너뛰고, 그동안 받는 피해가 50% 늘어나요. 보스는 게이지가 더 커요.</p></div></section>
    <section class="hs"><small class="eng">STEP 8 · 명조의 전투</small><h3>속성 이상 · 완벽 회피 · 에코 소나타</h3>
      <p><b>속성 이상</b> — 공격 카드를 쓰면 출전 공명자 속성의 상태가 대상에게 쌓여요. 회절 → 회절 잔향, 인멸 → 해체, 용융 → <b>용융 폭발</b>(4 쌓이면 터져서 12 + 주변 4), 응결 → <b>서리</b>(4 쌓이면 빙결: 8 피해 + 공진 파괴).</p>
      <p><b>완벽 회피</b> — 적 공격을 보호막으로 전부 막으면 반격 3 피해 + 협주 에너지 +1 (턴당 3번).</p>
      <p><b>에코 소나타</b> — 같은 속성 에코를 2개·4개 모으면 세트 효과. 상단 속성 칩에 마우스를 올려 확인해요.</p>
      <p><b>카드 조합</b> — 한 턴에 쓴 카드 3장의 순서(공·스)가 맞으면 추가 효과. 다른 공명자 카드가 섞이면 합주 ×1.5.</p></section>
    <section class="hs"><small class="eng">STEP 8 · 단축키</small><h3>편하게 플레이하기</h3>
      <div class="hs-icons"><div><kbd>1</kbd>~<kbd>9</kbd> 카드 사용 (마우스 올린 적 대상)</div><div><kbd>E</kbd> / <kbd>Enter</kbd> 턴 종료</div><div><kbd>Q</kbd> 에코 스킬</div><div><kbd>Esc</kbd> 일시정지 · 음량 · 전투 속도</div><div>우클릭 · <kbd>Esc</kbd> 카드 끌기 취소</div></div>
      <p class="dim">지도에 있을 때마다 자동 저장돼요. 타이틀의 <b>이어하기</b>로 계속하고, 쓰러지면 처음부터 다시 올라요.</p></section>
  </div>`;
}
/* ============ 영입 ============ */
const JOIN={rov:'"…같이 가자. 이 탑의 끝까지."',aem:'"저도 함께할게요! 이번엔 꼭 당신 곁에서요."',sk:'"당신이 가는 길이라면, 끝까지 지켜볼게요."'};
function openRecruit(){
  const pool=shuffle(ALL.filter(id=>!S.team.includes(id))).slice(0,3);
  S.modal=null;
  if(S.team.length>=3||!pool.length){S.reward={gold:0,cards:rollCards(3,true),echo:null,title:'동료들의 응원'};S.screen='reward';return render()}
  S.recruitOpts=pool;S.screen='recruit';render();
}
function recruit(id){
  if(S.team.includes(id)||S.team.length>=3)return;
  S.team.push(id);S.party[id]={hp:CH[id].maxHp,maxHp:CH[id].maxHp,down:false};
  ['_a','_b','_s'].forEach(x=>S.deck.push(mk(id+x)));
  const art=ARTS[id]&&(ARTS[id].portrait||ARTS[id].idle);
  S.screen='msg';S.msg={title:`${CH[id].name} 합류!`,body:`<div class="av" style="width:96px;height:96px;border-radius:18px;margin:6px auto 10px;background:${CH[id].color};${artStyle(id)}">${art?'':CH[id].ini}</div>
    <b style="color:${CH[id].color}">${CH[id].name}</b> — ${CH[id].join||JOIN[id]}<br><span class="dim">${CH[id].name}의 카드 3장이 덱에 추가되었습니다.${S.team.length===2?' 이제 전투에서 교체와 협주·변주를 쓸 수 있어요.':''} (파티 ${S.team.length}/3)</span>`};
  render();
}
function recruitHTML(){
  return `<div class="screen"><div class="box" style="max-width:1000px;text-align:center"><div style="font-size:34px;color:#7cf0c0">✚</div><h2>공명자 조우</h2>
    <p class="dim">탑을 오르던 공명자들과 마주쳤습니다. 한 명을 동료로 맞이하세요. (파티 ${S.team.length}/3)</p>
    <div class="party-intro">${S.recruitOpts.map(id=>charCardHTML(id,`recruit('${id}')`,'동료로 맞이하기')).join('')}</div>
    <button class="btn" style="margin-top:16px" onclick="S.screen='map';render()">지나치기</button></div></div>`;
}
const NODE_SVG={
  battle:'<path d="M5 19 19 5M14 5h5v5M5 14l5 5" />',elite:'<path d="M12 3 4 9l3 11h10l3-11z"/><path d="M9 12h6"/>',
  event:'<path d="M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.7V14M12 18v.5"/>',rest:'<path d="M20 14A8 8 0 1 1 10 4a6 6 0 0 0 10 10z"/>',
  shop:'<path d="M5 8h14l-1 12H6zM9 8a3 3 0 0 1 6 0"/>',treasure:'<path d="M4 9h16v10H4zM4 9l2-4h12l2 4M12 9v10"/>',
  recruit:'<path d="M12 5v14M5 12h14"/>'};
const NODE_IMG=Object.fromEntries(['battle','elite','event','rest','shop','treasure','recruit','boss'].map(id=>[id,`maps/node-${id}.png`]));
const nodeImg=t=>NODE_IMG[t]?`<img src="assets/${NODE_IMG[t]}" alt="" onerror="this.remove()">`:'';
const regionArt=()=>[['coast','forest'],['spire','lahai'],['lahai','spire']][S.act][S.vari||0];
function mapHTML(readonly){
  const GAP=86,H=ROWS*GAP+250;const av=readonly?[]:availNodes();const path=S.path||[];
  const yOf=(r,n)=>H-(r*GAP+70+(n?n.jy:0));
  const onPath=(a,b)=>{const i=path.indexOf(a);return i>=0&&path[i+1]===b};
  let lines='';
  S.map.forEach((row,r)=>row.forEach(n=>{
    const k=`${r}-${n.i}`;const y1=yOf(r,n);
    const tg=r===ROWS-1?[{x:.5,y:H-(ROWS*GAP+110),k:'boss'}]:n.next.map(j=>{const m=S.map[r+1][j];return{x:m.x,y:yOf(r+1,m),k:`${r+1}-${j}`}});
    tg.forEach(t=>{const hot=onPath(k,t.k)||(t.k==='boss'&&path.includes(k)&&S.pos&&S.pos.r===ROWS);
      lines+=`<line x1="${n.x*100}" y1="${y1}" x2="${t.x*100}" y2="${t.y}" class="${hot?'hot':''}" data-a="${k}" vector-effect="non-scaling-stroke"/>`})}));
  let nodes='';
  S.map.forEach((row,r)=>row.forEach(n=>{
    const key=`${r}-${n.i}`;const T=NODE[n.type];const isAv=av.includes(key);
    const isCur=S.pos&&S.pos.r===r&&S.pos.i===n.i;const vis=path.includes(key);const past=S.pos&&r<S.pos.r&&!vis;
    nodes+=`<button class="mnode t-${n.type} ${n.burn?'burn':''} ${isAv?'avail':''} ${isCur?'cur':''} ${vis?'vis':''} ${past?'past':''}" style="left:${n.x*100}%;top:${yOf(r,n)}px;--c:${T.c}"${tipAttr(`<b>${T.l}${n.burn?' · 불타는 정예':''}</b><br>${NODE_TIP[n.type]}${n.burn?'<hr>더 강하지만 에코를 하나 더 주는 정예예요.':''}`)} ${isAv?`onclick="enterNode('${key}')"`:'disabled'}><i><svg viewBox="0 0 24 24">${NODE_SVG[n.type]}</svg>${nodeImg(n.type)}</i></button>`;
  }));
  const bav=av.includes('boss');const bid=ACTS[S.act].boss;const ba=ARTS[bid]||{};
  nodes+=`<button class="mboss ${bav?'avail':''}" style="top:${H-(ROWS*GAP+110)}px" ${bav?`onclick="enterNode('boss')"`:'disabled'}${tipAttr(`<b>명식 · ${EN[bid].n}</b><br>${EN[bid].pv?EN[bid].pv.tx:''}`)}>
    <div class="bimg" style="${ba.portrait?`background-image:url('${ba.portrait}')`:''}"></div><span>명식 · ${EN[bid].n}</span></button>`;
  const legend=Object.entries(NODE).filter(([k])=>k!=='boss').map(([k,t])=>`<div class="lg t-${k}" style="--c:${t.c}"><i><svg viewBox="0 0 24 24">${NODE_SVG[k]}</svg>${nodeImg(k)}</i>${t.l}</div>`).join('');
  return `<div class="mapscr">
    <div class="maphead"><small>TOWER OF ECHOES · ACT ${S.act+1}</small><b>${AV().name}</b><em>${AV().flavor}</em></div>
    <div class="mapwrap"><div class="map" style="height:${H}px"><img class="route-art" src="assets/maps/${regionArt()}-route.png" alt="" draggable="false"><svg class="mlines" viewBox="0 0 100 ${H}" preserveAspectRatio="none">${lines}</svg>${nodes}</div></div>
    <aside class="maplegend"><small>LEGEND</small>${legend}<div class="lg burnlg"><i></i>불타는 정예</div></aside>
  </div>`;
}
const NODE_TIP={battle:'일반 잔상과 전투해요.',elite:'강력한 잔상. 이기면 에코를 흡수해요.',event:'무엇이 있을지 몰라요. 사건이 대부분이지만, 잔상의 매복이나 상점·보급이 나오기도 해요.',
  rest:'체력을 회복하거나 카드를 강화해요.',shop:'조개 화폐로 카드·에코를 사요.',treasure:'보급 상자에서 에코를 얻어요.',recruit:'새 공명자를 동료로 맞이해요.'};
function showMap(){S.modal={kind:'map'};render()}
const ICON={
  atk:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M20.5 2.5 21.5 3.5 11 14l-1.5-1.5zM3 21l2.2-5.3 3.1 3.1zM8.6 12.4l3 3-1.4 1.4-1.1-.4-2.6 2.6-1.4-1.4 2.6-2.6-.4-1.1z"/><path fill="currentColor" d="M20.5 2.5 15 4l-5.5 8.5 2 2L20 9z" opacity=".7"/></svg>',
  def:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2 20 5v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5z"/></svg>',
  buf:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 3 20 13h-5v8H9v-8H4z"/></svg>',
  deb:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21 4 11h5V3h6v8h5z"/></svg>',
};
function intentHTML(e){
  if(e.broken>0)return '<span class="in-deb">✦ 기절</span>';
  const m=e.move;const parts=[];
  if(m.d)parts.push(`<span class="in-atk">${ICON.atk}</span><span class="in-atk">${enemyDmg(e,m)}${m.h>1?`×${m.h}`:''}</span>`);
  if(m.b)parts.push(`<span class="in-def">${ICON.def}</span>`);
  if(m.s)parts.push(`<span class="in-buf">${ICON.buf}</span>`);
  if(m.w||m.add)parts.push(`<span class="in-deb">${ICON.deb}</span>`);
  return parts.join('');
}
function intentTitle(e){const m=e.move;const t=[];if(m.d)t.push(`공격 ${enemyDmg(e,m)}${m.h>1?`×${m.h}`:''}`);if(m.b)t.push(`방어 ${m.b}`);if(m.s)t.push(`힘 +${m.s}`);if(m.w)t.push(`약화 ${m.w}`);if(m.add)t.push(`덱에 「${CD[m.add[0]].n}」 ${m.add[1]}장`);return `${m.n}: ${t.join(', ')}`}
function battleBackground(region=regionArt()){
  // 'title'은 타이틀·공명자 선택 공용 배경(assets/maps/title-bg.png)
  return `<div class="battle-art"><img src="assets/maps/${region==='title'?'title-bg':region+'-battle'}.png" alt="" draggable="false"></div>`;
}
function enemyPos(n,i,boss,slot){
  if(slot!=null)return slot?[46,44]:[58,14];
  if(boss)return n>1?(i?[86,22]:[66,14]):[74,20];
  const xs=n===1?[74]:n===2?[62,84]:[54,70,86];const ys=n===3?[22,28,21]:[22,24];
  return[xs[i],ys[i]];
}
const FLY=['cheron_x','vheron_x','mephis_x','hecate_x','chirp','cruise','cheron','vheron','aix','mephis','hecate','levia','aleph','zig','explorer'];
function hudSkel(){return `<div class="hpb"><i class="lag"></i><i class="cur"></i><span></span><b class="blk"></b></div><div class="nametag"></div><div class="gauges"></div><div class="sts"></div>`}
function buildCombat(){
  const c=S.c;
  const motes=Array.from({length:14},(_,i)=>`<i class="mote" style="left:${(i*71)%100}%;bottom:${10+(i*13)%40}%;animation-delay:${(i*.53)%7}s;background:${S.act?'#e3b8ff':'#bfe6ff'}"></i>`).join('');
  return `<div class="combat" data-cid="${c.id}">
    <div class="stage" id="stage">${battleBackground()}${motes}
      <div class="stlog" id="stlog"></div><div class="seqbar" id="seqbar"></div><div class="tgthint" id="tgthint"></div>
      ${T_().map((id,i)=>`<div class="unit party" id="u-${id}" style="--c:${CH[id].color};--dl:${i*.45}s" onclick="clickUnit('${id}')">
        <div class="swaptag"></div><div class="libwrap"></div>
        <div class="body" data-fx="p-${id}"><div class="fig">${figHTML(id)}</div><div class="shadow"></div></div>
        <div class="uhud">${hudSkel()}</div></div>`).join('')}
      ${c.enemies.map((e,i)=>{const d=EN[e.id];const free=c.enemies.filter(z=>z.slot==null);const [x,y]=enemyPos(free.length,free.indexOf(e),d.boss&&free.length>1&&free.every(z=>EN[z.id].boss)||d.boss&&free.length===1,e.slot);
        return `<div class="unit enemy ${d.boss?'boss':d.elite?'elite':''} ${FLY.includes(e.id)?'fly':''} ${e.slot!=null?'minion':''} ${e.burn?'burnE':''} ${e.affix?'af-'+e.affix:''} ${d.boss&&c.enemies.filter(z=>EN[z.id].boss).length>1?'twin':''}" id="e-${e.uid}" style="left:${x}%;bottom:${y}%;--c:${EL[d.el]};--dl:${i*.6+.2}s" onclick="clickEnemy(${e.uid})">
        <div class="intentf"></div>
        <div class="body" data-fx="e${e.uid}">${d.boss||d.elite?'<div class="aura"></div>':''}<div class="fig">${figHTML(e.id,e.uid)}</div><div class="shadow"></div><div class="ret"></div></div>
        <div class="uhud">${hudSkel()}</div></div>`}).join('')}
    </div>
    <div class="bottom">
      <div class="lhud"><button class="echobtn" id="echobtn" onclick="useEcho(alive().find(x=>x.uid===HOVER_E))"></button><div class="energy" id="energy"></div><button class="pile" id="pdraw" data-tip="<b>뽑을 카드</b><br>클릭해서 목록 보기" onclick="showPile('draw')"></button></div>
      <div class="hand" id="hand"></div>
      <div class="rhud"><button class="endturn" id="endbtn" onclick="endTurn()"><small class="en">END TURN</small>턴 종료 <small>E</small></button><button class="pile disc" id="pdisc" data-tip="<b>버린 카드</b><br>클릭해서 목록 보기" onclick="showPile('discard')"></button></div>
    </div></div>`;
}
function setHP(root,hp,max,block){
  const pct=Math.max(0,hp/max*100)+'%';
  root.querySelector('.cur').style.width=pct;root.querySelector('.lag').style.width=pct;
  root.querySelector('.hpb span').textContent=`${hp} / ${max}`;
  const hb=root.querySelector('.hpb');hb.classList.toggle('blocked',block>0);hb.querySelector('.blk').textContent=block;
}
function updateCombat(){
  const c=S.c;const order=[c.active,...T_().filter(x=>x!==c.active)];
  const maxE=3+(S.bonusE||0)+(has('levia')?1:0);
  T_().forEach(id=>{
    const el=$('#u-'+id);const p=S.party[id];const slot=order.indexOf(id);const front=slot===0;
    el.className=`unit party s${slot} ${p.down?'down':''} ${!p.down&&p.hp<=p.maxHp*.3?'hurt':''} ${!front&&!p.down&&!c.busy&&!c.tgt?'swappable':''}`;
    const sp=el.querySelector('.sprite');
    if(sp&&sp.dataset.art!==artKey(id)){clearTimeout(sp._restore);resetSprite(sp,id)}
    const sw=el.querySelector('.swaptag');const ready=c.conc[c.active]>=3;
    sw.className='swaptag'+(!front&&!p.down&&ready&&!c.busy?' ready':'');
    sw.textContent=front||p.down?'':`${ready?'협주 → 변주!':'교체'}${switchCost()?' (에너지 1)':''}`;
    el.querySelector('.libwrap').innerHTML=front&&!p.down&&c.lib[id]>=5&&!c.busy?`<button class="libbtn" onpointerdown="libDown(event)" onclick="event.stopPropagation()">공명 해방</button>`:'';
    setHP(el,p.hp,p.maxHp,front?c.block:0);if(front)$('#stage').classList.toggle('danger',!p.down&&p.hp<=p.maxHp*.3);
    el.querySelector('.nametag').innerHTML=`${S.weapons&&S.weapons[id]?`<span class="wpn"${tipAttr(`<b>${WEAPON_DEF[S.weapons[id]].n}</b><br>${WEAPON_DEF[S.weapons[id]].tx}`)}>${WEAPON_DEF[S.weapons[id]].i}</span> `:''}<b>${CH[id].name}</b> · <span style="color:${EL[CH[id].el]}">${CH[id].el}</span>${p.down?' · <span style="color:var(--red)">기절</span>':''}`;
    el.querySelector('.gauges').dataset.tip=`<b>협주 에너지 ${c.conc[id]}/3 · 공명 해방 ${c.lib[id]}/5</b><br>${KW['협주 에너지']}<hr>${KW['공명 해방']}`;
    el.querySelector('.gauges').innerHTML=[0,1,2].map(k=>`<i class="gp ${c.conc[id]>k?'on':''}"></i>`).join('')+'<i class="gsep"></i>'+[0,1,2,3,4].map(k=>`<i class="gp l ${c.lib[id]>k?'on':''}"></i>`).join('');
    const st=[];
    if(id==='aem'&&c.mecha)st.push(stc('메카스카우트','var(--aem)'));
    if(id==='lyn'&&c.paint)st.push(stc(`색채 ${c.paint}`,'#5fe0c8','색채'));
    if(id==='cam'&&c.bloom)st.push(stc(`개화 ${c.bloom}`,'#ff7a95','개화'));
    if(id==='mor'&&c.calc)st.push(stc(`계산 +${c.calc}`,'#ffb347','계산','다음 공격 카드의 피해가 늘어나요.'));
    if(front&&c.nextE)st.push(`<span class="st">다음 턴 에너지 +${c.nextE}</span>`);
    if(front&&c.hyp)st.push(`<span class="st">가설 ${c.hyp}</span>`);
    if(front&&c.bond)st.push(`<span class="st">인연 ${c.bond}</span>`);
    if(front){
      if(c.amp)st.push(stc(`증폭 ${c.amp}`,'var(--gold)','증폭'));
      if(c.weak)st.push(stc(`약화 ${c.weak}`,'var(--red)','약화'));
      if(c.field.t)st.push(stc(`별의 영역 ${c.field.t}`,'var(--sk)','별의 영역'));
      if(c.orbit)st.push(`<span class="st">궤도 ${c.orbit}</span>`);
      if(c.melody)st.push(`<span class="st">선율 ${c.melody}</span>`);
      if(c.ghost)st.push(`<span class="st">동행 ${c.ghost}</span>`);
      if(c.luck)st.push(stc(`행운 +${Math.round(c.luck*100)}%`,'#ffd75e','치명타'));
    }
    el.querySelector('.sts').innerHTML=st.join('');
  });
  c.enemies.forEach(e=>{
    const el=$('#e-'+e.uid);const d=EN[e.id];
    el.classList.toggle('dead',e.dead);el.classList.toggle('charging',!e.dead&&!c.ending&&!!(e.move&&e.move.d)&&!(e.broken>0));el.classList.toggle('tgtable',!!c.tgt&&!e.dead);
    setHP(el,e.hp,e.maxHp,e.block);
    let vb=el.querySelector('.vib');if(!vb){vb=document.createElement('div');vb.className='vib';el.querySelector('.hpb').after(vb);vb.innerHTML='<i></i>'}
    vb.querySelector('i').style.width=(e.broken>0?100:e.vib/e.vibMax*100)+'%';vb.classList.toggle('broken',e.broken>0);
    vb.dataset.tip=`<b>공진 ${e.broken>0?'파괴됨':e.vib+'/'+e.vibMax}</b><br>${KW['공진']}`;
    const inf=el.querySelector('.intentf');inf.innerHTML=e.dead||c.ending?'':intentHTML(e);inf.dataset.tip=e.dead?'':`<b>${e.move.n}</b><br>${intentTitle(e).split(': ')[1]||''}`;
    el.querySelector('.nametag').innerHTML=`<b>${d.n}</b> · ${d.g}`;
    const s=[];if(e.str)s.push(stc(`힘 ${e.str}`,'var(--gold)','힘'));if(e.vuln)s.push(stc(`취약 ${e.vuln}`,'#ffb36b','취약'));
    if(e.weak)s.push(stc(`약화 ${e.weak}`,'','약화'));if(e.fz)s.push(stc(`잔향 ${e.fz}`,EL.회절,'회절 잔향'));if(e.ur)s.push(stc(`해체 ${e.ur}`,'#9aa8ff','해체'));if(e.fb)s.push(stc(`폭발 ${e.fb}/4`,EL.용융,'용융 폭발'));if(e.fr)s.push(stc(`서리 ${e.fr}/4`,EL.응결,'서리'));
    if(e.affix)s.unshift(`<span class="st afx" style="color:${AFFIX[e.affix].c}"${tipAttr(`<b>변이 · ${AFFIX[e.affix].n}</b><br>${AFFIX[e.affix].tx}`)}>${AFFIX[e.affix].i}${AFFIX[e.affix].n}</span>`);
    const pv=d.pv;if(pv&&!(pv.k==='enrage'&&e.p2))s.unshift(stc(pv.n+(pv.k==='static'?` ${4-(S.c.cards||0)%4}`:''),'#ff9ab0',pv.n,pv.tx));
    el.querySelector('.sts').innerHTML=s.join('');
  });
  const eb2=$('#echobtn');if(eb2){const id=S.mainEcho,sk=id&&ECHO_SKILL[id];eb2.style.display=sk?'':'none';
    if(sk){eb2.innerHTML=`<i>${ECHO[id].i}</i>${c.echoCd>0?`<b>${c.echoCd}</b>`:'<em>Q</em>'}`;eb2.classList.toggle('cd',c.echoCd>0);eb2.disabled=c.busy||c.echoCd>0;
      eb2.dataset.tip=`<b>에코 스킬 · ${sk.n}</b><br>${sk.tx}<br>쿨다운 ${sk.cd}턴${c.echoCd>0?` · ${c.echoCd}턴 남음`:' · 사용 가능 (Q)'}`}}
  const en=$('#energy');if(en.dataset.v!=null&&+en.dataset.v!==c.energy){en.classList.remove('pulse');void en.offsetWidth;en.classList.add('pulse')}en.dataset.v=c.energy;en.textContent=`${c.energy}/${maxE}`;en.dataset.tip='<b>에너지</b><br>카드를 쓰는 데 필요해요. 매 턴 다시 채워져요.';en.classList.toggle('zero',c.energy===0);en.style.setProperty('--ep',Math.min(1,c.energy/maxE));
  $('#pdraw').innerHTML=`${c.draw.length}<small>뽑을 카드</small>`;$('#pdisc').innerHTML=`${c.discard.length}<small>버린 카드</small>`;
  const eb=$('#endbtn');eb.disabled=c.busy;eb.classList.toggle('glow',!c.busy&&!c.hand.some(canPlay));
  const sq=c.seq||[];const next=RECIPES.filter(r=>sq.every((x,i)=>r.k[i]===x.t)).map(r=>`${r.k.slice(sq.length).map(t=>TSYM[t]).join('')} ${r.n}`);
  $('#seqbar').innerHTML=`<b>조합</b>${[0,1,2].map(i=>`<i class="${sq[i]?'on':''}">${sq[i]?TSYM[sq[i].t]:'·'}</i>`).join('')}<small>${next.slice(0,3).join(' · ')}</small>`;
  $('#seqbar').dataset.tip=`<b>카드 조합</b><br>${KW['카드 조합']}<hr>${RECIPES.map(r=>`${r.k.map(t=>TSYM[t]).join('')} <b>${r.n}</b> — ${r.tx}`).join('<br>')}`;
  $('#stlog').innerHTML=c.log.slice(-3).map(l=>`<div>${l}</div>`).join('');
  $('#tgthint').innerHTML=c.tgt?`대상을 선택하세요 <button class="smallbtn" onclick="S.c.tgt=null;render()">취소</button>`:'';
  renderHand();
}
function renderHand(){
  const c=S.c;const h=$('#hand');const n=c.hand.length;const W=h.clientWidth||600;const cw=W<420?112:150;
  const spacing=n>1?Math.min(cw*.82,(W-cw)/(n-1)):0;const mid=(n-1)/2;
  if(DRAG)return;
  h.innerHTML=c.hand.map((card,i)=>{const d=i-mid;const rot=n>1?d*Math.min(6,30/n):0;const y=d*d*(n>6?2.2:3.5);
    return cardHTML(card,{combat:1,down:`dragStart(event,'card',${card.uid})`,style:`left:calc(50% + ${d*spacing}px);transform:translateX(-50%) translateY(${y}px) rotate(${rot}deg);z-index:${i+1}`,hk:i<9?i+1:0})}).join('');
  const pile=$('#pdraw');if(!pile||window.FAST){c.hand.forEach(x=>HAND_SEEN.add(x.uid));return}
  const pr=pile.getBoundingClientRect();let k=0;
  c.hand.forEach(x=>{if(HAND_SEEN.has(x.uid))return;HAND_SEEN.add(x.uid);const el=h.querySelector(`[data-card="${x.uid}"]`);if(!el)return;
    const r=el.getBoundingClientRect();const dx=pr.left+pr.width/2-(r.left+r.width/2),dy=pr.top+pr.height/2-(r.top+r.height/2);
    el.animate([{translate:`${dx}px ${dy}px`,scale:.2,opacity:0},{translate:'0px 0px',scale:1,opacity:1}],{duration:360,delay:k++*75,easing:'cubic-bezier(.2,.8,.3,1)',fill:'backwards'})});
}
let HAND_SEEN=new Set();
function discardHandFx(){
  if(window.FAST)return;const pile=$('#pdisc');if(!pile)return;const pr=pile.getBoundingClientRect();
  document.querySelectorAll('#hand .card').forEach((el,i)=>{const r=el.getBoundingClientRect();const cl=el.cloneNode(true);cl.removeAttribute('onpointerdown');cl.removeAttribute('data-tip');
    cl.className+=' flycard';Object.assign(cl.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',transform:'none'});$('#fx').appendChild(cl);
    cl.animate([{transform:'none',opacity:1},{transform:`translate(${pr.left+pr.width/2-r.left-r.width/2}px,${pr.top+pr.height/2-r.top-r.height/2}px) scale(.2) rotate(25deg)`,opacity:.3}],{duration:380,delay:i*45,easing:'cubic-bezier(.5,0,.7,1)',fill:'forwards'});
    setTimeout(()=>cl.remove(),420+i*45)});
}
const TUT=[['카드를 끌어 사용해요','공격 카드는 적에게, 스킬 카드는 무대 위로 끌어다 놓으세요. 숫자키 1~9도 돼요.'],
  ['적 머리 위 아이콘을 보세요','다음 턴에 적이 할 행동이에요. 공격 수치만큼 보호막을 쌓아 대비하세요.'],
  ['공진을 노리세요','공격하면 적의 노란 진동 바가 차요. 가득 차면 공진 파괴로 적이 한 턴 쉬고 피해를 더 받아요.'],
  ['턴 종료','에너지를 다 쓰면 E 또는 턴 종료 버튼. 일시정지(Esc)에서 설명을 다시 볼 수 있어요.']];
function showTut(i){document.querySelectorAll('.tut').forEach(x=>x.remove());if(i>=TUT.length){OPT.tut=1;saveOpt();return}
  const d=document.createElement('div');d.className='tut';d.innerHTML=`<small class="eng">GUIDE ${i+1}/${TUT.length}</small><b>${TUT[i][0]}</b><p>${TUT[i][1]}</p><div><button class="btn" onclick="showTut(${TUT.length})">건너뛰기</button> <button class="btn primary" onclick="showTut(${i+1})">${i<TUT.length-1?'다음':'시작'}</button></div>`;
  document.body.appendChild(d)}
function turnBanner(t,sub){
  if(window.FAST)return;const b=document.createElement('div');b.className='turnban';b.innerHTML=`<b>${t}</b>${sub?`<small>${sub}</small>`:''}`;
  document.body.appendChild(b);setTimeout(()=>b.remove(),1250);
}
function clickUnit(id){const c=S.c;if(!c||c.tgt||DRAG||Date.now()-(c.dragAt||0)<350)return;if(id!==c.active)doSwitch(id)}
function showPile(kind){
  const c=S.c;if(!c)return;const list=kind==='draw'?[...c.draw].sort((a,b)=>CD[a.id].n.localeCompare(CD[b.id].n)):[...c.discard];
  S.modal={kind:'pile',title:kind==='draw'?`뽑을 카드 (${list.length})`:`버린 카드 (${list.length})`,list};render();
}

