import * as HID from 'node-hid';
import { Packet } from './packet/packet';
import { app, BrowserWindow, ipcMain } from 'electron';

interface HIDDeviceInfo {
  vendorId: number;
  productId: number;
  manufacturer: string;
  usage: number;
  usagePage: number;
  path?: string;
}
const BUF_SIZE_BYTES = 32;
const RAW_USAGE_PAGE = 0xFF60;
const RAW_USAGE_ID = 0x61;

let pkDevice: HID.HID | undefined;

/*
pkDevice.on("data", function(data){
    console.log("recieved data");
}); */
export function openConnection(): boolean {
    const devices = HID.devices() as HIDDeviceInfo[];
    const pkDeviceInfo = HID.devices()
        .filter(d => d.vendorId === 0xFEED && d.productId === 0x4594 && d.manufacturer === "phelix")
        .find(d => d.usage === RAW_USAGE_ID && d.usagePage === RAW_USAGE_PAGE);
    const path = pkDeviceInfo?.path;
    if (path) {
        pkDevice = new HID.HID(path);
        return true;
    }
    // throw error?
    return false;
}

export function closeConnection() {
    pkDevice.close();
}

export function sendPacket(packet: Packet){
    if (pkDevice) {
        console.log(packet.headerToBinaryString());
        console.log(packet.bodyToCharString());
        console.log(packet.toHexArray());
        pkDevice.write(packet.toHexArray());
    }
} 