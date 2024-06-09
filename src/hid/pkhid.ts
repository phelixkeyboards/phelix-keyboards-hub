// /path/to/hidModule.ts
import * as HID from 'node-hid';

const BUF_SIZE_BYTES = 32;
const RAW_USAGE_PAGE = 0xFF60;
const RAW_USAGE_ID = 0x61;

let pkdevice: HID.HID | undefined;

interface HIDDeviceInfo {
  vendorId: number;
  productId: number;
  manufacturer: string;
  usage: number;
  usagePage: number;
  path?: string;
}

export const listPkDevices = (): HIDDeviceInfo[] => {
  const devices: HIDDeviceInfo[] = HID.devices() as HIDDeviceInfo[];
  const pkDeviceInfo = devices.filter(d => d.vendorId === 0xFEED && d.productId === 0x4594 && d.manufacturer === "phelix");
  const pkrawHIDInterface = pkDeviceInfo.find(d => d.usage === RAW_USAGE_ID && d.usagePage === RAW_USAGE_PAGE);

  const path = pkrawHIDInterface?.path;
  if (path) {
    pkdevice = new HID.HID(path);
  }
  return pkDeviceInfo;
};

export const listHidDevices = (): HIDDeviceInfo[] => {
  return HID.devices() as HIDDeviceInfo[];
};

export const sendTime = (): void => {
  if (pkdevice) {
    let time = getCurrentTime();
    let buffer: number[] = createEmptyBuffer();
    for (let i = 0; i < time.length; i++) {
      if (i > BUF_SIZE_BYTES) {
        break;
      }
      buffer[i + 2] = time.charCodeAt(i);
    }

    try {
      console.log('Sending buffer... \n--->Buffer:', buffer);
      pkdevice.write(buffer);
      console.log('Buffer sent.');
    } catch (error) {
      console.error('Error sending buffer:', error);
    }
    setTimeout(() => {
      console.log("closing connection");
      if (pkdevice) pkdevice.close();
    }, 60000);
  }
};

const createEmptyBuffer = (): number[] => {
  let buf: number[] = [];
  for (let i = 0; i < BUF_SIZE_BYTES; i++) {
    buf.push(0);
  }
  return buf;
};

