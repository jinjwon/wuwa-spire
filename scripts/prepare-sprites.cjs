// Run with a Node environment providing sharp. Source atlases remain unchanged.
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const sources = [
  {file:'exec-bf959425-8856-4f3a-8fe6-9a7045d68467.png', rows:[['rov'],['rovM'],['aem'],['sk']], x:[0,.25,.49,.81,1], y:[0,.26,.51,.745,1], motion:true},
  {file:'exec-8f038a01-3412-4384-93c2-45eb51ce106e.png', rows:[['lyn'],['mor'],['chi'],['cam']], x:[0,.25,.49,.79,1], y:[0,.26,.505,.74,1], motion:true},
  {file:'exec-e49888c9-441d-4651-9942-94699bb320da.png', rows:[['snip','zig','tick','gulp','chirp'],['vjun','fjun','cruise','fdread','hoar']], x:[[0,.21,.4,.60,.80,1],[0,.205,.395,.56,.785,1]], y:[0,.448,1]},
  {file:'exec-0c5e5a30-a8a1-4e92-815f-7b288c5a1240.png', rows:[['cheron','vheron','hdread','spear'],['saur','tamb','scout','crown']], x:[[0,.265,.48,.735,1],[0,.30,.50,.735,1]], y:[0,.48,1]},
  {file:'exec-09273e82-48bd-4a69-9d7e-2a4469c68251.png', rows:[['mephis','aix','explorer','rider','gorilla'],['dreamless','turtle','hecate','levia','aleph']], x:[[0,.178,.41,.585,.815,1],[0,.20,.415,.60,.81,1]], y:[0,.475,1]},
];
async function crop(file, x0,y0,x1,y1) {
  const {width,height}=await sharp(file).metadata();
  const left=Math.round(x0*width),top=Math.round(y0*height);
  const cell=await sharp(file).extract({left,top,width:Math.round(x1*width)-left,height:Math.round(y1*height)-top}).toBuffer();
  return sharp(cell).trim({threshold:8}).toBuffer();
}
async function frame(buf, scale) {
  const m=await sharp(buf).metadata();
  const width=Math.max(1,Math.round(m.width*scale)),height=Math.max(1,Math.round(m.height*scale));
  assert(width<=120&&height<=112);
  const pixels=await sharp(buf).resize(width,height,{kernel:'nearest'}).toBuffer();
  return sharp({create:{width:128,height:128,channels:4,background:'#00000000'}})
    .composite([{input:pixels,left:Math.floor((128-width)/2),top:120-height}]).png({palette:true,colours:64,dither:0}).toBuffer();
}
async function write(id, frames, source) {
  const prefix=id.startsWith('enemy_')?id:`${id}`;
  await fs.writeFile(path.join(root,'assets',`${prefix}.png`),frames[0]);
  await fs.writeFile(path.join(root,'assets',`${prefix}_idle.png`),frames[0]);
  if(frames.length>1) await sharp({create:{width:128*frames.length,height:128,channels:4,background:'#00000000'}})
    .composite(frames.map((input,i)=>({input,left:128*i,top:0}))).png({palette:true,colours:64,dither:0}).toFile(path.join(root,'assets',`${prefix}_attack.png`));
  return {id:prefix,source,frameSize:128,attackFrames:frames.length>1?frames.length:0,idle:'CSS breathing/hover',provenance:'OpenAI built-in image_gen; Wuthering Waves fan reinterpretation; original IP Kuro Games',review:'generated design approximation, not official sprites'};
}
(async()=>{
  const manifest=[];
  for(const s of sources){
    const file=path.join(root,'art/source',s.file);
    for(let row=0;row<s.rows.length;row++){
      const xs=Array.isArray(s.x[0])?s.x[row]:s.x;
      if(s.motion){
        const bufs=await Promise.all([0,1,2,3].map(i=>crop(file,xs[i],s.y[row],xs[i+1],s.y[row+1])));
        const sizes=await Promise.all(bufs.map(b=>sharp(b).metadata()));
        const scale=Math.min(...sizes.flatMap(m=>[120/m.width,112/m.height]));
        manifest.push(await write(s.rows[row][0],await Promise.all(bufs.map(b=>frame(b,scale))),s.file));
      }else for(let col=0;col<s.rows[row].length;col++){
        const b=await crop(file,xs[col],s.y[row],xs[col+1],s.y[row+1]);
        const m=await sharp(b).metadata();
        manifest.push(await write('enemy_'+s.rows[row][col],[await frame(b,Math.min(120/m.width,112/m.height))],s.file));
      }
    }
  }
  assert.equal(manifest.length,36);
  for(const a of manifest){
    const {data,info}=await sharp(path.join(root,'assets',a.id+'_idle.png')).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    assert.equal(info.width,128);assert.equal(info.height,128);
    let transparent=0,visible=0;
    for(let i=3;i<data.length;i+=4){if(data[i]===0)transparent++;else visible++}
    assert(transparent>1000&&visible>100,`${a.id}: invalid alpha`);
  }
  await fs.writeFile(path.join(root,'art/manifest.json'),JSON.stringify(manifest,null,2)+'\n');
  const tiles=await Promise.all(manifest.map(async(a,i)=>({input:await fs.readFile(path.join(root,'assets',a.id+'_idle.png')),left:(i%6)*144+8,top:Math.floor(i/6)*144+8})));
  await sharp({create:{width:864,height:864,channels:4,background:'#141c30'}}).composite(tiles).png().toFile(path.join(root,'art/contact-sheet.png'));
  console.log(`Validated ${manifest.length} transparent sprites; 8 four-frame attack strips.`);
})().catch(e=>{console.error(e);process.exitCode=1});
