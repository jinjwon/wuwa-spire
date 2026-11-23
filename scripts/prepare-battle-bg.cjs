// 전투 배경: 원본을 16:9로 자르고 블록 최빈색으로 640×360 도트 격자로 줄인다.
// 게임은 이것을 정수 배율(1080p 3배, 4K 6배)로 최근접 확대해 표시한다(styles.css .battle-art, input.js pixelScale).
const sharp=require('sharp'),path=require('node:path'),assert=require('node:assert/strict');
const {modeResize}=require('./lib/pixel.cjs');
const root=path.resolve(__dirname,'..');
// 타이틀 배경도 같은 처리: art/source-v2/title_bg.png → assets/maps/title-bg.png
const fs=require('node:fs');
const JOBS=[...['coast','forest','spire','lahai'].map(r=>[`battle_${r}`,`${r}-battle`]),['title_bg','title-bg']];
(async()=>{for(const [srcKey,outKey] of JOBS){
  const src=path.join(root,`art/source-v2/${srcKey}.png`);if(!fs.existsSync(src)){console.log('skip',srcKey);continue}const m=await sharp(src).metadata();
  const w=Math.min(m.width,Math.round(m.height*16/9)),h=Math.round(w*9/16);
  const crop=await sharp(src).extract({left:Math.floor((m.width-w)/2),top:Math.floor((m.height-h)/2),width:w,height:h}).png().toBuffer();
  const img=await modeResize(crop,640,360);
  await sharp(img.data,{raw:img.info}).png({palette:true,colours:64,dither:0}).toFile(path.join(root,`assets/maps/${outKey}.png`));
  const o=await sharp(path.join(root,`assets/maps/${outKey}.png`)).metadata();assert(o.width===640&&o.height===360)}
  console.log('PASS')})();
