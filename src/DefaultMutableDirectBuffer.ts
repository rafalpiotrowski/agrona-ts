import { BitUtil } from "./BitUtil";
import { BufferUtil } from "./BufferUtil";
import { ByteOrder } from "./ByteOrder";
import { DirectBuffer } from "./DirectBuffer";
import { MutableDirectBuffer } from "./MutableDirectBuffer";

export class DefaultMutableDirectBuffer implements MutableDirectBuffer {
    protected _buffer: Uint8Array;
    protected _capacity: number = 0;
    protected _addressOffset: bigint = 0n;

    constructor(capacity: number = 0) {
        this._capacity = capacity;
        this._buffer = new Uint8Array(capacity);
    }

    // Constants
    STR_HEADER_LEN: number = BitUtil.SIZE_OF_INT;
    DISABLE_ARRAY_CONTENT_PRINTOUT_PROP_NAME: string =
        "agrona.disable.array.printout";
    DISABLE_BOUNDS_CHECKS_PROP_NAME: string = "agrona.disable.bounds.checks";
    SHOULD_BOUNDS_CHECK: boolean = true;

    public byteArray(): Uint8Array {
        return this._buffer;
    }

    public byteBuffer(): ArrayBuffer {
        return this._buffer;
    }

    public addressOffset(): bigint {
        return this._addressOffset;
    }

    public capacity(): number {
        return this._capacity;
    }

    public checkLimit(limit: number): void {
        if (limit > this._capacity) {
            throw new Error(
                "limit=" + limit + " is beyond capacity=" + this._capacity,
            );
        }
    }

    wrap(buffer: Uint8Array): void;
    wrap(buffer: Uint8Array, offset: number, length: number): void;
    wrap(buffer: ArrayBuffer): void;
    wrap(buffer: ArrayBuffer, offset: number, length: number): void;
    wrap(buffer: DirectBuffer): void;
    wrap(buffer: DirectBuffer, offset: number, length: number): void;
    wrap(address: bigint, length: number): void;
    wrap(buffer: unknown, offset?: unknown, length?: unknown): void {
        if (offset === undefined) {
            offset = 0;
        }
        if (buffer instanceof Uint8Array) {
            if (length === undefined) {
                length = buffer.length - <number>offset;
            }
            this.wrapArray(buffer, <number>offset, <number>length);
        } else if (buffer instanceof ArrayBuffer) {
            if (length === undefined) {
                length = buffer.byteLength - <number>offset;
            }
            this.wrapArray1(buffer, <number>offset, <number>length);
        }
    }
    public wrapArray(buffer: Uint8Array, offset: number, length: number) {
        this._buffer = buffer;
        this._capacity = length;
        this._addressOffset = BigInt(offset);
    }
    wrapArray1(buffer: ArrayBuffer, offset: number, length: number) {
        this._buffer = new Uint8Array(buffer);
        this._capacity = length;
        this._addressOffset = BigInt(offset);
    }
    public getBytes(
        index: number,
        dst: Uint8Array | MutableDirectBuffer,
        offset?: number,
        length?: number,
    ): void {
        if (offset === undefined) {
            offset = 0;
        }
        if (dst instanceof Uint8Array) {
            if (length === undefined) {
                length = dst.length - offset;
            }

            BufferUtil.boundsCheck(this._buffer, index, length);
            BufferUtil.boundsCheck(dst, offset, length);

            dst.set(this._buffer.subarray(index, index + length), offset);
        } else {
            if (length === undefined) {
                length = dst.capacity() - offset;
            }

            BufferUtil.boundsCheck(this._buffer, index, length);
            //todo: implement bounds check for MutableDirectBuffer
            // BufferUtil.boundsCheck(dst, offset, length);

            dst.putBytes(offset, this._buffer, index, length);
        }
    }

    getStringAscii(index: number, length: number, buf: Array<number>): string {
        // Validate inputs
        if (index < 0 || length < 0 || index + length > buf.length) {
            throw new Error("Invalid index or length.");
        }

        // Initialize an empty string to store the result
        let asciiString = "";

        // Loop through the specified portion of the buffer
        for (let i = index; i < index + length; i++) {
            // Get the ASCII character corresponding to the number
            const char = String.fromCharCode(buf[i]);

            // Append the character to the result string
            asciiString += char;
        }

        // Return the resulting ASCII string
        return asciiString;
    }

    boundsCheck(index: number, length: number): void {
        BufferUtil.boundsCheck(this._buffer, index, length);
    }

    public getLong(
        index: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): bigint {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_LONG);
        return this.getLongFromBuffer(this._buffer, index, byteOrder);
    }

    public putLong(
        index: number,
        value: bigint,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_LONG);
        this.putLongInBuffer(this._buffer, index, value, byteOrder);
    }

    public getInt(
        index: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): number {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_INT);
        return this.getIntFromBuffer(this._buffer, index, byteOrder);
    }

    public putInt(
        index: number,
        value: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_INT);
        this.putIntInBuffer(this._buffer, index, value, byteOrder);
    }

    public getShort(
        index: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): number {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_SHORT);
        return this.getShortFromBuffer(this._buffer, index, byteOrder);
    }

    public putShort(
        index: number,
        value: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_SHORT);
        this.putShortInBuffer(this._buffer, index, value, byteOrder);
    }

    public getFloat(
        index: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): number {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_FLOAT);
        return this.getFloatFromBuffer(this._buffer, index, byteOrder);
    }

    public putFloat(
        index: number,
        value: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_FLOAT);
        this.putFloatInBuffer(this._buffer, index, value, byteOrder);
    }

    public getDouble(
        index: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): number {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_DOUBLE);
        return this.getDoubleFromBuffer(this._buffer, index, byteOrder);
    }

    public putDouble(
        index: number,
        value: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_FLOAT);
        this.putDoubleInBuffer(this._buffer, index, BigInt(value), byteOrder);
    }

    public getChar(index: number): string {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_CHAR);
        return this.getCharFromBuffer(this._buffer, index);
    }

    public getByte(index: number): number {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_BYTE);
        return this.getByteFromBuffer(this._buffer, index);
    }

    public putByte(index: number, value: number): void {
        BufferUtil.boundsCheck(this._buffer, index, BitUtil.SIZE_OF_BYTE);
        this.putByteInBuffer(this._buffer, index, value);
    }

    public putBytes(
        index: number,
        src: number[] | DirectBuffer | Uint8Array,
        offset: number,
        length: number,
        byteOrder?: ByteOrder,
    ): void {
        BufferUtil.boundsCheck(this._buffer, index, length);

        if (Array.isArray(src)) {
            this.putBytesFromNumberArrayWitOffset(
                index,
                src as number[],
                offset,
                length,
                byteOrder,
            );
        } else if (src instanceof Uint8Array) {
            this.putBytesFromUint8ArrayWithOffset(
                index,
                src as Uint8Array,
                offset,
                length,
                byteOrder,
            );
        } else {
            this.putBytesFromDirectBufferWithOffset(
                index,
                src as DirectBuffer,
                offset,
                length,
                byteOrder,
            );
        }
    }

    putBytesFromNumberArrayWitOffset(
        index: number,
        src: number[],
        offset: number,
        length: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ) {
        for (let i = 0; i < length; i++) {
            if (byteOrder === ByteOrder.LITTLE_ENDIAN) {
                this._buffer[index + i] = src[i + offset];
            } else {
                this._buffer[index + length - 1 - i] = src[i + offset];
            }
        }
    }

    putBytesFromUint8ArrayWithOffset(
        index: number,
        src: Uint8Array,
        offset: number,
        length: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ) {
        for (let i = 0; i < length; i++) {
            if (byteOrder === ByteOrder.LITTLE_ENDIAN) {
                this._buffer[index + i] = src[offset + i];
            } else {
                this._buffer[index + length - 1 - i] = src[offset + i];
            }
        }
    }

    putBytesFromDirectBufferWithOffset(
        index: number,
        src: DirectBuffer,
        offset: number,
        length: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        const buf = src.byteArray();
        if (buf === null) {
            throw new Error("DirectBuffer does not have backing byte array");
        }
        this.putBytesFromUint8ArrayWithOffset(
            index,
            buf,
            offset,
            length,
            byteOrder,
        );
    }

    public putString(index: number, value: string): void {
        BufferUtil.boundsCheck(this._buffer, index, value.length);
        this.putStringInBuffer(this._buffer, index, value);
    }

    getLongFromBuffer(
        buffer: Uint8Array,
        index: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): bigint {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_LONG);
        return view.getBigInt64(0, byteOrder === ByteOrder.LITTLE_ENDIAN);
    }

    putLongInBuffer(
        buffer: Uint8Array,
        index: number,
        value: bigint,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_LONG);
        view.setBigInt64(0, value, byteOrder === ByteOrder.LITTLE_ENDIAN);
    }

    getIntFromBuffer(
        buffer: Uint8Array,
        index: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): number {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_INT);
        return view.getInt32(0, byteOrder === ByteOrder.LITTLE_ENDIAN);
    }

    putIntInBuffer(
        buffer: Uint8Array,
        index: number,
        value: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_INT);
        view.setInt32(0, value, byteOrder === ByteOrder.LITTLE_ENDIAN);
    }

    getShortFromBuffer(
        _buffer: Uint8Array,
        index: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): number {
        const view = new DataView(_buffer.buffer, index, BitUtil.SIZE_OF_SHORT);
        return view.getInt16(0, byteOrder === ByteOrder.LITTLE_ENDIAN);
    }

    putShortInBuffer(
        buffer: Uint8Array,
        index: number,
        value: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_SHORT);
        view.setInt16(0, value, byteOrder === ByteOrder.LITTLE_ENDIAN);
    }

    getFloatFromBuffer(
        buffer: Uint8Array,
        index: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): number {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_FLOAT);
        return view.getFloat32(0, byteOrder === ByteOrder.LITTLE_ENDIAN);
    }

    putFloatInBuffer(
        buffer: Uint8Array,
        index: number,
        value: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_FLOAT);
        view.setFloat32(0, value, byteOrder === ByteOrder.LITTLE_ENDIAN);
    }

    getDoubleFromBuffer(
        buffer: Uint8Array,
        index: number,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): number {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_DOUBLE);
        const value = view.getBigInt64(
            0,
            byteOrder === ByteOrder.LITTLE_ENDIAN,
        );
        return Number(value);
    }

    putDoubleInBuffer(
        buffer: Uint8Array,
        index: number,
        value: bigint,
        byteOrder: ByteOrder = ByteOrder.LITTLE_ENDIAN,
    ): void {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_DOUBLE);
        view.setBigInt64(0, value, byteOrder === ByteOrder.LITTLE_ENDIAN);
    }

    getCharFromBuffer(buffer: Uint8Array, index: number): string {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_CHAR);
        const textDecoder = new TextDecoder("utf-8");
        return textDecoder.decode(view);
    }

    putStringInBuffer(buffer: Uint8Array, index: number, value: string): void {
        const textEncoder = new TextEncoder();
        const encoded = textEncoder.encode(value);
        buffer.set(encoded, index);
    }

    getByteFromBuffer(buffer: Uint8Array, index: number): number {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_BYTE);
        return view.getUint8(0);
    }

    putByteInBuffer(buffer: Uint8Array, index: number, value: number): void {
        const view = new DataView(buffer.buffer, index, BitUtil.SIZE_OF_BYTE);
        view.setUint8(0, value);
    }
}
