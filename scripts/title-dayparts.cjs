// 타이틀 시간대 영상: 하루가 한 바퀴 도는 원본 영상(8초)에서 박힌 로고 글자를 지우고,
// 낮·노을·밤·새벽 구간을 각각 소리 없는 핑퐁 반복 영상 assets/maps/title-<day|dusk|night|dawn>.mp4로 만든다.
//   node scripts/title-dayparts.cjs [원본=art/source-v2/title_daycycle.mp4]
// 원본은 공식 로고 글자가 박혀 있어 커밋하지 않는다(.gitignore). 게임은 지금 시각으로 고른다(render.js titlePart).
// 글자 마스크: 영상 내내 색이 거의 안 변하는 밝은 픽셀(배경은 낮→밤으로 크게 변함) ∪ 밤 프레임의 밝은 무채색 글자 픽셀,
// 7px 넓히고 아래로 10px(그림자). 채우기: 마스크 픽셀마다 16방향 가장 가까운 배경 픽셀의 거리² 가중 평균(어두운 외톨이 표본 제외) 후 흐림
const sharp=require('sharp'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),SRC=process.argv[2]||path.join(root,'art/source-v2/title_daycycle.mp4');
// 프레임 구간(24fps, 프레임 평균색이 평평한 곳). 192프레임: 낮 0~44, 노을 68~95, 밤 136~158, 새벽 172~191
const PARTS={day:[0,44],dusk:[68,95],night:[136,158],dawn:[172,191]};
// 로고 글자 범위(1280×720 기준). 원본이 바뀌면 다시 잡는다
const X=440,Y=0,W=400,H=260,BOX=[88,58,322,198];
const f3=i=>String(i).padStart(3,'0');
async function region(dir,i){return (await sharp(path.join(dir,f3(i)+'.png')).extract({left:X,top:Y,width:W,height:H}).removeAlpha().raw().toBuffer())}
function dilate(m,n){for(let r=0;r<n;r++){const a=Uint8Array.from(m);for(let p=W;p<W*H-W;p++)if(!a[p]){const x=p%W;if((x>0&&a[p-1])||(x<W-1&&a[p+1])||a[p-W]||a[p+W])m[p]=1}}}
async function makeMask(dir,n){
  const sum=new Float64Array(W*H*3),sq=new Float64Array(W*H*3);let k=0;
  for(let i=0;i<n;i+=2){const d=await region(dir,i);for(let j=0;j<d.length;j++){sum[j]+=d[j];sq[j]+=d[j]*d[j]}k++}
  const m=new Uint8Array(W*H),inBox=p=>{const x=p%W,y=(p-x)/W;return x>=BOX[0]&&x<=BOX[2]&&y>=BOX[1]&&y<=BOX[3]};
  for(let p=0;p<W*H;p++){let sd=0,mean=0;for(let c=0;c<3;c++){const mu=sum[p*3+c]/k;sd+=Math.sqrt(Math.max(0,sq[p*3+c]/k-mu*mu));mean+=mu}if(sd/3<14&&(mean/3>150||inBox(p)))m[p]=1}
  for(const i of [140,145,150]){const d=await region(dir,i);for(let p=0;p<W*H;p++){if(!inBox(p))continue;const r=d[p*3],g=d[p*3+1],b=d[p*3+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);if(mx>165&&(mx-mn)/mx<.3)m[p]=1}}
  const seen=new Uint8Array(W*H);for(let s=0;s<W*H;s++){if(seen[s]||!m[s])continue;const c=[s];seen[s]=1;
    for(let j=0;j<c.length;j++){const p=c[j],x=p%W;for(const o of [x>0?p-1:-1,x<W-1?p+1:-1,p-W,p+W])if(o>=0&&o<W*H&&!seen[o]&&m[o]){seen[o]=1;c.push(o)}}
    if(c.length<30)for(const p of c)m[p]=0}  // 별·반짝임 같은 작은 덩어리는 글자가 아님
  dilate(m,7);{const a=Uint8Array.from(m);for(let p=0;p<W*H;p++)if(a[p])for(let s=1;s<=10&&p+s*W<W*H;s++)m[p+s*W]=1}
  return m}
function planFill(m){const DIRS=[...Array(16)].map((_,i)=>[Math.cos(i*Math.PI/8),Math.sin(i*Math.PI/8)]),plan=[];
  for(let p=0;p<W*H;p++){if(!m[p])continue;const x=p%W,y=(p-x)/W,ws=[];
    for(const [dx,dy] of DIRS)for(let t=1;t<200;t++){const xx=Math.round(x+dx*t),yy=Math.round(y+dy*t);if(xx<0||yy<0||xx>=W||yy>=H)break;if(!m[yy*W+xx]){ws.push([yy*W+xx,1/(t*t)]);break}}
    plan.push([p,ws])}
  return plan}
async function fill(file,m,plan){
  const {data:d,info}=await sharp(file).removeAlpha().raw().toBuffer({resolveWithObject:true}),FW=info.width,I=q=>((Y+(q/W|0))*FW+X+q%W)*3,L=q=>{const i=I(q);return d[i]*.3+d[i+1]*.59+d[i+2]*.11};
  const val=[];for(const [p,ws] of plan){const ls=ws.map(([q])=>L(q)).sort((a,b)=>a-b),med=ls[ls.length>>1];let r=0,g=0,b=0,s=0;
    for(const [q,w] of ws){if(L(q)<med-35)continue;const i=I(q);r+=d[i]*w;g+=d[i+1]*w;b+=d[i+2]*w;s+=w}val.push([p,r/s,g/s,b/s])}
  for(const [p,r,g,b] of val){const i=I(p);d[i]=r;d[i+1]=g;d[i+2]=b}
  // 빛살 자국을 지우려고 채운 자리만 5×5 평균으로 한 번 흐림
  const blur=[];for(const [p] of plan){const x=p%W,y=(p-x)/W;let r=0,g=0,b=0,c=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(xx<0||yy<0||xx>=W||yy>=H)continue;const i=I(yy*W+xx);r+=d[i];g+=d[i+1];b+=d[i+2];c++}blur.push([p,r/c,g/c,b/c])}
  for(const [p,r,g,b] of blur){const i=I(p);d[i]=r;d[i+1]=g;d[i+2]=b}
  await sharp(d,{raw:info}).png().toFile(file)}
(async()=>{
  assert(fs.existsSync(SRC),'원본 영상이 없어요: '+SRC);
  const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'title-'));
  console.log(execFileSync('swift',[path.join(__dirname,'title-frames.swift'),'extract',SRC,tmp],{encoding:'utf8'}).trim());
  const n=fs.readdirSync(tmp).filter(f=>/^\d+\.png$/.test(f)).length;assert(n>=192,'프레임이 모자라요: '+n);
  const m=await makeMask(tmp,n),plan=planFill(m),cnt=m.reduce((a,b)=>a+b,0);assert(cnt>5000&&cnt<60000,'글자 마스크 크기가 이상해요: '+cnt);
  const need=new Set(Object.values(PARTS).flatMap(([a,b])=>[...Array(b-a+1)].map((_,i)=>a+i)));
  for(const i of need)await fill(path.join(tmp,f3(i)+'.png'),m,plan);
  for(const [k,[a,b]] of Object.entries(PARTS))console.log(k,execFileSync('swift',[path.join(__dirname,'title-frames.swift'),'encode',tmp,String(a),String(b),path.join(root,`assets/maps/title-${k}.mp4`)],{encoding:'utf8'}).trim());
  fs.rmSync(tmp,{recursive:true,force:true});console.log('PASS 마스크',cnt,'px')})();
