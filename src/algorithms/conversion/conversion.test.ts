import { describe, expect, test } from "vitest";
import { convertDecimal } from "./conversion";

describe("Decimal to binary conversion", () => {
    test("converts a positive number to 8-bit binary", () => {
        const result = convertDecimal("25", 8);

        expect(result.unsigned.valid).toBe(true);
        expect(result.unsigned.binary).toBe("00011001");

        expect(result.signed.valid).toBe(true);
        expect(result.signed.binary).toBe("00011001");
    });

    test("converts a negative number to signed two's complement", () => {
        const result = convertDecimal("-25", 8);

        expect(result.unsigned.valid).toBe(false);

        expect(result.signed.valid).toBe(true);
        expect(result.signed.binary).toBe("11100111");
    });

    test("allows 200 as unsigned but rejects it as signed in 8 bits", () => {
        const result = convertDecimal("200", 8);

        expect(result.unsigned.valid).toBe(true);
        expect(result.unsigned.binary).toBe("11001000");

        expect(result.signed.valid).toBe(false);
    });

    test("handles unsigned 8-bit maximum", () => {
        const result = convertDecimal("255", 8);

        expect(result.unsigned.valid).toBe(true);
        expect(result.unsigned.binary).toBe("11111111");

        expect(result.signed.valid).toBe(false);
    });

    test("handles signed 8-bit maximum", () => {
        const result = convertDecimal("127", 8);

        expect(result.signed.valid).toBe(true);
        expect(result.signed.binary).toBe("01111111");
    });

    test("handles signed 8-bit minimum", () => {
        const result = convertDecimal("-128", 8);

        expect(result.signed.valid).toBe(true);
        expect(result.signed.binary).toBe("10000000");

        expect(result.unsigned.valid).toBe(false);
    });

    test("rejects unsigned overflow", () => {
        const result = convertDecimal("256", 8);

        expect(result.unsigned.valid).toBe(false);
        expect(result.signed.valid).toBe(false);
    });

    test("rejects signed overflow", () => {
        const result = convertDecimal("128", 8);

        expect(result.unsigned.valid).toBe(true);
        expect(result.unsigned.binary).toBe("10000000");

        expect(result.signed.valid).toBe(false);
    });

    test("handles 2-bit boundaries", () => {
        expect(convertDecimal("0", 2).unsigned.binary).toBe("00");
        expect(convertDecimal("1", 2).unsigned.binary).toBe("01");
        expect(convertDecimal("2", 2).unsigned.binary).toBe("10");
        expect(convertDecimal("3", 2).unsigned.binary).toBe("11");

        expect(convertDecimal("0", 2).signed.binary).toBe("00");
        expect(convertDecimal("1", 2).signed.binary).toBe("01");
        expect(convertDecimal("-1", 2).signed.binary).toBe("11");
        expect(convertDecimal("-2", 2).signed.binary).toBe("10");
    });

    test("rejects invalid decimal input", () => {
        expect(() => convertDecimal("", 8)).toThrow();
        expect(() => convertDecimal("12.5", 8)).toThrow();
        expect(() => convertDecimal("abc", 8)).toThrow();
    });

    test("rejects invalid bit sizes", () => {
        expect(() => convertDecimal("10", 0)).toThrow();
        expect(() => convertDecimal("10", 1)).toThrow();
        expect(() => convertDecimal("10", -1)).toThrow();
        expect(() => convertDecimal("10", 2.5)).toThrow();
    });

    test("supports values larger than JavaScript's safe integer range", () => {
        const result = convertDecimal(
            "18446744073709551615",
            64
        );

        expect(result.unsigned.valid).toBe(true);
        expect(result.unsigned.binary).toBe(
            "1111111111111111111111111111111111111111111111111111111111111111"
        );

        expect(result.signed.valid).toBe(false);
    });
});