// 생성 그림에 박힌 체크무늬(흰·연회색 칸) 또는 단색 초록(#00FF00) 배경을 투명으로 바꾼다. 테두리에서 시작해, 채도가 낮고 밝은 픽셀만 따라 번진다(윤곽선에서 멈춤).
// 사용: node scripts/unchecker.cjs <입력.png> <출력.png> [strict] [box:x0,y0,x1,y1 ...]
// box: 이펙트에 둘러싸여 바깥 번짐이 닿지 않은 체크무늬 조각용. 그 상자 안에서만 '채도 낮고 밝은'(차이 ≤45, ≥150) 픽셀을 투명 쪽에서 번져 지운다.
//   윤곽선으로 닫힌 흰 부분(나비 몸통 등)은 투명과 닿지 않아 남는다. 예: 파수인 공격 칸 나비 주변(2026-11-24)
// strict: 완전 무채색(차이 ≤4)·아주 밝은(≥228) 칸만 배경으로 본다. 흰 장갑·은색 판이 배경과 이어진 그림(메카 등)에서 몸이 지워지지 않게 한다
const sharp=require('sharp'),assert=require('node:assert/strict');
const [,,src,dst,...opt]=process.argv,STRICT=opt.includes('strict'),BOXES=opt.filter(o=>o.startsWith('box:')).map(o=>o.slice(4).split(',').map(Number));assert(src&&dst,'사용: node scripts/unchecker.cjs <입력.png> <출력.png>');
(async()=>{
  const {data:d,info:{width:W,height:H}}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  // 초록 배경(#00FF00, 프롬프트의 투명 대안)이면 체크무늬 대신 초록을 지운다: 모서리 4곳이 모두 초록이면 켜짐
  const green=i=>d[i+1]>=170&&d[i+1]-Math.max(d[i],d[i+2])>=90;
  const GREEN=[0,W-1,(H-1)*W,H*W-1].every(p=>green(p*4));
  if(GREEN){let n=0;for(let p=0;p<W*H;p++){const i=p*4;if(green(i)){d[i+3]=0;n++}
      else if(d[i+1]>Math.max(d[i],d[i+2]))d[i+1]=Math.max(d[i],d[i+2])} // 가장자리 초록 번짐 빼기
    assert(n>W*H*0.3,`지운 초록이 너무 적음(${n}px)`);
    await sharp(Buffer.from(d),{raw:{width:W,height:H,channels:4}}).png().toFile(dst);
    return console.log('PASS(초록 배경)',dst,`배경 ${(n*100/(W*H)).toFixed(1)}% 투명`)}
  const bg=i=>{const r=d[i],g=d[i+1],b=d[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);return d[i+3]<16||(STRICT?mn>=228&&mx-mn<=4:mn>=200&&mx-mn<=18)};
  const seen=new Uint8Array(W*H),q=[];
  for(let x=0;x<W;x++)q.push(x,(H-1)*W+x);for(let y=0;y<H;y++)q.push(y*W,y*W+W-1);
  let n=0;while(q.length){const p=q.pop();if(seen[p])continue;seen[p]=1;if(!bg(p*4))continue;d[p*4+3]=0;n++;
    const x=p%W,y=(p-x)/W;if(x>0)q.push(p-1);if(x<W-1)q.push(p+1);if(y>0)q.push(p-W);if(y<H-1)q.push(p+W)}
  // 다리 사이처럼 막힌 곳에 갇힌 체크무늬: 밝은 칸과 회색 칸이 둘 다 섞인 덩어리(60px 이상)만 지운다. 작은 흰 하이라이트는 남김
  for(let s=0;s<W*H;s++){if(seen[s]||!bg(s*4))continue;const comp=[];let hi=0,lo=0;q.push(s);seen[s]=1;
    while(q.length){const p=q.pop();comp.push(p);const v=d[p*4];if(v>=242)hi++;else lo++;const x=p%W,y=(p-x)/W;
      for(const o of [x>0?p-1:-1,x<W-1?p+1:-1,y>0?p-W:-1,y<H-1?p+W:-1])if(o>=0&&!seen[o]&&bg(o*4)){seen[o]=1;q.push(o)}}
    if(comp.length>=60&&hi>comp.length*.15&&lo>comp.length*.15)for(const p of comp){d[p*4+3]=0;n++}}
  for(const [x0,y0,x1,y1] of BOXES){const soft=i=>{const mn=Math.min(d[i],d[i+1],d[i+2]),mx=Math.max(d[i],d[i+1],d[i+2]);return d[i+3]>0&&mn>=150&&mx-mn<=45},q=[];
    const inb=(x,y)=>x>=x0&&x<=x1&&y>=y0&&y<=y1,tr=p=>!d[p*4+3];
    for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const p=y*W+x;if(soft(p*4)&&[p-1,p+1,p-W,p+W].some(tr))q.push(p)}
    while(q.length){const p=q.pop();if(!soft(p*4))continue;d[p*4+3]=0;n++;const x=p%W,y=(p-x)/W;for(const [xx,yy] of [[x-1,y],[x+1,y],[x,y-1],[x,y+1]])if(inb(xx,yy))q.push(yy*W+xx)}}
  // 테두리 벗기기: 체크무늬와 윤곽선이 섞인 밝은 회색 픽셀이 몸 둘레에 남는다(메카 원본은 가장자리의 44%).
  // 투명과 닿은 밝은 무채색 픽셀을 한 겹씩 지우고, 원본의 어두운 윤곽선에 닿으면 멈춘다(최대 PEEL겹)
  const PEEL=6,light=i=>{const mn=Math.min(d[i],d[i+1],d[i+2]),mx=Math.max(d[i],d[i+1],d[i+2]);return mn>=165&&mx-mn<=22};
  for(let k=0;k<PEEL;k++){const cut=[];
    for(let y=0;y<H;y++)for(let x=0;x<W;x++){const p=y*W+x;if(!d[p*4+3]||!light(p*4))continue;
      if((x>0&&!d[(p-1)*4+3])||(x<W-1&&!d[(p+1)*4+3])||(y>0&&!d[(p-W)*4+3])||(y<H-1&&!d[(p+W)*4+3]))cut.push(p)}
    if(!cut.length)break;for(const p of cut)d[p*4+3]=0;n+=cut.length}
  // 떨어진 잔챙이(40px 미만 덩어리) 제거
  {const seen=new Uint8Array(W*H);for(let s=0;s<W*H;s++){if(seen[s]||!d[s*4+3])continue;const c=[s];seen[s]=1;
    for(let j=0;j<c.length;j++){const p=c[j],x=p%W,y=(p-x)/W;for(const o of [x>0?p-1:-1,x<W-1?p+1:-1,y>0?p-W:-1,y<H-1?p+W:-1])if(o>=0&&!seen[o]&&d[o*4+3]){seen[o]=1;c.push(o)}}
    if(c.length<40)for(const p of c){d[p*4+3]=0;n++}}}
  assert(n>W*H*0.3,`지운 배경이 너무 적음(${n}px): 체크무늬가 아닐 수 있음`);
  await sharp(Buffer.from(d),{raw:{width:W,height:H,channels:4}}).png().toFile(dst);
  console.log('PASS',dst,`배경 ${(n*100/(W*H)).toFixed(1)}% 투명`);
})();
