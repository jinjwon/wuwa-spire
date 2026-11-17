/* ============ 상태 ============ */
let S;
const DIFF=[
  {n:'보통',d:'적 체력·피해 110%, 추가 피해 +1, 정예 힘 +1. 구역 사이 회복 50%. 조합과 약제를 써야 편해요.',hp:1.1,add:1,mul:1.1,heal:.5,elite:1},
  {n:'어려움',d:'적 체력 125%·피해 120%, 추가 피해 +2, 정예 힘 +2. 구역 사이 회복 35%.',hp:1.25,add:2,mul:1.2,heal:.35,elite:2},
  {n:'악몽',d:'적 체력 140%·피해 135%, 추가 피해 +3, 정예 힘 +3. 회복 25%, 「잔향 노이즈」 저주를 안고 시작해요.',hp:1.4,add:3,mul:1.35,heal:.25,elite:3,curse:1},
];
let SEL_DIFF=1,SEL_ASC=0;
const ASC_KEY='wuwa-asc-max';const ascMax=()=>{try{return Math.min(10,+localStorage.getItem(ASC_KEY)||0)}catch(e){return 0}};
const ASC=['','일반 적 체력 +10%','정예 체력 +10%','명식 체력 +10%','적 피해 +1','휴식 회복 30%→22%','시작 최대 체력 -10%','전투 화폐 -25%','정예 힘 +1','덱에 저주 1장','3구역 명식은 항상 쌍둥이'];
const DF=()=>DIFF[S&&S.diff!=null?S.diff:1];
function newGame(start,diff){
  start=start||'aem';if(diff==null)diff=SEL_DIFF;
  S={diff,asc:SEL_ASC,potions:[],screen:'map',act:0,floor:0,gold:99,echoes:[],deck:[],party:{},team:[start],pos:null,map:null,fights:0,modal:null,stats:{kills:0}};
  const hp=Math.round((CH[start].maxHp+14)*(S.asc>=6?.9:1));S.party[start]={hp,maxHp:hp,down:false};
  ['_a','_a','_a','_a','_b','_b','_b','_b','_s','_s'].forEach(x=>S.deck.push(mk(start+x)));
  if(DIFF[diff].curse)S.deck.push(mk('noise'));if(S.asc>=9)S.deck.push(mk('noise'));
  pickVariant();S.map=genMap();
  openAncient();
}

/* ============ 지도 ============ */
const NODE={battle:{l:'전투',s:'⚔',c:'#c9d2ff'},elite:{l:'정예',s:'☠',c:'#ff8a8a'},event:{l:'사건',s:'?',c:'#9fe8c8'},
  rest:{l:'휴식',s:'☾',c:'#ffd75e'},shop:{l:'상점',s:'$',c:'#ffb36b'},treasure:{l:'보급',s:'◈',c:'#8ab4ff'},recruit:{l:'영입',s:'✚',c:'#7cf0c0'},boss:{l:'명식',s:'✹',c:'#ff5d6c'}};
const ROWS=15,COLS=7;
function genMap(){
  const grid=Array.from({length:ROWS},()=>Array(COLS).fill(null));
  const get=(r,c)=>grid[r][c]||(grid[r][c]={r,c,nx:new Set()});
  const starts=[];
  for(let p=0;p<6;p++){
    let c=rnd(0,COLS-1);if(p<2)while(starts.includes(c))c=rnd(0,COLS-1);starts.push(c);
    for(let r=0;r<ROWS;r++){
      const n=get(r,c);if(r===ROWS-1)break;
      let opts=[c-1,c,c+1].filter(x=>x>=0&&x<COLS);
      opts=opts.filter(x=>!(x===c+1&&grid[r][c+1]&&grid[r][c+1].nx.has(c))&&!(x===c-1&&grid[r][c-1]&&grid[r][c-1].nx.has(c)));
      const nx=pick(opts);n.nx.add(nx);c=nx;
    }
  }
  const rows=grid.map(row=>row.filter(Boolean));
  rows.forEach(row=>row.forEach((n,i)=>{n.i=i;n.x=(n.c+.5)/COLS+(Math.random()-.5)*.045;n.jy=Math.round((Math.random()-.5)*16)}));
  rows.forEach((row,r)=>row.forEach(n=>{n.next=r<ROWS-1?[...n.nx].map(c=>rows[r+1].findIndex(m=>m.c===c)).sort((a,b)=>a-b):[];delete n.nx}));
  // 종류 배정 (슬더스 규칙 참고)
  const RC=S.act===0?5:2;
  rows.forEach((row,r)=>row.forEach(n=>{
    if(r===0)n.type='battle';else if(r===ROWS-1)n.type='rest';else if(r===8)n.type='treasure';else if(r===RC)n.type='recruit';
    else{
      const parents=r?rows[r-1].filter(m=>m.next.includes(n.i)).map(m=>m.type):[];
      for(let t=0;t<12;t++){
        const x=Math.random();let ty=x<.45?'battle':x<.67?'event':x<.83?'elite':x<.95?'rest':'shop';
        if(r<5&&(ty==='elite'||ty==='rest'))continue;
        if(r===ROWS-2&&ty==='rest')continue;
        if(['elite','rest','shop'].includes(ty)&&parents.includes(ty))continue;
        n.type=ty;break;
      }
      n.type=n.type||'battle';
    }
  }));
  // 불타는 정예(보상 강화) 하나
  const elites=rows.flat().filter(n=>n.type==='elite');if(elites.length)pick(elites).burn=1;
  return rows;
}
function availNodes(){
  if(!S.pos)return S.map[0].map(n=>`0-${n.i}`);
  if(S.pos.r===ROWS-1)return['boss'];
  if(S.pos.r===ROWS)return[];
  return S.map[S.pos.r][S.pos.i].next.map(j=>`${S.pos.r+1}-${j}`);
}
function enterNode(key){
  if(!availNodes().includes(key))return;
  S.floor++;
  if(key==='boss'){S.pos={r:ROWS,i:0};S.burn=false;return startCombat(...rollEncounter('boss',[ACTS[S.act].boss]))}
  S._scrolled=false;const [r,i]=key.split('-').map(Number);S.pos={r,i};(S.path=S.path||[]).push(key);
  let t=S.map[r][i].type;S.burn=!!S.map[r][i].burn;
  if(t==='event'){const x=Math.random();const fc=S.mysF=(S.mysF||.1);
    if(x<fc){S.mysF=.1;S.screen='msg';S.msg={title:'? — 매복',body:'고요하던 무음 지대에서 잔상이 튀어나왔다!'};t='battle'}
    else{S.mysF=fc+.1;if(x<fc+.05)t='shop';else if(x<fc+.09)t='treasure'}}
  if(t==='battle'){const A=ACTS[S.act];startCombat(...rollEncounter('battle',pick(S.fights<2?A.easy:A.normal.concat(AV().normalAdd||[]))));S.fights++}
  else if(t==='elite')startCombat(...rollEncounter('elite',pick(ACTS[S.act].elite)));
  else if(t==='event')startEvent();
  else if(t==='rest'){S.screen='rest';S.restDone=false;render()}
  else if(t==='shop')openShop();
  else if(t==='recruit')openRecruit();
  else if(t==='treasure'){const pool=TREASURE_ECHO.filter(e=>!has(e));const e=pool.length?pick(pool):null;const g=rnd(30,50);S.gold+=g;gainEcho(e);
    S.screen='msg';S.msg={title:'보급 상자',body:`낡은 보급 상자를 열었습니다.<br>조개 화폐 <b>+${g}</b>${e?`<br>에코 <b>${ECHO[e].n}</b> 획득 — ${ECHO[e].tx}`:''}`};render()}
}

