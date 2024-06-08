const { app, BrowserWindow, ipcMain } = require('electron');
const HID = require('node-hid');
const path = require('path');

const BUF_SIZE_BYTES = 32;
const RAW_USAGE_PAGE = 0xFF60;
const RAW_USAGE_ID = 0x61;

let pkdevice;

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      enambeRemoteModule: false,
    }
  })
  win.loadFile('index.html');
  win.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  // Communicate with the QMK keyboard
  // "vid": "0xFEED",
  // "pid": "0x4594",
  //const devices = HID.devices();
  //const qmkKeyboard = devices.find(d => d.vendorId === 0xFEED && d.productId === 0x4594);


  /*if (qmkKeyboard) {
    const device = new HID.HID(qmkKeyboard.path);

    device.on('data', (data) => {
      console.log('Received data:', data);
      // Send data to renderer process if needed
      mainWindow.webContents.send('keyboard-data', data);
    });

    device.on('error', (err) => {
      console.error('Error:', err);
    });

    // Example: Send a command to the keyboard
    const command = Buffer.from([0x00, 0x01, 0x02]);  // Replace with actual command
    device.write(command);
  } else {
    console.error('QMK keyboard not found');
  }*/
});

ipcMain.on('list-pk-devices', (event) => {
  const devices = HID.devices();
  let pkDeviceInfo = devices.filter(d => d.vendorId === 0xFEED && d.productId === 0x4594 && d.manufacturer === "phelix");
  let pkrawHIDInterface = pkDeviceInfo.find(d =>d.usage === RAW_USAGE_ID && d.usagePage === RAW_USAGE_PAGE);
  if (pkrawHIDInterface) {
    console.log(typeof(pkrawHIDInterface));
    console.log(pkrawHIDInterface);
    pkdevice = new HID.HID(pkrawHIDInterface.path);
  }
  event.reply('hid-pk-devices', pkDeviceInfo);
});

ipcMain.on('list-hid-devices', (event) => {
  const devices = HID.devices();
  event.reply('hid-devices', devices);
});

ipcMain.on('send-time', (event) => {
  console.log("sending");
  sendTime();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

function sendTime() {
  //setInterval(() => {
    let time = getCurrentTime();
    let buffer = [];
    buffer = createEmptyBuffer();
    for (let i = 0; i < time.length; i++) {
      if (i > BUF_SIZE_BYTES){
        // what do?
        break;
      }
      buffer[i+2] = time.charCodeAt(i);
    }

    // Send the buffer to the QMK keyboard
    try {
      console.log('Sending buffer... \n--->Buffer:', buffer);
      pkdevice.write(buffer);
      console.log('Buffer sent.');
    } catch (error) {
      console.error('Error sending buffer:', error);
    }
    setTimeout( function() {
      console.log("closing connection");
      pkdevice.close();
    }, 60000);
  //}, 1000); // Send every second
}

function createEmptyBuffer() {
  let buf = [];
  for (i = 0; i < BUF_SIZE_BYTES; i++) {
    buf.push(0);
  }
  return buf;
}

function oldBufferImplementation() {
    buffer = [];
    // Fill the buffer with some data. Example: 32-byte pattern
    for (let i = 0; i < 32; i++) {
      buffer[i] = 0; // Example data
    }
 
}

function getCurrentTime() {
    const zeroPad = (num, places) => String(num).padStart(places, '0');
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    return `${hours}:${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)} ${ampm}`;
}  