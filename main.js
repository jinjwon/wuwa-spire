// 데스크톱 앱(Electron) 진입점: index.html을 게임 창으로 엽니다.
const { app, BrowserWindow, Menu, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    backgroundColor: '#0b0f1d',
    title: '첨탑의 메아리',
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, sandbox: true },
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
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  app.quit();
});
