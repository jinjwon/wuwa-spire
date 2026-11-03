// 렌더러가 멀티(같은 와이파이) 서버를 켤 수 있게 하는 최소 통로
const { contextBridge, ipcRenderer } = require('electron');
contextBridge.exposeInMainWorld('mpHost', { start: () => ipcRenderer.invoke('mp-start') });
