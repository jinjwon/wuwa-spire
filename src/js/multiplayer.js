/* ============ 멀티: 같은 와이파이 협동 ============
   호스트(데스크톱 앱)가 7777 포트로 게임을 열고 상태를 보냄. 손님은 같은 화면을 보며 같은 파티를 함께 조작(행동만 호스트로 전송). */
const MP={role:/[?&]guest\b/.test(location.search)?'guest':null,peers:0,ips:[]};
const MP_LOCAL=/^(showPile|showDeck|showMap|toggleMute|toggleFS|setVol|setYt|toggleRover|goMenu)\b/;
const MP_ACT=/^(clickCard\(\d+\)|mergeCard\(\d+\)|endTurn\(\)|clickLib\(\))$/;
const mpSend=code=>fetch('/act',{method:'POST',body:code}).catch(()=>{});
function mpBadge(){let b=$('#mpb');if(!MP.role){b&&b.remove();return}if(!b){b=document.createElement('div');b.id='mpb';b.className='mpbadge';document.body.appendChild(b)}
  b.innerHTML=MP.role==='host'?`🔗 방 열림 · 손님 ${MP.peers}명 · <b>${MP.ips.map(ip=>ip+':7777').join(' / ')||'와이파이 없음'}</b>`:`🔗 손님으로 참가 중 · 호스트와 같은 파티를 함께 조작`}
async function mpHostStart(){
  if(!window.mpHost){alert('방 만들기는 데스크톱 앱에서만 돼요. 손님은 브라우저로도 참가할 수 있어요.');return}
  try{const r=await window.mpHost.start();MP.role='host';MP.ips=r.ips}catch(e){alert('방을 열지 못했어요: '+e);return}
  const es=new EventSource('http://127.0.0.1:7777/sub?role=host');
  es.addEventListener('peers',e=>{MP.peers=+e.data;mpBadge();mpPush()});
  es.addEventListener('act',e=>mpRun(JSON.parse(e.data)));
  mpBadge();alert(`방을 열었어요. 같은 와이파이의 친구가 아래 주소를 브라우저(또는 이 게임의 「멀티 · 참가」)로 열면 함께 플레이해요.\n\n${MP.ips.map(ip=>`http://${ip}:7777/?guest`).join('\n')}`);
}
// 손님 행동 검증: 지금 호스트 화면에 실제로 있는 버튼이거나, 정해진 몇 가지 명령만 실행 (임의 코드 실행 방지)
function mpRun(code){if(typeof code!=='string'||!S)return;
  const el=[...document.querySelectorAll('[onclick]')].find(x=>x.getAttribute('onclick')===code&&!x.disabled);
  if(el)return el.click();
  if(!MP_ACT.test(code)||!S.c)return;const n=+(code.match(/\d+/)||[0])[0];
  if(code.startsWith('clickCard'))clickCard(n);else if(code.startsWith('mergeCard'))mergeCard(n);else if(code==='endTurn()')endTurn();else clickLib();render()}
let mpT=0;const mpRep=(k,v)=>v instanceof Set?[...v]:v;
function mpPush(){if(MP.role!=='host')return;clearTimeout(mpT);mpT=setTimeout(()=>{try{fetch('http://127.0.0.1:7777/state',{method:'POST',body:JSON.stringify(S,mpRep)}).catch(()=>{})}catch(e){}},60)}
function mpJoin(){const ip=prompt('호스트 화면 왼쪽 아래에 보이는 주소(IP)를 입력하세요. 예: 192.168.0.12');if(ip)location.href=`http://${ip.replace(/^https?:\/\//,'').replace(/[:/].*$/,'')}:7777/?guest`}
{const base=render;render=function(){
  if(MP.role==='guest'&&!S){$('#app').innerHTML='<div id="topbar"></div><div id="screen"><div class="screen"><div class="box" style="text-align:center"><h2>호스트를 기다리는 중…</h2><p class="dim">호스트가 게임을 시작하면 화면이 따라와요.</p></div></div></div><div id="modal"></div>';mpBadge();return}
  try{base()}catch(e){if(MP.role!=='guest')throw e}
  mpPush()}}
if(MP.role==='guest'){
  saveRun=()=>{};addRecord=()=>{};
  const es=new EventSource('/sub?role=guest');
  es.addEventListener('state',e=>{S=JSON.parse(e.data);if(S.c)S.c.played=new Set(S.c.played||[]);render()});
  es.onerror=()=>{MP.role==='guest'&&($('#mpb')||{}).innerHTML!==undefined&&($('#mpb').innerHTML='⚠ 호스트와 연결이 끊겼어요. 다시 연결 중…')};
  addEventListener('click',e=>{const el=e.target.closest&&e.target.closest('[onclick]');if(!el||!S)return;const code=el.getAttribute('onclick');if(MP_LOCAL.test(code))return;
    e.preventDefault();e.stopImmediatePropagation();mpSend(code)},true);
  addEventListener('pointerdown',e=>{if(!S||!S.c)return;const card=e.target.closest&&e.target.closest('#hand .card');const lib=e.target.closest&&e.target.closest('.libbtn');
    if(e.target.closest&&e.target.closest('.mergeb'))return;
    if(card){e.stopImmediatePropagation();e.preventDefault();mpSend(`clickCard(${card.dataset.card})`)}else if(lib){e.stopImmediatePropagation();e.preventDefault();mpSend('clickLib()')}},true);
  addEventListener('keydown',e=>{if(!S||!S.c)return;const k=e.key.toLowerCase();let code=null;
    if(k==='e'||k==='enter')code='endTurn()';else if(/^[1-9]$/.test(k)&&S.c.hand[+k-1])code=`clickCard(${S.c.hand[+k-1].uid})`;else if(k==='m'){const x=S.c.hand.find(mergeable);if(x)code=`mergeCard(${x.uid})`}
    if(code){e.stopImmediatePropagation();e.preventDefault();mpSend(code)}},true);
}
render();loadArt().then(render);if(MP.role)mpBadge();
