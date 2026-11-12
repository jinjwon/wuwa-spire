// 속성별 스킬 임팩트 도트를 코드로 직접 찍는다(AI 생성 아님). 64×64 6프레임 가로 시트 → assets/fx/<spectro|fusion|glacio|electro|aero|havoc>.png
// 사용: node scripts/make-vfx.cjs [preview]  (preview면 art/preview-v3/fx/에만)
const sharp=require('sharp'),fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=path.join(root,process.argv[2]==='preview'?'art/preview-v3/fx':'assets/fx');
const N=64,F=6,C=N/2;
// 팔레트: 외곽(어두움)·중간·밝음·하이라이트. 속성 색은 index.html의 EL과 맞춤
const PAL={
  회절:['#8a5a12','#ffb627','#ffd75e','#fffbe0'],
  용융:['#7a1d0e','#e8471c','#ff9a3d','#fff1b0'],
  응결:['#1f4e86','#3fa2e8','#7fd8ff','#f2fdff'],
  전도:['#3b1f78','#7b4cf0','#b48cff','#f6efff'],
  기류:['#145c4a','#22b38a','#6fe3b0','#effff8'],
  인멸:['#3a0c2a','#a3205f','#e0558a','#ffd6ea'],
};
const FILE={회절:'spectro',용융:'fusion',응결:'glacio',전도:'electro',기류:'aero',인멸:'havoc'};
const hex=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
function canvas(){const d=new Uint8Array(N*N*F*4);
  const px=(f,x,y,c)=>{x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=N||y>=N||!c)return;const i=(y*N*F+f*N+x)*4;[d[i],d[i+1],d[i+2]]=c;d[i+3]=255};
  const line=(f,x0,y0,x1,y1,c)=>{const n=Math.max(Math.abs(x1-x0),Math.abs(y1-y0),1);for(let k=0;k<=n;k++)px(f,x0+(x1-x0)*k/n,y0+(y1-y0)*k/n,c)};
  const disc=(f,cx,cy,r,c)=>{for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r+r*.8)px(f,cx+x,cy+y,c)};
  const ring=(f,cx,cy,r,c,w=1)=>{for(let y=-r-w;y<=r+w;y++)for(let x=-r-w;x<=r+w;x++){const q=Math.hypot(x,y);if(q>=r-w/2&&q<r+w/2)px(f,cx+x,cy+y,c)}};
  // 마름모 파편: 길이 l, 두께 w의 방향성 결정
  const shard=(f,a,r0,l,w,cs)=>{const ca=Math.cos(a),sa=Math.sin(a);for(let t=0;t<=l;t++){const hw=Math.round(w*(1-Math.abs(2*t/l-1)));for(let s=-hw;s<=hw;s++)px(f,C+ca*(r0+t)-sa*s,C+sa*(r0+t)+ca*s,Math.abs(s)===hw&&hw>0?cs[0]:t>l*.6?cs[3]:cs[2])}};
  return {d,px,line,disc,ring,shard};
}
let seed=7;const rnd=()=>(seed=(seed*1103515245+12345)&0x7fffffff)/0x7fffffff;
const DRAW={
  // 회절: 프리즘 십자 섬광 → 마름모 파편이 퍼지며 사라짐
  회절(g,p){for(let f=0;f<F;f++){const k=f/(F-1);
    if(f<3){const L=10+f*9;for(const a of [0,Math.PI/2,Math.PI,-Math.PI/2])g.shard(f,a,0,L,f===0?3:2,p);for(const a of [1,3,5,7])g.shard(f,a*Math.PI/4,0,L*.45,1,p);g.disc(f,C,C,4-f,p[3])}
    if(f>=1)for(let i=0;i<8;i++){const a=i*Math.PI/4+Math.PI/8;g.shard(f,a,4+k*22,Math.max(3,10-f*1.4),f<4?2:1,p)}
    if(f>=2)g.ring(f,C,C,8+f*4,f<5?p[1]:p[0],1)}},
  // 용융: 흰 핵 폭발 → 불꽃 고리 → 솟는 불씨
  용융(g,p){for(let f=0;f<F;f++){const r=5+f*4.5;
    if(f<4){g.disc(f,C,C,Math.max(1,r-f*2),p[f<2?3:2]);g.ring(f,C,C,r,p[1],3);g.ring(f,C,C,r+2,p[0],1)}
    for(let i=0;i<12;i++){const a=i*Math.PI/6+f*.2,q=r+2+(i%3)*2,fl=4+((i*7+f)%4);
      for(let t=0;t<fl;t++)g.px(f,C+Math.cos(a)*q,C+Math.sin(a)*q-t-f*1.5,t<fl/2?p[1]:t<fl-1?p[2]:p[3])}
    if(f>=3)for(let i=0;i<10;i++)g.px(f,C+(rnd()-.5)*44,C-6-rnd()*26+f,rnd()<.5?p[2]:p[3])}},
  // 응결: 육각 방향 얼음 가시가 돋았다가 부서짐
  응결(g,p){for(let f=0;f<F;f++){const grow=Math.min(1,(f+1)/3);
    for(let i=0;i<6;i++){const a=i*Math.PI/3-Math.PI/2,L=24*grow;
      if(f<4){g.shard(f,a,2,L,3,p);g.shard(f,a+.5,8,L*.5,1.5,p);g.shard(f,a-.5,8,L*.5,1.5,p)}
      else for(let s=0;s<4;s++){const q=10+s*6+(f-3)*5;g.px(f,C+Math.cos(a+s*.15)*q,C+Math.sin(a+s*.15)*q,p[s%2?2:3]);g.px(f,C+Math.cos(a+s*.15)*q+1,C+Math.sin(a+s*.15)*q,p[1])}}
    if(f<3)g.disc(f,C,C,3,p[3]);if(f>=1&&f<5)g.ring(f,C,C,6+f*5,p[1],1)}},
  // 전도: 중심에서 갈라지는 지그재그 번개
  전도(g,p){for(let f=0;f<F;f++){seed=11+f*31;const n=f<4?6:5;
    for(let i=0;i<n;i++){let a=i*Math.PI*2/n+f*.4,x=C,y=C;const L=f<4?7:3+(i%2);
      for(let s=0;s<L;s++){a+=(rnd()-.5)*1.1;const nx=x+Math.cos(a)*4,ny=y+Math.sin(a)*4;g.line(f,x,y,nx,ny,p[1]);g.line(f,x+1,y,nx+1,ny,p[s<2?3:2]);x=nx;y=ny}}
    if(f<4)g.disc(f,C,C,4-f,p[3]);if(f===1||f===3)g.ring(f,C,C,14+f*4,p[0],1)}},
  // 기류: 회오리 세 갈래가 돌며 퍼짐
  기류(g,p){for(let f=0;f<F;f++){for(let b=0;b<3;b++)for(let t=0;t<90;t++){const k=t/90,a=b*Math.PI*2/3+k*4+f*.7,r=3+k*(14+f*3);
      if(k<.15+f*.12)continue;const x=C+Math.cos(a)*r,y=C+Math.sin(a)*r*.75;g.px(f,x,y+1,p[0]);g.px(f,x,y+2,p[0]);g.px(f,x,y,k>.85?p[3]:k>.5?p[2]:p[1]);g.px(f,x,y+1,k>.7?p[2]:p[1])}
    if(f<2)g.disc(f,C,C,3,p[3])}},
  // 인멸: 검붉은 고리가 안으로 빨려들며 금이 감
  인멸(g,p){for(let f=0;f<F;f++){const r=26-f*4;
    g.ring(f,C,C,Math.max(2,r),p[1],2);g.ring(f,C,C,Math.max(1,r-3),p[0],1);
    if(f>=2){seed=5;for(let i=0;i<5;i++){let a=rnd()*6.28,x=C,y=C;for(let s=0;s<f;s++){a+=(rnd()-.5);const nx=x+Math.cos(a)*5,ny=y+Math.sin(a)*5;g.line(f,x,y,nx,ny,p[2]);x=nx;y=ny}}}
    g.disc(f,C,C,f<4?2+f:7-f,f<4?p[0]:p[3]);if(f>=4)g.ring(f,C,C,10+(f-4)*8,p[2],1)}},
};
(async()=>{fs.mkdirSync(out,{recursive:true});
  for(const [el,cols] of Object.entries(PAL)){const g=canvas(),p=cols.map(hex);DRAW[el](g,p);
    for(let f=0;f<F;f++){let v=0;for(let y=0;y<N;y++)for(let x=0;x<N;x++)v+=g.d[(y*N*F+f*N+x)*4+3]>0;assert(v>20,`${el} frame ${f} empty`)}
    await sharp(Buffer.from(g.d),{raw:{width:N*F,height:N,channels:4}}).png().toFile(path.join(out,`${FILE[el]}.png`))}
  console.log('PASS',out);
})();
