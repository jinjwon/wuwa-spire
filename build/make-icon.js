// 앱 아이콘(build/icon.png, 1024×1024)을 캔버스로 그려 저장합니다.  실행: npm run icon
const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

const draw = `(() => {
  const N = 1024, s = N / 512, cv = document.createElement('canvas');
  cv.width = cv.height = N;
  const g = cv.getContext('2d');
  g.scale(s, s);
  const rr = (x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  rr(16, 16, 480, 480, 108); g.save(); g.clip();
  let gr = g.createLinearGradient(0, 0, 0, 512); gr.addColorStop(0, '#0d1636'); gr.addColorStop(.62, '#24407a'); gr.addColorStop(1, '#0b1a30');
  g.fillStyle = gr; g.fillRect(0, 0, 512, 512);
  let mg = g.createRadialGradient(350, 150, 10, 350, 150, 220); mg.addColorStop(0, 'rgba(255,240,200,.9)'); mg.addColorStop(.25, 'rgba(255,225,150,.35)'); mg.addColorStop(1, 'rgba(255,225,150,0)');
  g.fillStyle = mg; g.fillRect(0, 0, 512, 512);
  g.fillStyle = '#fff3cf'; g.beginPath(); g.arc(350, 150, 46, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 40; i++) { g.fillStyle = 'rgba(255,255,255,' + (.3 + (i % 4) * .15) + ')'; g.beginPath(); g.arc((i * 137) % 512, (i * 71) % 300, i % 5 ? 1.5 : 2.6, 0, 7); g.fill(); }
  let sg = g.createLinearGradient(0, 330, 0, 512); sg.addColorStop(0, '#2a5f8e'); sg.addColorStop(1, '#071322');
  g.fillStyle = sg; g.fillRect(0, 340, 512, 512);
  g.fillStyle = 'rgba(180,220,255,.25)'; for (let i = 0; i < 7; i++) g.fillRect(60 + (i * 97) % 330, 360 + i * 14, 60 + (i % 3) * 30, 3);
  let tg = g.createLinearGradient(256, 60, 256, 360); tg.addColorStop(0, '#c9b8ff'); tg.addColorStop(1, '#141b44');
  g.fillStyle = tg; g.beginPath(); g.moveTo(256, 52); g.lineTo(272, 170); g.lineTo(300, 362); g.lineTo(212, 362); g.lineTo(240, 170); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,233,168,.85)'; g.lineWidth = 5;
  [[200, 46, 12], [262, 70, 15], [318, 92, 17]].forEach(([y, rx, ry]) => { g.beginPath(); g.ellipse(256, y, rx, ry * .32, 0, 0, 7); g.stroke(); });
  let pg = g.createRadialGradient(256, 56, 0, 256, 56, 60); pg.addColorStop(0, 'rgba(255,255,255,1)'); pg.addColorStop(.3, 'rgba(255,230,160,.7)'); pg.addColorStop(1, 'rgba(255,230,160,0)');
  g.fillStyle = pg; g.fillRect(190, 0, 140, 130);
  g.restore();
  rr(16, 16, 480, 480, 108); g.lineWidth = 10;
  let bg = g.createLinearGradient(0, 0, 512, 512); bg.addColorStop(0, '#c9b8ff'); bg.addColorStop(.5, '#ffe9a8'); bg.addColorStop(1, '#ff9a7a');
  g.strokeStyle = bg; g.stroke();
  return cv.toDataURL('image/png');
})()`;

app.whenReady().then(async () => {
  const win = new BrowserWindow({ show: false });
  await win.loadURL('about:blank');
  const url = await win.webContents.executeJavaScript(draw);
  const out = path.join(__dirname, 'icon.png');
  fs.writeFileSync(out, Buffer.from(url.split(',')[1], 'base64'));
  console.log('saved', out);
  app.quit();
});
