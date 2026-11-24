// 게임 자가 점검: `npx electron . --remote-debugging-port=9334` 실행 중에 `node scripts/selfcheck.cjs`
const CHECKS = {
  _noluck: `(()=>{window.NOLUCK=1;return true})()`,
  select_screen: `(async()=>{S=null;goMenu('select');await new Promise(r=>setTimeout(r,200));const n=document.querySelectorAll('.sel-tile').length;
    document.querySelectorAll('.sel-tile')[3].click();await new Promise(r=>setTimeout(r,100));const on=document.querySelector('.sel-tile.on b').textContent===CH[ALL[3]].name;
    document.querySelector('.sel-go').click();await new Promise(r=>setTimeout(r,200));return n===ALL.length&&on&&S&&S.team[0]===ALL[3]})()`,
  pixel_fx: `(async()=>{const els=[...new Set(Object.values(CH).map(c=>c.el))];if(!els.every(e=>FXFILE[e]))return false;
    const ok=await Promise.all(els.map(e=>new Promise(r=>{const i=new Image();i.onload=()=>r(i.naturalWidth===384&&i.naturalHeight===64);i.onerror=()=>r(false);i.src='assets/fx/'+FXFILE[e]+'.png'})));
    newGame('lyn',0);S.ancient=null;S.modal=null;S.screen='map';startCombat(['snip'],'battle');await new Promise(r=>setTimeout(r,400));
    const T=alive()[0];T.hp=T.maxHp=500;T.block=0;S.c.cur=S.c.active;dmgEnemy(T,5);flushFx();await new Promise(r=>setTimeout(r,250));
    return ok.every(Boolean)&&!!document.querySelector('#fx .pfx')})()`,
  free_assets: `(async()=>{const ok=await Promise.all(Object.values(FXFILE).map(f=>new Promise(r=>{const i=new Image();i.onload=()=>r(i.naturalWidth===576&&i.naturalHeight===47);i.onerror=()=>r(false);i.src='assets/fx/slash_'+f+'.png'})));
    const snd=await Promise.all(Object.values(SMP).flat().map(n=>fetch('assets/sfx/'+n+'.ogg').then(r=>r.ok).catch(()=>false)));
    newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';startCombat(['snip'],'battle');await new Promise(r=>setTimeout(r,400));
    const T=alive()[0];T.hp=T.maxHp=500;T.block=0;S.c.cur=S.c.active;dmgEnemy(T,5);flushFx();await new Promise(r=>setTimeout(r,250));
    const s=document.querySelector('#fx .pslash'),w=s&&s.getBoundingClientRect().width/parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--k')||1);
    return ok.every(Boolean)&&snd.every(Boolean)&&!!s&&[192,256].includes(Math.round(w))&&[s,document.querySelector('#fx .pfx')].every(e=>e&&/\\/assets\\/fx\\//.test(getComputedStyle(e).backgroundImage)&&!/\\/src\\/assets/.test(getComputedStyle(e).backgroundImage))})()`,
  wuwa_systems: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';startCombat(['snip','zig'],'battle');await new Promise(r=>setTimeout(r,400));
    const c=S.c;const [T,U]=c.enemies;T.hp=T.maxHp=500;U.hp=U.maxHp=500;T.block=U.block=0;T.fb=3;c.cur=c.active;applyElem(T,'용융');const boom=T.fb===0&&T.hp===488&&U.hp===496;
    S.echoes=['snip','fdread'];const s2=son2('용융')&&!son4('용융');
    c.block=50;const cc=c.conc[c.active];const uh=U.hp;hurtParty(10,U);const dodge=U.hp===uh-3&&c.conc[c.active]===Math.min(3,cc+1);
    return boom&&s2&&dodge})()`,
  card_combo: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';startCombat(['snip'],'battle');await new Promise(r=>setTimeout(r,400));
    const c=S.c;const T=alive()[0];T.hp=T.maxHp=500;T.block=0;c.energy=9;const b=c.block;['aem_s','aem_s','aem_s'].forEach(id=>{const x=mk(id);c.hand.push(x);playCard(x.uid,T)});
    return c.seq.length===0&&c.log.some(l=>l.includes('화음'))&&c.energy===10})()`,
  act3_volume: `(()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.act=1;S.pos={r:ROWS,i:0};S.reward={cards:[]};afterReward();const a=S.act===2&&S.screen==='ancient';
    const B=spawn('ender'),X=spawn('tick_x');const art=artOf('tick_x')===ARTS.tick;
    return a&&B.maxHp>=390&&X.maxHp>EN.tick.hp[1]&&art&&ACTS.length===3&&EVENTS.length>=20&&Object.keys(ECHO).length>=45&&Object.keys(POT).length>=15})()`,
  potions: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';startCombat(['snip','zig'],'battle');await new Promise(r=>setTimeout(r,500));
    S.potions=['fire','energy','block','heal'];const ok0=S.potions.length===4;S.potions.pop();const c=S.c;const e=c.energy;usePotion(1);const ok1=c.energy===e+2&&S.potions.length===2;
    usePotion(0);const tg=c.tgt&&c.tgt.kind==='potion';const T=alive()[0];T.block=0;const h=T.hp;clickEnemy(T.uid);return ok1&&tg&&(T.dead||h-T.hp===20)&&S.potions.length===1&&!gainPotion('x')===false})()`,
  echo_hooks: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';gainEcho('e_ember');gainEcho('e_anchor');gainEcho('e_heart');const hp=S.party.aem.maxHp;
    startCombat(['snip'],'battle');await new Promise(r=>setTimeout(r,300));return S.c.enemies[0].vuln>=1&&S.c.block>=8})()`,
  ascension: `(()=>{SEL_ASC=6;newGame('aem',0);const a=S.asc===6&&S.party.aem.maxHp<CH.aem.maxHp+14;SEL_ASC=0;return a})()`,
  pixel_scale: `(()=>{const g=v=>parseFloat(getComputedStyle(document.documentElement).getPropertyValue(v)),d=devicePixelRatio,k=g('--k'),b=g('--bk');
    return k>=1&&Number.isInteger(Math.round(k*d*1000)/1000)&&640*b>=innerWidth&&360*b>=innerHeight&&Number.isInteger(Math.round(b*d*1000)/1000)})()`,
  // 타이틀 움직이는 배경: 소리 없는 반복 영상이 재생되고, 크기는 배경 규격(640×360)의 정수 배율
  title_video: `(async()=>{S=null;goMenu('title');await new Promise(r=>setTimeout(r,1500));const v=document.querySelector('.titlescr .battle-art video');if(!v)return 'no video';
    const r=v.getBoundingClientRect(),b=r.width/640;if(![[6,'dawn'],[12,'day'],[18,'dusk'],[23,'night'],[2,'night']].every(([h,k])=>titlePart(h)===k)||!v.src.endsWith('title-cycle.mp4')||!String(v.getAttribute('onloadedmetadata')).includes('='+TITLE_T[titlePart()]))return 'part '+v.src;return getComputedStyle(v).imageRendering==='pixelated'&&v.muted&&v.loop&&(!v.paused||document.visibilityState==='hidden')&&v.readyState>=2&&v.videoWidth===1280&&v.videoHeight===720&&Number.isInteger(Math.round(b*devicePixelRatio*1000)/1000)&&Math.abs(r.height-360*b)<1||JSON.stringify({m:v.muted,p:v.paused,rs:v.readyState,w:v.videoWidth,b})})()`,
  // 피해 분해·판 결산: 배율 2개 이상이면 분해 연출, 초과 피해·최고 한 방·카드 사용 횟수를 모아 기록과 결산 화면에 남김
  damage_tally: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';startCombat(['snip'],'battle');await new Promise(r=>setTimeout(r,400));
    const c=S.c,T=alive()[0];T.hp=T.maxHp=40;T.block=0;T.vuln=1;T.broken=1;c.cur=c.active;hit(T,10,{});await new Promise(r=>setTimeout(r,250));const tl=!!document.querySelector('.tally');
    const st=ST();const ok1=T.hp===18&&st.best.d===22&&st.best.en===EN.snip.n;T.hp=5;dmgEnemy(T,30);const ok2=st.over===25&&T.dead;
    const x=mk('aem_a');c.hand.push(x);c.energy=9;const U=spawn('snip');U.slot=0;setIntent(U);c.enemies.push(U);c.rebuild=true;playCard(x.uid,U);const ok3=st.cards.aem_a===1;
    const L0=loadRecords();try{localStorage.setItem(REC_KEY,JSON.stringify([{t:1,r:'lose',d:0,team:['aem'],act:0,floor:1,kills:0,deck:10,echoes:0,best:1}]))}catch(e){}
    S._rec=0;addRecord('lose');const top=loadRecords()[0];try{localStorage.setItem(REC_KEY,JSON.stringify(L0))}catch(e){}
    S.screen='over';S.c=null;render();const rc=document.querySelector('.recap .newbest')&&document.querySelector('.recap .rbest b').textContent==='30';
    return tl&&ok1&&ok2&&ok3&&top.best===30&&S._newBest&&!!rc})()`,
  // 보상 공개: 카드는 뒷면으로 시작, 뒤집어야 고를 수 있고 희귀는 금빛. 보급 상자는 룰렛이 뜬다
  reward_reveal: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;const rid=REWARD_POOL.find(k=>CD[k].r),cid=REWARD_POOL.find(k=>!CD[k].r);
    S.reward={gold:10,cards:[mk(rid),mk(cid)],open:1};S.screen='reward';render();const b0=document.querySelectorAll('.rcard .cback').length===2&&!document.querySelector('.rcard .card');
    document.querySelector('.rcard .cback').click();await new Promise(r=>setTimeout(r,100));const up=document.querySelector('.rcard.up.rare .card')&&document.querySelectorAll('.rcard .cback').length===1;
    S.echoes=[];S.screen='map';S.pos=null;S.map[8].forEach(n=>n.type='treasure');S.pos={r:7,i:S.map[7].findIndex(n=>n.next.length)};const k=availNodes()[0];enterNode(k);await new Promise(r=>setTimeout(r,200));
    return b0&&!!up&&!!document.querySelector('.tide')&&S.echoes.length===1})()`,
  // 가로 지도: 지도가 옆으로 길고, 보스가 가장 오른쪽, 첫 층이 왼쪽
  map_horizontal: `(async()=>{newGame('rov',0);S.ancient=null;S.modal=null;S.screen='map';render();await new Promise(r=>setTimeout(r,300));
    const m=document.querySelector('.map'),b=document.querySelector('.mboss').getBoundingClientRect(),ns=[...document.querySelectorAll('.mnode')].map(n=>n.getBoundingClientRect().left);
    return m.scrollWidth>m.clientHeight*1.5&&b.left>Math.max(...ns)&&Math.min(...ns)<b.left})()`,
  mp_guard: `(async()=>{if(!window.mpHost)return false;const r=await window.mpHost.start();const ok1=Array.isArray(r.ips)&&(await fetch('http://127.0.0.1:7777/index.html')).ok;
    const bad=(await fetch('http://127.0.0.1:7777/main.js')).status===404&&(await fetch('http://127.0.0.1:7777/src/js/data.js')).ok&&(await fetch('http://127.0.0.1:7777/src/styles.css')).headers.get('content-type')==='text/css';newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';render();const g=S.gold;mpRun('S.gold=9999');return ok1&&bad&&S.gold===g})()`,
  merge_cards: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';enterNode(availNodes()[0]);await new Promise(r=>setTimeout(r,800));
    const c=S.c;c.hand=[mk('aem_a'),mk('aem_a')];render();const a=c.hand[0];const before=vals(a);mergeCard(a.uid);
    const after=vals(c.hand[0]);const k=Object.keys(before).find(k=>typeof before[k]==='number');
    return c.hand.length===1&&c.hand[0].fu===1&&after[k]===Math.ceil(before[k]*1.5)&&!mergeable(c.hand[0])&&c.exhaust.length===1})()`,
  twin_boss_layout: `(async()=>{window.NOLUCK=0;newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';S.diff=0;const R=Math.random;Math.random=()=>.05;
    const [ids,k,n]=rollEncounter('boss',['levia']);Math.random=R;window.NOLUCK=1;startCombat(ids,k,n);await new Promise(r=>setTimeout(r,900));
    const r=S.c.enemies.map(e=>document.querySelector('#e-'+e.uid).getBoundingClientRect());
    return n==='쌍둥이 명식'&&ids.length===2&&r[0].right<=r[1].left+r[1].width*.35&&S.c.enemies.every(e=>e.mul===.75)})()`,
  escort_slots: `(async()=>{window.NOLUCK=0;newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';const R=Math.random;Math.random=()=>.3;
    const [ids,k,n]=rollEncounter('boss',['aleph']);Math.random=R;window.NOLUCK=1;startCombat(ids,k,n);
    const sl=S.c.enemies.filter(e=>!EN[e.id].boss).map(e=>e.slot).sort();return n==='명식과 호위'&&sl.join()==='0,1'})()`,
  volatile_chain: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';startCombat(['snip','zig','tick'],'battle');await new Promise(r=>setTimeout(r,600));
    const [a,b,c2]=S.c.enemies;a.affix='volatile';b.affix='gold';b.hp=5;c2.hp=c2.maxHp=40;c2.block=0;const g=S.gold;S.c.cur=S.c.active;dmgEnemy(a,999,true);
    return b.dead&&S.gold===g+35&&c2.hp===30})()`,
  tide_roll: `(async()=>{window.NOLUCK=0;newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';startCombat(['snip'],'battle');S.c.turn=2;
    const R=Math.random;Math.random=()=>.995;const e=S.c.energy;const t=rollTide();Math.random=R;window.NOLUCK=1;return t.k==='gold'&&S.c.luck===.5&&S.c.tideDraw===2})()`,
  save_continue: `(()=>{const o=localStorage.getItem(SAVE_KEY);newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';S.gold=321;render();saveQuit();continueRun();
    const ok=S&&S.screen==='map'&&S.gold===321;o?localStorage.setItem(SAVE_KEY,o):localStorage.removeItem(SAVE_KEY);return ok})()`,
  records: `(()=>{const o=localStorage.getItem(REC_KEY),n=loadRecords().length;newGame('aem',0);S.screen='map';addRecord('lose');addRecord('lose');
    const L=loadRecords(),ok=L.length===Math.min(n+1,50)&&L[0].r==='lose'&&L[0].team[0]==='aem';o?localStorage.setItem(REC_KEY,o):localStorage.removeItem(REC_KEY);return ok})()`,
  card_body_visible: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';enterNode(availNodes()[0]);await new Promise(r=>setTimeout(r,1800));
    const t=document.querySelector('#hand .card .tx').getBoundingClientRect();return t.bottom<=innerHeight})()`,
  hand10_badges: `(async()=>{while(S.c.hand.length<10)S.c.hand.push(mk('aem_a'));render();await new Promise(r=>setTimeout(r,1500));
    return [...document.querySelectorAll('#hand .hk')].every(b=>{const r=b.getBoundingClientRect();const el=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return el&&el.closest('.card')===b.closest('.card')})})()`,
  theme_tokens: `(()=>getComputedStyle(document.documentElement).getPropertyValue('--wu-acc').trim()==='#e6d3a3'&&getComputedStyle(document.querySelector('.endturn')).clipPath!=='none')()`,
  echo_skill: `(async()=>{newGame('aem',0);S.ancient=null;S.screen='map';gainEcho('crown');enterNode(availNodes()[0]);await new Promise(r=>setTimeout(r,800));
    const T=alive()[0],h=T.hp;useEcho(T);const ok1=T.hp<h&&S.c.echoCd===3;const h2=T.hp;useEcho(T);const ok2=T.hp===h2;
    S.c.busy=false;startTurn();const ok3=S.c.echoCd===2;S.c.enemies.forEach(e=>{e.dead=true});let ok4=true;try{useEcho()}catch(e){ok4=false}return ok1&&ok2&&ok3&&ok4})()`,
  vibration: `(async()=>{newGame('aem',0);S.ancient=null;S.screen='map';startCombat(['snip'],'battle');await new Promise(r=>setTimeout(r,800));
    const T=alive()[0];addVib(T,T.vibMax);const a=T.broken===1&&T.vib===0;addVib(T,T.vibMax);const b=T.broken===1&&T.vib===0;
    const hp=S.party[S.c.active].hp;await endTurn();const c2=S.party[S.c.active].hp===hp&&T.broken===0;
    const B=spawn('levia');return a&&b&&c2&&B.vibMax===22})()`,
  map_focus: `(async()=>{newGame('aem',0);S.ancient=null;S.screen='map';render();await new Promise(r=>setTimeout(r,800));const n=document.querySelector('.mnode.avail').getBoundingClientRect();return n.top>=0&&n.bottom<=innerHeight})()`,
  help_new_systems: `(()=>{goMenu('help');const t=document.body.innerText;return t.includes('에코 스킬')&&t.includes('공진')})()`,
  czn_epiphany: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';startCombat(['snip'],'battle');await new Promise(r=>setTimeout(r,300));
    const c=S.c,T=alive()[0];T.hp=T.maxHp=500;T.block=0;c.energy=5;c.epiUid=0;const a=mk('aem_a');S.deck.push(a);c.hand.push(a);c.epiUid=a.uid;const e=c.energy,h=T.hp;
    playCard(a.uid,T);const paused=S.modal&&S.modal.kind==='epi'&&S.modal.opts.length===3&&new Set(S.modal.opts).size===3&&c.energy===e&&T.hp===h&&c.hand.includes(a);
    pickEpiphany('sharp');const once=!S.modal&&c.epi===1&&!c.epiUid&&a.ep==='sharp'&&S.deck.find(x=>x.uid===a.uid).ep==='sharp';const dmg=vals(a).d===Math.ceil(6*1.3)&&h-T.hp>=8;
    const b=mk('aem_a');b.ep='light';const cost=costOf(b)===0;return paused&&once&&dmg&&cost&&cardText(a).includes('수치 +30%')})()`,
  hiyuki_frost: `(async()=>{newGame('hiy',0);S.ancient=null;S.screen='map';startCombat(['snip'],'battle');await new Promise(r=>setTimeout(r,800));
    const T=alive()[0];T.hp=T.maxHp=500;T.block=0;frost(T,3);const a=T.fr===3&&!T.broken;const h=T.hp;frost(T,1);const b=T.fr===0&&T.broken===1&&T.hp<h;
    const art=await Promise.all(Object.keys(CD).filter(k=>CD[k].o==='hiy').map(k=>new Promise(r=>{const i=new Image();i.onload=()=>r(1);i.onerror=()=>r(0);i.src=cardArt(k)})));
    return a&&b&&ALL.includes('hiy')&&art.length===9&&art.every(Boolean)&&S.deck.some(x=>CD[x.id].o==='hiy')})()`,
  new_cards_weapons: `(async()=>{newGame('aem',0);S.ancient=null;S.screen='map';enterNode(availNodes()[0]);await new Promise(r=>setTimeout(r,800));
    const c=S.c;c.energy=3;const T=alive()[0];T.hp=T.maxHp=500;
    T.block=0;const x=mk('any_overload');c.hand.push(x);const h=T.hp;playCard(x.uid,T);const xOk=c.energy===0&&h-T.hp===12;
    c.energy=3;const r=mk('any_focus');c.hand.push(r);c.busy=false;await endTurn();const retOk=S.c.hand.some(y=>y.uid===r.uid);
    S.weapons={aem:'w_blade'};c.energy=3;c.weak=0;c.amp=0;T.vuln=0;T.block=0;T.ur=0;const a=mk('aem_a');c.hand.push(a);const h2=T.hp;playCard(a.uid,T);const wOk=h2-T.hp===8;
    const art=procArt('any_chain').startsWith('data:image/svg');return xOk&&retOk&&wOk&&art})()`,
};
const only = process.argv.slice(2);
(async () => {
  const list = await (await fetch('http://127.0.0.1:9334/json')).json();
  const ws = new WebSocket(list.find(p => p.type === 'page').webSocketDebuggerUrl);
  let id = 0; const pend = {};
  ws.onmessage = e => { const m = JSON.parse(e.data); if (pend[m.id]) { pend[m.id](m.result); delete pend[m.id]; } };
  await new Promise(r => ws.onopen = r);
  const ev = x => new Promise(r => { const i = ++id; pend[i] = r; ws.send(JSON.stringify({ id: i, method: 'Runtime.evaluate', params: { expression: x, awaitPromise: true, returnByValue: true } })); });
  let fail = 0;
  for (const [name, expr] of Object.entries(CHECKS)) {
    if (only.length && !only.includes(name)) continue;
    const r = await ev(expr); const pass = r.result && r.result.value === true;
    if (!pass) fail++; console.log(pass ? 'PASS' : 'FAIL', name, pass ? '' : JSON.stringify(r.exceptionDetails ? r.exceptionDetails.exception.description : r.result.value).slice(0, 200));
  }
  ws.close(); process.exit(fail ? 1 : 0);
})();
