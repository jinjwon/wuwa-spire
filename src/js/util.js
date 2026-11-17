/* ============ 유틸 ============ */
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuffle=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const OPT=(()=>{try{return JSON.parse(localStorage.getItem('wuwa-opt'))||{}}catch(e){return {}}})();OPT.speed=OPT.speed||1;if(OPT.sfx==null)OPT.sfx=1;
if(OPT.vol==null)OPT.vol=.7;if(OPT.mini==null)OPT.mini=true;
const VOLV=()=>OPT.mute?0.0001:Math.max(.0001,OPT.vol);
const saveOpt=()=>{try{localStorage.setItem('wuwa-opt',JSON.stringify(OPT))}catch(e){}};
const sleep=ms=>window.FAST?Promise.resolve():new Promise(r=>setTimeout(r,ms/OPT.speed));
/* 효과음: 파일 없이 WebAudio로 합성 */
let AC=null;
function ac(){if(!AC)AC=new(window.AudioContext||window.webkitAudioContext)();if(AC.state==='suspended')AC.resume();return AC}
function tone(f,dur,type,g,f2,t0=0){const a=ac(),t=a.currentTime+t0,o=a.createOscillator(),v=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+dur);v.gain.setValueAtTime(g*.6*VOLV(),t);v.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(v).connect(a.destination);o.start(t);o.stop(t+dur)}
function noise(dur,g,freq,t0=0){const a=ac(),t=a.currentTime+t0,b=a.createBuffer(1,a.sampleRate*dur,a.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
  const n=a.createBufferSource(),f=a.createBiquadFilter(),v=a.createGain();n.buffer=b;f.type='bandpass';f.frequency.value=freq;v.gain.setValueAtTime(g*.6*VOLV(),t);v.gain.exponentialRampToValueAtTime(.001,t+dur);n.connect(f).connect(v).connect(a.destination);n.start(t)}
const SFX={
  hit:()=>{noise(.12,.55,1200);tone(160,.12,'square',.18,70)},
  crit:()=>{noise(.22,.7,700);tone(110,.25,'sawtooth',.25,40);tone(880,.08,'square',.08,440)},
  hurt:()=>{noise(.16,.5,500);tone(120,.18,'sawtooth',.2,50)},
  block:()=>{tone(620,.09,'triangle',.25,900);noise(.05,.2,4000)},
  card:()=>noise(.07,.18,2600),
  draw:()=>tone(1200,.035,'sine',.05,1500),
  end:()=>{tone(392,.12,'triangle',.18);tone(294,.18,'triangle',.18,null,.1)},
  heal:()=>[523,659,784].forEach((f,i)=>tone(f,.15,'sine',.12,null,i*.06)),
  death:()=>{tone(320,.45,'sawtooth',.18,45);noise(.4,.35,300)},
  ult:()=>{tone(220,.5,'sawtooth',.16,880);noise(.5,.2,2000,.1)},
  win:()=>[523,659,784,1047].forEach((f,i)=>tone(f,.25,'triangle',.18,null,i*.1)),
  lose:()=>[392,330,262,196].forEach((f,i)=>tone(f,.35,'triangle',.18,null,i*.16)),
  click:()=>tone(760,.03,'square',.05),
  critx:()=>{noise(.3,.8,900);tone(1320,.12,'square',.12,2640);tone(90,.35,'sawtooth',.3,35);tone(1760,.25,'sine',.1,null,.06)},
  coin:()=>[1319,1760].forEach((f,i)=>tone(f,.12,'square',.07,null,i*.07)),
  tick:()=>tone(1800,.02,'square',.04),
  tide:()=>{tone(330,.3,'sine',.12,660);noise(.35,.15,600)},
  jackpot:()=>[523,659,784,1047,1319,1568].forEach((f,i)=>{tone(f,.22,'triangle',.16,null,i*.07);tone(f*2,.1,'square',.04,null,i*.07)}),
  merge:()=>{tone(440,.18,'sine',.14,880);tone(660,.25,'triangle',.12,1320,.08);noise(.12,.2,5000,.1)},
  boom:()=>{noise(.5,.9,180);tone(70,.5,'sawtooth',.35,30)},
  affix:()=>{tone(220,.4,'sawtooth',.1,110);tone(330,.4,'square',.05,165,.05)},
};
/* 배경음: assets/bgm/<장면>.mp3 가 있으면 반복 재생 (없으면 조용히 넘어감) */
if(OPT.bgm==null)OPT.bgm=1;
const BGM={el:null,key:null};
function bgmScene(){if(!S)return 'title';if(['over','win'].includes(S.screen))return S.screen;if(S.screen==='combat')return S.c&&S.c.kind==='boss'?'boss'+S.act:'battle_'+regionArt();return 'map_'+regionArt()}
function playBgm(){
  const k=OPT.bgm?bgmScene():null;if(k===BGM.key)return;BGM.key=k;
  const old=BGM.el;if(old){old.animate([{opacity:1},{opacity:0}],600);let v=old.volume;const t=setInterval(()=>{v-=.05;if(v<=0){clearInterval(t);old.pause()}else old.volume=v},40)}
  if(!k){BGM.el=null;ytStop();return}
  ytStop();const a=new Audio(`assets/bgm/${k}.mp3`);a.loop=true;a.volume=OPT.mute?0:.5*OPT.vol;a.onerror=()=>{if(BGM.key===k)ytPlay(k)};BGM.el=a;a.play().catch(()=>{});
}
/* 로컬 mp3가 없으면 명조 공식 유튜브 OST를 임베드 플레이어로 재생 (다운로드 아님, 플레이어는 화면에 보이게 유지) */
const YT_DEFAULT={title:'nl_vdjf-jM0',win:'dSy11_e7NF4',over:'wGnPLE_SGw0',boss0:'bNS2ozFgCVA',boss1:'suvkUU54CNA',
  map_coast:'1zORiYv3VmU',battle_coast:'Yr1RlcoqXTg',map_forest:'DrjZLUFlW7Q',battle_forest:'jyc8iS1-rj8',
  map_spire:'Y0yo_cdQP7s',battle_spire:'La24P92A3rM',map_lahai:'wiXzbkjuJao',battle_lahai:'Lixpftlm0Eo'};
const YT_NAME={'nl_vdjf-jM0':'Saving Light',dSy11_e7NF4:'Come To Light',wGnPLE_SGw0:'I Question My Fate',bNS2ozFgCVA:'Oaths Unbent',suvkUU54CNA:'To the Finale',
  '1zORiYv3VmU':"There's No Moonlight This Night",Yr1RlcoqXTg:'Against the Tide',DrjZLUFlW7Q:'The Sound of Lost Joy','jyc8iS1-rj8':'Leaping Waves!',
  Y0yo_cdQP7s:'A Story in a Loop',La24P92A3rM:'Endless Pulse',wiXzbkjuJao:'Unfinished Journey',Lixpftlm0Eo:'Catch Me If You Can'};
const ytId=k=>(OPT.yt&&OPT.yt[k])||YT_DEFAULT[k];
function ytStop(){const b=document.getElementById('ytbox');if(b)b.remove()}
function ytCmd(func,args){const f=document.querySelector('#ytbox iframe');if(f)f.contentWindow.postMessage(JSON.stringify({event:'command',func,args:args||[]}),'*')}
function applyVol(){if(BGM.el&&BGM.el.src)BGM.el.volume=OPT.mute?0:.5*OPT.vol;ytCmd(OPT.mute?'mute':'unMute');ytCmd('setVolume',[Math.round(OPT.vol*60)]);
  const b=document.getElementById('ytbox');if(b){b.querySelector('.mute').textContent=OPT.mute?'🔇':'🔊';b.querySelector('input').value=OPT.vol}}
function setVol(v){OPT.vol=+v;OPT.mute=false;saveOpt();applyVol()}
function toggleMute(){OPT.mute=!OPT.mute;saveOpt();applyVol()}
YT_DEFAULT.boss2=YT_DEFAULT.boss1;
function ytPlay(k){
  const id=ytId(k);if(!id)return;ytStop();
  const b=document.createElement('div');b.id='ytbox';
  b.innerHTML=`<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&loop=1&playlist=${id}&enablejsapi=1&controls=0&playsinline=1&modestbranding=1&rel=0" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin" title="배경음"></iframe><div class="mp-head"><span class="mp-disc">♪</span><div class="mp-t"><small>NOW PLAYING · 명조 OST</small><b>${YT_NAME[id]||'명조 OST'}</b></div>
    <button class="mute" onclick="toggleMute()" title="음소거">${OPT.mute?'🔇':'🔊'}</button>
    <input type="range" min="0" max="1" step="0.05" value="${OPT.vol}" oninput="setVol(this.value)" aria-label="음량">
</div>`;
  document.body.appendChild(b);
  b.querySelector('iframe').onload=()=>setTimeout(applyVol,900);
}
function setYt(){const k=bgmScene();const v=prompt(`「${k}」 장면에 틀 유튜브 링크(또는 영상 ID). 비우면 기본 곡으로 돌아가요.`,ytId(k));if(v==null)return;
  const m=v.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)||v.match(/^([\w-]{11})$/);OPT.yt=OPT.yt||{};if(m)OPT.yt[k]=m[1];else delete OPT.yt[k];saveOpt();BGM.key=null;playBgm()}
addEventListener('pointerdown',()=>{if(BGM.el&&BGM.el.paused)BGM.el.play().catch(()=>{})});
function sfx(k,delay){if(window.FAST||!OPT.sfx)return;const go=()=>{try{SFX[k]()}catch(e){}};delay?setTimeout(go,delay/OPT.speed):go()}
addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('button'))sfx('click')});
/* 히트스톱: 맞는 순간 무대 애니메이션을 잠깐 멈춤 */
function hitStop(ms){if(window.FAST)return;const st=document.getElementById('stage');if(!st)return;st.classList.add('stop');clearTimeout(hitStop.t);hitStop.t=setTimeout(()=>st.classList.remove('stop'),ms)}
let UID=1;
const mk=(id,up=false)=>({uid:UID++,id,up});

