// 생성 그림에 박힌 체크무늬(흰·연회색 칸) 배경을 투명으로 바꾼다. 테두리에서 시작해, 채도가 낮고 밝은 픽셀만 따라 번진다(윤곽선에서 멈춤).
// 사용: node scripts/unchecker.cjs <입력.png> <출력.png>
const sharp=require('sharp'),assert=require('node:assert/strict');
const [,,src,dst]=process.argv;assert(src&&dst,'사용: node scripts/unchecker.cjs <입력.png> <출력.png>');
(async()=>{
  const {data:d,info:{width:W,height:H}}=await sharp(src).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  const bg=i=>{const r=d[i],g=d[i+1],b=d[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);return d[i+3]<16||(mn>=200&&mx-mn<=18)};
  const seen=new Uint8Array(W*H),q=[];
  for(let x=0;x<W;x++)q.push(x,(H-1)*W+x);for(let y=0;y<H;y++)q.push(y*W,y*W+W-1);
  let n=0;while(q.length){const p=q.pop();if(seen[p])continue;seen[p]=1;if(!bg(p*4))continue;d[p*4+3]=0;n++;
    const x=p%W,y=(p-x)/W;if(x>0)q.push(p-1);if(x<W-1)q.push(p+1);if(y>0)q.push(p-W);if(y<H-1)q.push(p+W)}
  // 다리 사이처럼 막힌 곳에 갇힌 체크무늬: 밝은 칸과 회색 칸이 둘 다 섞인 덩어리(60px 이상)만 지운다. 작은 흰 하이라이트는 남김
  for(let s=0;s<W*H;s++){if(seen[s]||!bg(s*4))continue;const comp=[];let hi=0,lo=0;q.push(s);seen[s]=1;
    while(q.length){const p=q.pop();comp.push(p);const v=d[p*4];if(v>=242)hi++;else lo++;const x=p%W,y=(p-x)/W;
      for(const o of [x>0?p-1:-1,x<W-1?p+1:-1,y>0?p-W:-1,y<H-1?p+W:-1])if(o>=0&&!seen[o]&&bg(o*4)){seen[o]=1;q.push(o)}}
    if(comp.length>=60&&hi>comp.length*.15&&lo>comp.length*.15)for(const p of comp){d[p*4+3]=0;n++}}
  assert(n>W*H*0.3,`지운 배경이 너무 적음(${n}px): 체크무늬가 아닐 수 있음`);
  await sharp(Buffer.from(d),{raw:{width:W,height:H,channels:4}}).png().toFile(dst);
  console.log('PASS',dst,`배경 ${(n*100/(W*H)).toFixed(1)}% 투명`);
})();
