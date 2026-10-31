// 모니에 카드 눈 영역의 청색 픽셀을 붉게(원작 붉은 눈). recolor.cjs mor 실행 뒤 한 번 돌린다.
const sharp=require('sharp'),fs=require('fs');
// 카드별 눈 영역 [x0,y0,x1,y1] (144×96 원본 좌표, 직접 확인)
const EYES={mor_a:[80,18,106,30],mor_crit:[82,7,94,16],mor_lecture:[34,4,50,18],mor_s:[48,20,64,32]};
(async()=>{for(const[id,[x0,y0,x1,y1]]of Object.entries(EYES)){const f=`assets/cards/${id}.png`;
  const{data,info}=await sharp(f).ensureAlpha().raw().toBuffer({resolveWithObject:true});let n=0;
  for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const i=(y*info.width+x)*4,[r,g,b]=[data[i],data[i+1],data[i+2]];
    if(b>r+40&&b>g+20&&b>90){data[i]=Math.min(255,b+30);data[i+1]=Math.round(g*.35);data[i+2]=Math.round(r*.4);n++}}
  fs.writeFileSync(f,await sharp(data,{raw:info}).png().toBuffer());console.log(id,n)}})();
