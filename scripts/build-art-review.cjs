const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'art/manifest-v2.json'),'utf8'));
const names=Object.fromEntries([...html.matchAll(/^  (\w+):\{(?:name|n):'([^']+)'/gm)].map(m=>[m[1],m[2]]));
names.rov='방랑자 · 여성';names.rovM='방랑자 · 남성';names.aemMecha='에이메스 · 메카스카우트';
const ids=[...new Set(manifest.filter(a=>a.frames).map(a=>a.id))];
assert.equal(ids.length,37);
const characters=ids.map(id=>({id,name:names[id.replace(/^enemy_/,'')]||id,
  states:{idle:`${id}_idle.png`,...Object.fromEntries(manifest.filter(a=>a.id===id&&a.frames).map(a=>[a.state,a.file])),
    ...(!id.startsWith('enemy_')?{attack:`${id}_attack.png`}:{})}}));
const cards=manifest.filter(a=>a.file.startsWith('cards/')&&a.id!=='node_icons').map(a=>({name:names[a.id],file:a.file}));
assert.equal(cards.length,70);assert(cards.every(c=>c.name));
const data=JSON.stringify({characters,cards}).replace(/</g,'\\u003c');
fs.writeFileSync(path.join(root,'art/review.html'),`<!doctype html><html lang="ko"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>첨탑의 메아리 · 도트 아트 리뷰</title><style>
*{box-sizing:border-box}body{margin:0;padding:32px;background:#0c1222;color:#e8edf5;font:15px/1.5 system-ui,sans-serif}main{max-width:1100px;margin:auto}h1{margin:0;font-size:28px}p{color:#a7b4ca}select,button{font:inherit;color:inherit;background:#1b2841;border:1px solid #69839a;padding:9px 12px;border-radius:3px}label{display:inline-flex;gap:8px;align-items:center;margin:8px 10px 14px 0}button:focus-visible,select:focus-visible{outline:3px solid #8fe7e1}.preview{height:400px;background:url('../assets/maps/coast-battle.png') center/cover;image-rendering:pixelated;display:grid;place-items:end center;border:2px solid #61788b;overflow:hidden}.actor{width:256px;height:256px;overflow:hidden;margin-bottom:30px;filter:drop-shadow(3px 4px #080c1788)}.actor img{height:100%;display:block;image-rendering:pixelated}.animated{width:400%;animation:pose 1.2s steps(4,jump-none) infinite}@keyframes pose{to{transform:translateX(-75%)}}.paused{animation-play-state:paused}.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(144px,1fr));gap:12px}.cards figure{margin:0;padding:5px;background:#17233a;border:1px solid #3c516b}.cards img{width:100%;aspect-ratio:1.5;image-rendering:pixelated;display:block}.cards figcaption{font-size:12px;padding:6px 2px}.maps{display:grid;grid-template-columns:1fr 1fr;gap:16px}.maps figure{margin:0}.maps img{width:100%;image-rendering:pixelated;display:block}.maps figcaption{padding:6px 0;color:#c2d2df}details{margin-top:28px}summary{font-weight:700;font-size:20px;cursor:pointer;margin-bottom:14px}a{color:#9ce8df}@media(max-width:600px){body{padding:16px}.maps{grid-template-columns:1fr}.preview{height:300px}}@media(prefers-reduced-motion:reduce){.animated{animation:none}}
</style><main><h1>첨탑의 메아리 · 도트 아트</h1><p>37개 외형 · 공명자 방어/피격/시전/해방 · 적 공격/시전/피격 · 카드 70종 · 지역 4종</p>
<label>캐릭터 <select id="character"></select></label><label>동작 <select id="motion"></select></label><label>지역 <select id="region"><option value="coast">검은 해안</option><option value="forest">무음 지대</option><option value="spire">별빛 첨탑</option><option value="lahai">라하이로이</option></select></label><button id="pause" type="button">일시정지</button>
<div class="preview"><div class="actor"><img id="actor" alt="선택한 캐릭터의 동작 미리보기"></div></div>
<details open><summary>카드 일러스트</summary><div class="cards" id="cards"></div></details>
<details><summary>지역 배경과 지도</summary><div class="maps" id="maps"></div></details>
<p>AI 생성 팬아트를 게임 규격으로 정리한 작업본입니다. 원작의 지역·의상·무기를 재해석했으며 공식 에셋이 아닙니다. <a href="../index.html">게임 열기</a></p></main>
<script>
const data=${data};
const q=s=>document.querySelector(s),char=q('#character'),motion=q('#motion'),actor=q('#actor');
const labels={idle:'대기',attack:'공격',guard:'방어',hit:'피격',cast:'시전',ultimate:'공명 해방'};
for(const c of data.characters)char.add(new Option(c.name,c.id));
function show(){const c=data.characters.find(c=>c.id===char.value);actor.src='../assets/'+c.states[motion.value];actor.className=motion.value==='idle'?'':'animated';q('#pause').textContent='일시정지'}
function select(){const c=data.characters.find(c=>c.id===char.value);motion.replaceChildren(...Object.keys(c.states).map(s=>new Option(labels[s],s)));motion.value='attack';show()}
char.value='aem';char.onchange=select;motion.onchange=show;select();
q('#region').onchange=e=>q('.preview').style.backgroundImage="url('../assets/maps/"+e.target.value+"-battle.png')";
q('#pause').onclick=()=>{actor.classList.toggle('paused');q('#pause').textContent=actor.classList.contains('paused')?'재생':'일시정지'};
for(const c of data.cards){const f=document.createElement('figure'),img=document.createElement('img'),cap=document.createElement('figcaption');img.src='../assets/'+c.file;img.alt='';img.loading='lazy';cap.textContent=c.name;f.append(img,cap);q('#cards').append(f)}
for(const [id,name]of [['coast','검은 해안'],['forest','무음 지대'],['spire','별빛 첨탑'],['lahai','라하이로이']])for(const type of ['battle','route']){const f=document.createElement('figure'),img=document.createElement('img'),cap=document.createElement('figcaption');img.src='../assets/maps/'+id+'-'+type+'.png';img.alt='';img.loading='lazy';cap.textContent=name+(type==='battle'?' · 전투':' · 분기 지도');f.append(img,cap);q('#maps').append(f)}
</script></html>`);
console.log('Created art/review.html: 37 selectable appearances and 70 named cards.');
