const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  listPKDevices: () => ipcRenderer.send('list-pk-devices'),
  onHidPKDevices: (callback) => ipcRenderer.on('hid-pk-devices', (event, devices) => callback(devices)),
  listHidDevices: () => ipcRenderer.send('list-hid-devices'),
  onHidDevices: (callback) => ipcRenderer.on('hid-devices', (event, devices) => callback(devices)),
  sendTime: () => ipcRenderer.send('send-time'),
});
