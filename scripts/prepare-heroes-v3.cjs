// v3 도트 정규화: 4×2 모션 시트 → 128px 스트립. v2(nearest 축소)의 지글거림·잡티·해방 프레임 축소 문제 해결.
// 사용: node scripts/prepare-heroes-v3.cjs [preview|write] [old]  (preview면 art/preview-v3/에만, old면 기존 8개 공명자 재처리)
const sharp=require('sharp'),fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),src=path.join(root,'art/source-v2');
const PREVIEW=process.argv[2]==='preview',out=process.env.OUT?path.resolve(root,process.env.OUT):PREVIEW?path.join(root,'art/preview-v3'):path.join(root,'assets');
// 새 시트는 256px 프레임(화면 1배). old는 원본이 작아 128px(화면 2배) 유지
// 새 시트: 몸 208px은 그대로, 프레임만 320px로 넓혀 위·옆에 이펙트 여백을 둔다(256px에서는 베기·해방이 잘렸음)
const OLD_MODE=process.argv[3]==='old',CELL=OLD_MODE?128:320,BODY=OLD_MODE?104:208,MECHA_BODY=OLD_MODE?92:184,FOOT=CELL-(OLD_MODE?6:12);
// 반투명 글로우 제거 + 작은 잡티 삭제(< minPx), 옆 칸에서 넘어온 좌우 경계 조각 삭제(< edgePx)
function clean(data,w,h,cut,minPx,edgePx=0){
  for(let i=3;i<data.length;i+=4)data[i]=data[i]<cut?0:255;
  const seen=new Uint8Array(w*h),st=[];
  for(let p=0;p<w*h;p++){if(seen[p]||!data[p*4+3])continue;const comp=[];let edge=false,x0=w,x1=0;st.push(p);seen[p]=1;
    while(st.length){const q=st.pop();comp.push(q);const x=q%w,y=(q/w)|0;if(x===0||x===w-1)edge=true;if(x<x0)x0=x;if(x>x1)x1=x;
      for(const n of [x>0?q-1:-1,x<w-1?q+1:-1,y>0?q-w:-1,y<h-1?q+w:-1])if(n>=0&&!seen[n]&&data[n*4+3]){seen[n]=1;st.push(n)}}
    if(comp.length<minPx||(edge&&comp.length<edgePx&&x1-x0<w/4))for(const q of comp)data[q*4+3]=0}
  return data;
}
// 칸 밖으로 넘어간 베기·이펙트를 살리려고 옆 칸 쪽 여백(MARGIN)까지 읽고, 무게중심이 이 칸 안에 있는 덩어리만 남긴다(옆 칸 그림은 버림)
const MARGIN=0.22;
function keepCore(d,w,h,cx0,cy0,cx1,cy1){
  const seen=new Uint8Array(w*h),st=[];
  for(let p=0;p<w*h;p++){if(seen[p]||!d[p*4+3])continue;const comp=[];let sx=0,sy=0;st.push(p);seen[p]=1;
    while(st.length){const q=st.pop();comp.push(q);const x=q%w,y=(q/w)|0;sx+=x;sy+=y;
      for(const n of [x>0?q-1:-1,x<w-1?q+1:-1,y>0?q-w:-1,y<h-1?q+w:-1])if(n>=0&&!seen[n]&&d[n*4+3]){seen[n]=1;st.push(n)}}
    const mx=sx/comp.length,my=sy/comp.length;if(mx<cx0||mx>=cx1||my<cy0||my>=cy1)for(const q of comp)d[q*4+3]=0}
  return d;
}
const cellOf=(file,c,r,cols,rows)=>rectOf(file,c/cols,r/rows,(c+1)/cols,(r+1)/rows,MARGIN);
// 반환: 잘라낸 그림 + 그 안에서 원래 칸 중심의 x(프레임마다 몸 위치를 같게 맞추는 기준)
async function rectOf(file,x0,y0,x1,y1,margin=0){
  const m=await sharp(file).metadata(),cw=(x1-x0)*m.width,ch=(y1-y0)*m.height;
  const L=Math.max(0,Math.round(x0*m.width-margin*cw)+3),T=Math.max(0,Math.round(y0*m.height-margin*ch/2)+3);
  const R=Math.min(m.width,Math.round(x1*m.width+margin*cw)-3),B=Math.min(m.height,Math.round(y1*m.height+margin*ch/2)-3);
  const {data,info}=await sharp(file).extract({left:L,top:T,width:R-L,height:B-T}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  clean(data,info.width,info.height,140,400,45000);
  if(margin)keepCore(data,info.width,info.height,x0*m.width-L,y0*m.height-T,x1*m.width-L,y1*m.height-T);
  const r=await sharp(await sharp(data,{raw:info}).png().toBuffer()).trim({threshold:1}).toBuffer({resolveWithObject:true});
  return {data:r.data,cx:((x0+x1)/2*m.width-L)+(r.info.trimOffsetLeft||0)};
}
const {modeResize}=require('./lib/pixel.cjs');
// 칸 경계에서 일자로 잘린 이펙트 단면을 물결 모양으로 깎는다. 8px 이상 연속으로 경계에 닿은 구간만(칼끝 한 점은 그대로). 아래쪽(발)은 제외
function taper(d,w,h,B){
  const sides=[[h,i=>[0,i],(i,k)=>[k,i]],[h,i=>[w-1,i],(i,k)=>[w-1-k,i]],[w,i=>[i,0],(i,k)=>[i,k]]];
  for(const [n,at,inward] of sides){
    const on=i=>{const [x,y]=at(i);return d[(y*w+x)*4+3]>0};
    for(let i=0;i<n;){if(!on(i)){i++;continue}let j=i;while(j<n&&on(j))j++;
      if(j-i>=8){const m=Math.round(B/2);for(let t=Math.max(0,i-m);t<Math.min(n,j+m);t++){
        const ramp=Math.min(1,(t-(i-m))/m,((j+m)-t)/m),depth=Math.round(B*ramp*(0.6+0.4*Math.sin(t*0.45)*Math.sin(t*0.17+1)));
        for(let k=0;k<depth;k++){const [x,y]=inward(t,k);if(x>=0&&x<w&&y>=0&&y<h)d[(y*w+x)*4+3]=0}}}
      i=j}
  }
  return d;
}
// 바깥 윤곽선: 몸 바로 바깥 투명 칸을 진한 남색으로 칠한다(축소 후 흐려진 실루엣을 도트답게 세움)
function outline(d,w,h){
  const add=[];for(let y=0;y<h;y++)for(let x=0;x<w;x++){const p=y*w+x;if(d[p*4+3])continue;
    if((x>0&&d[(p-1)*4+3])||(x<w-1&&d[(p+1)*4+3])||(y>0&&d[(p-w)*4+3])||(y<h-1&&d[(p+w)*4+3]))add.push(p)}
  for(const p of add){d[p*4]=18;d[p*4+1]=20;d[p*4+2]=38;d[p*4+3]=255}
  return d;
}
{const d=Buffer.alloc(40*40*4,255);taper(d,40,40,6);assert(!d[(20*40+39)*4+3]&&d[(20*40+20)*4+3]&&d[(39*40+20)*4+3],'taper self-check')}
async function frame({data:buf,cx},scale){
  const m=await sharp(buf).metadata();let w=Math.round(m.width*scale),h=Math.round(m.height*scale);
  // 블록 최빈색 축소 → 칸 중심을 프레임 중앙에 고정(몸이 흔들리지 않게), 밖은 자름 → 잘린 단면 깎기 → 잡티 제거 → 무디더 감색
  let img=await modeResize(buf,w,h,{lines:true});
  const left=Math.round(CELL/2-cx*scale),top=FOOT-h,X=Math.max(0,-left),Y=Math.max(0,-top),W=Math.min(w,CELL-left)-X,H=h-Y;
  if(X||Y||W<w){const r=await sharp(img.data,{raw:img.info}).extract({left:X,top:Y,width:W,height:H}).raw().toBuffer({resolveWithObject:true});w=W;h=H;img={data:r.data,info:r.info}}
  taper(img.data,w,h,Math.round(BODY*0.11));
  clean(img.data,w,h,110,6*(BODY/104)**2);
  outline(img.data,w,h);
  const png=await sharp(img.data,{raw:img.info}).png({palette:true,colours:OLD_MODE?32:64,dither:0}).toBuffer();
  return sharp({create:{width:CELL,height:CELL,channels:4,background:'#00000000'}}).composite([{input:png,left:Math.max(0,left),top:Math.max(0,top)}]).png({palette:true,colours:48,dither:0}).toBuffer();
}
const strip=(name,fr)=>sharp({create:{width:CELL*fr.length,height:CELL,channels:4,background:'#00000000'}}).composite(fr.map((input,i)=>({input,left:CELL*i,top:0}))).png().toFile(path.join(out,name));
async function hero(id,rects){
  // hero_<id>_full.png(세로 4×4 16칸, 중간 동작 포함)이 있으면 그것을 쓴다. 없으면 기존 4×2 8칸
  const full=path.join(src,`hero_${id}_full.png`),FULL=!rects&&require('node:fs').existsSync(full),file=FULL?full:path.join(src,`hero_${id}.png`);
  const cells=[];for(let i=0;i<(FULL?16:8);i++)cells.push((await (rects?rectOf(...rects[i]):cellOf(file,i%4,i>>2,4,FULL?4:2))));
  const idleH=(await sharp(cells[0].data).metadata()).height,scale=(id==='aemMecha'?MECHA_BODY:BODY)/idleH; // 대기 자세 키 기준으로 전 프레임 동일 배율
  const p=await Promise.all(cells.map(b=>frame(b,scale)));
  if(FULL){
    // 16칸: 대기 숨쉬기 2장(8fps, 1초). 동작은 8장 스트립 → 게임이 16fps로 재생(art.js playSprite). 공격 베기는 4번째 칸(약 190ms)
    const S=a=>a.map(i=>p[i]);await fs.writeFile(path.join(out,`${id}.png`),p[0]);await strip(`${id}_idle.png`,S([0,0,0,0,1,1,1,1]));
    const atk=S([2,3,4,5,5,5,6,7]);await strip(`${id}_attack.png`,atk);if(id==='aemMecha')await strip('motion/aemMecha_attack.png',atk);
    for(const [st,a] of [['guard',[8,9,9,9,9,9,8,0]],['hit',[10,10,10,10,11,11,0,0]],['cast',[12,13,13,13,13,13,12,0]],['ultimate',[12,14,14,15,15,15,15,0]]])await strip(`motion/${id}_${st}.png`,S(a));
    return p;
  }
  await fs.writeFile(path.join(out,`${id}.png`),p[0]);await fs.writeFile(path.join(out,`${id}_idle.png`),p[0]);
  // 공격: 준비 → 베기 3칸 유지 → 회수(8fps). 베는 칸이 125ms에 나와 피해 숫자(170ms)보다 먼저 보이고, 타격 순간이 길게 읽힘
  const atk=[p[1],p[2],p[2],p[2],p[3]];
  await strip(`${id}_attack.png`,atk);if(id==='aemMecha')await strip('motion/aemMecha_attack.png',atk);
  for(const [s,k] of [['guard',4],['hit',5],['cast',6],['ultimate',7]])await strip(`motion/${id}_${s}.png`,[p[0],s==='ultimate'?p[6]:p[k],p[k],p[0]]);
  return p;
}
async function cards(id,ids,cols=3,rows=3){
  const file=path.join(src,`cards_${id}.png`);
  for(const [i,cid] of ids.entries()){const m=await sharp(file).metadata(),w=m.width/cols,h=m.height/rows;
    await sharp(file).extract({left:Math.round((i%cols)*w)+6,top:Math.round(Math.floor(i/cols)*h)+6,width:Math.round(w)-12,height:Math.round(h)-12})
      .resize(144,96,{fit:'cover',kernel:'lanczos3'}).png({palette:true,colours:64,dither:0}).toFile(path.join(out,`cards/${cid}.png`))}
}
const HEROES={yin:null,car:'car',aem:null,aemMecha:null,mor:null,lyn:null,hiy:'hiy',sk:null,rov:null,rovM:null,chi:null,cam:null};
// 기존 7명: 대기·공격 4프레임 = art/source 원본, 방어·피격·시전·해방 = source-v2 heroesA/B (prepare-sprites / prepare-art-v2와 같은 좌표)
const OLD=[[ 'exec-bf959425-8856-4f3a-8fe6-9a7045d68467.png',[0,.25,.49,.81,1],[0,.26,.51,.745,1],['rov','rovM','aem','sk'],'heroesA',[0,.245,.48,.755,1],[0,.285,.535,.77,1]],
  ['exec-8f038a01-3412-4384-93c2-45eb51ce106e.png',[0,.25,.49,.79,1],[0,.26,.505,.74,1],['lyn','mor','chi','cam'],'heroesB',[0,.245,.48,.755,1],[0,.265,.515,.755,1]]];
const oldRects=()=>Object.fromEntries(OLD.flatMap(([a,ax,ay,ids,b,bx,by])=>ids.map((id,r)=>[id,[
  ...[0,1,2,3].map(c=>[path.join(root,'art/source',a),ax[c],ay[r],ax[c+1],ay[r+1]]),
  ...[0,1,2,3].map(c=>[path.join(src,b+'.png'),bx[c],by[r],bx[c+1],by[r+1]])]])));
const AEM_CARDS=['aem_a','aem_b','aem_s','aem_dash','aem_shard','aem_wing','aem_star','aem_ghost','aem_break','aem_sync'];
const HIY_CARDS=['hiy_a','hiy_b','hiy_s','hiy_bloom','hiy_edge','hiy_suzu','hiy_art','hiy_shatter','hiy_bless'];
// 카드 시트 패널 순서 = src/js/data.js 카드 정의 순서(HERO_PROMPTS.md 카드 순서)
const CARD_LIST={aem:AEM_CARDS,hiy:HIY_CARDS,lyn:['lyn_a','lyn_b','lyn_s','lyn_spray','lyn_rapid','lyn_free','lyn_merc','lyn_quick','lyn_canvas'],
  mor:['mor_a','mor_b','mor_s','mor_mass','mor_conv','mor_crit','mor_hyp','mor_probe','mor_lecture']};
(async()=>{
  await fs.mkdir(path.join(out,'motion'),{recursive:true});await fs.mkdir(path.join(out,'cards'),{recursive:true});
  const R=oldRects(),list=(process.argv[3]==='old'?Object.keys(R).filter(id=>!HEROES.hasOwnProperty(id)):Object.keys(HEROES)).filter(id=>!process.env.IDS||process.env.IDS.split(',').includes(id));
  for(const id of list){
    const p=await hero(id,R[id]&&process.argv[3]==='old'?R[id]:null);
    for(const f of p){const {data}=await sharp(f).ensureAlpha().raw().toBuffer({resolveWithObject:true});let v=0;for(let i=3;i<data.length;i+=4)v+=data[i]>0;assert(v>800,`${id}: frame ${p.indexOf(f)} nearly empty (${v}px)`)}
    // 카드 목록이 등록된 캐릭터만. 나머지는 기존 카드 유지
    // 카드 시트는 CARDS=1일 때만 다시 자른다(전원 처리 때 card-gen 단품 카드를 덮어쓰지 않게)
    if(process.env.CARDS==='1'&&CARD_LIST[id]&&process.argv[3]!=='old')try{await fs.access(path.join(src,`cards_${id}.png`));await (id==='aem'?cards(id,AEM_CARDS,2,5):cards(id,CARD_LIST[id]))}catch{console.log(`skip cards_${id}.png (없음)`)}
  }
  console.log('PASS',PREVIEW?'(preview)':'');
})();
