export class StringBuilder {
    private _buffer: Array<string> = [];
    constructor() {}
    append(value: string | number | bigint): StringBuilder {
        this._buffer.push(value.toString());
        return this;
    }
    setLength(length: number): void {
        if (length < 0) {
            throw new Error("Length cannot be negative");
        }
        this._buffer.length = length;
    }
    length(): number {
        return this._buffer.join("").length;
    }
    toString(): string {
        return this._buffer.join("");
    }
}
