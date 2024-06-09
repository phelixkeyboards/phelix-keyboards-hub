export namespace HIDConstants {
    export namespace Packets {
        export const PACKET_SIZE: number = 32;
        export const HEADER_SIZE_BYTES: number = 5;
        export const SEQ_NUM_SIZE_BYTES: number = 2;
        export const TOTAL_NUM_SIZE_BYTES: number = 2;
        export const CONTROL_SIZE_BYTES: number = 1;
        export const BODY_SIZE_BYTES: number = 27;

        export namespace CONTROL {
            export const CONTROL_PACKET_TYPE = 5; // first 5 bits are packet type
            export const CONTROL_SOF = 1;
            export const CONTROL_EOF = 1;
            export const CONTROL_UNUSED = 3;
        }

        export namespace Feature {
            export const CLOCK_PACKET_ID = 0;
        }
    }
}