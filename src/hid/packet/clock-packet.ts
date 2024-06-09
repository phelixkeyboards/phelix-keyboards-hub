import { HIDConstants } from '../hid-constants';
import { Packet } from './packet';
export class ClockPacket extends Packet {

    constructor(clockTime: string) {
        let controlBits: number = Packet.buildControl(HIDConstants.Packets.CONTROL.CONTROL_EOF, true, true);
        super(0, 1, controlBits);
        this.setBody(clockTime);
    }

    private setBody(clockTime: string) {
        if (clockTime.length > HIDConstants.Packets.BODY_SIZE_BYTES) {
            throw new Error("String length out of range for body: " + clockTime.length);
        }
        let body:number[] = Packet.buildEmptyBody();
        for (let i = 0; i < clockTime.length; i++) {
            body[i] = clockTime.charCodeAt(i);
        }
        this.data = body;
    }


    public toPacket(): Packet {
        let tmp: Packet = this as Packet;
        return this as Packet;
    }

}