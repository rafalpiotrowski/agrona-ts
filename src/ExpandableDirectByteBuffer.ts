import { DefaultMutableDirectBuffer } from "./DefaultMutableDirectBuffer";

export class ExpandableDirectByteBuffer extends DefaultMutableDirectBuffer {
    /**
     * Maximum length to which the underlying buffer can grow.
     */
    public static MAX_BUFFER_LENGTH = Number.MAX_VALUE - 8;

    /**
     * Initial capacity of the buffer from which it will expand.
     */
    public static INITIAL_CAPACITY = 128;

    constructor(
        capacity: number = ExpandableDirectByteBuffer.INITIAL_CAPACITY,
    ) {
        super(capacity);
    }
}
