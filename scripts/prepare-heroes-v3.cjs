// v3 도트 정규화: 4×2 모션 시트 → 128px 스트립. v2(nearest 축소)의 지글거림·잡티·해방 프레임 축소 문제 해결.
// 기존 색 보정 캐릭터는 OUT=art/backup-recolor/assets IDS=rov,... 로 원본 자리에 쓰고 recolor.cjs를 다시 돌린다.
// 사용: node scripts/prepare-heroes-v3.cjs [preview|write] [old]  (preview면 art/preview-v3/에만, old면 기존 8개 공명자 재처리)
const sharp=require('sharp'),fs=require('node:fs/promises'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),src=path.join(root,'art/source-v2');
const PREVIEW=process.argv[2]==='preview',out=process.env.OUT?path.resolve(root,process.env.OUT):PREVIEW?path.join(root,'art/preview-v3'):path.join(root,'assets');
// 새 시트는 256px 프레임(화면 1배). old는 원본이 작아 128px(화면 2배) 유지
const OLD_MODE=process.argv[3]==='old',CELL=OLD_MODE?128:256,BODY=CELL*13/16,MECHA_BODY=CELL*23/32,FOOT=CELL-6*CELL/128;
// 반투명 글로우 제거 + 작은 잡티 삭제(< minPx), 옆 칸에서 넘어온 좌우 경계 조각 삭제(< edgePx)
function clean(data,w,h,cut,minPx,edgePx=0){
  for(let i=3;i<data.length;i+=4)data[i]=data[i]<cut?0:255;
  const seen=new Uint8Array(w*h),st=[];
  for(let p=0;p<w*h;p++){if(seen[p]||!data[p*4+3])continue;const comp=[];let edge=false;st.push(p);seen[p]=1;
    while(st.length){const q=st.pop();comp.push(q);const x=q%w,y=(q/w)|0;if(x===0||x===w-1)edge=true;
      for(const n of [x>0?q-1:-1,x<w-1?q+1:-1,y>0?q-w:-1,y<h-1?q+w:-1])if(n>=0&&!seen[n]&&data[n*4+3]){seen[n]=1;st.push(n)}}
    if(comp.length<minPx||(edge&&comp.length<edgePx))for(const q of comp)data[q*4+3]=0}
  return data;
}
const cellOf=(file,c,r,cols,rows)=>rectOf(file,c/cols,r/rows,(c+1)/cols,(r+1)/rows);
async function rectOf(file,x0,y0,x1,y1){
  const m=await sharp(file).metadata(),L=Math.round(x0*m.width)+3,T=Math.round(y0*m.height)+3;
  const {data,info}=await sharp(file).extract({left:L,top:T,width:Math.round(x1*m.width)-L-3,height:Math.round(y1*m.height)-T-3}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  clean(data,info.width,info.height,140,400,45000);
  return sharp(data,{raw:info}).png().toBuffer().then(b=>sharp(b).trim({threshold:1}).toBuffer({resolveWithObject:true}));
}
async function frame(buf,scale){
  const m=await sharp(buf).metadata();let w=Math.round(m.width*scale),h=Math.round(m.height*scale);
  // 면적 평균 축소(붓질 노이즈 제거) → 알파 이진화 → 잡티 제거 → 32색 무디더
  let img=await sharp(buf).resize(w,h,{kernel:'lanczos3'}).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  clean(img.data,w,h,110,6*(CELL/128)**2);
  let png=await sharp(img.data,{raw:img.info}).png({palette:true,colours:OLD_MODE?32:64,dither:0}).toBuffer();
  // 이펙트가 커서 칸을 넘으면 몸 크기를 유지한 채 가장자리를 자름
  const L=Math.max(0,Math.floor((w-CELL)/2)),T=Math.max(0,h-FOOT);
  if(w>CELL||h>FOOT){png=await sharp(png).extract({left:L,top:T,width:Math.min(w,CELL),height:Math.min(h,FOOT)}).toBuffer();w=Math.min(w,CELL);h=Math.min(h,FOOT)}
  return sharp({create:{width:CELL,height:CELL,channels:4,background:'#00000000'}}).composite([{input:png,left:Math.floor((CELL-w)/2),top:FOOT-h}]).png({palette:true,colours:48,dither:0}).toBuffer();
}
const strip=(name,fr)=>sharp({create:{width:CELL*fr.length,height:CELL,channels:4,background:'#00000000'}}).composite(fr.map((input,i)=>({input,left:CELL*i,top:0}))).png().toFile(path.join(out,name));
async function hero(id,rects){
  const file=path.join(src,`hero_${id}.png`);
  const cells=[];for(let i=0;i<8;i++)cells.push((await (rects?rectOf(...rects[i]):cellOf(file,i%4,i>>2,4,2))).data);
  const idleH=(await sharp(cells[0]).metadata()).height,scale=(id==='aemMecha'?MECHA_BODY:BODY)/idleH; // 대기 자세 키 기준으로 전 프레임 동일 배율
  const p=await Promise.all(cells.map(b=>frame(b,scale)));
  await fs.writeFile(path.join(out,`${id}.png`),p[0]);await fs.writeFile(path.join(out,`${id}_idle.png`),p[0]);
  await strip(`${id}_attack.png`,p.slice(0,4));if(id==='aemMecha')await strip('motion/aemMecha_attack.png',p.slice(0,4));
  for(const [s,k] of [['guard',4],['hit',5],['cast',6],['ultimate',7]])await strip(`motion/${id}_${s}.png`,[p[0],s==='ultimate'?p[6]:p[k],p[k],p[0]]);
  return p;
}
async function cards(id,ids,cols=3,rows=3){
  const file=path.join(src,`cards_${id}.png`);
  for(const [i,cid] of ids.entries()){const m=await sharp(file).metadata(),w=m.width/cols,h=m.height/rows;
    await sharp(file).extract({left:Math.round((i%cols)*w)+6,top:Math.round(Math.floor(i/cols)*h)+6,width:Math.round(w)-12,height:Math.round(h)-12})
      .resize(144,96,{fit:'cover',kernel:'lanczos3'}).png({palette:true,colours:64,dither:0}).toFile(path.join(out,`cards/${cid}.png`))}
}
const HEROES={yin:null,car:'car',aem:null,aemMecha:null,mor:null,lyn:null,hiy:'hiy'};
// 기존 7명: 대기·공격 4프레임 = art/source 원본, 방어·피격·시전·해방 = source-v2 heroesA/B (prepare-sprites / prepare-art-v2와 같은 좌표)
const OLD=[[ 'exec-bf959425-8856-4f3a-8fe6-9a7045d68467.png',[0,.25,.49,.81,1],[0,.26,.51,.745,1],['rov','rovM','aem','sk'],'heroesA',[0,.245,.48,.755,1],[0,.285,.535,.77,1]],
  ['exec-8f038a01-3412-4384-93c2-45eb51ce106e.png',[0,.25,.49,.79,1],[0,.26,.505,.74,1],['lyn','mor','chi','cam'],'heroesB',[0,.245,.48,.755,1],[0,.265,.515,.755,1]]];
const oldRects=()=>Object.fromEntries(OLD.flatMap(([a,ax,ay,ids,b,bx,by])=>ids.map((id,r)=>[id,[
  ...[0,1,2,3].map(c=>[path.join(root,'art/source',a),ax[c],ay[r],ax[c+1],ay[r+1]]),
  ...[0,1,2,3].map(c=>[path.join(src,b+'.png'),bx[c],by[r],bx[c+1],by[r+1]])]])));
const AEM_CARDS=['aem_a','aem_b','aem_s','aem_dash','aem_shard','aem_wing','aem_star','aem_ghost','aem_break','aem_sync'];
const CARD_IDS=k=>Array.from({length:9},(_,i)=>`${k}_${i+1}`);
(async()=>{
  await fs.mkdir(path.join(out,'motion'),{recursive:true});await fs.mkdir(path.join(out,'cards'),{recursive:true});
  const R=oldRects(),list=(process.argv[3]==='old'?Object.keys(R).filter(id=>!HEROES.hasOwnProperty(id)):Object.keys(HEROES)).filter(id=>!process.env.IDS||process.env.IDS.split(',').includes(id));
  for(const id of list){
    const p=await hero(id,R[id]&&process.argv[3]==='old'?R[id]:null);
    for(const f of p){const {data}=await sharp(f).ensureAlpha().raw().toBuffer({resolveWithObject:true});let v=0;for(let i=3;i<data.length;i+=4)v+=data[i]>0;assert(v>800,`${id}: frame nearly empty`)}
    if(!R[id]||process.argv[3]!=='old')try{await fs.access(path.join(src,`cards_${id}.png`));await (id==='aem'?cards(id,AEM_CARDS,2,5):cards(id,CARD_IDS(id)))}catch{console.log(`skip cards_${id}.png (없음)`)}
  }
  console.log('PASS',PREVIEW?'(preview)':'');
})();
