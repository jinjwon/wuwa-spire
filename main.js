// 데스크톱 앱(Electron) 진입점: index.html을 게임 창으로 엽니다.
const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');
const http = require('http'), fs = require('fs'), os = require('os');

// 멀티: 같은 와이파이의 손님이 http://<내 IP>:7777 로 접속. 호스트(이 앱)가 상태의 주인이고 손님은 행동만 보냄.
const MP_PORT = 7777;
let mpServer = null, lastState = null;
const subs = { host: new Set(), guest: new Set() };
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.mp3': 'audio/mpeg', '.json': 'application/json', '.svg': 'image/svg+xml' };
const lanIps = () => Object.values(os.networkInterfaces()).flat().filter(n => n && n.family === 'IPv4' && !n.internal).map(n => n.address);
const send = (role, ev, data) => subs[role].forEach(r => r.write(`event:${ev}\ndata:${data}\n\n`));
const isLocal = q => ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(q.socket.remoteAddress);
function startMp() {
  if (mpServer) return Promise.resolve({ ips: lanIps(), port: MP_PORT });
  return new Promise((ok, fail) => {
    mpServer = http.createServer((q, r) => {
      r.setHeader('Access-Control-Allow-Origin', '*');
      const u = new URL(q.url, 'http://x');
      if (q.method === 'OPTIONS') { r.setHeader('Access-Control-Allow-Headers', 'content-type'); return r.end(); }
      if (u.pathname === '/sub') {
        // 호스트 구독은 이 컴퓨터에서만 (손님이 호스트 행세 못 하게)
        const role = u.searchParams.get('role') === 'host' && isLocal(q) ? 'host' : 'guest';
        r.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' });
        subs[role].add(r);
        if (role === 'guest' && lastState) r.write(`event:state\ndata:${lastState}\n\n`);
        send('host', 'peers', subs.guest.size);
        q.on('close', () => { subs[role].delete(r); send('host', 'peers', subs.guest.size); });
        return;
      }
      if (q.method === 'POST' && (u.pathname === '/state' || u.pathname === '/act')) {
        if (u.pathname === '/state' && !isLocal(q)) { r.writeHead(403); return r.end(); }
        let b = '';
        q.on('data', d => { b += d; if (b.length > 5e6) q.destroy(); });
        q.on('end', () => { if (u.pathname === '/state') { lastState = b; send('guest', 'state', b); } else if (b.length < 2000) send('host', 'act', JSON.stringify(b)); r.end('ok'); });
        return;
      }
      // 정적 파일: index.html과 assets/ 만
      const rel = u.pathname === '/' ? '/index.html' : decodeURIComponent(u.pathname);
      const f = path.join(__dirname, rel);
      if (!/^\/(index\.html$|assets\/)/.test(rel) || !f.startsWith(__dirname + path.sep)) { r.writeHead(404); return r.end(); }
      fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
    });
    mpServer.on('error', e => { mpServer = null; fail(e.message); });
    mpServer.listen(MP_PORT, '0.0.0.0', () => ok({ ips: lanIps(), port: MP_PORT }));
  });
}
ipcMain.handle('mp-start', () => startMp());

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#0b0f1d',
    title: '첨탑의 메아리',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true, preload: path.join(__dirname, 'preload.js') },
  });
  win.loadFile(path.join(__dirname, 'index.html'));
  // 외부 링크는 기본 브라우저로 엽니다.
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

const template = [
  ...(process.platform === 'darwin' ? [{ role: 'appMenu' }] : []),
  {
    label: '보기',
    submenu: [
      { role: 'togglefullscreen', label: '전체 화면' },
      { role: 'reload', label: '새로 고침' },
      { type: 'separator' },
      { role: 'resetZoom', label: '원래 크기' },
      { role: 'zoomIn', label: '확대' },
      { role: 'zoomOut', label: '축소' },
    ],
  },
  { role: 'windowMenu', label: '창' },
];

app.whenReady().then(() => {
  // 유튜브 임베드는 file:// 페이지에서 Referer가 없으면 재생을 거부해서 헤더를 채워 줍니다.
  require('electron').session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['*://*.youtube.com/*', '*://*.youtube-nocookie.com/*', '*://*.googlevideo.com/*'] }, (d, cb) => {
    d.requestHeaders.Referer = 'https://wuwa-spire.local/'; cb({ requestHeaders: d.requestHeaders });
  });
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
