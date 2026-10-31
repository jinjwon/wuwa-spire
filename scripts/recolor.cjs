// 도트 색 보정: 픽셀 모양은 그대로, 색만 원작 기준으로 옮긴다. 원본은 art/backup-recolor/에 한 번만 백업.
// 사용: node scripts/recolor.cjs rov
const sharp=require('sharp'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
// noCard: 카드 일러스트에는 적용 안 함(모니에 카드의 붉은 눈 유지).
// y: 프레임 높이 대비 이 비율보다 아래 픽셀에만 적용(머리 위쪽 제외, 예: 모니에 붉은 눈 유지).
// shift: [색상 범위, 최소 채도, 최소 밝기] 픽셀을 목표 색상으로. rest: 나머지 채도 감소·밝기 보정.
const ROVER={shift:[{h:[35,68],s:.5,l:.22,to:218,sat:.55}],rest:{neutral:.85,lift:.04}}; // 금색 → 청색 발광(#6190D8)
const RULES={
  rov:ROVER, rovM:ROVER,
  // 모니에: 원작은 은백 머리 + 청·라벤더 천체 문양. 붉은 포인트 → 청색
  // 카드의 금빛 발광 → 청·남색, 검정·갈색 그림자 → 남색(원작 안감), fix=고정 채도
  mor:{shift:[{h:[330,20],s:.35,l:.12,y:.42,noCard:1,to:222,sat:.8},{h:[12,65],s:.4,l:.15,to:228,sat:.75},{h:[12,50],s:.93,l:.5,lmax:.8,pre:1,to:228,sat:.75},{h:[0,360],s:-1,l:-1,lmax:.38,to:232,fix:.24,lift:.08}]},
  // 에이메스: 원작 메카 포인트는 청·하늘색. 진한 마젠타 검광 → 하늘색, 분홍 머리는 유지
  // 어두운 진홍·자주 의상 → 원작의 남색 포인트(머리는 밝아서 제외)
  aem:{shift:[{h:[285,335],s:.75,l:.3,lmax:.92,to:198,sat:.9},{h:[280,30],s:.15,l:-1,lmax:.45,to:226,sat:.75}]},
  // 에이메스 메카: 원작은 은백 장갑 + 청록 발광. 분홍·마젠타 → 청색 계열
  aemMecha:{shift:[{h:[285,355],s:.3,l:-1,to:204,sat:.7}]},
  // 린네: 원작 네온은 민트·청록. 연두 네온 → 청록
  lyn:{shift:[{h:[55,115],s:.35,l:.15,to:158,sat:.85}]},
  // 치사: 원작은 흑·회색 위주에 붉은 리본만 포인트. 어두운 붉은 천·머리 그늘 → 차콜
  chi:{shift:[{h:[330,25],s:.3,l:-1,lmax:.42,to:350,fix:.14}]},
  // 파수인: 원작은 옅은 청록 머리 + 흰 드레스. 진한 청색 → 옅은 청록
  sk:{shift:[{h:[195,255],s:.3,l:-1,to:198,sat:.6,lift:.06}]},
};
function hsl(r,g,b){r/=255;g/=255;b/=255;const M=Math.max(r,g,b),m=Math.min(r,g,b),l=(M+m)/2,d=M-m;let h=0,s=0;
  if(d){s=d/(1-Math.abs(2*l-1));h=M===r?((g-b)/d)%6:M===g?(b-r)/d+2:(r-g)/d+4;h*=60;if(h<0)h+=360}return[h,s,l]}
function rgb(h,s,l){const c=(1-Math.abs(2*l-1))*s,x=c*(1-Math.abs((h/60)%2-1)),m=l-c/2;
  const[r,g,b]=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
  return[r,g,b].map(v=>Math.round(Math.min(1,Math.max(0,v+m))*255))}
function px(r,g,b,R,y=1,card=0){const[h,s,l]=hsl(r,g,b);
  const hit=t=>{const[a,b]=t.h,inH=a<=b?h>=a&&h<=b:h>=a||h<=b;return inH&&!(card&&t.noCard)&&y>=(t.y||0)&&s>t.s&&l>t.l&&l<=(t.lmax??1)};
  for(const t of R.shift)if(t.pre&&hit(t))return rgb(t.to,t.fix??s*t.sat,Math.min(1,l+(t.lift||0))); // pre: 피부색과 겹치는 강한 발광
  if(l>.6&&h>=10&&h<=42)return[r,g,b];                       // 피부
  for(const t of R.shift){const[a,b]=t.h,inH=a<=b?h>=a&&h<=b:h>=a||h<=b;
    if(inH&&!(card&&t.noCard)&&y>=(t.y||0)&&s>t.s&&l>t.l&&l<=(t.lmax??1))return rgb(t.to,t.fix??s*t.sat,Math.min(1,l+(t.lift||0)))}
  if(!R.rest)return[r,g,b];
  return rgb(h,s*(1-R.rest.neutral),Math.min(1,l+R.rest.lift*(1-l)));
}
async function recolor(file,R){const card=file.includes('/cards/');const{data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let i=0;i<data.length;i+=4){if(!data[i+3])continue;const[r,g,b]=px(data[i],data[i+1],data[i+2],R,Math.floor(i/4/info.width)/info.height,card);data[i]=r;data[i+1]=g;data[i+2]=b}
  return sharp(data,{raw:info}).png().toBuffer()}
async function main(id){const R=RULES[id];assert(R,'규칙 없음: '+id);const root=path.join(__dirname,'..'),bak=path.join(root,'art/backup-recolor');
  const files=[...fs.readdirSync(path.join(root,'assets')).filter(f=>new RegExp(`^${id}(_[a-z]\\w*)?\\.png$`).test(f)).map(f=>'assets/'+f),
    ...fs.readdirSync(path.join(root,'assets/motion')).filter(f=>f.startsWith(id+'_')).map(f=>'assets/motion/'+f),
    ...fs.readdirSync(path.join(root,'assets/cards')).filter(f=>f.startsWith(id+'_')).map(f=>'assets/cards/'+f)];
  for(const f of files){const src=path.join(root,f),b=path.join(bak,f);
    if(!fs.existsSync(b)){fs.mkdirSync(path.dirname(b),{recursive:true});fs.copyFileSync(src,b)}
    fs.writeFileSync(src,await recolor(b,R));console.log('보정',f)}}
// 자체 점검: 피부 유지, 금색은 청색 계열로
assert.deepEqual(px(0xfb,0xe0,0xc2,RULES.rov),[0xfb,0xe0,0xc2]);
{const[h]=hsl(...px(0xf8,0xd4,0x07,RULES.rov));assert(h>200&&h<235,'금색→청색 실패')}
main(process.argv[2]).catch(e=>{console.error(e);process.exit(1)});
