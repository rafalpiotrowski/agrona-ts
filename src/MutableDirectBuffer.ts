import { ByteOrder } from "./ByteOrder";
import { DirectBuffer } from "./DirectBuffer";

export interface MutableDirectBuffer extends DirectBuffer {
    putLong(index: number, value: bigint, byteOrder?: ByteOrder): void;
    putInt(index: number, value: number, byteOrder?: ByteOrder): void;
    putShort(index: number, value: number, byteOrder?: ByteOrder): void;
    putFloat(index: number, value: number, byteOrder?: ByteOrder): void;
    putDouble(index: number, value: number, byteOrder?: ByteOrder): void;
    putByte(index: number, value: number): void;
    putBytes(
        index: number,
        src: number[] | Uint8Array | DirectBuffer,
        offset: number,
        length: number,
    ): void;
    putString(index: number, value: string): void;
}
