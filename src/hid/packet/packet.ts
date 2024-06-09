import { HIDConstants } from "../hid-constants";

export class Packet {
    private seqNum: number;
    private totalNumPackets: number;
    private controlBits: number;
    protected data: number[];
  

    constructor(seqNum?: number, totalNumPackets?: number, controlBits?: number, data?: number[]) {
      if (data && data.length !== HIDConstants.Packets.BODY_SIZE_BYTES) {
        throw new Error("Data must be exactly 27 hex values.");
      }
  
      this.seqNum = seqNum;
      this.totalNumPackets = totalNumPackets;
      this.controlBits = controlBits;
      this.data = data;
    }
  
    // Getters
    public getSeqNum(): number {
      return this.seqNum;
    }
  
    public getTotalNumPackets(): number {
      return this.totalNumPackets;
    }
  
    public getControlBits(): number {
      return this.controlBits;
    }
  
    public getData(): number[] {
      return this.data;
    }
  
    // Serialization to an array of hex values as numbers
    public toHexArray(): number[] {
      const hexArray: number[] = [];
  
      // Write seqNum (2 bytes)
      hexArray.push((this.seqNum >> 8) & 0xFF);
      hexArray.push(this.seqNum & 0xFF);
  
      // Write totalNumPackets (2 bytes)
      hexArray.push((this.totalNumPackets >> 8) & 0xFF);
      hexArray.push(this.totalNumPackets & 0xFF);
  
      // Write controlBits (1 byte)
      hexArray.push(this.controlBits & 0xFF);
  
      // Write data (27 bytes)
      for (let i = 0; i < this.data.length; i++) {
        hexArray.push(this.data[i] & 0xFF);
      }
  
      return hexArray;
    }
  
    // Deserialization from an array of hex values as numbers
    public static fromHexArray(hexArray: number[]): Packet {
      if (hexArray.length !== HIDConstants.Packets.PACKET_SIZE) {
        throw new Error("Hex array must be exactly 32 values.");
      }
  
      // Read seqNum (2 bytes)
      const seqNum = (hexArray[0] << 8) | hexArray[1];
  
      // Read totalNumPackets (2 bytes)
      const totalNumPackets = (hexArray[2] << 8) | hexArray[3];
  
      // Read controlBits (1 byte)
      const controlBits = hexArray[4];
  
      // Read data (27 bytes)
      const data: number[] = [];
      for (let i = 5; i < HIDConstants.Packets.PACKET_SIZE; i++) {
        data.push(hexArray[i]);
      }
  
      return new Packet(seqNum, totalNumPackets, controlBits, data);
    }

    public headerToBinaryString(): String {
      return "seqNum: [" + this.seqNum.toString(2).padStart(16, '0') + "]\n"
        + "totalNum: [" + this.totalNumPackets.toString(2).padStart(16, '0') + "]\n"
        + "control: ["+ this.controlBits.toString(2).padStart(8, '0') + "]\n"
        + "control packet type: ["+ this.controlBits.toString(2).substring(0, 4).padStart(5, '0') + "]\n"
        + "control SOF flag: [" + this.controlBits.toString(2)[5] + "]\n"
        + "control EOF flag: [" + this.controlBits.toString(2)[6] + "]\n";
    }
    public bodyToCharString():String {
      return "Body stringified: " + String.fromCharCode(...this.data);
    }

    public static buildControl(packetTypeId: number, sof: boolean, eof: boolean): number {
      if (packetTypeId < 0 || packetTypeId > 31) {
        throw new Error("Number out of range. Must be between 0 and 31.");
      }
      // set first 5 bits index 0-4
      let controlBits = packetTypeId & 0x1F;
      // set the sof bit (index 5)
      controlBits = sof ? controlBits |= 1 << 5 : controlBits &= ~(1 << 5);
      // set the eof bit (index 6)
      controlBits = eof ? controlBits |= 1 << 6 : controlBits &= ~(1 << 6);

      //unused last three (index 7-10)
      controlBits &= 0x7F;
      return controlBits;
    }

    public static buildEmptyBody(): number[] {
      return new Array(HIDConstants.Packets.BODY_SIZE_BYTES).fill(0);
    }

  }

  