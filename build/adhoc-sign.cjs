// 맥 앱 애드혹 서명(무료). 서명이 깨진 채 배포되면 macOS가 "손상됨"이라며 막아 터미널 명령이 필요했음.
// 애드혹 서명이면 처음 한 번 시스템 설정 → "그래도 열기"로 열 수 있다. 공증(유료 개발자 계정)은 아님.
const{execFileSync}=require('child_process'),path=require('path');
exports.default=async ctx=>{
  if(ctx.electronPlatformName!=='darwin')return;
  const app=path.join(ctx.appOutDir,`${ctx.packager.appInfo.productFilename}.app`);
  execFileSync('xattr',['-cr',app]); // 확장 속성이 남아 있으면 codesign이 거부함
  execFileSync('codesign',['--force','--deep','--sign','-',app],{stdio:'inherit'});
};
