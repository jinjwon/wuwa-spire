// 도트 처리 공용 함수
const sharp=require('sharp');
// 블록 최빈색 축소: lanczos는 가짜 도트 원본의 윤곽선을 흐리게 섞어서, 블록마다 가장 많은 색 하나를 고른다(v4)
// lines: 블록에 어두운 색이 20% 이상이고 최빈색보다 확실히 어두우면 그 색을 고른다(가는 윤곽선이 최빈색에 밀려 사라지지 않게)
async function modeResize(buf,w,h,{lines=false}={}){
  const {data,info}=await sharp(buf).ensureAlpha().raw().toBuffer({resolveWithObject:true}),W=info.width,H=info.height,o=Buffer.alloc(w*h*4);
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const x0=Math.floor(x*W/w),x1=Math.max(x0+1,Math.floor((x+1)*W/w)),y0=Math.floor(y*H/h),y1=Math.max(y0+1,Math.floor((y+1)*H/h)),m=new Map();let a=0,b=null;
    for(let yy=y0;yy<y1;yy++)for(let xx=x0;xx<x1;xx++){const i=(yy*W+xx)*4;if(data[i+3]<128)continue;a++;
      const k=(data[i]>>3)<<10|(data[i+1]>>3)<<5|data[i+2]>>3,e=m.get(k)||[0,0,0,0];e[0]++;e[1]+=data[i];e[2]+=data[i+1];e[3]+=data[i+2];m.set(k,e)}
    if(a*2<(x1-x0)*(y1-y0))continue;for(const e of m.values())if(!b||e[0]>b[0])b=e;
    if(lines){const L=e=>(e[1]*.3+e[2]*.59+e[3]*.11)/e[0];let dk=null;for(const e of m.values())if(!dk||L(e)<L(dk))dk=e;
      if(dk!==b&&dk[0]>=a*.2&&L(dk)<L(b)-70)b=dk}
    const j=(y*w+x)*4;o[j]=b[1]/b[0];o[j+1]=b[2]/b[0];o[j+2]=b[3]/b[0];o[j+3]=255}
  return {data:o,info:{width:w,height:h,channels:4}};
}
module.exports={modeResize};
