export class BufferUtil {
    /**
     * Bounds check the access range and throw a {@link Error} if exceeded.
     *
     * @param buffer to be checked.
     * @param index  at which the access will begin.
     * @param length of the range accessed.
     */
    public static boundsCheck(
        buffer: Uint8Array,
        index: number,
        length: number,
    ): void {
        const capacity = buffer.length;
        const resultingPosition = index + length;
        if (index < 0 || resultingPosition > capacity) {
            throw new Error(
                "index=" +
                    index +
                    " length=" +
                    length +
                    " capacity=" +
                    capacity,
            );
        }
    }
}
