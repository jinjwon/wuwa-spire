// unchecker 점검: 몸 안에 갇힌 체크무늬는 지우고, 음영 있는 흰 옷(에이메스 가슴 구멍 사고, 2026-11-24)은 남긴다
// 사용: node scripts/unchecker.test.cjs
const sharp=require('sharp'),os=require('node:os'),path=require('node:path'),{execFileSync}=require('node:child_process'),assert=require('node:assert/strict');
(async()=>{const W=300,d=Buffer.alloc(W*W*4),tmp=os.tmpdir(),a=path.join(tmp,'unchk-in.png'),b=path.join(tmp,'unchk-out.png');
  for(let y=0;y<W;y++)for(let x=0;x<W;x++){const i=y*W*4+x*4;let v=((x>>3)+(y>>3))%2?255:204;const r=Math.hypot(x-80,y-150);if(r>=40&&r<52)v=20;
    if(x>=170&&x<260&&y>=100&&y<200)v=x<174||x>=256||y<104||y>=196?20:Math.round(200+55*(x-174)/82);d[i]=d[i+1]=d[i+2]=v;d[i+3]=255}
  await sharp(d,{raw:{width:W,height:W,channels:4}}).png().toFile(a);execFileSync('node',[path.join(__dirname,'unchecker.cjs'),a,b]);
  const o=await sharp(b).raw().toBuffer(),al=(x,y)=>o[(y*W+x)*4+3];
  assert(!al(80,150)&&!al(70,140),'고리 안에 갇힌 체크무늬가 남음');assert(al(180,150)&&al(215,150)&&al(250,150),'음영 있는 흰 옷이 지워짐');console.log('PASS unchecker.test')})();
