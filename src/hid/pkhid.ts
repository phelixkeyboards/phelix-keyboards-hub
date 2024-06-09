// /path/to/hidModule.ts
import * as HID from 'node-hid';

const BUF_SIZE_BYTES = 32;
const RAW_USAGE_PAGE = 0xFF60;
const RAW_USAGE_ID = 0x61;

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

  return pkDeviceInfo;
};

export const listHidDevices = (): HIDDeviceInfo[] => {
  return HID.devices() as HIDDeviceInfo[];
};



