// 모니에 카드 픽셀 손질. `node scripts/recolor.cjs mor` 뒤에 실행한다.
// 1) 남은 주황·살구 점: 반경 2px에 피부색이 빽빽하지 않으면(얼굴·손 덩어리가 아니면) 남색 계열로
// 2) 눈: 카드별 눈 영역의 청색 픽셀을 원작의 붉은 눈으로
const sharp=require('sharp'),fs=require('fs'),assert=require('assert/strict');
const EYES={mor_a:[80,18,106,30],mor_crit:[82,7,94,16],mor_lecture:[34,4,50,18],mor_s:[48,20,64,32]};
const orange=(r,g,b)=>r>120&&r-b>45&&g<r-10&&g>=b;              // 주황·금빛 (피부보다 채도 높음)
const skinish=(r,g,b)=>r>200&&g>150&&b>120&&r-b<110;             // 밝은 피부
function despeckle(data,w,h,box){let n=0;const src=Buffer.from(data);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){if(box&&x>=box[0]&&x<box[2]&&y>=box[1]&&y<box[3])continue;const i=(y*w+x)*4;if(!orange(src[i],src[i+1],src[i+2])&&!skinish(src[i],src[i+1],src[i+2]))continue;
    let skin=0;for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){const yy=y+dy,xx=x+dx;if(yy<0||xx<0||yy>=h||xx>=w)continue;
      const j=(yy*w+xx)*4;if(skinish(src[j],src[j+1],src[j+2]))skin++}
    if(skin<13){const l=(src[i]+src[i+1]+src[i+2])/3;data[i]=Math.round(l*.55);data[i+1]=Math.round(l*.65);data[i+2]=Math.min(255,Math.round(l*1.15));n++}}
  return n}
assert.equal(orange(240,150,40),true);assert.equal(skinish(250,225,200),true); // 피부 덩어리(5×5 중 13칸 이상)는 유지
(async()=>{for(const f of fs.readdirSync('assets/cards').filter(f=>f.startsWith('mor_'))){const id=f.slice(0,-4),p='assets/cards/'+f;
  const{data,info}=await sharp(p).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  let eye=0; // 눈을 먼저 칠하고, 점 손질은 눈 영역을 건너뛴다
  if(EYES[id]){const[x0,y0,x1,y1]=EYES[id];for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=(y*info.width+x)*4,[r,g,b]=[data[i],data[i+1],data[i+2]];
    if(b>r+40&&b>g+20&&b>90){data[i]=Math.min(255,b+30);data[i+1]=Math.round(g*.35);data[i+2]=Math.round(r*.4);eye++}}}
  const dots=despeckle(data,info.width,info.height,EYES[id]);
  fs.writeFileSync(p,await sharp(data,{raw:info}).png().toBuffer());console.log(id,'점',dots,'눈',eye)}})();
