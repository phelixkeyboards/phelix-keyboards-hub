import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

interface ElectronAPI {
  listPKDevices: () => void;
  onHidPKDevices: (callback: (devices: any) => void) => void;
  listHidDevices: () => void;
  onHidDevices: (callback: (devices: any) => void) => void;
  sendTime: () => void;
}

contextBridge.exposeInMainWorld('electronAPI', {
  listPKDevices: (): void => {
    ipcRenderer.send('list-pk-devices');
  },
  onHidPKDevices: (callback: (devices: any) => void): void => {
    ipcRenderer.on('hid-pk-devices', (event: IpcRendererEvent, devices: any) => {
      callback(devices);
    });
  },
  listHidDevices: (): void => {
    ipcRenderer.send('list-hid-devices');
  },
  onHidDevices: (callback: (devices: any) => void): void => {
    ipcRenderer.on('hid-devices', (event: IpcRendererEvent, devices: any) => {
      callback(devices);
    });
  },
  sendTime: (): void => {
    ipcRenderer.send('send-time');
  },
} as ElectronAPI);
