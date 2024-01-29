/**
 * Miscellaneous useful functions for dealing with low level bits and bytes.
 */
export class BitUtil {
    /**
     * Size of a byte in bytes
     */
    public static SIZE_OF_BYTE = 1;

    /**
     * Size of a boolean in bytes
     */
    public static SIZE_OF_BOOLEAN = 1;

    /**
     * Size of a char in bytes
     */
    public static SIZE_OF_CHAR = 2;

    /**
     * Size of a short in bytes
     */
    public static SIZE_OF_SHORT = 2;

    /**
     * Size of an int in bytes
     */
    public static SIZE_OF_INT = 4;

    /**
     * Size of a float in bytes
     */
    public static SIZE_OF_FLOAT = 4;

    /**
     * Size of a long in bytes
     */
    public static SIZE_OF_LONG = 8;

    /**
     * Size of a double in bytes
     */
    public static SIZE_OF_DOUBLE = 8;

    /**
     * Length of the data blocks used by the CPU cache sub-system in bytes.
     */
    public static CACHE_LINE_LENGTH = 64;

    private static HEX_DIGIT_TABLE = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
    ];

    private static FROM_HEX_DIGIT_TABLE: number[] =
        BitUtil.initializeFromHexDigitTable();

    private static initializeFromHexDigitTable(): number[] {
        const table: number[] = [];
        const hexDigits = "0123456789abcdef";
        const upperHexDigits = hexDigits.toUpperCase();

        for (let i = 0; i < hexDigits.length; i++) {
            table[hexDigits.charCodeAt(i)] = i;
            table[upperHexDigits.charCodeAt(i)] = i;
        }

        return table;
    }

    private static LAST_DIGIT_MASK = 0b1;

    private BitUtil() {}

    /**
     * Fast method of finding the next power of 2 greater than or equal to the supplied value.
     * <p>
     * If the value is &lt;= 0 then 1 will be returned.
     * <p>
     * This method is not suitable for {@link Integer#MIN_VALUE} or numbers greater than 2^30. When provided
     * then {@link Integer#MIN_VALUE} will be returned.
     *
     * @param value from which to search for next power of 2.
     * @return The next power of 2 or the value itself if it is a power of 2.
     */
    static findNextPositivePowerOfTwo(value: number): number {
        return 1 << (32 - BitUtil.numberOfLeadingZeros(value - 1));
    }

    static numberOfLeadingZeros(value: number): number {
        value |= value >> 1;
        value |= value >> 2;
        value |= value >> 4;
        value |= value >> 8;
        value |= value >> 16;
        return BitUtil.SIZE_OF_INT * 8 - BitUtil.popCount(value);
    }

    static popCount(value: number): number {
        value -= (value >>> 1) & 0x55555555;
        value = (value & 0x33333333) + ((value >>> 2) & 0x33333333);
        value = (value + (value >>> 4)) & 0x0f0f0f0f;
        value += value >>> 8;
        value += value >>> 16;
        return value & 0x3f;
    }

    /**
     * Align a value to the next multiple up of alignment.
     * If the value equals an alignment multiple then it is returned unchanged.
     * <p>
     * This method executes without branching. This code is designed to be use in the fast path and should not
     * be used with negative numbers. Negative numbers will result in undefined behaviour.
     *
     * @param value     to be aligned up.
     * @param alignment to be used.
     * @return the value aligned to the next boundary.
     */
    static align(value: number, alignment: number): number {
        return (value + (alignment - 1)) & ~(alignment - 1);
    }

    /**
     * Align a value to the next multiple up of alignment.
     * If the value equals an alignment multiple then it is returned unchanged.
     * <p>
     * This method executes without branching. This code is designed to be use in the fast path and should not
     * be used with negative numbers. Negative numbers will result in undefined behaviour.
     *
     * @param value     to be aligned up.
     * @param alignment to be used.
     * @return the value aligned to the next boundary.
     */
    public static alignBigInt(value: bigint, alignment: bigint): bigint {
        return (value + (alignment - 1n)) & -alignment;
    }

    /**
     * Generate a byte array from the hex representation of the given byte array.
     *
     * @param buffer to convert from a hex representation (in Big Endian).
     * @return new byte array that is decimal representation of the passed array.
     */
    public static fromHexByteArray(buffer: Uint8Array): Uint8Array {
        const outputBuffer = new Uint8Array(buffer.length >> 1);

        for (let i = 1; i < buffer.length; i += 2) {
            const hi = BitUtil.FROM_HEX_DIGIT_TABLE[buffer[i - 1]] << 4;
            const lo = BitUtil.FROM_HEX_DIGIT_TABLE[buffer[i]];
            outputBuffer[(i - 1) >> 1] = hi | lo;
        }

        return outputBuffer;
    }

    private static HEX_DIGIT_TABLE_NUMBERS = [..."0123456789abcdef"].map((c) =>
        c.charCodeAt(0),
    );

    /**
     * Generate a byte array that is a hex representation of a given byte array.
     *
     * @param buffer to convert to a hex representation.
     * @param offset the offset into the buffer.
     * @param length the number of bytes to convert.
     * @return new byte array that is hex representation (in Big Endian) of the passed array.
     */
    public static toHexByteArray(
        buffer: Uint8Array,
        offset: number = 0,
        length: number = buffer.length,
    ): Uint8Array {
        const outputBuffer = new Uint8Array(length << 1);

        for (let i = 0; i < length << 1; i += 2) {
            const b = buffer[offset + (i >> 1)];

            outputBuffer[i] = BitUtil.HEX_DIGIT_TABLE_NUMBERS[(b >> 4) & 0x0f];
            outputBuffer[i + 1] = BitUtil.HEX_DIGIT_TABLE_NUMBERS[b & 0x0f];
        }

        return outputBuffer;
    }

    /**
     * Generate a byte array that is a hex representation of a given byte array.
     *
     * @param charSequence to convert to a hex representation.
     * @param offset       the offset into the buffer.
     * @param length       the number of bytes to convert.
     * @return new byte array that is hex representation (in Big Endian) of the passed array.
     */
    public static toHexByteArrayFromString(
        charSequence: string,
        offset: number,
        length: number,
    ): Uint8Array {
        const outputBuffer = new Uint8Array(length << 1);

        for (let i = 0; i < length << 1; i += 2) {
            const b = charSequence.charCodeAt(offset + (i >> 1));

            outputBuffer[i] = BitUtil.HEX_DIGIT_TABLE_NUMBERS[(b >> 4) & 0x0f];
            outputBuffer[i + 1] = BitUtil.HEX_DIGIT_TABLE_NUMBERS[b & 0x0f];
        }

        return outputBuffer;
    }

    /**
     * Generate a byte array from a string that is the hex representation of the given byte array.
     *
     * @param string to convert from a hex representation (in Big Endian).
     * @return new byte array holding the decimal representation of the passed array.
     */
    public static fromHex(hexString: string): Uint8Array {
        const length = hexString.length;
        const bytes = new Uint8Array(length);

        for (let i = 0; i < length; i++) {
            bytes[i] = hexString.charCodeAt(i);
        }

        return BitUtil.fromHexByteArray(bytes);
    }

    /**
     * Generate a string that is the hex representation of a given byte array.
     *
     * @param buffer to convert to a hex representation.
     * @param offset the offset into the buffer.
     * @param length the number of bytes to convert.
     * @return new String holding the hex representation (in Big Endian) of the passed array.
     */
    public static toHex(
        buffer: Uint8Array,
        offset: number = 0,
        length: number = buffer.length,
    ): string {
        let hexString = "";

        for (let i = 0; i < length; i++) {
            const byte = buffer[offset + i];
            hexString += BitUtil.HEX_DIGIT_TABLE[(byte >> 4) & 0x0f];
            hexString += BitUtil.HEX_DIGIT_TABLE[byte & 0x0f];
        }

        return hexString;
    }

    /**
     * Generate a string that is the hex representation of a given byte array.
     *
     * @param buffer to convert to a hex representation.
     * @return new String holding the hex representation (in Big Endian) of the passed array.
     */
    public static toHexFromBuffer(buffer: Uint8Array): string {
        return BitUtil.toHex(buffer, 0, buffer.length);
    }

    /**
     * Is a int value even.
     *
     * @param value to check.
     * @return true if the number is even otherwise false.
     */
    public static isEven(value: number): boolean {
        return (value & BitUtil.LAST_DIGIT_MASK) === 0;
    }

    /**
     * Is a long value even.
     *
     * @param value to check.
     * @return true if the number is even otherwise false.
     */
    public static isEvenBigInt(value: bigint): boolean {
        return (value & BigInt(BitUtil.LAST_DIGIT_MASK)) === BigInt(0);
    }

    /**
     * Is a value a positive power of 2.
     *
     * @param value to be checked.
     * @return true if the number is a positive power of 2, otherwise false.
     */
    public static isPowerOfTwo(value: number): boolean {
        return value > 0 && (value & -value) === value;
    }

    /**
     * Is a value a positive power of 2.
     *
     * @param value to be checked.
     * @return true if the number is a positive power of 2, otherwise false.
     */
    public static isPowerOfTwoBigInt(value: bigint): boolean {
        return value > BigInt(0) && (value & -value) === value;
    }

    /**
     * Cycles indices of an array one at a time in a forward fashion.
     *
     * @param current value to be incremented.
     * @param max     value for the cycle.
     * @return the next value, or zero if max is reached.
     */
    public static next(current: number, max: number): number {
        if (current === max - 1) {
            return 0;
        }
        return current + 1;
    }

    /**
     * Cycles indices of an array one at a time in a backwards fashion.
     *
     * @param current value to be decremented.
     * @param max     value of the cycle.
     * @return the next value, or max - 1 if current is zero.
     */
    public static previous(current: number, max: number): number {
        if (0 == current) {
            return max - 1;
        }

        return current - 1;
    }

    /**
     * Calculate the shift value to scale a number based on how refs are compressed or not.
     *
     * @param scale of the number reported by Unsafe.
     * @return how many times the number needs to be shifted to the left.
     */
    public static calculateShiftForScale(scale: number): number {
        if (4 == scale) {
            return 2;
        } else if (8 == scale) {
            return 3;
        }

        throw new Error("unknown pointer size for scale=" + scale);
    }

    /**
     * Generate a randomised integer over [{@link Integer#MIN_VALUE}, {@link Integer#MAX_VALUE}].
     *
     * @return randomised integer suitable as an ID.
     */
    public static generateRandomizedId(): number {
        return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    }

    /**
     * Is an address aligned on a boundary.
     *
     * @param address   to be tested.
     * @param alignment boundary the address is tested against.
     * @return true if the address is on the aligned boundary otherwise false.
     * @throws IllegalArgumentException if the alignment is not a power of 2.
     */
    public static isAligned(address: bigint, alignment: number): boolean {
        if (!BitUtil.isPowerOfTwo(alignment)) {
            throw new Error(
                "alignment must be a power of 2: alignment=" + alignment,
            );
        }

        return (address & BigInt(alignment - 1)) === 0n;
    }
}
