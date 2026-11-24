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
// 색 수 줄이기(median cut, 개수 가중). sharp 0.33의 png({colours})는 색 수가 아니라 비트 깊이만 정해서 48·64색을 4비트=16색으로 깎는다.
// 그래서 여기서 n색으로 줄이고, 저장은 png({palette:true,colours:256})(8비트, 256색 이하는 그대로 보존)로 한다
function limitColors(d,n){
  const cnt=new Map();for(let i=0;i<d.length;i+=4)if(d[i+3]){const k=d[i]<<16|d[i+1]<<8|d[i+2];cnt.set(k,(cnt.get(k)||0)+1)}
  if(cnt.size<=n)return d;
  let boxes=[[...cnt.entries()]];const ch=(k,c)=>k>>(16-8*c)&255;
  while(boxes.length<n){let bi=-1,br=-1,bc=0;
    boxes.forEach((b,i)=>{if(b.length<2)return;for(let c=0;c<3;c++){let lo=255,hi=0;for(const [k] of b){const v=ch(k,c);if(v<lo)lo=v;if(v>hi)hi=v}const r=(hi-lo)*Math.sqrt(b.reduce((a,e)=>a+e[1],0));if(r>br){br=r;bi=i;bc=c}}});
    if(bi<0)break;const b=boxes[bi].sort((x,y)=>ch(x[0],bc)-ch(y[0],bc)),tot=b.reduce((a,e)=>a+e[1],0);let acc=0,m=0;while(m<b.length-1&&acc+b[m][1]<=tot/2)acc+=b[m++][1];m=Math.max(1,m);
    boxes.splice(bi,1,b.slice(0,m),b.slice(m))}
  const map=new Map();for(const b of boxes){const t=b.reduce((a,e)=>a+e[1],0),avg=[0,1,2].map(c=>Math.round(b.reduce((a,e)=>a+ch(e[0],c)*e[1],0)/t));for(const [k] of b)map.set(k,avg)}
  for(let i=0;i<d.length;i+=4)if(d[i+3]){const c=map.get(d[i]<<16|d[i+1]<<8|d[i+2]);d[i]=c[0];d[i+1]=c[1];d[i+2]=c[2]}
  return d;
}
{const assert=require('node:assert/strict'),d=Buffer.alloc(256*4);for(let i=0;i<256;i++){d[i*4]=i;d[i*4+1]=255-i;d[i*4+2]=(i*7)&255;d[i*4+3]=255}
  limitColors(d,48);const u=new Set();for(let i=0;i<d.length;i+=4)u.add(d.readUInt32BE(i));assert(u.size<=48&&u.size>=40,'limitColors self-check '+u.size)}
module.exports={modeResize,limitColors};
