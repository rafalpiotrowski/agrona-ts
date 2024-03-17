import { DefaultMutableDirectBuffer } from "../src/index";

describe("DirectBuffer", () => {
    test("putString should put string into the buffer", () => {
        const db = new DefaultMutableDirectBuffer(4);
        db.putString(0, "test");
        const buf = Array.from(db.byteArray());
        expect(db.getStringAscii(0, 4, buf)).toBe("test");
    });
});
