// 비율 가이드: GPT 시트 생성 때 첨부해 공명자 비율을 대화가 바뀌어도 같게 만든다. 사용: node scripts/make-guides.cjs
// 1024×1536, 4×4 칸(256×384). 칸마다 머리 꼭대기(파랑)·발바닥(빨강) 선, 7등신 띠(맨 위 1/7이 머리), 12% 여백 상자, 가운데 세로선
// 수치는 HERO_PROMPTS의 PROPORTION LOCK과 같다: 서 있는 키 = 칸 높이의 72%, 여백 12%
const sharp=require('sharp'),path=require('path'),assert=require('node:assert/strict');
const CW=256,CH=384,M=Math.round(CH*.12),HT=Math.round(CH*.72),TOP=M,FOOT=TOP+HT,HEAD=HT/7;
assert(FOOT<CH-M/2,'발 선이 칸 아래에 너무 붙음');
let g='';for(let r=0;r<4;r++)for(let c=0;c<4;c++){const x=c*CW,y=r*CH,mx=Math.round(CW*.12);
  g+=`<rect x="${x+.5}" y="${y+.5}" width="${CW-1}" height="${CH-1}" fill="none" stroke="#c8c8c8"/>`;
  g+=`<rect x="${x+mx}" y="${y+M}" width="${CW-2*mx}" height="${CH-2*M}" fill="none" stroke="#9a9a9a" stroke-dasharray="6 4"/>`;
  for(let k=0;k<7;k++)g+=`<rect x="${x+mx}" y="${(y+TOP+k*HEAD).toFixed(1)}" width="${CW-2*mx}" height="${HEAD.toFixed(1)}" fill="${k===0?'#cfe0ff':k%2?'#f2f2f2':'#ffffff'}"/>`;
  g+=`<line x1="${x+CW/2}" y1="${y+TOP}" x2="${x+CW/2}" y2="${y+FOOT}" stroke="#b5b5b5"/>`;
  g+=`<line x1="${x+mx}" y1="${y+TOP}" x2="${x+CW-mx}" y2="${y+TOP}" stroke="#2a6cff" stroke-width="2"/>`;
  g+=`<line x1="${x+mx}" y1="${y+FOOT}" x2="${x+CW-mx}" y2="${y+FOOT}" stroke="#ff2a2a" stroke-width="2"/>`}
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1536"><rect width="1024" height="1536" fill="#fff"/>${g}</svg>`;
const out=path.join(__dirname,'..','art','guides','hero-16-guide.png');
sharp(Buffer.from(svg)).png().toFile(out).then(()=>console.log('PASS',out,`머리 꼭대기 y=${TOP}, 발 y=${FOOT}, 머리 ${HEAD.toFixed(1)}px (칸 384px 기준)`));
