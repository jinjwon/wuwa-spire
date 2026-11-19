/* ============ 드래그로 카드 사용 ============ */
let DRAG=null;
function handTop(){const h=$('#hand');return h?h.getBoundingClientRect().top:innerHeight*.7}
function arrowEl(){
  let a=$('#arrow');
  if(!a){document.body.insertAdjacentHTML('beforeend',`<svg id="arrow"><defs><marker id="ah" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 L3 5z"/></marker></defs><path class="ln" marker-end="url(#ah)"/></svg>`);a=$('#arrow')}
  return a;
}
function drawArrow(sx,sy,x,y){
  const a=arrowEl();a.style.display='block';
  const cx=sx+(x-sx)*.15,cy=Math.min(sy,y)-Math.abs(x-sx)*.25-40;
  a.querySelector('.ln').setAttribute('d',`M${sx} ${sy} Q${cx} ${cy} ${x} ${y}`);
}
function hideArrow(){const a=$('#arrow');if(a){a.style.display='none';a.classList.remove('hot')}}
function nope(el,msg){
  if(el){el.classList.remove('nope');void el.offsetWidth;el.classList.add('nope')}
  const r=el?el.getBoundingClientRect():{left:innerWidth/2,top:innerHeight/2,width:0};
  const s=document.createElement('div');s.className='pop info';s.textContent=msg;s.style.left=(r.left+r.width/2)+'px';s.style.top=(r.top-10)+'px';
  $('#fx').appendChild(s);setTimeout(()=>s.remove(),950);
}
function dragStart(ev,kind,uid){
  if(DRAG||ev.button>0)return;
  const c=S.c;if(!c||c.busy||c.ending)return;
  const src=ev.currentTarget;let tg=true;
  if(kind==='card'){
    const card=c.hand.find(x=>x.uid===uid);if(!card)return;const d=CD[card.id];
    if(!canPlay(card))return nope(src,d.unplay?'사용할 수 없는 카드':(d.o!=='any'&&S.party[d.o].down)?'기절한 공명자의 카드':'에너지가 부족합니다');
    tg=!!d.tg;
  }
  ev.preventDefault();ev.stopPropagation();
  const r=src.getBoundingClientRect();let clone=null;
  if(kind==='card'){
    clone=src.cloneNode(true);clone.removeAttribute('onpointerdown');clone.classList.add('dragcard');
    Object.assign(clone.style,{left:r.left+'px',top:r.top+'px',width:r.width+'px',height:r.height+'px',transform:'scale(1.06)'});
    $('#fx').appendChild(clone);src.classList.add('ghost');
  }
  DRAG={kind,uid,src,clone,tg,r,ox:ev.clientX-r.left,oy:ev.clientY-r.top,sx:ev.clientX,sy:ev.clientY,aim:false,target:null,moved:false,sticky:false};
  document.body.classList.add('dragging');
  addEventListener('pointermove',dragMove);addEventListener('pointerup',dragUp);addEventListener('pointercancel',dragCancel);
  addEventListener('keydown',dragKey);addEventListener('contextmenu',dragCtx);
  if(kind==='lib')dragMove(ev);
}
function dragMove(ev){
  const D=DRAG;if(!D)return;const x=ev.clientX,y=ev.clientY;
  if(Math.hypot(x-D.sx,y-D.sy)>8)D.moved=true;
  const ht=handTop();
  if(D.kind==='card'){
    if(D.tg&&y<ht+10){
      if(!D.aim){D.aim=true;D.clone.classList.add('aim');
        const hr=$('#hand').getBoundingClientRect();
        D.clone.style.left=(hr.left+hr.width/2-D.r.width/2)+'px';D.clone.style.top=(hr.top-D.r.height*.45)+'px';D.clone.style.transform='scale(1.1)'}
      const hr=$('#hand').getBoundingClientRect();
      drawArrow(hr.left+hr.width/2,hr.top-D.r.height*.45+8,x,y);
      $('#tgthint').textContent='적에게 끌어다 놓으세요';
    }else{
      if(D.aim){D.aim=false;D.clone.classList.remove('aim');hideArrow();$('#tgthint').textContent=''}
      const tilt=Math.max(-12,Math.min(12,(ev.movementX||0)*1.2));
      D.clone.style.left=(x-D.ox)+'px';D.clone.style.top=(y-D.oy)+'px';D.clone.style.transform=`scale(1.1) rotate(${tilt}deg)`;
      D.clone.classList.toggle('armed',!D.tg&&y<ht-20);
    }
  }else{
    const r=D.src.getBoundingClientRect();D.aim=true;drawArrow(r.left+r.width/2,r.top,x,y);
  }
  let T=null;
  if(D.tg&&D.aim){const el=document.elementFromPoint(x,y);const u=el&&el.closest('.unit.enemy');if(u)T=S.c.enemies.find(e=>'e-'+e.uid===u.id&&!e.dead)||null}
  if(T!==D.target){document.querySelectorAll('.unit.enemy.aimed').forEach(e=>e.classList.remove('aimed'));if(T)$('#e-'+T.uid).classList.add('aimed');D.target=T}
  const a=$('#arrow');if(a)a.classList.toggle('hot',!!T);
}
function dragUp(ev){
  const D=DRAG;if(!D)return;
  dragMove(ev);
  // 움직이지 않고 떼면: 카드를 든 상태로 유지(다음 클릭으로 사용)
  if(!D.moved&&!D.sticky){D.sticky=true;if(D.kind==='card'&&D.tg){D.sy=-999;}return}
  const ht=handTop();
  if(D.kind==='lib'){endDrag();if(D.target)doLib(D.target);else render();return}
  const card=S.c.hand.find(x=>x.uid===D.uid);
  let T=null,play=false;
  if(D.tg){if(D.target){play=true;T=D.target}}
  else if(ev.clientY<ht-20)play=true;
  endDrag();
  if(play&&card&&canPlay(card)){flyClone(D.clone,T);playCard(D.uid,T||alive()[0])}
  else returnClone(D);
}
function dragCancel(){const D=DRAG;if(!D)return;endDrag();if(D.clone)returnClone(D);else render()}
function dragKey(e){if(e.key==='Escape')dragCancel()}
function dragCtx(e){e.preventDefault();dragCancel()}
function endDrag(){
  removeEventListener('pointermove',dragMove);removeEventListener('pointerup',dragUp);removeEventListener('pointercancel',dragCancel);
  removeEventListener('keydown',dragKey);removeEventListener('contextmenu',dragCtx);
  hideArrow();document.querySelectorAll('.unit.enemy.aimed').forEach(e=>e.classList.remove('aimed'));
  document.body.classList.remove('dragging');const h=$('#tgthint');if(h)h.textContent='';
  if(S.c)S.c.dragAt=Date.now();DRAG=null;
}
function returnClone(D){
  const cl=D.clone;if(!cl)return;cl.classList.remove('aim','armed');cl.classList.add('back');
  cl.style.left=D.r.left+'px';cl.style.top=D.r.top+'px';cl.style.transform='none';
  setTimeout(()=>{cl.remove();if(D.src.isConnected)D.src.classList.remove('ghost')},200);
}
function flyClone(cl,T){
  if(!cl)return;cl.classList.add('back');
  const r=cl.getBoundingClientRect();let tx=innerWidth/2,ty=innerHeight*.4;
  const tb=T?bodyOf('e'+T.uid):null;const st=$('#stage');
  if(tb){const b=tb.getBoundingClientRect();tx=b.left+b.width/2;ty=b.top+b.height/2}else if(st){const b=st.getBoundingClientRect();tx=b.left+b.width*.45;ty=b.top+b.height*.4}
  requestAnimationFrame(()=>{cl.style.transition='transform .3s cubic-bezier(.4,0,.6,1),opacity .3s';
    cl.style.transform=`translate(${tx-r.left-r.width/2}px,${ty-r.top-r.height/2}px) scale(.35) rotate(${T?12:-8}deg)`;cl.style.opacity='0'});
  setTimeout(()=>cl.remove(),340);
}
function libDown(ev){
  ev.stopPropagation();const c=S.c;if(!c||c.busy)return;
  if(!LIB_TG[c.active]){clickLib();return}
  dragStart(ev,'lib');
}
(function(){
  let tip=null;
  addEventListener('pointerover',e=>{
    const t=e.target.closest&&e.target.closest('[data-tip]');
    if(!t||DRAG||!t.dataset.tip){if(tip){tip.remove();tip=null}return}
    if(!tip){tip=document.createElement('div');tip.id='tip';document.body.appendChild(tip)}
    tip.innerHTML=t.dataset.tip;const r=t.getBoundingClientRect();const w=240;
    let x=r.right+10;if(x+w>innerWidth-8)x=r.left-w-10;if(x<8)x=Math.min(innerWidth-w-8,Math.max(8,r.left));
    tip.style.left=x+'px';tip.style.width=w+'px';
    const th=tip.offsetHeight;let y=r.top;if(t.closest('.hand'))y=r.top-30;if(y+th>innerHeight-8)y=innerHeight-th-8;tip.style.top=Math.max(8,y)+'px';
  });
  addEventListener('pointerdown',()=>{if(tip){tip.remove();tip=null}});
})();
let HOVER_E=null;addEventListener('pointerover',e=>{const u=e.target.closest&&e.target.closest('.unit.enemy');if(u)HOVER_E=+u.id.slice(2)});
addEventListener('keydown',e=>{
  if(!S||S.screen!=='combat'||S.modal||DRAG||!S.c||S.c.busy||e.repeat)return;
  if(e.key==='e'||e.key==='E'||e.key==='Enter'){e.preventDefault();endTurn();return}
  if((e.key==='m'||e.key==='M')&&S&&S.c){const x=S.c.hand.find(mergeable);if(x)mergeCard(x.uid);return}
  if(e.key==='q'||e.key==='Q'){useEcho(alive().find(x=>x.uid===HOVER_E));return}
  const n=+e.key;if(!n)return;const card=S.c.hand[n-1];if(!card)return;
  if(!canPlay(card)){nope(document.querySelector(`[data-card="${card.uid}"]`),'사용할 수 없어요');return}
  const T=alive().find(x=>x.uid===HOVER_E)||alive()[0];flyCard(card.uid,CD[card.id].tg?T:null);playCard(card.uid,T);
});
addEventListener('pointerover',e=>{const n=e.target.closest&&e.target.closest('.mnode');document.querySelectorAll('.mlines line.peek').forEach(l=>l.classList.remove('peek'));
  if(n&&n.getAttribute('onclick')){const k=n.getAttribute('onclick').match(/'(.+)'/)[1];document.querySelectorAll(`.mlines line[data-a="${k}"]`).forEach(l=>l.classList.add('peek'))}});
// 도트 정수 배율: 캐릭터 --k(실제 화면 높이 1000px당 1배), 배경 --bk(640×360을 덮는 최소 정수 배율). 실제 픽셀 기준으로 맞춰 레티나에서도 고르게
function pixelScale(){const d=devicePixelRatio||1,r=document.documentElement.style;
  r.setProperty('--k',Math.max(Math.ceil(d),Math.floor(innerHeight*d/1000))/d);r.setProperty('--bk',Math.ceil(Math.max(innerWidth/640,innerHeight/360)*d)/d)}
pixelScale();
addEventListener('resize',()=>{pixelScale();if(S&&S.screen==='combat'&&$('#hand')&&!DRAG)renderHand()});
function rewardHTML(){
  const r=S.reward;const open=r.open;
  const rows=[`<div class="rw got"><i>◎</i><span>조개 화폐 <b>+${r.gold}</b></span></div>`];
  if(r.potion)rows.push(`<div class="rw got"><i style="color:${POT[r.potion].c}">${POT[r.potion].i}</i><span>약제 · <b>${POT[r.potion].n}</b><small>${POT[r.potion].tx}</small></span></div>`);
  if(r.echo)rows.push(`<div class="rw got"${tipAttr(ECHO[r.echo].tx)}><i>${ECHO[r.echo].i}</i><span>에코 흡수 · <b>${ECHO[r.echo].n}</b><small>${ECHO[r.echo].tx}</small></span></div>`);
  if(r.burnEcho)rows.push(`<div class="rw got burnrw"><i>${ECHO[r.burnEcho].i}</i><span>불타는 정예 보상 · <b>${ECHO[r.burnEcho].n}</b><small>${ECHO[r.burnEcho].tx}</small></span></div>`);
  if(r.bossPick)rows.push(`<div class="rw" style="flex-wrap:wrap"><i>✹</i><span>명식의 에코 · 하나를 고르세요<small>${r.bossPick.map(e=>`<button class="choice" style="display:inline-block;margin:6px 6px 0 0;width:200px" onclick="S.reward.bossPick=null;gainEcho('${e}');S.reward.picked='${e}';render()"><b>${ECHO[e].i} ${ECHO[e].n}</b><small>${ECHO[e].tx}</small></button>`).join('')}</small></span></div>`);
  if(r.picked)rows.push(`<div class="rw got"><i>${ECHO[r.picked].i}</i><span>명식의 에코 · <b>${ECHO[r.picked].n}</b></span></div>`);
  if(r.weapon)rows.push(`<button class="rw" onclick="const w=S.reward.weapon;S.reward.weapon=null;offerWeapon(w)"${tipAttr(WEAPON_DEF[r.weapon].tx)}><i>${WEAPON_DEF[r.weapon].i}</i><span>무기 · <b>${WEAPON_DEF[r.weapon].n}</b> (${WEAPON_DEF[r.weapon].k})<small>${WEAPON_DEF[r.weapon].tx} · 클릭해서 장착할 공명자 고르기</small></span></button>`);
  if(r.cards.length)rows.push(`<button class="rw" onclick="S.reward.open=!S.reward.open;render()"><i>🂠</i><span>카드 보상<small>3장 중 1장을 덱에 추가</small></span></button>`);
  return `<div class="screen"><div class="box wbox" style="max-width:${open?900:520}px"><small class="eng">REWARD</small><h2>${r.title||'전투 승리'}</h2>
    <div class="rws">${rows.join('')}</div>
    ${open&&r.cards.length?`<div class="cards" style="margin-top:14px">${r.cards.map(c=>{const n=S.deck.filter(x=>x.id===c.id).length;return `<div class="shopitem">${cardHTML(c,{click:`takeReward(${c.uid})`})}<span class="dim" style="font-size:12px">덱에 ${n}장 보유</span></div>`}).join('')}</div>`:''}
    <div style="margin-top:16px;text-align:right"><button class="btn primary" onclick="S.reward.cards=[];afterReward()">${r.cards.length?'카드 건너뛰고 계속':'계속'}</button></div></div></div>`;
}
function eventHTML(){
  const e=S.ev;
  return `<div class="screen"><div class="box"><div style="font-size:40px;text-align:center">${e.s}</div><h2 style="text-align:center">${e.t}</h2>
    <p>${e.b}</p>
    ${S.evResult?`<p style="color:var(--gold)">${S.evResult}</p><button class="btn primary" onclick="S.screen='map';render()">계속</button>`
    :`<div class="choices">${e.c.map((ch,i)=>`<button class="choice" ${ch.ok&&!ch.ok()?'disabled':''} onclick="evChoose(${i})"><b>${ch.l}</b>${ch.d?`<small>${ch.d}</small>`:''}</button>`).join('')}</div>`}
  </div></div>`;
}
function restHTML(){
  const RL=REST_LINES.filter(l=>S.team.includes(l[0]));const [who,line]=RL.length?RL[S.floor%RL.length]:['rov','모닥불이 조용히 타오른다.'];
  return `<div class="screen"><div class="box" style="text-align:center"><div style="font-size:40px">☾</div><h2>휴식처</h2>
    <p><span style="color:${CH[who].color}">${CH[who].name}</span> — ${line}</p>
    ${S.restDone?`<p style="color:var(--gold)">${S.restDone}</p><button class="btn primary" onclick="S.screen='map';render()">계속</button>`
    :`<div class="choices"><button class="choice" onclick="restHeal()"><b>휴식</b><small>모든 공명자 최대 체력 30% 회복 (기절한 공명자도 일으킴)</small></button>
      <button class="choice" onclick="restUp()" ${S.deck.some(x=>!x.up&&!CD[x.id].unplay)?'':'disabled'}><b>공명 조율</b><small>카드 1장 강화</small></button></div>`}
  </div></div>`;
}
function shopHTML(){
  const s=S.shop;
  return `<div class="screen"><div class="box" style="max-width:960px"><h2 style="text-align:center">${s.trinket?'떠돌이 에코 상인':'탑 속의 상점'}</h2>
    <p class="dim" style="text-align:center">${s.trinket?'"카드는 없어. 대신 진짜 귀한 에코만 모아 왔지."':'"조개 화폐만 있으면 뭐든지! 잔상 빼고요."'}</p>
    <div class="cards">${s.cards.map((it,i)=>`<div class="shopitem" style="${it.sold?'opacity:.25':''}">${cardHTML(it.c,{click:it.sold?'':`buyCard(${i})`})}<span class="price">◎ ${it.price}</span></div>`).join('')}</div>
    <div class="cards" style="margin-top:16px">
      ${s.ech.map((it,i)=>`<button class="choice" style="width:220px;${it.sold?'opacity:.25':''}" onclick="buyEcho(${i})" ${it.sold||S.gold<it.price?'disabled':''}><div class="echoicon">${ECHO[it.e].i}</div><b>${ECHO[it.e].n}</b><small>${ECHO[it.e].tx}</small><span class="price">◎ ${it.price}</span></button>`).join('')}
      <button class="choice" style="width:220px" onclick="buyRemove()" ${s.removed||S.gold<75?'disabled':''}><b>카드 제거</b><small>덱에서 카드 1장 제거</small><span class="price">◎ 75</span></button>
      ${s.trinket?'':`<button class="choice" style="width:220px" onclick="buyEnch()" ${s.enched||S.gold<90?'disabled':''}><b>공명 각인</b><small>카드 1장에 무작위 인챈트</small><span class="price">◎ 90</span></button>`}
      ${s.trinket||!S.shopWeapon?'':`<button class="choice" style="width:220px;${S.shopWeapon.sold?'opacity:.25':''}" onclick="if(!S.shopWeapon.sold&&S.gold>=S.shopWeapon.price){S.gold-=S.shopWeapon.price;S.shopWeapon.sold=true;offerWeapon(S.shopWeapon.w)}" ${S.shopWeapon.sold||S.gold<S.shopWeapon.price?'disabled':''}><div class="echoicon">${WEAPON_DEF[S.shopWeapon.w].i}</div><b>${WEAPON_DEF[S.shopWeapon.w].n}</b><small>${WEAPON_DEF[S.shopWeapon.w].k} · ${WEAPON_DEF[S.shopWeapon.w].tx}</small><span class="price">◎ ${S.shopWeapon.price}</span></button>`}
 ${(s.pots||[]).map((it,i)=>`<button class="choice" style="width:220px;${it.sold?'opacity:.25':''}" onclick="buyPot(${i})" ${it.sold||S.gold<it.price||S.potions.length>=potSlots()?'disabled':''}><div class="echoicon" style="color:${POT[it.k].c}">${POT[it.k].i}</div><b>${POT[it.k].n}</b><small>${POT[it.k].tx}</small><span class="price">◎ ${it.price}</span></button>`).join('')}
      <button class="choice" style="width:220px" onclick="buyKit()" ${s.kit||S.gold<40?'disabled':''}><b>응급 키트</b><small>모든 공명자 체력 15 회복</small><span class="price">◎ 40</span></button>
    </div>
    <div style="text-align:center;margin-top:16px"><button class="btn primary" onclick="S.screen='map';render()">떠나기</button></div></div></div>`;
}
function msgHTML(){return `<div class="screen"><div class="box" style="text-align:center"><h2>${S.msg.title}</h2><p>${S.msg.body}</p><button class="btn primary" onclick="S.screen='map';render()">계속</button></div></div>`}
function overHTML(){return `<div class="screen"><div class="box" style="text-align:center"><h2 style="color:var(--red)">모든 공명자가 쓰러졌습니다</h2>
  <p>${ACTS[S.act].name} · 층 ${S.floor} · 처치한 잔상 ${S.stats.kills}</p><p class="dim">잔향은 사라지지 않습니다. 다시 탑에 오르세요.</p>
  <button class="btn gold" onclick="goMenu('select')">다시 도전</button> <button class="btn" onclick="goMenu('title')">타이틀</button></div></div>`}
function winHTML(){return `<div class="screen"><div class="box" style="text-align:center"><div style="font-size:46px">✹</div><h2 style="color:var(--gold)">첨탑 정복!</h2>
  <p>알레프-원의 창조물이 무너지고, 탑 꼭대기에 고요한 별빛이 내려앉습니다.</p>
  <p>층 ${S.floor} · 처치한 잔상 ${S.stats.kills} · 에코 ${S.echoes.length}개 · 덱 ${S.deck.length}장</p>
  <button class="btn gold" onclick="goMenu('select')">다시 오르기</button> <button class="btn" onclick="goMenu('title')">타이틀</button></div></div>`}
function modalHTML(){
  const m=S.modal;
  if(m.kind==='epi'){const card=S.c.hand.find(x=>x.uid===m.uid);return `<div class="modal"><div class="box" style="max-width:720px;margin-top:20vh;text-align:center"><small class="eng">EPIPHANY</small><h2>✧ 번뜩임 · ${CD[card.id].n}</h2><p class="dim">이 카드를 영원히 바꿀 공명을 하나 고르세요.</p>
    <div class="epis">${m.opts.map((k,i)=>`<button class="choice" onclick="pickEpiphany('${k}')"><b>${i+1}. ${EPI[k].n}</b><br>${EPI[k].tx}</button>`).join('')}</div></div></div>`}
  if(m.kind==='deck'){
    const sorted=[...S.deck].sort((a,b)=>ALL.indexOf(CD[a.id].o)-ALL.indexOf(CD[b.id].o));
    return `<div class="modal" onclick="if(event.target===this)closeModal()"><div class="box"><h2>덱 (${S.deck.length}장)</h2>
      <div class="cards" style="margin-top:14px">${sorted.map(c=>cardHTML(c)).join('')}</div>
      <div style="text-align:center;margin-top:16px"><button class="btn" onclick="closeModal()">닫기</button></div></div></div>`;
  }
  if(m.kind==='weapon'){const W=WEAPON_DEF[m.w];return `<div class="modal"><div class="box wbox" style="max-width:640px;text-align:center"><small class="eng">WEAPON</small><div class="echoicon">${W.i}</div><h2>${W.n}</h2><p class="dim">${W.k} · ${W.tx}</p>
    <p>장착할 공명자를 고르세요. 이미 무기가 있으면 교체돼요.</p><div class="party-intro">${T_().map(id=>`<div class="pi sel" style="--c:${CH[id].color};width:170px" onclick="equipWeapon('${id}')"><div class="av" style="background:${CH[id].color};${artStyle(id)}"></div><b>${CH[id].name}</b><div class="dim" style="font-size:12px">${S.weapons&&S.weapons[id]?'현재: '+WEAPON_DEF[S.weapons[id]].n:'무기 없음'}</div></div>`).join('')}</div>
    <button class="btn" style="margin-top:12px" onclick="S.modal=null;render()">장착하지 않기</button></div></div>`}
  if(m.kind==='map')return `<div class="modal" onclick="if(event.target===this)closeModal()"><div class="box" style="max-width:1000px;padding:10px"><div style="text-align:right"><button class="btn" onclick="closeModal()">닫기</button></div>${mapHTML(true)}</div></div>`;
  if(m.kind==='pause'){const inMap=S.screen==='map';
    return `<div class="modal" onclick="if(event.target===this)closeModal()"><div class="box pause"><h2>일시정지</h2>
      <p class="dim">${ACTS[S.act].name} · ${S.floor}층 · ${S.team.map(id=>CH[id].name).join(', ')}</p>
      <div class="choices">
        <button class="choice" onclick="closeModal()"><b>계속하기</b></button>
        <button class="choice" onclick="showDeck()"><b>덱 보기</b></button>
        <button class="choice" onclick="toggleFS()"><b>전체 화면</b></button>
        <button class="choice" onclick="OPT.speed=OPT.speed===1?2:1;saveOpt();render()"><b>전투 속도 ×${OPT.speed}</b><small>적 턴·연출 대기 시간을 줄여요</small></button>
        <button class="choice" onclick="OPT.sfx=OPT.sfx?0:1;saveOpt();render()"><b>효과음 ${OPT.sfx?'켜짐':'꺼짐'}</b></button>
        <button class="choice" onclick="OPT.bgm=OPT.bgm?0:1;saveOpt();render()"><b>배경음 ${OPT.bgm?'켜짐':'꺼짐'}</b><small>명조 공식 OST(유튜브) · assets/bgm의 mp3가 있으면 우선</small></button>
        <div class="choice" style="display:flex;align-items:center;gap:10px"><b style="flex:1">전체 음량</b><button class="btn" onclick="toggleMute();render()">${OPT.mute?'🔇 음소거됨':'🔊'}</button><input type="range" min="0" max="1" step="0.05" value="${OPT.vol}" oninput="setVol(this.value)" style="accent-color:#e9d9a6"></div>
        <button class="choice" onclick="setYt()"><b>지금 장면 배경음 바꾸기</b><small>유튜브 링크를 붙여 넣으세요</small></button>
        <button class="choice" onclick="saveQuit()"><b>저장하고 타이틀로</b><small>${inMap?'지금 지도 위치에서':'직전 지도 위치에서'} 이어할 수 있어요.</small></button>
        <button class="choice" onclick="toTitle()"><b>이번 판 포기</b><small>저장을 지우고 판을 끝내요. 게임 기록에 '중단'으로 남아요.</small></button>
        ${IS_APP?`<button class="choice" onclick="quitGame()"><b>게임 종료</b><small>앱을 닫아요. 진행은 ${inMap?'지금 지도 위치에':'직전 지도 위치에'} 저장돼 있어요.</small></button>`:''}
      </div></div></div>`}
  if(m.kind==='pile')return `<div class="modal" onclick="if(event.target===this)closeModal()"><div class="box"><h2>${m.title}</h2>
      <div class="cards" style="margin-top:14px">${m.list.map(c=>cardHTML(c)).join('')||'<p class="dim">비어 있음</p>'}</div>
      <div style="text-align:center;margin-top:16px"><button class="btn" onclick="closeModal()">닫기</button></div></div></div>`;
  return `<div class="modal"><div class="box"><h2>${m.title}</h2>
    <div class="cards" style="margin-top:14px">${m.list.map(c=>cardHTML(c,{click:`modalPick(${c.uid})`})).join('')}</div>
    <div style="text-align:center;margin-top:16px"><button class="btn" onclick="closeModal()">취소</button></div></div></div>`;
}
try{localStorage.removeItem('wuwa-spire-save-v1');localStorage.removeItem('wuwa-spire-save-v2')}catch(e){}
