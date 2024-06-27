import { BitUtil } from "../src/index";

describe("isEven", () => {
    test("check if number is even", () => {
        expect(BitUtil.isEven(0)).toBe(true);
        expect(BitUtil.isEven(1)).toBe(false);
    });
});

describe("previous", () => {
    test("should produce current - 1 or max - 1 if 0", () => {
        expect(BitUtil.previous(0, 10)).toBe(9);
        expect(BitUtil.previous(1, 10)).toBe(0);
        expect(BitUtil.previous(2, 10)).toBe(1);
    });
});

describe("next", () => {
    test("should produce current + 1 or 0 if max - 1", () => {
        expect(BitUtil.next(0, 10)).toBe(1);
        expect(BitUtil.next(1, 10)).toBe(2);
        expect(BitUtil.next(9, 10)).toBe(0);
    });
});

describe("isPowerOfTwo", () => {
    test("should return true for positive powers of 2", () => {
        expect(BitUtil.isPowerOfTwo(1)).toBe(true);
        expect(BitUtil.isPowerOfTwo(2)).toBe(true);
        expect(BitUtil.isPowerOfTwo(4)).toBe(true);
        expect(BitUtil.isPowerOfTwo(8)).toBe(true);
        expect(BitUtil.isPowerOfTwo(16)).toBe(true);
        expect(BitUtil.isPowerOfTwo(32)).toBe(true);
        expect(BitUtil.isPowerOfTwo(64)).toBe(true);
        expect(BitUtil.isPowerOfTwo(128)).toBe(true);
        expect(BitUtil.isPowerOfTwo(256)).toBe(true);
        expect(BitUtil.isPowerOfTwo(512)).toBe(true);
        expect(BitUtil.isPowerOfTwo(1024)).toBe(true);
    });

    test("should return false for non-positive numbers", () => {
        expect(BitUtil.isPowerOfTwo(0)).toBe(false);
        expect(BitUtil.isPowerOfTwo(-1)).toBe(false);
        expect(BitUtil.isPowerOfTwo(-2)).toBe(false);
    });

    test("should return false for non-power of 2 numbers", () => {
        expect(BitUtil.isPowerOfTwo(3)).toBe(false);
        expect(BitUtil.isPowerOfTwo(5)).toBe(false);
        expect(BitUtil.isPowerOfTwo(6)).toBe(false);
        expect(BitUtil.isPowerOfTwo(7)).toBe(false);
        expect(BitUtil.isPowerOfTwo(9)).toBe(false);
        expect(BitUtil.isPowerOfTwo(10)).toBe(false);
        expect(BitUtil.isPowerOfTwo(12)).toBe(false);
        expect(BitUtil.isPowerOfTwo(15)).toBe(false);
        expect(BitUtil.isPowerOfTwo(18)).toBe(false);
        expect(BitUtil.isPowerOfTwo(20)).toBe(false);
    });
});

describe("isPowerOfTwoBigInt", () => {
    test("should return true for positive powers of 2", () => {
        expect(BitUtil.isPowerOfTwoBigInt(1n)).toBe(true);
        expect(BitUtil.isPowerOfTwoBigInt(2n)).toBe(true);
        expect(BitUtil.isPowerOfTwoBigInt(4n)).toBe(true);
        expect(BitUtil.isPowerOfTwoBigInt(8n)).toBe(true);
        expect(BitUtil.isPowerOfTwoBigInt(16n)).toBe(true);
        expect(BitUtil.isPowerOfTwoBigInt(32n)).toBe(true);
        expect(BitUtil.isPowerOfTwoBigInt(64n)).toBe(true);
        expect(BitUtil.isPowerOfTwoBigInt(128n)).toBe(true);
        expect(BitUtil.isPowerOfTwoBigInt(256n)).toBe(true);
        expect(BitUtil.isPowerOfTwoBigInt(512n)).toBe(true);
        expect(BitUtil.isPowerOfTwoBigInt(1024n)).toBe(true);
    });

    test("should return false for non-positive numbers", () => {
        expect(BitUtil.isPowerOfTwoBigInt(0n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(-1n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(-2n)).toBe(false);
    });

    test("should return false for non-power of 2 numbers", () => {
        expect(BitUtil.isPowerOfTwoBigInt(3n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(5n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(6n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(7n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(9n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(10n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(12n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(15n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(18n)).toBe(false);
        expect(BitUtil.isPowerOfTwoBigInt(20n)).toBe(false);
    });
});
