// 전투 배경: 전체 화면에서 깨지지 않게 원본을 1280×720으로 줄인다(최근접 금지).
const sharp=require('sharp'),path=require('node:path');
const root=path.resolve(__dirname,'..');
(async()=>{for(const r of ['coast','forest','spire','lahai'])
  await sharp(path.join(root,`art/source-v2/battle_${r}.png`)).resize(1280,720,{fit:'cover',kernel:'lanczos3'}).png({palette:true,colours:192,dither:0}).toFile(path.join(root,`assets/maps/${r}-battle.png`));
  console.log('PASS')})();
