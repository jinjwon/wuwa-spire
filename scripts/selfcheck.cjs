// 게임 자가 점검: `npx electron . --remote-debugging-port=9334` 실행 중에 `node scripts/selfcheck.cjs`
const CHECKS = {
  save_continue: `(()=>{const o=localStorage.getItem(SAVE_KEY);newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';S.gold=321;render();saveQuit();continueRun();
    const ok=S&&S.screen==='map'&&S.gold===321;o?localStorage.setItem(SAVE_KEY,o):localStorage.removeItem(SAVE_KEY);return ok})()`,
  records: `(()=>{const o=localStorage.getItem(REC_KEY),n=loadRecords().length;newGame('aem',0);S.screen='map';addRecord('lose');addRecord('lose');
    const L=loadRecords(),ok=L.length===Math.min(n+1,50)&&L[0].r==='lose'&&L[0].team[0]==='aem';o?localStorage.setItem(REC_KEY,o):localStorage.removeItem(REC_KEY);return ok})()`,
  card_body_visible: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';enterNode(availNodes()[0]);await new Promise(r=>setTimeout(r,1800));
    const t=document.querySelector('#hand .card .tx').getBoundingClientRect();return t.bottom<=innerHeight})()`,
  hand10_badges: `(async()=>{while(S.c.hand.length<10)S.c.hand.push(mk('aem_a'));render();await new Promise(r=>setTimeout(r,1500));
    return [...document.querySelectorAll('#hand .hk')].every(b=>{const r=b.getBoundingClientRect();const el=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return el&&el.closest('.card')===b.closest('.card')})})()`,
  theme_tokens: `(()=>getComputedStyle(document.documentElement).getPropertyValue('--wu-acc').trim()==='#e9d9a6'&&getComputedStyle(document.querySelector('.endturn')).clipPath!=='none')()`,
  echo_skill: `(async()=>{newGame('aem',0);S.ancient=null;S.screen='map';gainEcho('crown');enterNode(availNodes()[0]);await new Promise(r=>setTimeout(r,800));
    const T=alive()[0],h=T.hp;useEcho(T);const ok1=T.hp<h&&S.c.echoCd===3;const h2=T.hp;useEcho(T);const ok2=T.hp===h2;
    S.c.busy=false;startTurn();const ok3=S.c.echoCd===2;S.c.enemies.forEach(e=>{e.dead=true});let ok4=true;try{useEcho()}catch(e){ok4=false}return ok1&&ok2&&ok3&&ok4})()`,
  vibration: `(async()=>{newGame('aem',0);S.ancient=null;S.screen='map';enterNode(availNodes()[0]);await new Promise(r=>setTimeout(r,800));
    const T=alive()[0];addVib(T,T.vibMax);const a=T.broken===1&&T.vib===0;addVib(T,T.vibMax);const b=T.broken===1&&T.vib===0;
    const hp=S.party[S.c.active].hp;await endTurn();const c2=S.party[S.c.active].hp===hp&&T.broken===0;
    const B=spawn('levia');return a&&b&&c2&&B.vibMax===22})()`,
  map_focus: `(async()=>{newGame('aem',0);S.ancient=null;S.screen='map';render();await new Promise(r=>setTimeout(r,800));const n=document.querySelector('.mnode.avail').getBoundingClientRect();return n.top>=0&&n.bottom<=innerHeight})()`,
  help_new_systems: `(()=>{goMenu('help');const t=document.body.innerText;return t.includes('에코 스킬')&&t.includes('공진')})()`,
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
