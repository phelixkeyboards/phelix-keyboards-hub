import { sendPacket } from './../../hid/keyboard-hid';
import { ClockPacket } from '../../hid/packet/clock-packet';

let clockIntervalId: any;

export function initTaskSendClock() {
    clockIntervalId = setInterval(eventSendClock, 1000);
}
export function endTaskSendClock() {
    clearInterval(clockIntervalId);
}

function eventSendClock() {
    let time = getCurrentTimeFormatted();
    sendPacket(new ClockPacket(time).toPacket());
}

function getCurrentTimeFormatted(): string {
    const zeroPad = (num: number, places: number): string => String(num).padStart(places, '0');
    const date = new Date();
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes.toString();
  
    return `${hours}:${zeroPad(minutes, 2)}:${zeroPad(seconds, 2)} ${ampm}`;
  };