/* ============ 사건 ============ */
const EVENTS=[
  {t:'조개 뽑기 기계',s:'¤',b:'녹슨 기계가 깜빡인다. "한 판에 조개 30개! 잭팟은 에코!"',
   c:[{l:'한 판 돌린다 (◎30)',d:'꽝·약제·화폐·에코 중 하나',ok:()=>S.gold>=30,f:()=>{S.gold-=30;const x=Math.random();sfx('tick');
      if(x<.3)done('꽝! 기계가 조개를 삼켰다.');else if(x<.6){const k=randPot();gainPotion(k);done(`약제 「${POT[k].n}」이(가) 굴러 나왔다.`)}
      else if(x<.9){S.gold+=70;sfx('coin');done('조개가 쏟아진다! 화폐 +70.')}else{const e=pick(TREASURE_ECHO.filter(e=>!has(e)));gainEcho(e);sfx('jackpot');done(`★ 잭팟! 에코 「${ECHO[e].n}」!`)}}},
      {l:'그냥 지나간다',d:'',f:()=>done('기계가 아쉽다는 듯 삐 소리를 냈다.')}]},
  {t:'운명의 주사위',s:'⚄',b:'공중에 떠 있는 커다란 주사위. 던지면 무언가가 일어날 것 같다.',
   c:[{l:'주사위를 던진다',d:'1~6, 결과는 운에 맡김',f:()=>{const n=rnd(1,6);const id=T_()[0];const p=S.party[id];
      const r=[()=>{p.hp=Math.max(1,p.hp-12);return '파티 선두 체력 -12'},()=>{S.gold=Math.max(0,S.gold-40);return '화폐 -40'},()=>{S.gold+=50;return '화폐 +50'},()=>{gainPotion(randPot());return '약제 1개'},
        ()=>{shuffle(S.deck.filter(x=>!x.up&&!CD[x.id].unplay)).slice(0,2).forEach(x=>x.up=true);return '무작위 카드 2장 강화'},()=>{const e=pick(TREASURE_ECHO.filter(e=>!has(e)));gainEcho(e);return `에코 「${ECHO[e].n}」`}][n-1]();
      done(`주사위 눈: <b>${n}</b> — ${r}`)}},{l:'손대지 않는다',d:'',f:()=>done('주사위는 다시 허공에서 천천히 돈다.')}]},
  {t:'약초꾼의 오두막',s:'⚗',b:'구석에 약병이 잔뜩 쌓여 있다. 주인은 자리를 비웠다.',
   c:[{l:'약제 2개를 챙긴다',d:'약제 2개 (슬롯이 남는 만큼)',f:()=>{gainPotion(randPot());gainPotion(randPot());done('쓸 만한 약제를 챙겼다.')}},
      {l:'조개를 두고 간다 (◎20)',d:'최대 체력 +5',ok:()=>S.gold>=20,f:()=>{S.gold-=20;T_().forEach(id=>{S.party[id].maxHp+=5;S.party[id].hp+=5});done('정직의 대가로 몸이 가벼워졌다. 최대 체력 +5.')}}]},
  {t:'금이 간 거울',s:'◐',b:'거울 속 덱이 조금 다르게 비친다.',
   c:[{l:'카드 하나를 비춰 본다',d:'카드 1장 복제',f:()=>chooseCard(x=>!CD[x.id].unplay,'복제할 카드',x=>{S.deck.push({...x,uid:UID++});done(`「${CD[x.id].n}」이(가) 한 장 더 생겼다.`)})},
      {l:'거울을 깬다',d:'체력 -6, 무작위 카드 1장 제거',f:()=>{const p=S.party[T_()[0]];p.hp=Math.max(1,p.hp-6);const x=pick(S.deck);S.deck=S.deck.filter(y=>y!==x);done(`파편에 베였다. 「${CD[x.id].n}」이(가) 사라졌다.`)}}]},
  {t:'잔상의 내기',s:'♠',b:'지친 잔상이 카드를 내밀며 내기를 걸어온다. "이기면 다 가져가."',
   c:[{l:'건다 (◎50)',d:'50%: 화폐 +120 / 50%: 잃음',ok:()=>S.gold>=50,f:()=>{S.gold-=50;if(Math.random()<.5){S.gold+=120;sfx('jackpot');done('이겼다! 화폐 +120.')}else done('졌다… 잔상이 킥킥 웃는다.')}},
      {l:'거절한다',d:'',f:()=>done('잔상이 어깨를 으쓱했다.')}]},
  {t:'공명의 샘',s:'≋',b:'맑은 물에서 공명음이 울린다.',
   c:[{l:'물을 마신다',d:'모든 공명자 체력 전부 회복',f:()=>{T_().forEach(id=>{const p=S.party[id];p.down=false;p.hp=p.maxHp});done('온몸에 공명이 차오른다.')}},
      {l:'저주를 씻는다',d:'저주·상태 카드 전부 제거',ok:()=>S.deck.some(x=>CD[x.id].unplay),f:()=>{S.deck=S.deck.filter(x=>!CD[x.id].unplay);done('잡음이 물에 씻겨 나갔다.')}}]},
  {t:'버려진 무기고',s:'⚔',b:'먼지 쌓인 무기 거치대. 하나는 아직 쓸 만해 보인다.',
   c:[{l:'무기를 집는다',d:'무작위 무기 장착',f:()=>{S.screen='map';offerWeapon(pick(Object.keys(WEAPON_DEF)))}},
      {l:'카드를 갈고닦는다',d:'카드 1장 강화',ok:()=>S.deck.some(x=>!x.up&&!CD[x.id].unplay),f:()=>chooseCard(x=>!x.up&&!CD[x.id].unplay,'강화할 카드',x=>{x.up=true;done(`「${CD[x.id].n}」 강화.`)})}]},
  {t:'융합의 제단',s:'⧉',b:'같은 것 둘을 올리면 하나로 합쳐 준다는 제단.',
   c:[{l:'같은 카드 2장을 바친다',d:'같은 카드 2장 → 강화된 1장 + 무작위 인챈트',ok:()=>S.deck.some(x=>!CD[x.id].unplay&&S.deck.filter(y=>y.id===x.id).length>1),
      f:()=>chooseCard(x=>!CD[x.id].unplay&&S.deck.filter(y=>y.id===x.id).length>1,'합칠 카드',x=>{const o=S.deck.find(y=>y!==x&&y.id===x.id);S.deck=S.deck.filter(y=>y!==o);x.up=true;if(!x.ench)x.ench=randomEnch(x);sfx('merge');done(`「${CD[x.id].n}」이(가) 하나로 합쳐졌다.`)})},
      {l:'떠난다',d:'',f:()=>done('제단의 빛이 잦아들었다.')}]},
  {req:()=>S.team.includes('aem'),t:'스타토치 아카데미의 빈 교실',s:'✎',b:'먼지 쌓인 책상 위에 누군가 그려 둔 비행 설계도가 남아 있다. 에이메스가 잠시 말없이 그 그림을 바라본다.',
   c:[{l:'설계도를 함께 들여다본다',d:'에이메스 카드 1장 강화',ok:()=>S.deck.some(x=>CD[x.id].o==='aem'&&!x.up),f:()=>chooseCard(x=>CD[x.id].o==='aem'&&!x.up,'강화할 에이메스 카드',x=>{x.up=true;done(`「${CD[x.id].n}」이(가) 강화되었습니다.`)})},
      {l:'창가에 앉아 쉬어 간다',d:'에이메스 체력 전부 회복',ok:()=>!S.party.aem.down,f:()=>{const p=S.party.aem;p.hp=p.maxHp;done('창밖의 별빛이 따뜻하다. 에이메스가 기운을 되찾았습니다.')}},
      {l:'조용히 문을 닫는다',d:'아무 일도 일어나지 않음',f:()=>done('추억은 그대로 두기로 했습니다.')}]},
  {req:()=>S.team.includes('sk'),t:'검은해안의 관측소',s:'⌬',b:'파수인이 오래된 관측 단말을 깨운다. "기록 중 일부는 정리해도 괜찮아요. 대신, 남은 기록이 당신을 조금 아프게 할 수도 있어요."',
   c:[{l:'불필요한 데이터를 정리한다',d:'카드 1장 제거',ok:()=>S.deck.length>5,f:()=>chooseCard(()=>true,'제거할 카드',x=>{S.deck=S.deck.filter(y=>y.uid!==x.uid);done(`「${CD[x.id].n}」을(를) 덱에서 제거했습니다.`)})},
      {l:'봉인된 관측 기록을 연다',d:'무작위 에코 획득, 파수인 최대 체력 -6',ok:()=>TREASURE_ECHO.some(e=>!has(e)),f:()=>{const e=pick(TREASURE_ECHO.filter(e=>!has(e)));gainEcho(e);const p=S.party.sk;p.maxHp-=6;p.hp=Math.min(p.hp,p.maxHp);done(`에코 「${ECHO[e].n}」 획득. ${ECHO[e].tx}<br>파수인의 최대 체력이 6 감소했습니다.`)}},
      {l:'관측소를 떠난다',d:'',f:()=>done('단말의 불빛이 천천히 꺼집니다.')}]},
  {req:()=>S.team.includes('rov'),t:'디지털 유령의 속삭임',s:'◌',b:'아무도 없는 복도에서 방랑자에게만 들리는 목소리가 흘러나온다. 낯익은 듯한, 아주 먼 곳의 신호.',
   c:[{l:'목소리를 따라간다',d:'50%: 희귀 카드 / 50%: 잔향 노이즈 + 방랑자 체력 -8',f:()=>{if(Math.random()<.5){const id=pick(REWARD_POOL.filter(k=>CD[k].r&&S.team.includes(CD[k].o)));S.deck.push(mk(id));done(`신호의 끝에서 「${CD[id].n}」을(를) 얻었습니다.`)}else{S.deck.push(mk('noise'));const p=S.party.rov;if(!p.down)p.hp=Math.max(1,p.hp-8);done('신호가 일그러지며 귀를 찢는다. <b>잔향 노이즈</b>가 덱에 들어왔고 방랑자가 8 피해를 입었습니다.')}}},
      {l:'지금은 지나친다',d:'',f:()=>done('목소리는 다음에 다시 들릴 것만 같습니다.')}]},
  {t:'버려진 무음 지대',s:'▧',b:'소리가 사라진 구역. 잔상의 흔적과 함께 누군가 흘린 조개 화폐가 반짝인다.',
   c:[{l:'흔적을 조사한다',d:'조개 화폐 +60, 모든 공명자 체력 -5',f:()=>{S.gold+=60;T_().forEach(id=>{const p=S.party[id];if(!p.down)p.hp=Math.max(1,p.hp-5)});done('잔류 진동에 휩쓸렸지만 화폐 주머니를 챙겼습니다.')}},
      {l:'잔상의 메아리를 흡수한다',d:'무작위 공용 카드 「조개 화폐 던지기」 획득',f:()=>{S.deck.push(mk('any_shell'));done('「조개 화폐 던지기」를 얻었습니다.')}},
      {l:'돌아간다',d:'',f:()=>done('무음은 여전히 무겁습니다.')}]},
  {t:'라하이로이 노점',s:'⛺',b:'탑 중턱에서 장사를 하는 이상한 상인. "공명 보정 장치 있어요! 효과는… 아마 있을 거예요."',
   c:[{l:'보정 장치를 산다 (50 화폐)',d:'모든 공명자 최대 체력 +5',ok:()=>S.gold>=50,f:()=>{S.gold-=50;T_().forEach(id=>{S.party[id].maxHp+=5;if(!S.party[id].down)S.party[id].hp+=5});done('의외로 효과가 있었습니다!')}},
      {l:'따뜻한 차를 얻어 마신다',d:'모든 공명자 체력 12 회복',f:()=>{T_().forEach(id=>{const p=S.party[id];if(!p.down)p.hp=Math.min(p.maxHp,p.hp+12)});done('잠깐의 휴식이 반갑습니다.')}}]},
  {req:()=>S.team.includes('rov'),t:'방랑자의 기억 조각',s:'❂',b:'공명하는 파편이 떠 있다. 손을 뻗자 잊고 있던 장면이 스친다.',
   c:[{l:'기억을 붙잡는다',d:'방랑자 카드 1장 강화',ok:()=>S.deck.some(x=>CD[x.id].o==='rov'&&!x.up),f:()=>chooseCard(x=>CD[x.id].o==='rov'&&!x.up,'강화할 방랑자 카드',x=>{x.up=true;done(`「${CD[x.id].n}」이(가) 강화되었습니다.`)})},
      {l:'기억을 놓아준다',d:'기절한 공명자 부활(체력 30%), 없으면 모두 8 회복',f:()=>{let rev=false;T_().forEach(id=>{const p=S.party[id];if(p.down){p.down=false;p.hp=Math.round(p.maxHp*.3);rev=true}else p.hp=Math.min(p.maxHp,p.hp+8)});done(rev?'쓰러졌던 동료가 다시 일어섰습니다.':'마음이 가벼워졌습니다.')}}]},
  {req:()=>S.team.includes('sk'),t:'공명 동기화 실험',s:'⚗',b:'검은해안의 실험 장치가 아직 작동한다. 파수인: "출력이 불안정하지만, 성공하면 꽤 의미 있는 결과가 나올 거예요."',
   c:[{l:'실험에 참여한다',d:'무작위 카드 2장 강화, 무작위 공명자 체력 -10',ok:()=>S.deck.some(x=>!x.up&&!CD[x.id].unplay),f:()=>{const ups=shuffle(S.deck.filter(x=>!x.up&&!CD[x.id].unplay)).slice(0,2);ups.forEach(x=>x.up=true);const v=pick(T_().filter(id=>!S.party[id].down));if(v)S.party[v].hp=Math.max(1,S.party[v].hp-10);done(`${ups.map(x=>`「${CD[x.id].n}」`).join(', ')} 강화!${v?`<br>${CH[v].name}이(가) 10 피해를 입었습니다.`:''}`)}},
      {l:'장치를 끈다',d:'',f:()=>done('"현명한 선택이에요." 파수인이 미소 짓습니다.')}]},
  {t:'무음 지대의 잔상',s:'☠',b:'짙은 무음 속에 강력한 잔상이 웅크리고 있다. 지금이라면 먼저 덮칠 수 있다.',
   c:[{l:'기습한다',d:'정예 전투 (에코 보상)',f:()=>{S.screen='map';startCombat(pick(ACTS[S.act].elite),'elite')}},
      {l:'우회한다',d:'',f:()=>done('숨을 죽인 채 지나갔습니다.')}]},
  {req:()=>S.team.length<3&&ALL.some(id=>!S.team.includes(id)),t:'갈림길의 공명자',s:'✚',b:'탑의 갈림길에서 홀로 잔상을 상대하던 공명자와 마주쳤다. 잔상을 함께 물리치자, 상대가 당신을 가만히 바라본다.',
   c:[{l:'동료로 맞이한다',d:'공명자 영입',f:()=>openRecruit()},{l:'각자의 길을 간다',d:'',f:()=>done('서로 짧게 고개를 끄덕이고 헤어졌습니다.')}]},
  {req:()=>S.team.includes('lyn'),t:'색이 바랜 벽화',s:'✐',b:'탑 벽면에 빛바랜 벽화가 남아 있다. 린네가 눈을 반짝인다. "이거, 좀 더 화려하게 만들어도 되지?"',
   c:[{l:'마음껏 덧칠하게 둔다',d:'린네 카드 1장 강화',ok:()=>S.deck.some(x=>CD[x.id].o==='lyn'&&!x.up),f:()=>chooseCard(x=>CD[x.id].o==='lyn'&&!x.up,'강화할 린네 카드',x=>{x.up=true;done(`「${CD[x.id].n}」이(가) 강화되었습니다.`)})},
      {l:'완성된 그림을 감상한다',d:'모든 공명자 체력 8 회복',f:()=>{T_().forEach(id=>heal(id,8));done('벽화가 형형색색으로 빛납니다. 마음이 조금 가벼워졌어요.')}}]},
  {req:()=>S.team.includes('mor'),t:'버려진 탐사 연구실',s:'⌖',b:'모니에가 먼지 쌓인 단말을 살핀다. "이 데이터, 아직 복원할 수 있어요. 조금만 시간을 주세요."',
   c:[{l:'데이터를 복원한다',d:'무작위 카드 1장 강화, 모니에 최대 체력 +4',f:()=>{const u=shuffle(S.deck.filter(x=>!x.up&&!CD[x.id].unplay))[0];if(u)u.up=true;const p=S.party.mor;p.maxHp+=4;if(!p.down)p.hp+=4;done(`${u?`「${CD[u.id].n}」 강화. `:''}모니에의 최대 체력이 4 증가했습니다.`)}},
      {l:'쓸 만한 부품만 챙긴다',d:'조개 화폐 +45',f:()=>{S.gold+=45;done('부품을 팔면 꽤 쏠쏠하겠네요.')}}]},
  {req:()=>S.team.includes('chi'),t:'끊어진 공명의 실',s:'⌇',b:'허공에 공명의 실이 늘어져 있다. 치사가 조용히 말한다. "끊을지, 이을지. 선택은 당신 몫이에요."',
   c:[{l:'실을 끊는다',d:'카드 1장 제거',ok:()=>S.deck.length>5,f:()=>chooseCard(()=>true,'제거할 카드',x=>{S.deck=S.deck.filter(y=>y.uid!==x.uid);done(`「${CD[x.id].n}」을(를) 덱에서 제거했습니다.`)})},
      {l:'실을 잇는다',d:'모든 공명자 최대 체력 +3',f:()=>{T_().forEach(id=>{S.party[id].maxHp+=3;if(!S.party[id].down)S.party[id].hp+=3});done('끊어질 듯하던 실이 단단해졌습니다.')}}]},
  {req:()=>S.team.includes('cam'),t:'블룸 베어러의 발아 시험',s:'❀',b:'카멜리아가 검을 뽑으며 웃는다. "시험이야. 통과하면 상을 줄게. 물론, 다치는 건 각오해야겠지?"',
   c:[{l:'시험에 응한다',d:'정예 전투 (에코 보상)',f:()=>{S.screen='map';startCombat(pick(ACTS[S.act].elite),'elite')}},
      {l:'꽃잎만 받아 간다',d:'카멜리아 체력 -8, 카멜리아 희귀 카드 획득',ok:()=>!S.party.cam.down,f:()=>{const p=S.party.cam;p.hp=Math.max(1,p.hp-8);const id=pick(REWARD_POOL.filter(k=>CD[k].o==='cam'&&CD[k].r));S.deck.push(mk(id));done(`「${CD[id].n}」을(를) 얻었습니다. "다음엔 진짜로 싸워 줘야 해?"`)}}]},
];
function startEvent(){
  const ok=EVENTS.filter(e=>!e.req||e.req());const pool=ok.filter(e=>!(S.seenEv||[]).includes(EVENTS.indexOf(e)));
  const ev=pool.length?pick(pool):pick(ok);S.seenEv=[...(S.seenEv||[]),EVENTS.indexOf(ev)];
  S.ev=ev;S.evResult=null;S.screen='event';render();
}
function evChoose(i){const ch=S.ev.c[i];if(ch.ok&&!ch.ok())return;ch.f()}
function done(t){S.evResult=t;S.modal=null;if(S.screen==='event')render();else{S.screen='msg';S.msg={title:'결과',body:t};render()}}

/* ============ 휴식 · 상점 ============ */
const REST_LINES=[
  ['sk','"별이 보이네요. 이런 밤에는 조금 쉬어도 괜찮아요."'],
  ['aem','"저, 오늘은 꽤 잘 싸웠죠? …그렇게 말해 주면 좋겠어요."'],
  ['rov','모닥불 너머로 잔향이 잔잔하게 울린다.'],
  ['aem','"메카스카우트 정비 완료! 다음 층도 함께 가요."'],
  ['sk','"당신이 걸어온 길은 전부 기록해 두고 있어요."'],
  ['lyn','"쉬는 시간이다! 다음 층 벽은 무슨 색으로 칠할까?"'],
  ['mor','"휴식도 계산에 넣어야 효율이 나와요. 자, 앉으세요."'],
  ['chi','"상처 부위, 보여 주세요. 금방 정리할게요."'],
  ['cam','"벌써 쉬어? …뭐, 꽃도 물은 마셔야지."'],
  ['hiy','"잠시 눈을 붙이세요. 경계는 제가 설게요."'],
];
function restHeal(){T_().forEach(id=>{const p=S.party[id];if(p.down){p.down=false;p.hp=1}p.hp=Math.min(p.maxHp,p.hp+Math.round(p.maxHp*(S.asc>=5?.22:.3)))});S.restDone=`모든 공명자가 최대 체력의 ${S.asc>=5?22:30}%를 회복했습니다.`;render()}
function restUp(){chooseCard(x=>!x.up&&!CD[x.id].unplay,'강화할 카드',x=>{x.up=true;S.restDone=`「${CD[x.id].n}」 강화 완료.`;S.modal=null;render()})}
function openShop(){
  S.shopWeapon={w:pick(Object.keys(WEAPON_DEF)),price:rnd(120,150),sold:false};
  const cards=rollCards(5,true).map(c=>({c,price:CD[c.id].r?rnd(110,140):rnd(45,75),sold:false}));
  cards.push({c:mk('any_tune'),price:40,sold:false});
  const ech=shuffle(TREASURE_ECHO.filter(e=>!has(e))).slice(0,2).map(e=>({e,price:rnd(130,160),sold:false}));
  S.shop={cards,ech,removed:false,kit:false,trinket:Math.random()<.3,pots:shuffle(Object.keys(POT)).slice(0,3).map(k=>({k,price:rnd(45,75),sold:false}))};
  if(S.shop.trinket){S.shop.cards=[];S.shop.ech=shuffle(TREASURE_ECHO.concat(['crown','aix','mephis','turtle']).filter(e=>!has(e)&&ECHO[e])).slice(0,4).map(e=>({e,price:rnd(110,150),sold:false}))}
  S.screen='shop';render();
}
function buyCard(i){const it=S.shop.cards[i];if(it.sold||S.gold<it.price)return;S.gold-=it.price;it.sold=true;S.deck.push(it.c);render()}
function buyEcho(i){const it=S.shop.ech[i];if(it.sold||S.gold<it.price)return;S.gold-=it.price;it.sold=true;gainEcho(it.e);render()}
function buyRemove(){if(S.shop.removed||S.gold<75)return;chooseCard(()=>true,'제거할 카드 (75 화폐)',x=>{S.gold-=75;S.shop.removed=true;S.deck=S.deck.filter(y=>y.uid!==x.uid);S.modal=null;render()})}
function buyEnch(){if(S.shop.enched||S.gold<90)return;S.gold-=90;S.shop.enched=1;enchantFlow(1,'인챈트할 카드')}
function buyPot(i){const it=S.shop.pots[i];if(it.sold||S.gold<it.price||!gainPotion(it.k))return;S.gold-=it.price;it.sold=true;sfx('coin');render()}
function buyKit(){if(S.shop.kit||S.gold<40)return;S.gold-=40;S.shop.kit=true;T_().forEach(id=>{const p=S.party[id];if(!p.down)p.hp=Math.min(p.maxHp,p.hp+15)});render()}

/* ============ 모달 ============ */
function chooseCard(filter,title,cb){S.modal={kind:'choose',title,list:S.deck.filter(filter),cb};render()}
function modalPick(uid){const m=S.modal;const card=S.deck.find(x=>x.uid===uid);if(!card)return;S.modal=null;m.cb(card)}
function showDeck(){S.modal={kind:'deck'};render()}
function closeModal(){if(S.modal&&S.modal.kind==='choose'&&S.screen==='event'&&!S.evResult){}S.modal=null;render()}

