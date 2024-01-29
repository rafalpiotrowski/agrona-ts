import { ByteOrder } from "./ByteOrder";
import { MutableDirectBuffer } from "./MutableDirectBuffer";

export interface DirectBuffer {
    // Constants
    STR_HEADER_LEN: number;
    DISABLE_ARRAY_CONTENT_PRINTOUT_PROP_NAME: string;
    DISABLE_BOUNDS_CHECKS_PROP_NAME: string;
    SHOULD_BOUNDS_CHECK: boolean;

    // Methods
    wrap(buffer: Uint8Array): void;
    wrap(buffer: Uint8Array, offset: number, length: number): void;
    wrap(buffer: ArrayBuffer): void;
    wrap(buffer: ArrayBuffer, offset: number, length: number): void;
    wrap(buffer: DirectBuffer): void;
    wrap(buffer: DirectBuffer, offset: number, length: number): void;
    wrap(address: bigint, length: number): void;

    addressOffset(): bigint;

    byteArray(): Uint8Array | null;
    byteBuffer(): ArrayBuffer | null;

    capacity(): number;

    checkLimit(limit: number): void;

    getLong(index: number, byteOrder?: ByteOrder): bigint;
    getInt(index: number, byteOrder?: ByteOrder): number;
    getDouble(index: number, byteOrder?: ByteOrder): number;
    getFloat(index: number, byteOrder?: ByteOrder): number;
    getShort(index: number, byteOrder?: ByteOrder): number;
    getChar(index: number, byteOrder?: ByteOrder): string;
    getByte(index: number): number;

    getBytes(index: number, dst: Uint8Array): void;
    getBytes(
        index: number,
        dst: Uint8Array,
        offset: number,
        length: number,
    ): void;
    getBytes(
        index: number,
        dst: MutableDirectBuffer,
        offset: number,
        length: number,
    ): void;

    getStringAscii(index: number, length: number, buf: Array<number>): string;

    boundsCheck(index: number, length: number): void;
}
