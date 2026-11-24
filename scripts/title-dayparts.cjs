// 타이틀 하루 주기 영상: 원본(8초, 낮→노을→밤→새벽)을 게임 배경과 같은 640×360 도트 격자로 다시 그리고
// 끝(새벽)→처음(낮) 이음매를 1초 겹쳐 끊김 없이 반복되는 영상 assets/maps/title-cycle.mp4로 만든다.
//   node scripts/title-dayparts.cjs [원본=art/source-v2/title_daycycle.mp4]
// 도트화: 칸마다 블록 최빈색(lib/pixel.cjs modeResize, 가는 윤곽선 우선) → 2배 최근접으로 1280×720 저장
//   (H.264 색 정보는 가로세로 절반 해상도라 2배로 저장해야 도트 한 칸의 색이 옆 칸으로 번지지 않는다).
// 게임은 640×360×정수 배율(--bk)로 최근접 확대해 보여 주고, 지금 시각의 시간대에서 재생을 시작한다(render.js TITLE_T).
// 원본은 커밋하지 않는다(.gitignore).
const sharp=require('sharp'),fs=require('node:fs'),path=require('node:path'),os=require('node:os'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process'),{modeResize}=require('./lib/pixel.cjs');
const root=path.resolve(__dirname,'..'),SRC=process.argv[2]||path.join(root,'art/source-v2/title_daycycle.mp4'),K=24; // 겹치는 길이 24프레임 = 1초
const f3=i=>String(i).padStart(3,'0');
async function dot(file){const img=await modeResize(await sharp(file).png().toBuffer(),640,360,{lines:true});
  return sharp(img.data,{raw:img.info}).resize(1280,720,{kernel:'nearest'}).removeAlpha().raw().toBuffer()}
(async()=>{
  assert(fs.existsSync(SRC),'원본 영상이 없어요: '+SRC);
  const a=fs.mkdtempSync(path.join(os.tmpdir(),'title-')),b=fs.mkdtempSync(path.join(os.tmpdir(),'title-out-'));
  console.log(execFileSync('swift',[path.join(__dirname,'title-frames.swift'),'extract',SRC,a],{encoding:'utf8'}).trim());
  const N=fs.readdirSync(a).filter(f=>/^\d+\.png$/.test(f)).length;assert(N>K*3,'프레임이 모자라요: '+N);
  // 출력 j(0..N-K-1): j<K는 원본 끝(N-K+j)에서 처음(j)으로 서서히 넘어가고, 그 뒤는 원본 j. 마지막 j=N-K-1 다음이 원본 N-K(=출력 0의 대부분)라 이어진다
  for(let j=0;j<N-K;j++){const cur=await dot(path.join(a,f3(j)+'.png'));
    if(j<K){const t=(j+.5)/K,end=await dot(path.join(a,f3(N-K+j)+'.png'));for(let i=0;i<cur.length;i++)cur[i]=Math.round(end[i]*(1-t)+cur[i]*t)}
    await sharp(cur,{raw:{width:1280,height:720,channels:3}}).png().toFile(path.join(b,f3(j)+'.png'))}
  console.log(execFileSync('swift',[path.join(__dirname,'title-frames.swift'),'encode',b,'0',String(N-K-1),path.join(root,'assets/maps/title-cycle.mp4')],{encoding:'utf8'}).trim());
  for(const d of [a,b])fs.rmSync(d,{recursive:true,force:true});console.log('PASS',N-K,'프레임',((N-K)/24).toFixed(1)+'초')})();
