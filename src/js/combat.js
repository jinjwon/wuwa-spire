/* ============ 전투 ============ */
const alive=()=>S.c.enemies.filter(e=>!e.dead);
function spawn(id){
  const d=EN[id];const A=S.asc||0;const k=(d.boss||d.elite?1:[1.1,1.2,1.3][S.act])*DF().hp*(1+(A>=1&&!d.boss&&!d.elite?.1:0)+(A>=2&&d.elite?.1:0)+(A>=3&&d.boss?.1:0));
  const hp=Math.round(rnd(d.hp[0],d.hp[1])*k);
  return{uid:UID++,id,hp,maxHp:hp,block:0,str:d.elite?DF().elite+(S.asc>=8?1:0):0,weak:0,vuln:0,fz:0,ur:0,vib:0,vibMax:d.boss?22:d.elite?14:8,broken:0,dead:false,mi:d.boss?0:rnd(0,d.m.length-1),bonus:(d.boss?0:[1,3,5][S.act])+DF().add+(S.asc>=4?1:0)};
}
function startCombat(ids,kind,fname){
  const lead=T_().find(id=>!S.party[id].down);
  S.c={kind,enemies:ids.map(spawn),draw:(()=>{const a=shuffle(S.deck.map(c=>({...c})));a.sort((x,y)=>(x.ench==='innate')-(y.ench==='innate'));return a})(),discard:[],hand:[],exhaust:[],energy:0,block:0,amp:0,weak:0,
    field:{t:0,b:0},orbit:0,melody:0,ghost:0,mecha:false,active:lead,conc:Object.fromEntries(T_().map(id=>[id,0])),lib:Object.fromEntries(T_().map(id=>[id,0])),paint:0,bloom:0,calc:0,calcNow:0,nextE:0,hyp:0,bond:0,freeBrush:0,camUni:0,suzu:0,
    switched:0,turn:0,tgt:null,log:[],busy:false,cur:lead,id:UID++};
  if(kind==='elite'&&S.burn)S.c.enemies.forEach(e=>{e.maxHp=e.hp=Math.round(e.hp*1.25);e.str+=2;e.burn=1});
  twinScale();applyAffixes(kind);S.c.fname=fname;
  S.c.enemies.forEach((e,i)=>{if(kind==='boss'&&!EN[e.id].boss&&e.slot==null&&S.c.enemies.some(z=>EN[z.id].boss)){e.slot=i%2}});
  S.c.enemies.forEach(setIntent);

  if(has('gulp'))S.c.conc[lead]=3;
  if(S.team.includes('lyn'))S.c.paint=3;
  if(has('tuner'))T_().forEach(id=>S.c.lib[id]+=2);
  if(has('rider'))T_().forEach(id=>S.c.lib[id]=Math.min(5,S.c.lib[id]+3));
  if(has('hoar'))S.c.block+=10;
  S.screen='combat';echoHook('cs',S.c);
  log(fname?`${fname} 출현!`:kind==='boss'?`명식 「${EN[ids[0]].n}」 출현!`:kind==='elite'?'강력한 잔상이 앞을 가로막습니다.':'잔상과 조우했습니다.');
  startTurn();
  if(!OPT.tut&&!window.FAST)setTimeout(()=>showTut(0),900);
  if(kind==='boss')turnBanner(fname?`${fname}!`:`명식 · ${EN[ids[0]].n}`,fname?S.c.enemies.map(e=>EN[e.id].n).join(' · '):EN[ids[0]].pv?EN[ids[0]].pv.tx:'');
  else if(fname)setTimeout(()=>{banner(fname+'!');sfx('affix')},500);
  if(S.c.enemies.some(e=>e.affix)&&!window.FAST)setTimeout(()=>{sfx('affix');S.c&&S.c.enemies.forEach(e=>e.affix&&pop(e,`${AFFIX[e.affix].i} ${AFFIX[e.affix].n}`,'info'));flushFx()},fname?1300:600);
}
/* 독창 시스템 ③: 운 — 편성 변화(쌍두 정예·쌍둥이 명식·호위), 변이 잔상, 치명타, 조수 룰렛, 카드 병합 */
const LUCK=()=>!window.FAST&&!window.NOLUCK;
const ESCORT=[['fjun','zig'],['tick','cruise'],['vjun','chirp'],['snip','gulp']];
// 편성: [적 id 목록, 전투 종류, 편성 이름]
function rollEncounter(kind,ids){
  if(!LUCK())return [ids,kind];const A=ACTS[S.act];const x=Math.random();
  if(kind==='boss'){const other=pick(['levia','aleph'].filter(b=>b!==ids[0]));
    if(x<.15||S.act===2&&S.asc>=10)return [[ids[0],other],'boss','쌍둥이 명식'];
    if(x<.45)return [[ids[0],...pick(ESCORT)],'boss','명식과 호위'];return [ids,kind]}
  if(kind==='elite'&&x<.22){const two=shuffle(A.elite.filter(z=>z[0]!==ids[0])).slice(0,1)[0];return [[ids[0],two[0]],'elite','쌍두 정예']}
  if(kind==='elite'&&x<.45)return [[ids[0],pick(A.easy)[0]],'elite','정예와 졸개'];
  if(kind==='battle'&&ids.length<3&&x<.2)return [[...ids,pick(A.easy)[0]],'battle','잔상 무리'];
  return [ids,kind];
}
const AFFIX={
  gold:{n:'황금',i:'✦',c:'#ffd75e',tx:'쓰러뜨리면 조개 화폐 +35. 행운의 잔상!'},
  giant:{n:'거대',i:'⬆',c:'#ff9a6b',tx:'체력 +40%. 쓰러뜨리면 공명 해방 +2.'},
  regen:{n:'재생',i:'✚',c:'#6fe3b0',tx:'자신의 턴이 끝날 때 체력 5 회복.'},
  frenzy:{n:'광폭',i:'✸',c:'#ff5d6c',tx:'힘 +2를 가지고 시작해요.'},
  shell:{n:'결정 껍질',i:'⬢',c:'#7fd8ff',tx:'방어 14를 가지고 시작해요.'},
  volatile:{n:'불안정',i:'☢',c:'#e0558a',tx:'쓰러지면 폭발해 다른 적 모두에게 10 피해. 연쇄 폭발 가능!'},
};
function applyAffixes(kind){
  if(!LUCK())return;const ch=(kind==='battle'?.22:kind==='elite'?.35:.25)+(has('e_magnet')?.15:0);
  S.c.enemies.forEach(e=>{if(EN[e.id].boss||Math.random()>=ch)return;const k=pick(Object.keys(AFFIX));e.affix=k;
    if(k==='giant'){e.maxHp=e.hp=Math.round(e.hp*1.4)}if(k==='frenzy')e.str+=2;if(k==='shell')e.block=14});
}
function twinScale(){const c=S.c;const el=c.enemies.filter(e=>EN[e.id].elite);if(el.length>1)el.forEach(e=>{e.maxHp=e.hp=Math.round(e.hp*.68)});const bs=c.enemies.filter(e=>EN[e.id].boss);if(bs.length<2)return;
  const base=EN[ACTS[S.act].boss].hp[0];bs.forEach(e=>{e.maxHp=e.hp=Math.round(base*DF().hp*.62);e.mul=.75;e.vibMax=16})}
function rollCrit(){const c=S.c;if(!LUCK())return false;return Math.random()<.08+(c.luck||0)+(has('charm')?.04:0)+(has('e_coin')?.05:0)}
// 조수 룰렛: 매 턴 시작마다 바다가 굴리는 운
const TIDES=[
  {k:'calm',w:27,n:'잔잔한 물결',i:'〰',tx:'아무 일도 없어요.'},
  {k:'flow',w:18,n:'해류',i:'⇶',tx:'카드 1장 더 뽑아요.',f:c=>c.tideDraw=1},
  {k:'high',w:15,n:'만조',i:'▲',tx:'에너지 +1.',f:c=>c.energy++},
  {k:'luck',w:15,n:'행운의 물결',i:'✧',tx:'이번 턴 치명타 확률 +25%.',f:c=>c.luck=.25},
  {k:'back',w:12,n:'역류',i:'↺',tx:'모든 적 취약 1.',f:()=>alive().forEach(e=>vuln(e,1))},
  {k:'whirl',w:10,n:'소용돌이',i:'@',tx:'모든 적 공진 +3.',f:()=>alive().forEach(e=>addVib(e,3))},
  {k:'gold',w:3,n:'황금 조수',i:'★',tx:'잭팟! 에너지 +1, 카드 +2, 치명타 +50%.',f:c=>{c.energy++;c.tideDraw=2;c.luck=.5},jp:1},
];
function rollTide(){const c=S.c;c.luck=0;c.tideDraw=0;if(!LUCK()||c.turn<(has('e_tide')?1:2))return null;
  let r=Math.random()*100;let t=TIDES.find(x=>(r-=x.w)<0)||TIDES[0];if(t.k==='calm'&&has('e_clover')){r=Math.random()*100;t=TIDES.find(x=>(r-=x.w)<0)||TIDES[0]}t.f&&t.f(c);c.tide=t.k;return t}
function showTide(t){if(!t||window.FAST)return;document.querySelectorAll('.tide').forEach(x=>x.remove());
  const b=document.createElement('div');b.className='tide';b.innerHTML=`<div class="reel"><b>${TIDES[0].i}</b></div><div class="tt"><small>조수 룰렛</small><span>…</span></div>`;document.body.appendChild(b);
  const reel=b.querySelector('.reel b');let n=0;const spin=setInterval(()=>{reel.textContent=TIDES[n++%TIDES.length].i;sfx('tick')},55);
  setTimeout(()=>{clearInterval(spin);reel.textContent=t.i;b.classList.add('land',t.jp?'jp':t.k==='calm'?'calm':'ok');
    b.querySelector('.tt').innerHTML=`<small>조수 룰렛</small><span>${t.n}</span><em>${t.tx}</em>`;sfx(t.jp?'jackpot':t.k==='calm'?'tick':'tide');
    if(t.jp){flash('#ffd75e');banner('★ 황금 조수 ★')}},650/OPT.speed);
  setTimeout(()=>b.classList.add('out'),2300/OPT.speed);setTimeout(()=>b.remove(),2800/OPT.speed)}
/* 카드 조합: 한 턴에 쓴 카드 종류 3장 순서가 레시피와 맞으면 추가 효과. 두 공명자 이상이 섞이면 합주 ×1.5 */
const RECIPES=[
  {k:['공격','스킬','공격'],n:'검무',tx:'모든 적에게 6 피해 + 공진 2',f:m=>alive().forEach(e=>{hit(e,Math.round(6*m),{raw:1});addVib(e,2)})},
  {k:['스킬','공격','스킬'],n:'반격 태세',tx:'보호막 8 + 카드 1장',f:m=>{gainBlock(Math.round(8*m));draw(1)}},
  {k:['공격','공격','공격'],n:'연타',tx:'무작위 적에게 12 피해',f:m=>{const T=pick(alive());T&&hit(T,Math.round(12*m),{raw:1})}},
  {k:['스킬','스킬','스킬'],n:'화음',tx:'에너지 +1 + 보호막 4',f:m=>{S.c.energy++;gainBlock(Math.round(4*m))}},
  {k:['스킬','스킬','공격'],n:'준비된 일격',tx:'모든 적 취약 1 + 8 피해(무작위)',f:m=>{alive().forEach(e=>vuln(e,1));const T=pick(alive());T&&hit(T,Math.round(8*m),{raw:1})}},
  {k:['공격','공격','스킬'],n:'숨 고르기',tx:'출전 공명자 체력 4 회복 + 협주 +1',f:m=>{heal(S.c.active,Math.round(4*m));gainConc(S.c.active,1)}},
];
const TSYM={공격:'공',스킬:'스',파워:'파'};
function comboCheck(c,d,owner){if(!TSYM[d.t])return;c.seq=[...(c.seq||[]),{t:d.t,o:owner}].slice(-3);if(c.seq.length<3)return;
  const r=RECIPES.find(r=>r.k.every((t,i)=>c.seq[i].t===t));if(!r)return;const duo=new Set(c.seq.map(x=>x.o)).size>1;
  c.seq=[];FXDELAY=200;HITSEQ=0;c.cur=owner;r.f(duo?1.5:1);FXDELAY=0;log(`조합 — ${r.n}${duo?' (합주 ×1.5)':''}`);
  if(!window.FAST){sfx('jackpot');banner(`${duo?'합주 · ':''}${r.n}!`);flash(duo?'#ffd75e':'#7fd8ff')}}
// 번뜩임(카오스 제로 나이트메어식): 턴 시작에 손패 한 장이 빛나고, 그 카드를 쓰면 효과 3개 중 하나를 골라 덱의 카드를 영구히 바꾼다 (전투당 1회, 카드당 1회)
const EPI={
  sharp:{n:'예리한 공명',tx:'수치 +30%',ok:d=>Object.values(d.v||{}).some(x=>Array.isArray(x))},
  light:{n:'가벼운 선율',tx:'비용 -1',ok:d=>d.c!=='X'&&Math.max(...[d.c].flat())>0},
  draw:{n:'잔향 연쇄',tx:'사용 시 카드 1장',f:()=>draw(1)},
  conc:{n:'협주 고조',tx:'사용 시 협주 +1',f:o=>gainConc(o,1)},
  lib:{n:'해방 공명',tx:'사용 시 해방 +1',f:o=>gainLib(o,1)},
  guard:{n:'공명 방벽',tx:'사용 시 보호막 4',f:()=>gainBlock(4)},
  vib:{n:'진동 증폭',tx:'사용 시 대상 공진 +2',ok:d=>!!d.tg,f:(o,T)=>{if(T&&!T.dead)addVib(T,2)}},
};
const epiOptions=d=>{const a=Object.keys(EPI).filter(k=>!EPI[k].ok||EPI[k].ok(d));for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,3)};
function markEpiphany(c){if(!LUCK()||c.epi||c.epiUid||Math.random()>=.3)return;const x=pick(c.hand.filter(y=>!y.ep&&!CD[y.id].unplay));if(x)c.epiUid=x.uid}
function pickEpiphany(k){const m=S.modal,c=S.c,card=c.hand.find(x=>x.uid===m.uid);S.modal=null;c.epi=1;c.epiUid=0;
  card.ep=k;const dk=S.deck.find(x=>x.uid===card.uid);if(dk)dk.ep=k;
  log(`번뜩임 — 「${CD[card.id].n}」 ${EPI[k].n}`);if(!window.FAST){sfx('merge');banner(`✧ 번뜩임 · ${EPI[k].n}`);flash('#e9d9a6')}
  playCard(m.uid,m.T)}
function combo(c){if(window.FAST||c.cards<3)return;try{tone(500+90*Math.min(c.cards,10),.08,'triangle',.08)}catch(e){}
  const b=document.createElement('div');b.className='combo';b.innerHTML=`<b>${c.cards}</b> COMBO`;document.body.appendChild(b);setTimeout(()=>b.remove(),700)}
function flash(col){if(window.FAST)return;const f=document.createElement('div');f.className='flash';f.style.setProperty('--fc',col);document.body.appendChild(f);setTimeout(()=>f.remove(),420)}
function shakeStage(big){if(window.FAST)return;const st=$('#stage');if(!st)return;const k=big?'shake2':'shake';st.classList.remove('shake','shake2');void st.offsetWidth;st.classList.add(k)}
// 카드 병합: 손에 같은 카드 2장 → 하나로 융합(수치 ×1.5, 이번 전투 동안). 한 장은 소멸.
const mergeable=card=>{const d=CD[card.id];return !card.fu&&!d.unplay&&d.v&&Object.keys(d.v).length&&S.c.hand.filter(x=>x.id===card.id&&!x.fu&&x.up===card.up).length>=2};
function mergeCard(uid){const c=S.c;if(!c||c.busy)return;const a=c.hand.find(x=>x.uid===uid);if(!a||!mergeable(a))return;
  const b=c.hand.find(x=>x!==a&&x.id===a.id&&!x.fu&&x.up===a.up);c.hand.splice(c.hand.indexOf(b),1);c.exhaust.push(b);a.fu=1;
  if(has('e_star'))draw(1);sfx('merge');log(`카드 병합 — ${CD[a.id].n} 융합!`);pop('p-'+c.active,'융합!','info');render();
  const el=document.querySelector(`[data-card="${a.uid}"]`);if(el&&!window.FAST)el.animate([{filter:'brightness(3)',scale:1.25},{filter:'none',scale:1}],{duration:450,easing:'cubic-bezier(.2,.8,.3,1)'})}
function setIntent(e){const m=(e.p2&&EN[e.id].m2)||EN[e.id].m;e.move=m[e.mi%m.length];e.mi++}
function log(t){S.c.log.push(t);if(S.c.log.length>4)S.c.log.shift()}
function startTurn(){
  const c=S.c;c.turn++;c.block=0;c.switched=0;
  c.energy=3+(S.bonusE||0)+(has('levia')?1:0)+c.nextE;c.nextE=0;
  if(c.turn>1&&c.echoCd>0)c.echoCd--;
  c.played=new Set();
  if(WPN(c.active,'w_guard'))gainBlock(5);
  if(c.turn===1)T_().forEach(id=>{if(WPN(id,'w_pistol'))draw(1)});
  if(c.bond)heal(c.active,c.bond);
  if(has('turtle'))gainBlock(4);
  if(has('hoar')&&c.turn===1)c.block=10;
  if(c.field.t>0){gainBlock(c.field.b);heal(c.active,2);c.field.t--}
  if(c.orbit){gainBlock(c.orbit);gainConc(c.active,1)}
  if(c.melody)alive().forEach(e=>fz(e,c.melody));
  if(c.suzu)alive().forEach(e=>frost(e,c.suzu));
  echoHook('ts',c);c.atkN=0;c.seq=[];
  if(son2('응결'))gainBlock(3);if(son4('응결')&&c.turn===1)alive().forEach(e=>{e.weak+=2});
  if(son2('기류'))gainConc(c.active,1);if(son2('전도'))gainLib(c.active,1);
  const tide=rollTide();
  draw(5+(c.turn===1&&has('crown')?2:0)+(c.tideDraw||0)+(son4('기류')?1:0));markEpiphany(c);
  if(!(c.turn===1&&c.kind==='boss'))turnBanner('플레이어 턴',c.turn>1?`${c.turn}턴`:'');
  render();if(tide)setTimeout(()=>showTide(tide),500/OPT.speed);
}
function draw(n){
  const c=S.c;
  for(let i=0;i<n;i++){
    if(!c.draw.length){if(!c.discard.length)break;c.draw=shuffle(c.discard);c.discard=[]}
    if(c.hand.length>=10)break;
    c.hand.push(c.draw.pop());
  }
}
const ENCH={
  sharp:{n:'예리',tx:'공격 피해 +3',c:'#ff8a8a'},sturdy:{n:'견고',tx:'얻는 보호막 +3',c:'#8cc8ff'},
  swift:{n:'신속',tx:'비용 -1',c:'#9ff0c8'},echo:{n:'메아리',tx:'전투에서 처음 쓸 때 복사본을 손에 추가',c:'#d6a8ff'},
  innate:{n:'선천',tx:'전투 시작 시 손에서 시작',c:'#ffd75e'}};
function enchOk(card,k){const d=CD[card.id];if(d.unplay||card.ench)return false;if(k==='sharp')return d.t==='공격';if(k==='sturdy')return /보호막/.test(cardText(card));if(k==='swift')return (Array.isArray(d.c)?d.c[card.up?1:0]:d.c)>0;return true}
function randomEnch(card){const ks=Object.keys(ENCH).filter(k=>enchOk(card,k));return ks.length?pick(ks):null}
function enchantFlow(n,title,after){
  let left=n;const step=()=>{if(left--<=0){S.modal=null;after&&after();render();return}
    chooseCard(x=>!!randomEnch(x),title+` (${n-left}/${n})`,x=>{x.ench=randomEnch(x);step()})};
  if(!S.deck.some(x=>randomEnch(x))){after&&after();return render()}step();
}
const VARIANTS=[
  [{name:'1구역 · 잠긴 해안의 탑',hue:0,flavor:'달빛 아래 가라앉은 해안. 바닷물이 탑의 아랫부분을 삼켰다.'},
   {name:'1구역 · 무음 지대의 숲',hue:95,flavor:'소리가 사라진 숲. 잔상들이 풀숲 사이에서 숨을 죽이고 있다.',normalAdd:[['gulp','gulp'],['hoar','chirp'],['cruise','cruise','zig']]}],
  [{name:'2구역 · 별빛 첨탑',hue:0,flavor:'별빛이 결정처럼 굳은 첨탑. 공허의 기척이 가까워진다.'},
   {name:'2구역 · 라하이로이 폐허',hue:-55,flavor:'붉게 타오른 폐허 도시. 기계 잔상들이 순찰을 돈다.',normalAdd:[['scout','scout'],['saur','fdread'],['spear','snip']]}],
  [{name:'3구역 · 심연의 정점',hue:180,flavor:'탑의 꼭대기는 바다 밑처럼 고요하다. 이름 없는 노래가 들려온다.'},
   {name:'3구역 · 잊힌 별의 회랑',hue:-120,flavor:'별이 꺼진 회랑. 모든 잔상이 심연의 색으로 물들었다.',normalAdd:[['crown','tick_x'],['hecate','snip_x']]}]];
function pickVariant(){S.vari=rnd(0,1)}
const AV=()=>VARIANTS[S.act][S.vari||0];
const ANCIENTS=[
  {n:'잔향의 관측자',t:'1구역의 고대',art:'2/26/Sequence_Node_To_the_New_World.png',line:'"새로운 파도가 탑을 오르는구나. 무엇을 짊어지고 가겠느냐."'},
  {n:'별을 짓는 자',t:'2구역의 고대',art:'b/bd/Sequence_Node_Infinity_Awaits_Me.png',line:'"여기까지 온 공명이여. 대가를 치를 각오가 있다면, 더 큰 힘을 주마."'},
  {n:'심연의 지휘자',t:'3구역의 고대',art:'2/26/Sequence_Node_To_the_New_World.png',line:'"마지막 악장이다. 끝까지 연주할 힘을 고르거라."'}];
const BLESS=[
  {k:'hp',n:'단단한 공명',d:'파티 전원 최대 체력 +10',f:()=>T_().forEach(id=>{S.party[id].maxHp+=10;S.party[id].hp+=10})},
  {k:'rare',n:'희귀한 선율',d:'파티 공명자의 희귀 카드 1장 획득',f:()=>{const pool=REWARD_POOL.filter(k=>CD[k].r&&S.team.includes(CD[k].o));if(pool.length)S.deck.push(mk(pick(pool)))}},
  {k:'remove',n:'잡음 정리',d:'카드 2장 제거',flow:after=>{let n=2;const step=()=>{if(n--<=0||S.deck.length<=5){S.modal=null;after();return}chooseCard(()=>true,'제거할 카드',x=>{S.deck=S.deck.filter(y=>y.uid!==x.uid);step()})};step()}},
  {k:'ench',n:'공명 각인',d:'카드 2장에 무작위 인챈트(예리·견고·신속·메아리·선천)',flow:after=>enchantFlow(2,'인챈트할 카드',after)},
  {k:'echo',n:'잊힌 에코',d:'무작위 에코 1개 획득',f:()=>{const pool=TREASURE_ECHO.filter(e=>!has(e));if(pool.length)gainEcho(pick(pool))}},
  {k:'gold',n:'조개 화폐 더미',d:'조개 화폐 +150',f:()=>{S.gold+=150}},
  {k:'upgrade',n:'정련',d:'무작위 카드 3장 강화',f:()=>shuffle(S.deck.filter(x=>!x.up&&!CD[x.id].unplay)).slice(0,3).forEach(x=>x.up=true)},
];
const BLESS2=[{k:'energy',n:'과부하된 심장',d:'매 턴 에너지 +1 · 대신 덱에 「잔향 노이즈」 2장',f:()=>{S.bonusE=(S.bonusE||0)+1;S.deck.push(mk('noise'),mk('noise'))}},
  {k:'pact',n:'피의 계약',d:'희귀 카드 2장 획득 · 대신 파티 전원 최대 체력 -8',f:()=>{const pool=REWARD_POOL.filter(k=>CD[k].r&&S.team.includes(CD[k].o));for(let i=0;i<2&&pool.length;i++)S.deck.push(mk(pick(pool)));T_().forEach(id=>{const p=S.party[id];p.maxHp=Math.max(10,p.maxHp-8);p.hp=Math.min(p.hp,p.maxHp)})}}];
function openAncient(){
  const opts=shuffle(BLESS.slice()).slice(0,2).concat(S.act?[pick(BLESS2)]:[shuffle(BLESS.slice()).find(b=>b.k==='hp'||b.k==='gold')]);
  const seen=new Set();S.ancient={opts:opts.filter(o=>!seen.has(o.k)&&seen.add(o.k)).map(o=>o.k)};S.screen='ancient';S.modal=null;render();
}
function takeBlessing(k){const b=[...BLESS,...BLESS2].find(x=>x.k===k);const done=()=>{S.screen='map';S.ancient=null;S._scrolled=false;render()};
  if(b.flow)b.flow(done);else{b.f();done()}}
function ancientHTML(){const A=ANCIENTS[S.act];
  return `<div class="screen"><div class="box wbox ancient"><div class="anc-art" style="background-image:url('${WIKI+A.art}/revision/latest/scale-to-width-down/240')"></div>
   <small class="eng">ANCIENT · ${AV().name}</small><h2>${A.n}</h2><div class="dim">${A.t}</div>${S.healNote?`<p class="dim">구역을 넘어오며 모든 공명자가 최대 체력의 ${S.healNote}%를 회복했습니다.</p>`:''}
   <p>${A.line}</p><div class="choices">${S.ancient.opts.map(k=>{const b=[...BLESS,...BLESS2].find(x=>x.k===k);return `<button class="choice" onclick="takeBlessing('${k}')"><b>${b.n}</b><small>${b.d}</small></button>`}).join('')}</div></div></div>`}
/* 무기: 공명자마다 1개 장착하는 고유 효과 장비 */
const WEAPON_DEF={
  w_blade:{n:'흐르는 칼날',k:'직검',i:'🗡',tx:'장착 공명자의 공격 피해 +2.'},
  w_heavy:{n:'단층 대검',k:'대검',i:'⚔',tx:'장착 공명자의 타격마다 공진 +1 추가.'},
  w_pistol:{n:'쌍성 권총',k:'권총',i:'✦',tx:'전투 시작 시 카드 1장을 추가로 뽑음.'},
  w_rect:{n:'공명 증폭기',k:'증폭기',i:'◎',tx:'장착 공명자의 카드를 쓸 때 해방 게이지 +1 추가.'},
  w_guard:{n:'수호 권갑',k:'권갑',i:'⬢',tx:'장착 공명자가 출전 중이면 턴 시작 시 보호막 5.'},
  w_tide:{n:'밀물의 결',k:'직검',i:'≋',tx:'장착 공명자가 변주로 등장하면 에너지 +1.'},
  w_thorn:{n:'피어나는 가시',k:'직검',i:'❀',tx:'장착 공명자가 적을 처치하면 체력 6 회복.'},
  w_star:{n:'별무리 지팡이',k:'증폭기',i:'✧',tx:'장착 공명자의 회복량 +3.'},
};
const WPN=(id,w)=>S.weapons&&S.weapons[id]===w;
function offerWeapon(w,after){S.modal={kind:'weapon',w,after};render()}
function equipWeapon(id){const m=S.modal;(S.weapons=S.weapons||{})[id]=m.w;S.modal=null;m.after&&m.after();render()}
const chained=()=>!!S.c.chain;
function observe(n){const c=S.c;const top=c.draw.splice(-n);const keep=top.filter(x=>!CD[x.id].unplay);const out=top.length-keep.length;c.discard.push(...top.filter(x=>CD[x.id].unplay));c.draw.push(...keep);pop('party',`관측 · ${out}장 버림`,'info')}
function costOf(card){
  const d=CD[card.id];if(d.c==='X')return S.c?S.c.energy:0;let k=Array.isArray(d.c)?d.c[card.up?1:0]:d.c;
  if(d.o!=='any'&&d.o!==S.c.active)k+=1;
  if(card.id==='aem_break'&&S.c.mecha)k-=1;
  if(card.ench==='swift')k-=1;
  if(card.ep==='light')k-=1;
  return Math.max(0,k);
}
function canPlay(card){
  const d=CD[card.id];if(d.unplay||S.c.busy)return false;
  if(d.o!=='any'&&S.party[d.o].down)return false;
  if(d.duo&&d.duo.some(x=>!S.party[x]||S.party[x].down))return false;
  return costOf(card)<=S.c.energy;
}
function clickCard(uid){
  const c=S.c;const card=c.hand.find(x=>x.uid===uid);if(!card||!canPlay(card))return;
  if(c.tgt&&c.tgt.uid===uid){c.tgt=null;return render()}
  if(CD[card.id].tg&&alive().length>1){c.tgt={kind:'card',uid};return render()}
  flyCard(uid,CD[card.id].tg?alive()[0]:null);playCard(uid,alive()[0]);
}
function clickEnemy(euid){
  const c=S.c;if(!c.tgt)return;const T=c.enemies.find(e=>e.uid===euid);if(!T||T.dead)return;
  const t=c.tgt;c.tgt=null;
  if(t.kind==='card'){flyCard(t.uid,T);playCard(t.uid,T)}else if(t.kind==='potion')usePotion(t.i,T);else doLib(T);
}
function playCard(uid,T){
  const c=S.c;const idx=c.hand.findIndex(x=>x.uid===uid);const card=c.hand[idx];const d=CD[card.id];
  if(c.epiUid===uid){S.modal={kind:'epi',uid,T,opts:epiOptions(d)};return render()}
  c.X=costOf(card);c.energy-=c.X;c.hand.splice(idx,1);
  const owner=d.duo?(d.duo.includes(c.active)?c.active:d.duo[0]):d.o==='any'?c.active:d.o;c.cur=owner;c.chain=[...(c.played||[])].some(o=>o!==owner);
  const atk=d.t==='공격';anim('u-'+owner,atk?'atk':d.v?.b?'block':'cast');FXDELAY=atk?170:60;HITSEQ=0;
  if(!atk)vfx('circle','u-'+owner,{c:CH[owner].color});
  if(atk&&c.calc){c.calcNow=c.calc;c.calc=0}
  c.curCard=card;if(atk)c.atkN=(c.atkN||0)+1;
  if(card.ench==='echo'&&!card.echoed){card.echoed=1;c.hand.push({...card,uid:UID++,ench:null})}
  d.p(vals(card),T,card);if(card.ep&&EPI[card.ep].f)EPI[card.ep].f(owner,T);if(atk&&T&&!T.dead&&alive().includes(T))applyElem(T,CH[owner].el);FXDELAY=0;c.calcNow=0;c.curCard=null;
  if(atk&&c.freeBrush&&S.team.includes('lyn'))paint(c.freeBrush);
  (c.played=c.played||new Set()).add(owner);
  gainConc(owner,1);gainLib(owner,1);if(WPN(owner,'w_rect'))gainLib(owner,1);
  if(d.pw){}else if(d.ex)c.exhaust.push(card);else c.discard.push(card);
  log(`${CH[owner].name} — ${d.n}${card.up?'+':''}`);
  onPlayerCard(d);sfx('card');echoHook('play',c);combo(c);comboCheck(c,d,owner);
  afterAction();
}
function afterAction(){
  if(S.c&&!S.c.ending&&wiped()){S.c.busy=true;render();window.FAST?queueMicrotask(lose):setTimeout(lose,700);return}
  maybeWin();render();
}
function onPlayerCard(d){
  const c=S.c;c.cards=(c.cards||0)+1;
  alive().forEach(e=>{const pv=EN[e.id].pv;if(!pv)return;
    if(pv.k==='anger'&&d.t==='스킬'){e.str+=pv.v;pop(e,`분노 · 힘 +${pv.v}`,'info');anim('e'+e.uid,'cast')}
    if(pv.k==='static'&&c.cards%4===0){anim('e'+e.uid,'cast');FXDELAY=250;hurtParty(pv.v,e);FXDELAY=0;log(`${EN[e.id].n} — ${pv.n}`)}
  });
}
function enemyHook(T,wasAttack){
  const pv=EN[T.id].pv;if(!pv)return;const c=S.c;
  if(pv.k==='thorns'&&wasAttack&&!T.dead)hurtParty(pv.v,T);
  if(pv.k==='enrage'&&!T.p2&&!T.dead&&T.hp<=T.maxHp/2){T.p2=1;T.str+=pv.v;pop(T,`폭주 · 힘 +${pv.v}`,'info');anim('e'+T.uid,'cast',300)}
  if(pv.k==='awaken'&&!T.p2&&!T.dead&&T.hp<=T.maxHp/2){T.p2=1;T.vuln=T.weak=T.fz=T.ur=0;T.str+=2;T.block+=15;T.mi=0;setIntent(T);
    log(`${EN[T.id].n} — ${pv.n}!`);setTimeout(()=>turnBanner(pv.n,`${EN[T.id].n}의 패턴이 바뀝니다`),350);anim('e'+T.uid,'cast',300)}
  if(pv.k==='summon'&&!T.dead){
    const r=T.hp/T.maxHp;const lv=r<=.33?2:r<=.66?1:0;
    if(lv>(T.sumLv||0)){T.sumLv=lv;summon(T);if(lv===2){T.str+=3;pop(T,'힘 +3','info')}}
  }
}
const MINIONS=[['fjun','zig'],['tick','cruise'],['vjun','chirp']];
function summon(boss){
  const c=S.c;const used=c.enemies.filter(e=>!e.dead&&e.slot!=null).map(e=>e.slot);
  const pair=pick(MINIONS);let k=0;
  for(const slot of [0,1]){if(used.includes(slot))continue;const e=spawn(pair[k++]);e.slot=slot;setIntent(e);c.enemies.push(e)}
  c.rebuild=true;log(`${EN[boss.id].n} — 공허의 창조`);
}
function maybeWin(){
  const c=S.c;if(!c||alive().length||c.ending)return false;
  c.ending=true;c.busy=true;c.tgt=null;if(!window.FAST){setTimeout(()=>{flash('#fff');shakeStage(true);hitStop(220);banner('VICTORY')},250)}window.FAST?queueMicrotask(winCombat):setTimeout(winCombat,750);return true;
}
function gainConc(id,n){S.c.conc[id]=Math.min(3,S.c.conc[id]+n)}
function gainLib(id,n){S.c.lib[id]=Math.min(5,S.c.lib[id]+n)}
function hit(T,base,o={}){
  if(!T||T.dead)return;const c=S.c;let d=base+(c.curCard&&c.curCard.ench==='sharp'&&!o.raw?3:0);
  if(!o.raw)d+=(WPN(c.cur,'w_blade')?2:0)+(c.cur==='aem'&&c.mecha?3:0)+(has('fdread')?1:0)+(has('dreamless')?2:0)+((c.cur==='aem'||c.cur==='mor')&&has('snip')?2:0)+(c.cur==='cam'?c.bloom:0)+(c.cur==='lyn'?Math.floor(c.paint/2):0)+c.calcNow;
  if(!o.raw&&CH[c.cur]&&son2(CH[c.cur].el))d+=2;
  d+=T.ur||0;if(!o.raw&&has('e_whet')&&c.atkN===1&&c.curCard)d+=5;
  let m=1;if(c.amp>0)m*=1.3;if(c.weak>0)m*=.75;if(T.vuln>0)m*=1.5;if(T.broken>0)m*=1.5;
  const cr=!o.raw&&rollCrit();if(cr){m*=has('e_dice')?2.25:1.75;if(has('e_vamp'))heal(c.active,2);const dl=FXDELAY+HITSEQ*110;pop(T,'치명타!','crit');sfx('critx',dl);if(!window.FAST)setTimeout(()=>{flash('#fff3c4');shakeStage(true);hitStop(140)},dl/OPT.speed)}
  dmgEnemy(T,Math.max(0,Math.floor(d*m)));
}
/* 독창 시스템 ②: 진동(공진) 게이지가 가득 차면 공진 파괴 — 다음 행동 1회 건너뜀 + 받는 피해 +50% */
function addVib(T,n){
  if(!T||T.dead||T.broken>0)return;T.vib+=n;
  if(T.vib>=T.vibMax){T.vib=0;T.broken=1;pop(T,'공진 파괴!','info');if(has('e_mirror'))setTimeout(()=>{if(S.c&&!T.dead){dmgEnemy(T,12,true,'burst');maybeWin();render()}},50);log(`${EN[T.id].n} 공진 파괴!`);sfx('crit');setTimeout(()=>{hitStop(160);banner('공진 파괴!')},200)}
}
function dmgEnemy(T,d,pierce,style){
  let left=d;if(!pierce){const ab=Math.min(T.block,left);T.block-=ab;left-=ab;if(ab&&!T.block){pop(T,'방어 파괴!','brk');vfx('shield','e'+T.uid,{})}else if(ab&&!left)pop(T,'막음','blk')}
  const dl=FXDELAY+HITSEQ*110;HITSEQ++;const own=S.c.cur;
  T.hp-=left;pop(T,`-${d}`,'dmg');anim('e'+T.uid,'hit',dl);
  sfx(d>=18?'crit':'hit',dl);if(!window.FAST)setTimeout(()=>hitStop(d>=18?110:55),dl/OPT.speed);
  vfx(style||(pierce?'burst':(WEAPON[own]||'sword')),'e'+T.uid,{c:pierce?EL.회절:CH[own].color,el:pierce?'회절':CH[own].el,from:'u-'+own,big:d>=18},dl);
  if(T.hp<=0){T.hp=0;T.dead=true;if(WPN(own,'w_thorn'))heal(own,6);sfx('death',dl+120);S.stats.kills++;log(`${EN[T.id].n} 처치!`);vfx('death','e'+T.uid,{c:EL[EN[T.id].el]},dl+120);if(has('chirp'))heal(S.c.active,3);if(has('hecate'))S.c.energy++;onAffixDeath(T,dl);echoHook('kill',T)}
  enemyHook(T,!pierce&&style!=='burst');
  if(!pierce&&style!=='burst')addVib(T,1+(WPN(own,'w_heavy')?1:0));
}
function onAffixDeath(T,dl){const c=S.c;const a=T.affix;if(!a)return;
  if(a==='gold'){S.gold+=35;c.goldBonus=(c.goldBonus||0)+35;pop(T,'+35 화폐','gold');sfx('coin',dl+150);sfx('coin',dl+300)}
  if(a==='giant'){gainLib(c.active,2);pop('p-'+c.active,'해방 +2','info')}
  if(a==='volatile'){T.affix=null;sfx('boom',dl+200);if(!window.FAST)setTimeout(()=>{flash('#e0558a');shakeStage(true)},(dl+200)/OPT.speed);log(`${EN[T.id].n} 폭발!`);
    const own=c.cur,fd=FXDELAY;alive().forEach(e=>{FXDELAY=dl+200;dmgEnemy(e,10,true,'burst')});FXDELAY=fd;c.cur=own}}
const fz=(T,n)=>{if(T&&!T.dead){T.fz+=n;pop(T,`잔향 +${n}`,'info')}};
const vuln=(T,n)=>{if(T&&!T.dead)T.vuln+=n+(has('explorer')?1:0)};
function gainBlock(n){const c=S.c;if(c.curCard&&c.curCard.ench==='sturdy'&&n>0)n+=3;c.block+=n;pop('party',`+${n} 보호막`,'blk');vfx('shield','u-'+c.active,{});if(c.hyp&&n>0&&alive().length)dmgEnemy(pick(alive()),c.hyp,false,'burst')}
function paint(n){const c=S.c;c.paint=Math.min(12,c.paint+n);if(n>0)pop('p-lyn',`색채 +${n}`,'info')}
function bloom(n){const c=S.c;c.bloom=Math.min(10,c.bloom+n);if(n>0)pop('p-cam',`개화 +${n}`,'info')}
function unravel(T,n){if(T&&!T.dead){T.ur+=n;pop(T,`해체 +${n}`,'info')}}
function selfHurt(id,n){const p=S.party[id];if(!p||p.down)return;const lost=Math.min(n,p.hp-1);if(lost<=0)return;p.hp-=lost;pop('p-'+id,`-${lost}`,'dmg');if(id==='cam'&&S.c.camUni)bloom(S.c.camUni)}
function heal(id,n){const p=S.party[id];if(p.down)return;if(WPN(id,'w_star'))n+=3;const before=p.hp;p.hp=Math.min(p.maxHp,p.hp+n);if(S.c&&S.screen==='combat'&&p.hp>before){sfx('heal');pop('p-'+id,`+${p.hp-before}`,'heal');vfx('heal','u-'+id,{})}}
function setField(n,b){const f=S.c.field;f.t=Math.max(f.t,n);f.b=Math.max(f.b,b);pop('party','별의 영역','info')}
function toggleMecha(b){const c=S.c;if(c.mecha){c.mecha=false;gainBlock(b);pop('p-aem','일반 형태','info')}else{c.mecha=true;pop('p-aem','메카스카우트!','info')}}

/* 교체 · 변주 · 협주 */
function switchCost(){return S.c.switched?1:0}
function doSwitch(id){
  const c=S.c;if(c.busy||id===c.active||S.party[id].down)return;
  const cost=switchCost();if(c.energy<cost)return;
  c.energy-=cost;const out=c.active;const full=c.conc[out]>=3;
  if(full){c.cur=out;outro(out,id);c.conc[out]=0}
  c.active=id;c.cur=id;
  if(!c.switched){if(has('vjun'))gainBlock(5);if(has('zig'))draw(1)}
  c.switched++;
  anim('u-'+id,'enter');
  if(full&&WPN(id,'w_tide'))c.energy++;
  if(full){FXDELAY=200;intro(id);FXDELAY=0;alive().forEach(e=>addVib(e,3));log(`협주 → 변주! ${CH[out].name} → ${CH[id].name}`);banner(`${CH[out].name} 협주 → ${CH[id].name} 변주`)}
  else log(`${CH[id].name}(으)로 교체`);
  if(c.ghost&&alive().length){c.cur='aem';hit(pick(alive()),c.ghost)}
  afterAction();
}
function outro(id,inc){
  const c=S.c;
  if(id==='rov')alive().forEach(e=>fz(e,2));
  if(id==='aem')c.amp=Math.max(c.amp,2);
  if(id==='sk'){heal(inc,6);c.amp=Math.max(c.amp,1)}
  if(id==='lyn'){c.energy+=1;draw(1)}
  if(id==='mor'){gainBlock(4);c.amp=Math.max(c.amp,1)}
  if(id==='chi'){alive().forEach(e=>unravel(e,2));heal(inc,4)}
  if(id==='cam'){alive().forEach(e=>{e.weak+=1});c.amp=Math.max(c.amp,1)}
  if(id==='hiy'){gainBlock(4);alive().forEach(e=>frost(e,1))}
}
function intro(id){
  const c=S.c;if(!alive().length)return;
  if(id==='rov'){const T=pick(alive());hit(T,5);fz(T,2)}
  if(id==='aem'){hit(pick(alive()),8);c.amp=Math.max(c.amp,1)}
  if(id==='sk')gainBlock(8);
  if(id==='lyn'){paint(2);const T=pick(alive());hit(T,4);hit(T,4)}
  if(id==='mor')gainBlock(6);
  if(id==='chi'){const T=pick(alive());hit(T,6);unravel(T,2)}
  if(id==='cam')hit(pick(alive()),9);
  if(id==='hiy'){const T=pick(alive());hit(T,6);frost(T,2)}
}
const LIB_TG={rov:1,aem:1,mor:1,cam:1};
function clickLib(){
  const c=S.c;const id=c.active;if(c.busy||c.lib[id]<5)return;
  if(LIB_TG[id]&&alive().length>1){c.tgt={kind:'lib'};return render()}
  doLib(alive()[0]);
}
function doLib(T){if(son4('전도')&&S.c)S.c.energy++;
  const c=S.c;const id=c.active;c.lib[id]=0;c.cur=id;
  cutIn(id);anim('u-'+id,id==='sk'?'cast':'ult',520);FXDELAY=id==='sk'?600:880;HITSEQ=0;
  if(id==='rov'){hit(T,22);fz(T,6)}
  if(id==='aem'){c.mecha=true;hit(T,28)}
  if(id==='sk'){T_().forEach(x=>heal(x,10));gainBlock(12);c.field.t+=2;c.field.b=Math.max(c.field.b,4)}
  if(id==='lyn'){const k=c.paint;c.paint=0;alive().forEach(e=>hit(e,8+k*3))}
  if(id==='mor'){gainBlock(15);hit(T,c.block,{raw:1})}
  if(id==='chi'){alive().forEach(e=>{hit(e,10);unravel(e,3)});T_().forEach(x=>heal(x,5))}
  if(id==='cam'){hit(T,26);bloom(3)}
  if(id==='hiy')alive().forEach(e=>{hit(e,12);frost(e,3)});
  (LIB_TG[id]?[[T,[0,110,220]]]:alive().map(e=>[e,[60]])).forEach(([e,ts])=>e&&!e.dead&&ts.forEach(t=>vfx(WEAPON[id],'e'+e.uid,{c:CH[id].color,big:1,from:'u-'+id},FXDELAY+t)));
  setTimeout(()=>libFinale(id),FXDELAY);
  FXDELAY=0;alive().forEach(e=>addVib(e,3));gainConc(id,1);
  if(has('aix')){c.energy++;draw(1)}
  log(`${CH[id].name} — ${CH[id].lib.split(':')[0]}`);
  afterAction();
}

/* 적 턴 */
async function endTurn(){sfx('end');
  const c=S.c;if(c.busy)return;c.busy=true;c.tgt=null;
  discardHandFx();
  const kept=[];for(const x of c.hand){const d=CD[x.id];if(d.ret){kept.push(x);continue}if(d.eth){c.exhaust.push(x);continue}if(x.id==='burn'){hurtParty(3);pop('party','오염 -3','dmg')}c.discard.push(x)}
  c.hand=kept;
  if(wiped()){render();await sleep(600);return lose()}
  echoHook('te',c);turnBanner('적 턴');
  c.amp=Math.max(0,c.amp-1);c.weak=Math.max(0,c.weak-1);
  if(has('mephis')&&c.block===0)gainBlock(6);
  render();await sleep(350);
  for(const e of c.enemies){
    if(e.dead)continue;
    e.block=0;
    if(e.fz>0){dmgEnemy(e,e.fz,true);log(`회절 잔향 폭발 ${e.fz}`);e.fz=Math.max(0,e.fz-1);render();await sleep(300);if(e.dead){if(maybeWin()){render();return}continue}}
    if(e.broken>0){e.broken--;log(`${EN[e.id].n} — 공진 파괴로 행동 불가`);pop(e,'기절','info');render();await sleep(380);continue}
    const m=e.move;
    if(m.b){e.block+=m.b;pop(e,`+${m.b} 방어`,'blk')}
    if(m.s){e.str+=m.s;pop(e,`힘 +${m.s}`,'info')}
    if(m.w){c.weak+=m.w;pop('party',`약화 ${m.w}`,'info')}
    if(m.add){const [cid,n,where]=m.add;for(let k=0;k<n;k++){const x=mk(cid);if(where==='draw')c.draw.splice(rnd(0,c.draw.length),0,x);else c.discard.push(x)}pop('party',`${CD[cid].n} +${n}`,'info')}
    log(`${EN[e.id].n} — ${m.n}`);
    if(m.d){anim('e'+e.uid,'atk');render();await sleep(300);
      for(let h=0;h<(m.h||1);h++){if(h)anim('e'+e.uid,'jab');hurtParty(enemyDmg(e,m),e);render();await sleep(h<(m.h||1)-1?200:330);if(wiped()){render();await sleep(700);return lose()}}}
    else{anim('e'+e.uid,'cast');render();await sleep(420)}
    if(e.affix==='regen'&&!e.dead&&e.hp<e.maxHp){const h=Math.min(5,e.maxHp-e.hp);e.hp+=h;pop(e,`+${h}`,'heal');render();await sleep(150)}
    const pv=EN[e.id].pv;if(pv&&pv.k==='metal'&&!e.dead){e.block+=pv.v;pop(e,`+${pv.v} 방어`,'blk');render();await sleep(150)}
  }
  c.dodge=0;c.enemies.forEach(e=>{if(!e.dead){e.vuln=Math.max(0,e.vuln-1);e.weak=Math.max(0,e.weak-1);e.ur=Math.max(0,e.ur-1);setIntent(e)}});
  c.cards=0;
  c.busy=false;startTurn();
}
const enemyDmg=(e,m)=>{let d=Math.floor((m.d+e.str+e.bonus)*DF().mul*(e.mul||1));if(e.weak>0)d=Math.floor(d*.75);return Math.max(0,d)};
const wiped=()=>T_().every(id=>S.party[id].down);
function hurtParty(d,e){
  const c=S.c;const ab=Math.min(c.block,d);c.block-=ab;const rest=d-ab;
  const p=S.party[c.active];
  if(e)vfx('claw','u-'+c.active,{c:EL[EN[e.id].el]||'#ff5d6c',big:d>=15});
  sfx(rest>0?'hurt':'block',FXDELAY);if(rest>0){hitStop(rest>=15?100:50);if(rest>=12){shakeStage(rest>=20);flash('rgba(255,60,80,.5)')}}
  if(rest>0){p.hp-=rest;pop('p-'+c.active,`-${rest}`,'dmg');anim('u-'+c.active,'hit');if(c.active==='cam'&&c.camUni)bloom(c.camUni)}
  else{pop('party',e&&ab>0?'완벽 회피!':'막음','blk');anim('u-'+c.active,'block');
    // 명조 ③: 적 공격을 보호막으로 전부 막으면 완벽 회피 → 반격 3 + 협주 +1 (턴당 최대 3회)
    if(e&&ab>0&&!e.dead&&(c.dodge=(c.dodge||0)+1)<=3){const own=c.cur;c.cur=c.active;dmgEnemy(e,3,true,'burst');gainConc(c.active,1);c.cur=own;if(!window.FAST){sfx('critx');flash('#bfe6ff')}}}
  if(p.hp<=0){p.hp=0;p.down=true;log(`${CH[c.active].name} 기절!`);const nx=T_().find(id=>!S.party[id].down);if(nx){c.active=nx;c.cur=nx;banner(`${CH[nx].name} 긴급 출전`)}}
}
// 게임 기록: 판이 끝날 때(패배·승리·포기) 한 줄씩 저장, 최근 50판 유지
const REC_KEY='wuwa-records';
function loadRecords(){try{return JSON.parse(localStorage.getItem(REC_KEY))||[]}catch(e){return []}}
function addRecord(r){if(!S||S._rec)return;S._rec=1;const L=loadRecords();
  L.unshift({t:Date.now(),r,d:S.diff,team:[...S.team],act:S.act,floor:S.floor,kills:S.stats.kills,deck:S.deck.length,echoes:S.echoes.length});
  try{localStorage.setItem(REC_KEY,JSON.stringify(L.slice(0,50)))}catch(e){}}
function lose(){sfx('lose');S.c.busy=false;S.screen='over';addRecord('lose');clearSave();render()}
function winCombat(){
  sfx('win');const c=S.c;const kind=c.kind;
  let gold=kind==='boss'?rnd(90,110):kind==='elite'?rnd(32,42):rnd(14,22);if(has('charm'))gold=Math.round(gold*1.5);if(S.asc>=7)gold=Math.round(gold*.75);
  S.gold+=gold;
  const rw={gold,cards:rollCards(3,kind!=='battle'),echo:null};
  S.potions=S.potions||[];if(Math.random()<(kind==='battle'?.4:.7)+(has('e_flask')?.25:0)){const k=randPot();if(gainPotion(k))rw.potion=k}
  if((kind==='elite'||kind==='boss')&&Math.random()<(kind==='boss'?.5:.35))rw.weapon=pick(Object.keys(WEAPON_DEF));
  if(kind==='elite'&&S.burn){rw.gold+=50;S.gold+=50;rw.burnEcho=pick(TREASURE_ECHO.filter(e=>!has(e)))||null;gainEcho(rw.burnEcho)}
  if(c.goldBonus)rw.gold+=c.goldBonus;
  if(c.fname&&kind!=='battle'){const b=kind==='boss'?60:30;S.gold+=b;rw.gold+=b}
  if(c.fname==='쌍두 정예'||c.fname==='쌍둥이 명식')rw.weapon=rw.weapon||pick(Object.keys(WEAPON_DEF));
  if(kind==='boss'){rw.bossPick=shuffle(['levia',...TREASURE_ECHO,'crown','aix','mephis'].filter(e=>!has(e)&&ECHO[e])).slice(0,c.fname==='쌍둥이 명식'?4:3)}
  else if(kind==='elite'){const ids=c.enemies.map(e=>e.id).filter(id=>ECHO[id]&&!has(id));rw.echo=ids.length?ids[0]:pick(TREASURE_ECHO.filter(e=>!has(e)))||null}
  else if(Math.random()<.22){const ids=c.enemies.map(e=>e.id).filter(id=>ECHO[id]&&!has(id));if(ids.length)rw.echo=pick(ids)}
  if(rw.echo)gainEcho(rw.echo);
  S.reward=rw;S.screen='reward';S.c=null;
  render();
}
function rollCards(n,better){
  const out=[];const pool=REWARD_POOL.filter(inPool);
  while(out.length<n&&pool.length){
    let id=pick(pool);if(CD[id].r&&Math.random()>(better?.55:.3))continue;
    if(CD[id].o==='any'&&!CD[id].duo&&Math.random()<.6)continue;
    pool.splice(pool.indexOf(id),1);out.push(mk(id,Math.random()<(better?.25:.08)));
  }
  return out;
}
function takeReward(uid){const c=S.reward.cards.find(x=>x.uid===uid);if(c)S.deck.push(c);S.reward.cards=[];afterReward()}
function afterReward(){
  if(S.pos&&S.pos.r===ROWS){
    if(S.act<2){S.act++;S.pos=null;S.path=[];pickVariant();S.map=genMap();S.fights=0;
      T_().forEach(id=>{const p=S.party[id];if(p.down){p.down=false;p.hp=1}p.hp=Math.min(p.maxHp,p.hp+Math.round(p.maxHp*DF().heal))});
      S.healNote=Math.round(DF().heal*100);openAncient();return;
    }else{S.screen='win';addRecord('win');clearSave();try{if((S.asc||0)>=ascMax())localStorage.setItem(ASC_KEY,Math.min(10,(S.asc||0)+1))}catch(e){}}
  }else S.screen='map';
  render();
}

