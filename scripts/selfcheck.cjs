// 게임 자가 점검: `npx electron . --remote-debugging-port=9334` 실행 중에 `node scripts/selfcheck.cjs`
const CHECKS = {
  card_body_visible: `(async()=>{newGame('aem',0);S.ancient=null;S.modal=null;S.screen='map';enterNode(availNodes()[0]);await new Promise(r=>setTimeout(r,1800));
    const t=document.querySelector('#hand .card .tx').getBoundingClientRect();return t.bottom<=innerHeight})()`,
  hand10_badges: `(async()=>{while(S.c.hand.length<10)S.c.hand.push(mk('aem_a'));render();await new Promise(r=>setTimeout(r,1500));
    return [...document.querySelectorAll('#hand .hk')].every(b=>{const r=b.getBoundingClientRect();const el=document.elementFromPoint(r.left+r.width/2,r.top+r.height/2);return el&&el.closest('.card')===b.closest('.card')})})()`,
  theme_tokens: `(()=>getComputedStyle(document.documentElement).getPropertyValue('--wu-acc').trim()==='#e9d9a6'&&getComputedStyle(document.querySelector('.endturn')).clipPath!=='none')()`,
  echo_skill: `(async()=>{newGame('aem',0);S.ancient=null;S.screen='map';gainEcho('crown');enterNode(availNodes()[0]);await new Promise(r=>setTimeout(r,800));
    const T=alive()[0],h=T.hp;useEcho(T);const ok1=T.hp<h&&S.c.echoCd===3;const h2=T.hp;useEcho(T);const ok2=T.hp===h2;
    S.c.busy=false;startTurn();const ok3=S.c.echoCd===2;S.c.enemies.forEach(e=>{e.dead=true});let ok4=true;try{useEcho()}catch(e){ok4=false}return ok1&&ok2&&ok3&&ok4})()`,
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
