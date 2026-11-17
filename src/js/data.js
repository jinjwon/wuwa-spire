/* ============ 공명자 ============ */
const EL={용융:'#ff7a45',회절:'#ffd75e',응결:'#7fd8ff',전도:'#b48cff',기류:'#6fe3b0',인멸:'#e0558a',물리:'#cfc3a6'};
const ALL=['rov','aem','sk','lyn','mor','chi','cam','hiy'];
const T_=()=>S?S.team:ALL;
const CH={
  rov:{name:'방랑자',el:'회절',color:'#f3d36b',maxHp:64,ini:'방',tag:'주인공',
    desc:'회절 잔향을 쌓고 터뜨리는 균형형 공명자. 잔향이 쌓인 적은 매 턴 피해를 입습니다.',
    intro:'변주: 적 하나에게 5 피해, 회절 잔향 2',
    outro:'협주: 모든 적에게 회절 잔향 2',
    lib:'공명 해방 「진명의 종소리」: 22 피해 + 회절 잔향 6'},
  aem:{name:'에이메스',el:'용융',color:'#ff8a5c',maxHp:58,ini:'에',tag:'라하이로이 · 스타토치 아카데미',
    desc:'일반 형태와 메카스카우트 형태를 오가는 딜러. 메카 형태에서는 모든 공격 피해가 증가합니다.',
    intro:'변주 「여정을 시작하는 신호」: 무작위 적에게 8 피해, 이번 턴 증폭',
    outro:'협주 「보이지 않는 기다림」: 2턴 동안 파티 증폭(피해 +30%)',
    lib:'공명 해방 「샛별을 향한 비행」: 28 피해 + 메카스카우트 형태'},
  sk:{name:'파수인',el:'회절',color:'#b7a6ff',maxHp:60,ini:'파',tag:'검은해안',
    desc:'별의 영역으로 파티를 지키는 서포터. 회복과 보호막, 적 약화를 담당합니다.',
    intro:'변주: 보호막 8',
    outro:'협주: 다음 공명자 체력 6 회복, 이번 턴 증폭',
    lib:'공명 해방 「끝없는 은하」: 모두 10 회복, 보호막 12, 별의 영역 +2턴'},
  lyn:{name:'린네',el:'회절',color:'#5fe0c8',maxHp:68,ini:'린',tag:'라하이로이 · 스타토치 아카데미',
    desc:'쌍권총으로 색을 흩뿌리는 자유로운 영혼. 전투를 색채 3으로 시작하며, 색채 2마다 린네의 공격 피해가 1 오르고, 모은 색채를 프리즘 오버블라스트로 한 번에 터뜨립니다.',
    intro:'변주 「물들일 시간이야!」: 색채 +2, 무작위 적에게 4×2 피해',
    outro:'협주 「출발하자!」: 에너지 +1, 카드 1장 뽑기',
    lib:'공명 해방 「프리즘 오버블라스트」: 모든 적에게 8 + 색채×3 피해 (색채 소모)',
    join:'"오, 재밌어 보이는데? 나도 끼워 줘!"'},
  mor:{name:'모니에',el:'용융',color:'#ffb347',maxHp:66,ini:'모',tag:'라하이로이 · 우주 탐사 연구회',
    desc:'계산으로 싸우는 엑소스트라이더 공학 교수. 보호막을 쌓고, 그 보호막을 그대로 파괴력으로 바꿉니다.',
    intro:'변주 「수렴」: 보호막 6',
    outro:'협주 「재귀」: 보호막 4, 이번 턴 증폭',
    lib:'공명 해방 「임계 프로토콜」: 보호막 15, 이후 보호막만큼 적 하나에게 피해',
    join:'"이 탑의 구조, 흥미롭네요. 관측 데이터는 제가 정리할게요."'},
  chi:{name:'치사',el:'인멸',color:'#7d8cff',maxHp:54,ini:'치',tag:'라하이로이 · 스타토치 아카데미',
    desc:'모든 것을 분해하고 분석하는 냉정한 서포터. 적에게 해체를 새겨 받는 피해를 늘리고, 동료를 치유합니다.',
    intro:'변주 「반향: 회귀」: 무작위 적에게 6 피해, 해체 2',
    outro:'협주 「해체: 제로 법칙」: 모든 적 해체 2, 다음 공명자 체력 4 회복',
    lib:'공명 해방 「허무의 순간」: 모든 적에게 10 피해 + 해체 3, 모든 공명자 5 회복',
    join:'"분석 완료. 당신과 함께 가는 게 가장 합리적인 선택이에요."'},
  hiy:{name:'히유키',el:'응결',color:'#9fdcff',maxHp:62,ini:'히',tag:'특별 대응대 · 플레이밍 사쿠라의 무녀',
    desc:'부적 「스즈」를 지닌 무녀 검사. 공격으로 적에게 서리를 쌓고, 서리 4에서 적을 얼려 다음 행동을 끊습니다.',
    intro:'변주 「설풍」: 무작위 적에게 6 피해, 서리 2',
    outro:'협주 「눈의 장막」: 보호막 4, 모든 적 서리 1',
    lib:'공명 해방 「영원한 서리의 영역」: 모든 적에게 12 피해, 서리 3',
    join:'"…스즈가 울렸어요. 당신과 함께 가라는 뜻이겠죠."'},
  cam:{name:'카멜리아',el:'인멸',color:'#e0405e',maxHp:68,ini:'카',tag:'검은해안 · 블룸 베어러',
    desc:'싸움 그 자체를 즐기는 검은해안의 블룸 베어러. 체력을 깎아 개화를 피우고, 개화만큼 공격이 강해집니다.',
    intro:'변주 「영원한 개화」: 무작위 적에게 9 피해',
    outro:'협주 「휘감기」: 모든 적 약화 1, 이번 턴 증폭',
    lib:'공명 해방 「만개하는 열정」: 적 하나에게 26 피해, 개화 +3',
    join:'"후후, 싸울 상대가 잔뜩이네? 좋아, 따라가 줄게."'},
};

/* ============ 카드 ============
 o:소유자 c:비용 t:종류 tg:대상 필요 v:수치[기본,강화] r:희귀 ex:소멸 pw:파워 */
const CD={
  // 방랑자
  rov_a:{n:'일반 공격',o:'rov',c:1,t:'공격',tg:1,v:{d:[6,9]},tx:V=>`피해 ${V.d}.`,p:(V,T)=>hit(T,V.d),start:1},
  rov_b:{n:'회피',o:'rov',c:1,t:'스킬',v:{b:[5,8]},tx:V=>`보호막 ${V.b}.`,p:V=>gainBlock(V.b),start:1},
  rov_s:{n:'회절 파동',o:'rov',c:1,t:'공격',tg:1,v:{d:[4,6],f:[3,5]},tx:V=>`피해 ${V.d}. 회절 잔향 ${V.f}.`,p:(V,T)=>{hit(T,V.d);fz(T,V.f)},start:1},
  rov_amp:{n:'잔향 증폭',o:'rov',c:[1,0],t:'스킬',tg:1,tx:()=>`대상의 회절 잔향을 2배로.`,p:(V,T)=>{if(T&&!T.dead){T.fz*=2;pop(T,'잔향 ×2','info')}}},
  rov_blade:{n:'공명의 칼날',o:'rov',c:2,t:'공격',tg:1,v:{d:[12,16],x:[2,3]},tx:V=>`피해 ${V.d}. 취약 ${V.x}.`,p:(V,T)=>{hit(T,V.d);vuln(T,V.x)}},
  rov_brand:{n:'별빛 낙인',o:'rov',c:1,t:'스킬',v:{f:[3,5]},tx:V=>`모든 적에게 회절 잔향 ${V.f}.`,p:V=>alive().forEach(e=>fz(e,V.f))},
  rov_res:{n:'방랑의 결의',o:'rov',c:1,t:'스킬',v:{b:[7,10]},tx:V=>`보호막 ${V.b}. 카드 1장 뽑기.`,p:V=>{gainBlock(V.b);draw(1)}},
  rov_echo:{n:'메아리 연격',o:'rov',c:1,t:'공격',tg:1,v:{d:[4,5]},tx:V=>`피해 ${V.d}×2. 대상에게 회절 잔향이 있으면 ×3.`,p:(V,T)=>{const n=T.fz>0?3:2;for(let i=0;i<n;i++)hit(T,V.d)}},
  rov_void:{n:'공허한 메아리',o:'rov',c:2,t:'공격',tg:1,r:1,v:{m:[2,3]},tx:V=>`대상의 회절 잔향 ×${V.m} 만큼 피해.`,p:(V,T)=>hit(T,T.fz*V.m,{raw:1})},
  rov_name:{n:'이름 없는 선율',o:'rov',c:1,t:'파워',pw:1,r:1,v:{f:[1,2]},tx:V=>`파워: 매 턴 시작 시 모든 적에게 회절 잔향 ${V.f}.`,p:V=>{S.c.melody+=V.f}},
  // 에이메스
  aem_a:{n:'일반 공격',o:'aem',c:1,t:'공격',tg:1,v:{d:[6,9]},tx:V=>`피해 ${V.d}.`,p:(V,T)=>hit(T,V.d),start:1},
  aem_b:{n:'회피',o:'aem',c:1,t:'스킬',v:{b:[5,8]},tx:V=>`보호막 ${V.b}.`,p:V=>gainBlock(V.b),start:1},
  aem_s:{n:'함께 떠난 긴 여정',o:'aem',c:0,t:'스킬',v:{b:[6,9]},tx:V=>`형태 전환. 메카스카우트: 에이메스 공격 +3. 일반 형태로 돌아오면 보호막 ${V.b}.`,p:V=>toggleMecha(V.b),start:1},
  aem_dash:{n:'무기 융합·돌진',o:'aem',c:2,t:'공격',tg:1,v:{d:[14,19]},tx:V=>`피해 ${V.d}. 메카 형태면 취약 2.`,p:(V,T)=>{hit(T,V.d);if(S.c.mecha)vuln(T,2)}},
  aem_shard:{n:'별조각 공진',o:'aem',c:1,t:'공격',tg:1,v:{d:[3,4]},tx:V=>`피해 ${V.d}×3.`,p:(V,T)=>{for(let i=0;i<3;i++)hit(T,V.d)}},
  aem_wing:{n:'빛나는 날개의 합주',o:'aem',c:1,t:'스킬',v:{a:[2,3]},tx:V=>`${V.a}턴 동안 증폭(피해 +30%).`,p:V=>{S.c.amp=Math.max(S.c.amp,V.a)}},
  aem_star:{n:'샛별 연격',o:'aem',c:2,t:'공격',v:{d:[9,12]},tx:V=>`모든 적에게 피해 ${V.d}.`,p:V=>alive().forEach(e=>hit(e,V.d))},
  aem_sync:{n:'동기화율 상승',o:'aem',c:0,t:'스킬',v:{k:[1,2]},tx:V=>`에이메스 협주 에너지 +2. 카드 ${V.k}장 뽑기.`,p:V=>{gainConc('aem',2);draw(V.k)}},
  aem_break:{n:'경계를 부순 별빛',o:'aem',c:3,t:'공격',tg:1,r:1,v:{d:[28,36]},tx:V=>`피해 ${V.d}. 메카 형태에서 비용 -1.`,p:(V,T)=>hit(T,V.d)},
  aem_ghost:{n:'보이지 않는 동행',o:'aem',c:1,t:'파워',pw:1,r:1,v:{d:[3,5]},tx:V=>`파워: 교체할 때마다 무작위 적에게 피해 ${V.d}.`,p:V=>{S.c.ghost+=V.d}},
  // 파수인
  sk_a:{n:'일반 공격',o:'sk',c:1,t:'공격',tg:1,v:{d:[5,8]},tx:V=>`피해 ${V.d}.`,p:(V,T)=>hit(T,V.d),start:1},
  sk_b:{n:'회피',o:'sk',c:1,t:'스킬',v:{b:[5,8]},tx:V=>`보호막 ${V.b}.`,p:V=>gainBlock(V.b),start:1},
  sk_s:{n:'별의 영역 전개',o:'sk',c:1,t:'스킬',v:{n:[3,4],b:[4,6]},tx:V=>`${V.n}턴 동안 별의 영역: 턴 시작 시 보호막 ${V.b}, 출전 공명자 체력 2 회복.`,p:V=>setField(V.n,V.b),start:1},
  sk_heal:{n:'나비의 인도',o:'sk',c:1,t:'스킬',ex:1,v:{h:[8,12]},tx:V=>`출전 공명자 체력 ${V.h} 회복. 소멸.`,p:V=>heal(S.c.active,V.h)},
  sk_wall:{n:'별무리 방벽',o:'sk',c:2,t:'스킬',v:{b:[14,19]},tx:V=>`보호막 ${V.b}.`,p:V=>gainBlock(V.b)},
  sk_veil:{n:'결정의 장막',o:'sk',c:1,t:'스킬',v:{b:[6,8],w:[1,2]},tx:V=>`보호막 ${V.b}. 모든 적 약화 ${V.w}.`,p:V=>{gainBlock(V.b);alive().forEach(e=>{e.weak+=V.w})}},
  sk_chaos:{n:'혼돈 이론',o:'sk',c:1,t:'스킬',v:{k:[2,3]},tx:V=>`카드 ${V.k}장 뽑기.`,p:V=>draw(V.k)},
  sk_orbit:{n:'무한한 별의 궤도',o:'sk',c:1,t:'파워',pw:1,v:{b:[3,5]},tx:V=>`파워: 매 턴 시작 시 보호막 ${V.b}, 출전 공명자 협주 에너지 +1.`,p:V=>{S.c.orbit+=V.b}},
  sk_care:{n:'종말의 보살핌',o:'sk',c:1,t:'스킬',ex:1,r:1,v:{h:[6,9]},tx:V=>`모든 공명자 체력 ${V.h} 회복. 소멸.`,p:V=>T_().forEach(id=>heal(id,V.h))},
  // 린네
  lyn_a:{n:'크로마 드리프트',o:'lyn',c:1,t:'공격',tg:1,v:{d:[4,5]},tx:V=>`피해 ${V.d}×2.`,p:(V,T)=>{hit(T,V.d);hit(T,V.d)},start:1},
  lyn_b:{n:'회피',o:'lyn',c:1,t:'스킬',v:{b:[5,8]},tx:V=>`보호막 ${V.b}.`,p:V=>gainBlock(V.b),start:1},
  lyn_s:{n:'린네식 팔레트',o:'lyn',c:1,t:'스킬',v:{k:[2,3]},tx:V=>`색채 +${V.k}. 카드 1장 뽑기.`,p:V=>{paint(V.k);draw(1)},start:1},
  lyn_spray:{n:'색 번짐',o:'lyn',c:1,t:'공격',v:{d:[4,6]},tx:V=>`모든 적에게 피해 ${V.d}. 색채를 1 써서 모든 적 취약 1.`,p:V=>{alive().forEach(e=>hit(e,V.d));if(S.c.paint>0){S.c.paint--;alive().forEach(e=>vuln(e,1))}}},
  lyn_rapid:{n:'프리즘 연사',o:'lyn',c:2,t:'공격',tg:1,v:{d:[3,4]},tx:V=>`색채를 모두 써서 피해 ${V.d}×(색채+2).`,p:(V,T)=>{const n=S.c.paint+2;S.c.paint=0;for(let i=0;i<n;i++)hit(T,V.d)}},
  lyn_free:{n:'자유로운 붓질',o:'lyn',c:[1,0],t:'파워',pw:1,tx:()=>`파워: 공격 카드를 쓸 때마다 색채 +1.`,p:()=>{S.c.freeBrush++}},
  lyn_merc:{n:'용병의 감각',o:'lyn',c:1,t:'스킬',v:{b:[6,9]},tx:V=>`보호막 ${V.b}. 색채 +1.`,p:V=>{gainBlock(V.b);paint(1)}},
  lyn_quick:{n:'난사',o:'lyn',c:0,t:'공격',tg:1,v:{d:[3,5]},tx:V=>`피해 ${V.d}. 색채 +1.`,p:(V,T)=>{hit(T,V.d);paint(1)}},
  lyn_canvas:{n:'거리의 캔버스',o:'lyn',c:[1,0],t:'스킬',r:1,tx:()=>`색채를 2배로. 카드 1장 뽑기.`,p:()=>{paint(S.c.paint);draw(1)}},
  // 모니에
  mor_a:{n:'기저 상태 보정',o:'mor',c:1,t:'공격',tg:1,v:{d:[7,10]},tx:V=>`피해 ${V.d}.`,p:(V,T)=>hit(T,V.d),start:1},
  mor_b:{n:'회피',o:'mor',c:1,t:'스킬',v:{b:[5,8]},tx:V=>`보호막 ${V.b}.`,p:V=>gainBlock(V.b),start:1},
  mor_s:{n:'해석',o:'mor',c:1,t:'스킬',v:{b:[6,9],k:[4,6]},tx:V=>`보호막 ${V.b}. 다음 공격 카드 피해 +${V.k}.`,p:V=>{gainBlock(V.b);S.c.calc+=V.k},start:1},
  mor_mass:{n:'질량-에너지 등가',o:'mor',c:[2,1],t:'공격',tg:1,tx:()=>`현재 보호막만큼 피해. 보호막은 유지.`,p:(V,T)=>hit(T,S.c.block,{raw:1})},
  mor_conv:{n:'수렴 궤도',o:'mor',c:1,t:'공격',v:{b:[5,7],d:[4,6]},tx:V=>`보호막 ${V.b}. 모든 적에게 피해 ${V.d}.`,p:V=>{gainBlock(V.b);alive().forEach(e=>hit(e,V.d))}},
  mor_crit:{n:'임계 충전',o:'mor',c:1,t:'스킬',v:{b:[8,11]},tx:V=>`보호막 ${V.b}. 다음 턴 에너지 +1.`,p:V=>{gainBlock(V.b);S.c.nextE++}},
  mor_hyp:{n:'가설 검증',o:'mor',c:1,t:'파워',pw:1,v:{d:[2,3]},tx:V=>`파워: 보호막을 얻을 때마다 무작위 적에게 피해 ${V.d}.`,p:V=>{S.c.hyp+=V.d}},
  mor_probe:{n:'탐사선 발사',o:'mor',c:3,t:'공격',tg:1,r:1,v:{d:[30,38]},tx:V=>`피해 ${V.d}.`,p:(V,T)=>hit(T,V.d)},
  mor_lecture:{n:'공학 강의',o:'mor',c:1,t:'스킬',v:{k:[2,3]},tx:V=>`카드 ${V.k}장 뽑기. 보호막 3.`,p:V=>{draw(V.k);gainBlock(3)}},
  // 치사
  chi_a:{n:'침묵의 군림',o:'chi',c:1,t:'공격',tg:1,v:{d:[6,9]},tx:V=>`피해 ${V.d}.`,p:(V,T)=>hit(T,V.d),start:1},
  chi_b:{n:'회피',o:'chi',c:1,t:'스킬',v:{b:[5,8]},tx:V=>`보호막 ${V.b}.`,p:V=>gainBlock(V.b),start:1},
  chi_s:{n:'파열된 구성',o:'chi',c:1,t:'스킬',tg:1,v:{u:[1,2],h:[2,3]},tx:V=>`대상 해체 ${V.u}. 출전 공명자 체력 ${V.h} 회복.`,p:(V,T)=>{unravel(T,V.u);heal(S.c.active,V.h)},start:1},
  chi_null:{n:'공백의 순간',o:'chi',c:1,t:'스킬',v:{u:[1,2]},tx:V=>`모든 적 해체 ${V.u}.`,p:V=>alive().forEach(e=>unravel(e,V.u))},
  chi_sever:{n:'실 끊기',o:'chi',c:1,t:'공격',tg:1,v:{d:[3,4]},tx:V=>`대상 해체 1. 피해 ${V.d}×2.`,p:(V,T)=>{unravel(T,1);hit(T,V.d);hit(T,V.d)}},
  chi_echo:{n:'회귀의 울림',o:'chi',c:1,t:'스킬',ex:1,v:{h:[5,8]},tx:V=>`모든 공명자 체력 ${V.h} 회복. 소멸.`,p:V=>T_().forEach(id=>heal(id,V.h))},
  chi_law:{n:'제로 법칙',o:'chi',c:2,t:'스킬',tg:1,r:1,v:{s:[3,5]},tx:V=>`대상의 힘 -${V.s}, 해체 3.`,p:(V,T)=>{if(T&&!T.dead){T.str-=V.s;pop(T,`힘 -${V.s}`,'info')}unravel(T,3)}},
  chi_bond:{n:'끊어지지 않는 인연',o:'chi',c:1,t:'파워',pw:1,v:{h:[3,4]},tx:V=>`파워: 매 턴 시작 시 출전 공명자 체력 ${V.h} 회복.`,p:V=>{S.c.bond+=V.h}},
  chi_blade:{n:'해체의 시선',o:'chi',c:2,t:'공격',tg:1,v:{d:[10,14]},tx:V=>`피해 ${V.d}. 대상의 해체 수치 ×2 만큼 추가 피해.`,p:(V,T)=>hit(T,V.d+(T.ur||0)*2)},
  // 카멜리아
  hiy_a:{n:'서리 베기',o:'hiy',c:1,t:'공격',tg:1,v:{d:[6,9]},tx:V=>`피해 ${V.d}.`,p:(V,T)=>hit(T,V.d),start:1},
  hiy_b:{n:'빙벽 자세',o:'hiy',c:1,t:'스킬',v:{b:[5,8]},tx:V=>`보호막 ${V.b}.`,p:V=>gainBlock(V.b),start:1},
  hiy_s:{n:'서릿날 견제',o:'hiy',c:1,t:'스킬',v:{b:[4,6]},tx:V=>`보호막 ${V.b}. 모든 적 서리 1.`,p:V=>{gainBlock(V.b);alive().forEach(e=>frost(e,1))},start:1},
  hiy_bloom:{n:'얼음꽃 개화',o:'hiy',c:1,t:'공격',v:{d:[5,7]},tx:V=>`모든 적에게 피해 ${V.d}, 서리 1.`,p:V=>alive().forEach(e=>{hit(e,V.d);frost(e,1)})},
  hiy_edge:{n:'서릿날',o:'hiy',c:0,t:'공격',tg:1,v:{d:[4,6]},tx:V=>`피해 ${V.d}. 서리 1.`,p:(V,T)=>{hit(T,V.d);frost(T,1)}},
  hiy_suzu:{n:'부적 스즈',o:'hiy',c:[1,0],t:'파워',pw:1,tx:()=>`파워: 턴 시작 시 모든 적 서리 1.`,p:()=>{S.c.suzu++}},
  hiy_art:{n:'플레이밍 사쿠라 검술',o:'hiy',c:2,t:'공격',tg:1,r:1,v:{d:[4,5]},tx:V=>`피해 ${V.d}×3. 한 번 벨 때마다 서리 1.`,p:(V,T)=>{for(let i=0;i<3;i++){hit(T,V.d);frost(T,1)}}},
  hiy_shatter:{n:'빙결 분쇄',o:'hiy',c:1,t:'공격',tg:1,v:{d:[5,7],m:[4,5]},tx:V=>`대상의 서리를 모두 써서 피해 ${V.d} + 서리×${V.m}.`,p:(V,T)=>{const n=T&&T.fr||0;if(T)T.fr=0;hit(T,V.d+n*V.m)}},
  hiy_bless:{n:'설광의 축복',o:'hiy',c:1,t:'스킬',v:{b:[6,8]},tx:V=>`보호막 ${V.b}. 파티 전원 체력 3 회복.`,p:V=>{gainBlock(V.b);T_().forEach(x=>heal(x,3))}},
  cam_a:{n:'일반 공격',o:'cam',c:1,t:'공격',tg:1,v:{d:[7,10]},tx:V=>`피해 ${V.d}.`,p:(V,T)=>hit(T,V.d),start:1},
  cam_b:{n:'회피',o:'cam',c:1,t:'스킬',v:{b:[5,8]},tx:V=>`보호막 ${V.b}.`,p:V=>gainBlock(V.b),start:1},
  cam_s:{n:'피고 지는 왈츠',o:'cam',c:1,t:'공격',tg:1,v:{d:[5,7]},tx:V=>`피해 ${V.d}. 개화 +2. 카멜리아 체력 -1.`,p:(V,T)=>{hit(T,V.d);bloom(2);selfHurt('cam',1)},start:1},
  cam_pistil:{n:'진홍 꽃술',o:'cam',c:2,t:'공격',tg:1,v:{d:[8,10]},tx:V=>`피해 ${V.d}×2.`,p:(V,T)=>{hit(T,V.d);hit(T,V.d)}},
  cam_vine:{n:'덩굴 휘감기',o:'cam',c:1,t:'공격',tg:1,v:{d:[6,8],w:[1,2]},tx:V=>`피해 ${V.d}. 약화 ${V.w}.`,p:(V,T)=>{hit(T,V.d);if(T&&!T.dead)T.weak+=V.w}},
  cam_thirst:{n:'피의 갈증',o:'cam',c:0,t:'스킬',v:{h:[4,3]},tx:V=>`카멜리아 체력 -${V.h}. 에너지 +2.`,p:V=>{selfHurt('cam',V.h);S.c.energy+=2}},
  cam_bloom:{n:'만개',o:'cam',c:1,t:'공격',v:{d:[6,9]},tx:V=>`모든 적에게 피해 ${V.d}.`,p:V=>alive().forEach(e=>hit(e,V.d))},
  cam_fervor:{n:'흐드러진 열정',o:'cam',c:2,t:'공격',tg:1,r:1,v:{m:[5,7]},tx:V=>`개화를 모두 써서 개화×${V.m} 피해.`,p:(V,T)=>{const b=S.c.bloom;S.c.bloom=0;hit(T,b*V.m,{raw:1})}},
  cam_uni:{n:'식물 우주',o:'cam',c:[1,0],t:'파워',pw:1,tx:()=>`파워: 카멜리아가 체력을 잃을 때마다 개화 +1.`,p:()=>{S.c.camUni++}},
  // 공용
  any_tune:{n:'공명 조율',o:'any',c:0,t:'스킬',v:{k:[1,2]},tx:V=>`카드 ${V.k}장 뽑기.`,p:V=>draw(V.k)},
  // 보상 풀에 들어가는 공용 카드(pool) — 새 키워드: 보존·X 비용·관측·연계
  any_focus:{n:'공명 집중',o:'any',pool:1,c:1,t:'스킬',ret:1,v:{k:[4,6]},tx:V=>`보존. 다음 공격 카드 피해 +${V.k}.`,p:V=>{S.c.calc+=V.k}},
  any_scan:{n:'파형 관측',o:'any',pool:1,c:[1,0],t:'스킬',v:{k:[3,4]},tx:V=>`관측 ${V.k}: 덱 위 ${V.k}장 중 쓸 수 없는 카드를 버림. 카드 1장 뽑기.`,p:V=>{observe(V.k);draw(1)}},
  any_overload:{n:'과부하 방출',o:'any',pool:1,r:1,c:'X',t:'공격',v:{d:[4,6]},tx:V=>`X 비용. 모든 적에게 피해 ${V.d}×X.`,p:V=>{for(let i=0;i<S.c.X;i++)alive().forEach(e=>hit(e,V.d))}},
  any_wall:{n:'잔향 방벽',o:'any',pool:1,c:'X',t:'스킬',v:{b:[5,7]},tx:V=>`X 비용. 보호막 ${V.b}×X.`,p:V=>{if(S.c.X)gainBlock(V.b*S.c.X)}},
  any_chain:{n:'연쇄 공명',o:'any',pool:1,c:1,t:'공격',tg:1,v:{d:[7,10]},tx:V=>`피해 ${V.d}. 연계: 이번 턴 다른 공명자의 카드를 썼다면 1.5배.`,p:(V,T)=>hit(T,Math.floor(V.d*(chained()?1.5:1)))},
  any_reson:{n:'울림 증폭',o:'any',pool:1,c:1,t:'스킬',ex:1,v:{k:[3,4]},tx:V=>`모든 적 공진 +${V.k}. 소멸.`,p:V=>alive().forEach(e=>addVib(e,V.k))},
  any_break:{n:'파쇄 일격',o:'any',pool:1,c:2,t:'공격',tg:1,v:{d:[10,14]},tx:V=>`피해 ${V.d}. 대상이 공진 파괴 상태면 1.5배.`,p:(V,T)=>hit(T,Math.floor(V.d*(T&&T.broken>0?1.5:1)))},
  any_replay:{n:'잔향 재생',o:'any',pool:1,c:[1,0],t:'스킬',tx:()=>`에코 스킬 쿨다운 -2. 카드 1장 뽑기.`,p:()=>{S.c.echoCd=Math.max(0,(S.c.echoCd||0)-2);draw(1)}},
  // 합주: 두 공명자가 모두 파티에 있어야 등장, 대기 비용 없음
  duo_aem_sk:{n:'별을 향한 비행',o:'any',duo:['aem','sk'],c:2,t:'공격',tg:1,r:1,v:{d:[16,22],b:[10,14]},tx:V=>`합주. 피해 ${V.d}. 보호막 ${V.b}.`,p:(V,T)=>{hit(T,V.d);gainBlock(V.b)}},
  duo_rov_lyn:{n:'색채의 메아리',o:'any',duo:['rov','lyn'],c:2,t:'공격',r:1,v:{f:[4,6],d:[4,5]},tx:V=>`합주. 모든 적 회절 잔향 ${V.f}. 무작위 적에게 ${V.d}×4.`,p:V=>{alive().forEach(e=>fz(e,V.f));for(let i=0;i<4;i++){const e=pick(alive());if(e)hit(e,V.d)}}},
  duo_mor_chi:{n:'해석된 붕괴',o:'any',duo:['mor','chi'],c:2,t:'공격',tg:1,r:1,v:{u:[4,6],d:[12,16]},tx:V=>`합주. 해체 ${V.u}, 피해 ${V.d}.`,p:(V,T)=>{unravel(T,V.u);hit(T,V.d)}},
  duo_cam_rov:{n:'피어나는 검무',o:'any',duo:['cam','rov'],c:1,t:'공격',tg:1,r:1,v:{d:[5,7]},tx:V=>`합주. 피해 ${V.d}×3. 개화 +2.`,p:(V,T)=>{for(let i=0;i<3;i++)hit(T,V.d);if(S.team.includes('cam'))bloom(2)}},
  any_shell:{n:'조개 화폐 던지기',o:'any',c:0,t:'공격',tg:1,ex:1,v:{d:[8,12]},tx:V=>`피해 ${V.d}. 소멸.`,p:(V,T)=>hit(T,V.d)},
  noise:{n:'잔향 노이즈',o:'any',c:0,t:'저주',unplay:1,tx:()=>`사용할 수 없음. 손패를 막는 잡음.`},
  static:{n:'잡음',o:'any',c:0,t:'상태',unplay:1,eth:1,tx:()=>`사용할 수 없음. 턴 종료 시 손에 있으면 소멸.`},
  burn:{n:'오염',o:'any',c:0,t:'상태',unplay:1,tx:()=>`사용할 수 없음. 턴 종료 시 손에 있으면 출전 공명자가 피해 3.`},
};
const REWARD_POOL=Object.keys(CD).filter(k=>!CD[k].start&&(CD[k].o!=='any'||CD[k].pool||CD[k].duo));
const inPool=k=>{const d=CD[k];return d.duo?d.duo.every(x=>S.team.includes(x)):d.o==='any'||S.team.includes(d.o)};
const vals=card=>{const d=CD[card.id],V={};for(const k in d.v||{}){const x=d.v[k][card.up?1:0];V[k]=card.fu&&typeof x==='number'?Math.ceil(x*1.5):x;if(card.ep==='sharp'&&typeof V[k]==='number')V[k]=Math.ceil(V[k]*1.3)}return V};
const cardText=card=>CD[card.id].tx(vals(card))+(card.ep?` <b class="epx">✧ ${EPI[card.ep].tx}</b>`:'');

/* ============ 적 ============
 d:피해 h:타수 b:방어 s:힘 w:약화(파티) */
const EN={
  // 경파급
  snip:{n:'칵찰찰',g:'경파급',el:'용융',sym:'♨',hp:[20,24],m:[{n:'집게 찌르기',d:6},{n:'불티 껍질',d:3,b:5}]},
  zig:{n:'아즈즈',g:'경파급',el:'회절',sym:'✧',hp:[18,22],m:[{n:'빛 튀기기',d:4,h:2},{n:'반짝임',b:6}]},
  tick:{n:'우글글',g:'경파급',el:'인멸',sym:'✶',hp:[22,26],m:[{n:'물어뜯기',d:7},{n:'으르렁',s:1,d:3,add:['static',1,'discard']}]},
  gulp:{n:'꾹꾹복어',g:'경파급',el:'응결',sym:'◉',hp:[24,28],m:[{n:'부풀기',b:8},{n:'얼음 가시',d:8}]},
  chirp:{n:'쮸쮸복어',g:'경파급',el:'기류',sym:'◌',hp:[13,16],m:[{n:'바람 뱉기',d:5},{n:'날갯짓',d:2,w:1}]},
  vjun:{n:'선봉 암괴',g:'경파급',el:'물리',sym:'▲',hp:[28,32],m:[{n:'바위 내려치기',d:8},{n:'단단해지기',b:8,s:1}]},
  fjun:{n:'분열 암괴',g:'경파급',el:'물리',sym:'△',hp:[18,21],m:[{n:'파편 투척',d:3,h:2},{n:'구르기',d:6}]},
  cruise:{n:'순회나비',g:'경파급',el:'회절',sym:'❦',hp:[15,18],m:[{n:'빛가루',d:4,w:1},{n:'날개 베기',d:6}]},
  fdread:{n:'갈기늑대 · 불꽃',g:'경파급',el:'용융',sym:'✹',hp:[30,34],m:[{n:'포효',s:2},{n:'불꽃 물기',d:5,h:2},{n:'할퀴기',d:10}]},
  hoar:{n:'서릿땅거북',g:'경파급',el:'응결',sym:'⬢',hp:[34,38],m:[{n:'등껍질 방어',b:12},{n:'박치기',d:9},{n:'서리 숨결',d:5,w:1,add:['static',1,'discard']}]},
  // 거랑급
  cheron:{n:'초록색 왜가리',g:'거랑급',el:'기류',sym:'⟰',hp:[44,48],m:[{n:'깃털 소나기',d:4,h:3},{n:'날아오르기',b:10},{n:'급강하',d:12}]},
  vheron:{n:'보라색 왜가리',g:'거랑급',el:'전도',sym:'⟰',hp:[44,48],m:[{n:'번개 깃',d:9,w:1},{n:'충전',s:3},{n:'뇌격 쪼기',d:6,h:2}]},
  hdread:{n:'갈기늑대 · 암흑',g:'거랑급',el:'인멸',sym:'✹',hp:[46,50],m:[{n:'암흑 포효',s:2,w:1},{n:'연속 물기',d:5,h:3},{n:'덮치기',d:13}]},
  spear:{n:'화살곰',g:'거랑급',el:'물리',sym:'⇶',hp:[54,58],m:[{n:'가시 발사',d:4,h:3},{n:'웅크리기',b:14},{n:'몸통 박치기',d:14}]},
  saur:{n:'그린멜팅카멜레온',g:'거랑급',el:'용융',sym:'♨',hp:[48,52],m:[{n:'화염 혀',d:10},{n:'위장',b:10,s:2},{n:'용암 침',d:6,w:1,add:['burn',1,'discard']}]},
  tamb:{n:'초혼의 악사',g:'거랑급',el:'인멸',sym:'♫',hp:[42,46],m:[{n:'초혼의 북',s:2,b:8},{n:'원혼 소환',d:5,h:2,add:['static',1,'discard']},{n:'진혼',d:11,w:1}]},
  scout:{n:'경전차 로봇',g:'거랑급',el:'응결',sym:'⚙',hp:[50,54],m:[{n:'냉각 포격',d:5,h:3},{n:'장갑 전개',b:15},{n:'돌진',d:12}]},
  // 노도급 (정예)
  crown:{n:'크라운리스',g:'노도급',el:'인멸',sym:'♛',hp:[82,86],elite:1,pv:{k:'anger',v:1,n:'왕의 분노',tx:'스킬 카드를 쓸 때마다 힘 +1.'},m:[{n:'왕관 없는 자의 칼날',d:7,h:2},{n:'불길한 기운',s:2,w:2,add:['static',2,'draw']},{n:'처단',d:18}]},
  mephis:{n:'천둥의 비늘',g:'노도급',el:'전도',sym:'ϟ',hp:[78,82],elite:1,pv:{k:'static',v:6,n:'과충전',tx:'카드를 4장 쓸 때마다 출전 공명자에게 낙뢰 6.'},m:[{n:'낙뢰',d:16},{n:'번개 장막',b:14,s:1},{n:'연쇄 번개',d:5,h:3}]},
  aix:{n:'애곡하는 아익스',g:'노도급',el:'회절',sym:'❖',hp:[80,84],elite:1,pv:{k:'metal',v:8,n:'날개 방벽',tx:'자신의 턴 종료 시 방어 8.'},m:[{n:'애곡',d:6,w:2},{n:'회절 광선',d:14},{n:'날개 방벽',b:15}]},
  explorer:{n:'이름없는 탐색자',g:'노도급',el:'기류',sym:'⌖',hp:[86,90],elite:1,pv:{k:'thorns',v:3,n:'반격 장갑',tx:'공격받을 때마다(타격마다) 출전 공명자에게 피해 3.'},m:[{n:'탐색 기동',b:12,s:2},{n:'질풍 사격',d:5,h:3},{n:'관통',d:17}]},
  rider:{n:'지옥불 기사',g:'노도급',el:'용융',sym:'♞',hp:[100,106],elite:1,pv:{k:'thorns',v:3,n:'불꽃 갑주',tx:'공격받을 때마다(타격마다) 출전 공명자에게 피해 3.'},m:[{n:'돌격',d:16},{n:'화염 갑주',b:16,s:2,add:['burn',2,'discard']},{n:'연속 베기',d:6,h:3}]},
  gorilla:{n:'폭주의 고릴라',g:'노도급',el:'기류',sym:'✊',hp:[104,110],elite:1,pv:{k:'enrage',v:6,n:'폭주',tx:'체력이 절반 이하가 되면 힘 +6.'},m:[{n:'포효',s:3},{n:'회오리 주먹',d:8,h:2},{n:'내려찍기',d:21}]},
  // 해일급 (정예)
  dreamless:{n:'무망자',g:'해일급',el:'인멸',sym:'☾',hp:[126,132],elite:1,pv:{k:'anger',v:2,n:'꿈 없는 분노',tx:'스킬 카드를 쓸 때마다 힘 +2.'},m:[{n:'꿈 없는 잠',s:2,w:2,add:['static',2,'draw']},{n:'혼돈의 칼날',d:7,h:3},{n:'허무 붕괴',d:24},{n:'그림자 장막',b:18}]},
  turtle:{n:'타종 거북이',g:'해일급',el:'응결',sym:'⍾',hp:[138,144],elite:1,pv:{k:'metal',v:12,n:'종각 껍질',tx:'자신의 턴 종료 시 방어 12.'},m:[{n:'종소리 방벽',b:24},{n:'종 내려치기',d:20},{n:'공명 진동',d:6,h:3,w:1}]},
  hecate:{n:'헤카테',g:'해일급',el:'인멸',sym:'☽',hp:[120,126],elite:1,pv:{k:'static',v:7,n:'달의 저주',tx:'카드를 4장 쓸 때마다 출전 공명자에게 피해 7.'},m:[{n:'세 갈래 저주',d:8,w:2,add:['burn',1,'discard']},{n:'월광 낫',d:7,h:3},{n:'명계의 문',s:3,b:12}]},
  // 명식 (보스)
  levia:{n:'레비아탄',g:'명식',el:'인멸',sym:'🜄',hp:[185,185],boss:1,pv:{k:'awaken',n:'심해 각성',tx:'체력이 절반 이하가 되면 각성: 약화·취약·잔향·해체를 떨쳐내고, 힘 +2·방어 15, 행동 패턴이 바뀜.'},m2:[{n:'심해 붕괴',d:9,h:2},{n:'대해일',d:24},{n:'심연의 포효',d:6,h:3,add:['static',2,'draw']},{n:'비늘 재생',b:18,s:1}],m:[{n:'심해의 압력',d:10,w:2},{n:'해일 덮치기',d:24},{n:'비늘 재생',b:20,s:2},{n:'심연의 포효',d:6,h:3,add:['static',2,'discard']}]},
  aleph:{n:'알레프-원의 창조물',g:'명식',el:'인멸',sym:'✺',hp:[310,310],boss:1,pv:{k:'summon',n:'공허의 창조',tx:'체력 66%·33%에서 잔상 2기를 창조. 33% 이하에서 힘 +3.'},m:[{n:'허무의 선고',s:3,b:15},{n:'공허 포격',d:9,h:3},{n:'붕괴의 창',d:32},{n:'존재 소거',d:10,w:2,add:['burn',2,'draw']},{n:'끝없는 공허',d:5,h:5}]},
};
// 3구역: 기존 잔상을 강화한 「심연」 개체. 그림은 art로 원본을 재사용
const ABYSS=(base,hk,dk,g)=>{const d=EN[base];return {...d,n:'심연 '+d.n,g,art:base,hp:d.hp.map(x=>Math.round(x*hk)),pv:d.pv,
  m:d.m.map(m=>({...m,d:m.d&&Math.round(m.d*dk),b:m.b&&Math.round(m.b*1.3)}))}};
['snip','tick','gulp','vjun','fdread','hoar','cheron','vheron','hdread','spear','saur','tamb','scout'].forEach(b=>EN[b+'_x']=ABYSS(b,1.55,1.3,'심연급'));
['crown','mephis','dreamless','hecate','rider','turtle'].forEach(b=>EN[b+'_x']=ABYSS(b,1.35,1.25,'심연 노도급'));
EN.ender={n:'종언의 명식 · 무명의 노래',g:'명식',el:'인멸',sym:'✺',art:'aleph',hp:[420,420],boss:1,pv:{k:'awaken',n:'종언 각성',tx:'체력이 절반 이하가 되면 각성: 약화·취약·잔향·해체를 떨쳐내고, 힘 +2·방어 15, 행동 패턴이 바뀜.'},
  m:[{n:'종언의 서곡',s:2,b:18},{n:'무명의 칼날',d:9,h:3},{n:'잊힌 노래',d:8,w:2,add:['static',2,'draw']},{n:'붕괴의 종',d:30}],
  m2:[{n:'끝없는 메아리',d:6,h:5},{n:'종언',d:38},{n:'소리 없는 비명',d:10,w:2,add:['burn',2,'draw']},{n:'재구성',b:25,s:2}]};
const ENEMY_ART={snip:'d/d6/Snip_Snap_Icon.png',zig:'4/4b/Zig_Zag_Icon.png',tick:'0/02/Tick_Tack_Icon.png',gulp:'a/a0/Gulpuff_Icon.png',chirp:'9/96/Chirpuff_Icon.png',vjun:'c/c1/Vanguard_Junrock_Icon.png',fjun:'4/4c/Fission_Junrock_Icon.png',cruise:'3/3d/Cruisewing_Icon.png',fdread:'4/40/Fusion_Dreadmane_Icon.png',hoar:'6/62/Hoartoise_Icon.png',
  cheron:'8/84/Cyan-Feathered_Heron_Icon.png',vheron:'0/05/Violet-Feathered_Heron_Icon.png',hdread:'e/ed/Havoc_Dreadmane_Icon.png',spear:'b/ba/Spearback_Icon.png',saur:'f/f8/Viridblaze_Saurian_Icon.png',tamb:'6/65/Tambourinist_Icon.png',scout:'4/4e/Autopuppet_Scout_Icon.png',
  crown:'7/70/Crownless_Icon.png',mephis:'1/1e/Tempest_Mephis_Icon.png',aix:'2/25/Mourning_Aix_Icon.png',explorer:'0/08/Nameless_Explorer_Icon.png',rider:'5/55/Inferno_Rider_Icon.png',gorilla:'5/53/Feilian_Beringal_Icon.png',
  dreamless:'9/91/Dreamless_Icon.png',turtle:'4/45/Bell-Borne_Geochelone_Icon.png',hecate:'b/b2/Hecate_Icon.png',
  levia:'b/b7/Reminiscence_Threnodian_-_Leviathan_Icon.png',aleph:'3/38/Reminiscence_Threnodian_-_Voidborne_Construct_Icon.png'};

/* ============ 에코(유물) — 쓰러뜨린 잔상의 힘 ============ */
const ECHO={
  gulp:{n:'꾹꾹복어 에코',i:'◉',tx:'전투 시작 시 선두 공명자의 협주 에너지가 가득 찹니다.'},
  vjun:{n:'선봉 암괴 에코',i:'▲',tx:'매 턴 첫 교체 시 보호막 5.'},
  chirp:{n:'쮸쮸복어 에코',i:'◌',tx:'적을 처치할 때 출전 공명자 체력 3 회복.'},
  snip:{n:'칵찰찰 에코',i:'♨',tx:'용융 공명자(에이메스·모니에)의 공격 피해 +2.'},
  fdread:{n:'갈기늑대 · 불꽃 에코',i:'✹',tx:'모든 공격 피해 +1.'},
  hoar:{n:'서릿땅거북 에코',i:'⬢',tx:'전투 시작 시 보호막 10.'},
  zig:{n:'아즈즈 에코',i:'✧',tx:'매 턴 첫 교체 시 카드 1장 뽑기.'},
  crown:{n:'크라운리스 에코',i:'♛',tx:'전투 첫 턴에 카드 2장을 추가로 뽑습니다.'},
  mephis:{n:'천둥의 비늘 에코',i:'ϟ',tx:'턴 종료 시 보호막이 없으면 보호막 6.'},
  aix:{n:'애곡하는 아익스 에코',i:'❖',tx:'공명 해방 사용 시 에너지 +1, 카드 1장 뽑기.'},
  explorer:{n:'이름없는 탐색자 에코',i:'⌖',tx:'적에게 취약을 부여할 때 1 더 부여.'},
  rider:{n:'지옥불 기사 에코',i:'♞',tx:'전투 시작 시 모든 공명자의 공명 해방 게이지 +3.'},
  gorilla:{n:'폭주의 고릴라 에코',i:'✊',tx:'획득 시 파티 전원 최대 체력 +8.',get:()=>T_().forEach(id=>{S.party[id].maxHp+=8;S.party[id].hp+=8})},
  dreamless:{n:'무망자 에코',i:'☾',tx:'모든 공격 피해 +2.'},
  turtle:{n:'타종 거북이 에코',i:'⍾',tx:'매 턴 시작 시 보호막 4.'},
  hecate:{n:'헤카테 에코',i:'☽',tx:'적을 처치할 때 에너지 +1.'},
  levia:{n:'레비아탄 에코',i:'🜄',tx:'매 턴 에너지 +1.'},
  tuner:{n:'공명 조율기',i:'◎',tx:'전투 시작 시 모든 공명자의 공명 해방 게이지 +2.'},
  pendant:{n:'별조각 펜던트',i:'✧',tx:'획득 시 파티 전원 최대 체력 +6.',get:()=>T_().forEach(id=>{S.party[id].maxHp+=6;S.party[id].hp+=6})},
  charm:{n:'조개 부적',i:'⌘',tx:'전투 보상 조개 화폐 +50%.'},
  e_ember:{n:'불씨 결정',i:'♨',tx:'전투 시작 시 모든 적 취약 1.',cs:()=>alive().forEach(e=>vuln(e,1))},
  e_frost:{n:'서리 결정',i:'❄',tx:'전투 시작 시 모든 적 약화 1.',cs:()=>alive().forEach(e=>e.weak+=1)},
  e_bell:{n:'작은 종',i:'🔔',tx:'3턴마다 에너지 +1.',ts:c=>{if(c.turn%3===0)c.energy++}},
  e_lamp:{n:'등불',i:'☀',tx:'매 턴 시작 시 출전 공명자 체력 2 회복.',ts:c=>heal(c.active,2)},
  e_quill:{n:'깃펜',i:'✎',tx:'전투 첫 턴에 카드 1장을 더 뽑아요.',ts:c=>{if(c.turn===1)draw(1)}},
  e_anchor:{n:'닻',i:'⚓',tx:'전투 첫 턴에 보호막 8.',ts:c=>{if(c.turn===1)gainBlock(8)}},
  e_coin:{n:'행운 동전',i:'¤',tx:'치명타 확률 +5%.'},
  e_clover:{n:'네잎 해초',i:'☘',tx:'조수 룰렛이 「잔잔한 물결」이면 한 번 더 굴려요.'},
  e_dice:{n:'공명 주사위',i:'⚄',tx:'치명타 피해 ×1.75 → ×2.25.'},
  e_magnet:{n:'자석 조개',i:'∩',tx:'변이 잔상이 더 자주 나와요(+15%).'},
  e_heart:{n:'심장석',i:'♥',tx:'획득 시 파티 전원 최대 체력 +12.',get:()=>T_().forEach(id=>{S.party[id].maxHp+=12;S.party[id].hp+=12})},
  e_purse:{n:'두둑한 지갑',i:'◎',tx:'획득 시 조개 화폐 +120.',get:()=>{S.gold+=120}},
  e_spike:{n:'가시 껍질',i:'✶',tx:'적을 처치하면 보호막 5.',kill:()=>gainBlock(5)},
  e_vamp:{n:'흡혈 이빨',i:'⌇',tx:'치명타를 낼 때마다 출전 공명자 체력 2 회복.'},
  e_chain:{n:'연쇄 고리',i:'⛓',tx:'한 턴에 5번째 카드를 쓸 때마다 모든 적에게 6 피해.',play:c=>{if(c.cards%5===0)alive().forEach(e=>dmgEnemy(e,6,true,'burst'))}},
  e_shell:{n:'소라 껍데기',i:'𖦹',tx:'한 턴에 카드를 3장 쓸 때마다 보호막 4.',play:c=>{if(c.cards%3===0)gainBlock(4)}},
  e_whet:{n:'숫돌',i:'◇',tx:'매 턴 첫 공격 카드의 피해 +5.'},
  e_star:{n:'별가루',i:'✦',tx:'카드를 병합하면 카드 1장 뽑기.'},
  e_mirror:{n:'공진 거울',i:'◐',tx:'적이 공진 파괴되면 그 적에게 12 피해.'},
  e_crown2:{n:'왕관 조각',i:'♔',tx:'정예·명식 전투 첫 턴에 에너지 +2.',ts:c=>{if(c.turn===1&&c.kind!=='battle')c.energy+=2}},
  e_tide:{n:'조수병',i:'⚱',tx:'조수 룰렛이 첫 턴부터 굴러요.'},
  e_bomb:{n:'잔향 폭약',i:'✺',tx:'적을 처치하면 다른 적 모두에게 4 피해.',kill:()=>alive().forEach(e=>dmgEnemy(e,4,true,'burst'))},
  e_hourglass:{n:'모래시계',i:'⌛',tx:'6턴째부터 매 턴 에너지 +1.',ts:c=>{if(c.turn>=6)c.energy++}},
  e_feather:{n:'약제 띠',i:'❦',tx:'약제 슬롯 +1.'},
  e_flask:{n:'약사의 가방',i:'⚗',tx:'전투 후 약제가 나올 확률 +25%.'},
  e_brew:{n:'거품 병',i:'○',tx:'약제를 쓸 때마다 체력 3 회복.'},
  e_gem:{n:'공명석',i:'◆',tx:'전투 시작 시 모든 공명자 협주 에너지 +1.',cs:c=>T_().forEach(id=>gainConc(id,1))},
  e_rain:{n:'비구름',i:'☂',tx:'턴 종료 시 모든 적에게 회절 잔향 1.',te:()=>alive().forEach(e=>fz(e,1))},
  e_wall:{n:'성벽 조각',i:'▦',tx:'턴 종료 시 남은 에너지 1당 보호막 3.',te:c=>{if(c.energy>0)gainBlock(c.energy*3)}},
};
/* 명조 ①: 에코 소나타 — 같은 속성 에코를 2개·4개 모으면 세트 효과 */
const ECHO_EL={tuner:'전도',pendant:'회절',charm:'응결',e_ember:'용융',e_frost:'응결',e_bell:'회절',e_lamp:'용융',e_quill:'기류',e_anchor:'응결',e_coin:'회절',e_clover:'기류',e_dice:'인멸',
  e_magnet:'전도',e_heart:'용융',e_purse:'회절',e_spike:'인멸',e_vamp:'인멸',e_chain:'전도',e_shell:'응결',e_whet:'용융',e_star:'회절',e_mirror:'회절',e_crown2:'인멸',e_tide:'응결',
  e_bomb:'용융',e_hourglass:'기류',e_feather:'기류',e_flask:'기류',e_brew:'응결',e_gem:'전도',e_rain:'기류',e_wall:'전도'};
const echoEl=e=>ECHO_EL[e]||(EN[e]&&EN[e].el);
const SONATA={
  용융:{n:'용융의 노래',t2:'용융 공명자의 공격 피해 +2',t4:'용융 폭발을 1 더 쌓아요'},
  회절:{n:'빛의 노래',t2:'회절 공명자의 공격 피해 +2',t4:'회절 잔향을 1 더 부여해요'},
  인멸:{n:'어둠의 노래',t2:'인멸 공명자의 공격 피해 +2',t4:'해체를 1 더 부여해요'},
  응결:{n:'서리의 노래',t2:'매 턴 시작 시 보호막 3',t4:'전투 첫 턴에 모든 적 약화 2'},
  기류:{n:'바람의 노래',t2:'매 턴 시작 시 협주 에너지 +1',t4:'매 턴 시작 시 카드 1장 더 뽑기'},
  전도:{n:'번개의 노래',t2:'매 턴 시작 시 공명 해방 게이지 +1',t4:'공명 해방을 쓰면 에너지 +1'},
};
const sonata=el=>S.echoes.filter(e=>echoEl(e)===el).length;
const son2=el=>sonata(el)>=2,son4=el=>sonata(el)>=4;
/* 명조 ②: 속성 이상 상태 — 공격 카드가 출전 공명자 속성의 상태를 대상에게 쌓음 */
function applyElem(T,el){if(!T||T.dead)return;const n=1+(son4(el)?1:0);
  if(el==='회절')fz(T,n);else if(el==='인멸')unravel(T,n);else if(el==='응결')frost(T,n);
  else if(el==='용융'){T.fb=(T.fb||0)+n;pop(T,`용융 폭발 ${T.fb}/4`,'info');
    if(T.fb>=4){T.fb=0;const own=S.c.cur;sfx('boom');if(!window.FAST)flash(EL.용융);log(`${EN[T.id].n} — 용융 폭발!`);dmgEnemy(T,12,true,'burst');alive().forEach(e=>e!==T&&dmgEnemy(e,4,true,'burst'));S.c.cur=own}}}
/* 응결 → 서리: 4 쌓이면 빙결 — 8 피해 + 공진 파괴(다음 행동 건너뜀) */
function frost(T,n){if(!T||T.dead)return;T.fr=(T.fr||0)+n;pop(T,`서리 ${Math.min(4,T.fr)}/4`,'info');
  if(T.fr>=4){T.fr=0;const own=S.c.cur;sfx('crit');if(!window.FAST)flash(EL.응결);log(`${EN[T.id].n} — 빙결!`);dmgEnemy(T,8,true,'burst');S.c.cur=own;if(!T.dead)addVib(T,T.vibMax)}}
const echoHook=(k,...a)=>S.echoes.forEach(e=>ECHO[e]&&ECHO[e][k]&&ECHO[e][k](...a));
const TREASURE_ECHO=['tuner','pendant','charm','gulp','vjun','fdread','hoar','zig',...Object.keys(ECHO).filter(k=>k.startsWith('e_'))];
const has=id=>S.echoes.includes(id);
function gainEcho(id){if(!id||has(id))return;S.echoes.push(id);ECHO[id].get&&ECHO[id].get();if(!S.mainEcho&&ECHO_SKILL[id])S.mainEcho=id}
/* 독창 시스템 ①: 주 에코를 장착하면 전투 중 쿨다운 액티브 스킬로 사용 (명조 에코 스킬) */
const ECHO_SKILL={
  crown:{n:'처단',cd:3,tg:1,tx:'적 하나에게 14 피해',run:T=>hit(T,14)},
  mephis:{n:'낙뢰',cd:3,tx:'모든 적에게 8 피해',run:()=>alive().forEach(e=>hit(e,8))},
  aix:{n:'애곡',cd:3,tg:1,tx:'적 하나 취약 2·약화 2',run:T=>{vuln(T,2);T.weak+=2;pop(T,'취약·약화','info')}},
  explorer:{n:'관통 사격',cd:2,tg:1,tx:'적 하나에게 6×2 피해',run:T=>{hit(T,6);hit(T,6)}},
  rider:{n:'돌격',cd:3,tg:1,tx:'적 하나에게 16 피해',run:T=>hit(T,16)},
  gorilla:{n:'내려찍기',cd:4,tx:'모든 적에게 10 피해',run:()=>alive().forEach(e=>hit(e,10))},
  dreamless:{n:'허무 붕괴',cd:4,tg:1,tx:'적 하나에게 22 피해',run:T=>hit(T,22)},
  turtle:{n:'종소리 방벽',cd:3,tx:'보호막 15',run:()=>gainBlock(15)},
  hecate:{n:'달의 저주',cd:3,tx:'모든 적 약화 2 + 6 피해',run:()=>alive().forEach(e=>{e.weak+=2;hit(e,6)})},
  levia:{n:'해일',cd:4,tx:'모든 적에게 12 피해',run:()=>alive().forEach(e=>hit(e,12))},
};
function equipEcho(id){if(!ECHO_SKILL[id])return;S.mainEcho=id;render()}
function useEcho(T){
  const c=S.c;if(!c||c.busy||c.ending||!S.mainEcho||c.echoCd>0)return;
  const sk=ECHO_SKILL[S.mainEcho];if(!sk||!alive().length)return;
  T=T&&!T.dead?T:alive()[0];c.cur=c.active;anim('u-'+c.active,'cast');FXDELAY=150;HITSEQ=0;sk.run(T);FXDELAY=0;
  c.echoCd=sk.cd;log(`에코 스킬 — ${sk.n}`);banner(`에코 스킬 · ${sk.n}`);afterAction();
}

/* ============ 구역 ============ */
const ACTS=[
  {name:'1구역 · 잠긴 해안의 탑',easy:[['snip'],['tick'],['chirp','chirp'],['zig']],
   normal:[['tick','chirp'],['vjun'],['gulp','chirp'],['fjun','fjun'],['fdread'],['hoar'],['cruise','snip'],['zig','tick']],
   elite:[['crown'],['mephis'],['aix'],['explorer']],boss:'levia'},
  {name:'2구역 · 별빛 첨탑',easy:[['cheron'],['vheron'],['scout']],
   normal:[['hdread'],['spear'],['saur'],['tamb','chirp'],['cheron','cruise'],['vjun','vjun','fjun'],['scout','zig'],['fdread','tick']],
   elite:[['dreamless'],['turtle'],['hecate'],['rider'],['gorilla']],boss:'aleph'},
  {name:'3구역 · 심연의 정점',easy:[['tick_x'],['snip_x','gulp_x'],['scout_x']],
   normal:[['hdread_x'],['spear_x'],['saur_x','tick_x'],['tamb_x','snip_x'],['cheron_x','vheron_x'],['vjun_x','hoar_x'],['fdread_x','gulp_x'],['scout_x','scout_x']],
   elite:[['crown_x'],['mephis_x'],['dreamless_x'],['hecate_x'],['rider_x'],['turtle_x']],boss:'ender'},
];

/* ============ 약제(포션) — 슬롯 3개, 전투 중 사용 ============ */
const POT={
  heal:{n:'회복 약제',i:'✚',c:'#6fe3b0',tx:'출전 공명자 체력 20 회복.',f:()=>heal(S.c.active,20)},
  block:{n:'방벽 약제',i:'⬢',c:'#7fd8ff',tx:'보호막 14.',f:()=>gainBlock(14)},
  energy:{n:'공명 약제',i:'⚡',c:'#ffd75e',tx:'에너지 +2.',f:()=>{S.c.energy+=2}},
  draw:{n:'영감 약제',i:'✎',c:'#b48cff',tx:'카드 3장 뽑기.',f:()=>draw(3)},
  fire:{n:'용융 약제',i:'♨',c:'#ff7a45',tg:1,tx:'적 하나에게 20 피해.',f:T=>hit(T,20,{raw:1})},
  bomb:{n:'폭발 약제',i:'✹',c:'#ff5d6c',tx:'모든 적에게 10 피해.',f:()=>alive().forEach(e=>hit(e,10,{raw:1}))},
  weak:{n:'안개 약제',i:'☁',c:'#9aa8ff',tx:'모든 적 약화 2.',f:()=>alive().forEach(e=>{e.weak+=2;pop(e,'약화 2','info')})},
  vuln:{n:'부식 약제',i:'☣',c:'#ffb36b',tg:1,tx:'적 하나 취약 3.',f:T=>{vuln(T,3);pop(T,'취약 3','info')}},
  vib:{n:'공진 약제',i:'≋',c:'#cfc3a6',tg:1,tx:'적 하나 공진 +10.',f:T=>addVib(T,10)},
  luck:{n:'행운 약제',i:'✧',c:'#ffe9a8',tx:'이번 턴 치명타 확률 +50%.',f:()=>{S.c.luck=(S.c.luck||0)+.5}},
  echo:{n:'회절 약제',i:'✦',c:'#ffd75e',tx:'모든 적 회절 잔향 4.',f:()=>alive().forEach(e=>fz(e,4))},
  lib:{n:'해방 약제',i:'✺',c:'#e0558a',tx:'출전 공명자 공명 해방 게이지 가득.',f:()=>{S.c.lib[S.c.active]=5}},
  conc:{n:'협주 약제',i:'♪',c:'#5fe0c8',tx:'출전 공명자 협주 에너지 가득.',f:()=>{S.c.conc[S.c.active]=3}},
  revive:{n:'부활 약제',i:'☼',c:'#fff3a8',tx:'기절한 공명자 하나를 체력 30%로 깨움. 없으면 체력 10 회복.',f:()=>{const id=T_().find(x=>S.party[x].down);if(id){const p=S.party[id];p.down=false;p.hp=Math.round(p.maxHp*.3);pop('p-'+id,'부활!','heal')}else heal(S.c.active,10)}},
  fuse:{n:'융합 약제',i:'⧉',c:'#ffd75e',tx:'손의 무작위 카드 1장을 융합(수치 ×1.5).',f:()=>{const x=pick(S.c.hand.filter(y=>!y.fu&&CD[y.id].v));if(x){x.fu=1;sfx('merge')}}},
};
const potSlots=()=>3+(has('e_feather')?1:0);
function gainPotion(k){if(!k||S.potions.length>=potSlots())return false;S.potions.push(k);return true}
function usePotion(i,T){const c=S.c;const k=S.potions[i];if(!c||c.busy||!k||S.screen!=='combat')return;const P=POT[k];
  if(P.tg&&!T){if(alive().length>1){c.tgt={kind:'potion',i};return render()}T=alive()[0]}
  S.potions.splice(i,1);FXDELAY=0;HITSEQ=0;c.cur=c.active;P.f(T);sfx('heal');flash(P.c);log(`약제 — ${P.n}`);if(has('e_brew'))heal(c.active,3);afterAction()}
function dropPotion(i){if(S.potions[i]&&confirm(`「${POT[S.potions[i]].n}」을(를) 버릴까요?`)){S.potions.splice(i,1);render()}}
const randPot=()=>pick(Object.keys(POT));

