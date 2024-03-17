import { StringBuilder } from "../src/index";

describe("testing StringBuilder file", () => {
    test("empty string should result in zero", () => {
        const sb = new StringBuilder();
        sb.append("");
        expect(sb.toString()).toBe("");
    });
    test("append string should add string to the builder", () => {
        const sb = new StringBuilder();
        sb.append("testing");
        expect(sb.toString()).toBe("testing");
    });
});
