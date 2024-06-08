# Packet Protocol 
The protocol for transferring packets from app to keyboard

## Packet Format
Header: 40 bits (5 bytes)\
Packet total size: 32 bytes

|Size | Description |
| ------------------------ | ----------- |
| 16 bits  | Sequence number (65,536 max numbers) |
| 16 bits  | Total number of packets (65,536 max numbers)    |
| 8  bits (8 bits) | Control bits/flags |
| 27 bytes | Body |

| Total | 
| ----- | 
| 32 bytes|

### Control/Flags
| Size | Type | Description |
| - | - | - |
| 5 bits | data | packet type (for routing packet data to correct feature on keyboard side) | 
| 1 bit | flag | SOF - indicates start of file |
| 1 bit | flag | EOF - indicates start of file |
| 3 bit | N/A | unused |


# Notes

Allocated memory on keyboard:
 ```
16Mb total
8Mb firmware
1Mb general allocated for os
7Mb free space

write buffer: [
    wallpaper - byte array[] image - 500kb 
    current time - byte array[11] - 11bytes current time
]
 ```


### Communication Protcol
Sequence:
- OS sends `seqnum(1)` with `SOF(1)`
- KB receives `pkt 1`
- KB sends `ack(1)`
- OS sends `seqnum(2)` with `EOF(1)`

Handling Packet Loss:

    Client sends Packet 1 and waits for ACK.
    Server receives Packet 1, processes it, and sends ACK 1.
    Client receives ACK 1, sends Packet 2, and so on.
    If Packet 3 is lost, the Client will not receive ACK 3 within the timeout and will retransmit Packet 3.
    Server receives retransmitted Packet 3, processes it, and sends ACK 3.
    This process continues until all packets are successfully received and acknowledged.

Example Scenario - Last packet lost:

    Assuming 320 bytes of data split into 12 packets:
    Packet 1 to Packet 11: Successfully received and acknowledged.
    Packet 12 (with EOF flag): Lost in transit.
    Server: Detects timeout after receiving Packet 11.
    Server: Sends NACK for Packet 12.
    Client: Receives NACK and retransmits Packet 12.
    Server: Receives retransmitted Packet 12, verifies EOF flag, and sends a final acknowledgment.