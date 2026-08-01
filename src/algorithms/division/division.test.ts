import { describe, expect, test } from "vitest"
import { division } from "./division"

describe("Unsigned Non-Restoring Division", () => {
    describe("normal decimal division", () => {
        test("divides 12 by 3 exactly", () => {
            const result = division(12, 3, 8)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("00000100")
            expect(result.R).toBe("000000000")

            expect(result.quotientDecimal).toBe("4")
            expect(result.remainderDecimal).toBe("0")
        })

        test("divides 13 by 3 with a remainder", () => {
            const result = division(13, 3, 8)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("00000100")
            expect(result.R).toBe("000000001")

            expect(result.quotientDecimal).toBe("4")
            expect(result.remainderDecimal).toBe("1")
        })

        test("divides 25 by 4 with a remainder", () => {
            const result = division(25, 4, 8)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("00000110")
            expect(result.R).toBe("000000001")

            expect(result.quotientDecimal).toBe("6")
            expect(result.remainderDecimal).toBe("1")
        })

        test("handles a dividend smaller than the divisor", () => {
            const result = division(3, 5, 8)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("00000000")
            expect(result.R).toBe("000000011")

            expect(result.quotientDecimal).toBe("0")
            expect(result.remainderDecimal).toBe("3")
        })

        test("handles equal dividend and divisor", () => {
            const result = division(7, 7, 8)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("00000001")
            expect(result.R).toBe("000000000")

            expect(result.quotientDecimal).toBe("1")
            expect(result.remainderDecimal).toBe("0")
        })

        test("handles a zero dividend", () => {
            const result = division(0, 5, 8)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("00000000")
            expect(result.R).toBe("000000000")

            expect(result.quotientDecimal).toBe("0")
            expect(result.remainderDecimal).toBe("0")
        })

        test("handles division by one", () => {
            const result = division(11, 1, 8)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("00001011")
            expect(result.R).toBe("000000000")

            expect(result.quotientDecimal).toBe("11")
            expect(result.remainderDecimal).toBe("0")
        })
    })

    describe("binary operand support", () => {
        test("accepts binary operands", () => {
            const result = division("1101", "0011", 8)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("00000100")
            expect(result.R).toBe("000000001")

            expect(result.quotientDecimal).toBe("4")
            expect(result.remainderDecimal).toBe("1")
        })

        test("removes unnecessary leading zeroes from binary operands", () => {
            const result = division("00001101", "00000011", 8)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("00000100")
            expect(result.R).toBe("000000001")
        })

        test("allows surrounding spaces in binary operands", () => {
            const result = division("  1101  ", "  0011  ", 8)

            expect(result.error).toBeUndefined()

            expect(result.quotientDecimal).toBe("4")
            expect(result.remainderDecimal).toBe("1")
        })
    })

    describe("unsigned range boundaries", () => {
        test("handles the maximum unsigned 8-bit dividend", () => {
            const result = division(255, 15, 8)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("00010001")
            expect(result.R).toBe("000000000")

            expect(result.quotientDecimal).toBe("17")
            expect(result.remainderDecimal).toBe("0")
        })

        test("handles the maximum unsigned 4-bit operand", () => {
            const result = division(15, 3, 4)

            expect(result.error).toBeUndefined()

            expect(result.Q).toBe("0101")
            expect(result.R).toBe("00000")

            expect(result.quotientDecimal).toBe("5")
            expect(result.remainderDecimal).toBe("0")
        })

        test("rejects a decimal operand exceeding the selected size", () => {
            const result = division(256, 2, 8)

            expect(result.error).toBe("Operands too big for data size")
            expect(result.Q).toBeUndefined()
            expect(result.R).toBeUndefined()
        })

        test("rejects a binary operand exceeding the selected size", () => {
            const result = division("10000", "0010", 4)

            expect(result.error).toBe("Operands too big for data size")
            expect(result.Q).toBeUndefined()
            expect(result.R).toBeUndefined()
        })
    })

    describe("input validation and error handling", () => {
        test("rejects decimal division by zero", () => {
            const result = division(13, 0, 8)

            expect(result.error).toBe("Division by zero is not allowed")
            expect(result.Q).toBeUndefined()
            expect(result.R).toBeUndefined()
        })

        test("rejects binary division by zero", () => {
            const result = division("1101", "0000", 8)

            expect(result.error).toBe("Division by zero is not allowed")
            expect(result.Q).toBeUndefined()
            expect(result.R).toBeUndefined()
        })

        test("rejects empty binary operands", () => {
            expect(
                division("", "0011", 8).error
            ).toBe("Dividend and divisor are required")

            expect(
                division("1101", "", 8).error
            ).toBe("Dividend and divisor are required")

            expect(
                division("   ", "0011", 8).error
            ).toBe("Dividend and divisor are required")
        })

        test("rejects invalid binary dividends", () => {
            expect(
                division("1021", "0011", 8).error
            ).toBe("Dividend must contain binary digits only")

            expect(
                division("hello", "0011", 8).error
            ).toBe("Dividend must contain binary digits only")
        })

        test("rejects invalid binary divisors", () => {
            expect(
                division("1101", "0012", 8).error
            ).toBe("Divisor must contain binary digits only")

            expect(
                division("1101", "abc", 8).error
            ).toBe("Divisor must contain binary digits only")
        })

        test("rejects negative decimal operands", () => {
            expect(
                division(-13, 3, 8).error
            ).toBe("Operands must be non-negative")

            expect(
                division(13, -3, 8).error
            ).toBe("Operands must be non-negative")
        })

        test("rejects decimal fractions", () => {
            expect(
                division(12.5, 3, 8).error
            ).toBe("Operands must be finite whole numbers")

            expect(
                division(12, 3.5, 8).error
            ).toBe("Operands must be finite whole numbers")
        })

        test("rejects NaN and infinite operands", () => {
            expect(
                division(Number.NaN, 3, 8).error
            ).toBe("Operands must be finite whole numbers")

            expect(
                division(Number.POSITIVE_INFINITY, 3, 8).error
            ).toBe("Operands must be finite whole numbers")

            expect(
                division(12, Number.NEGATIVE_INFINITY, 8).error
            ).toBe("Operands must be finite whole numbers")
        })

        test("rejects decimal operands outside JavaScript's safe integer range", () => {
            const unsafeValue = Number.MAX_SAFE_INTEGER + 1

            expect(
                division(unsafeValue, 3, 64).error
            ).toBe(
                "Decimal operands exceed JavaScript safe integer range"
            )
        })

        test("rejects operands with different input types", () => {
            expect(
                division(13, "0011", 8).error
            ).toBe("Operands are not in the same radix")

            expect(
                division("1101", 3, 8).error
            ).toBe("Operands are not in the same radix")
        })

        test("rejects invalid data sizes", () => {
            expect(
                division(10, 2, 0).error
            ).toBe("Data size must be an integer of at least 2 bits")

            expect(
                division(10, 2, 1).error
            ).toBe("Data size must be an integer of at least 2 bits")

            expect(
                division(10, 2, -1).error
            ).toBe("Data size must be an integer of at least 2 bits")

            expect(
                division(10, 2, 2.5).error
            ).toBe("Data size must be an integer of at least 2 bits")

            expect(
                division(10, 2, Number.NaN).error
            ).toBe("Data size must be an integer of at least 2 bits")
        })
    })

    describe("step-by-step process", () => {
        test("stores the correct initial register states", () => {
            const result = division(12, 3, 8)

            expect(result.initialStates).toEqual({
                A: "000000000",
                Q: "00001100",
                M: "000000011",
                M_2: "111111101"
            })
        })

        test("produces exactly one iteration per selected bit", () => {
            expect(division(12, 3, 8).steps).toHaveLength(8)
            expect(division(13, 3, 4).steps).toHaveLength(4)
            expect(division(25, 4, 16).steps).toHaveLength(16)
        })

        test("numbers every iteration in the correct order", () => {
            const result = division(12, 3, 8)

            const iterationNumbers = result.steps?.map(
                (step) => step.iteration
            )

            expect(iterationNumbers).toEqual([
                1, 2, 3, 4, 5, 6, 7, 8
            ])
        })

        test("records all required states for every iteration", () => {
            const result = division(12, 3, 8)

            expect(result.error).toBeUndefined()
            expect(result.steps).toBeDefined()

            for (const step of result.steps ?? []) {
                expect(step.A_before).toMatch(/^[01]{9}$/)
                expect(step.Q_before).toMatch(/^[01]{8}$/)

                expect(step.A_after_shift).toMatch(/^[01]{9}$/)
                expect(step.Q_after_shift).toMatch(/^[01]{7}_$/)

                expect([
                    "A = A - M",
                    "A = A + M"
                ]).toContain(step.operation)

                expect(step.A_after_operation).toMatch(/^[01]{9}$/)
                expect(["0", "1"]).toContain(step.Q0)

                expect(step.A_final).toMatch(/^[01]{9}$/)
                expect(step.Q_final).toMatch(/^[01]{8}$/)
            }
        })

        test("records final restoration when A remains negative", () => {
            const result = division(12, 3, 8)

            expect(result.restorationPerformed).toBe(true)
            expect(result.A_before_restoration).toBe("111111101")
            expect(result.R).toBe("000000000")
        })

        test("keeps the final result consistent with the recorded last step", () => {
            const result = division(13, 3, 8)

            const lastStep = result.steps?.at(-1)

            expect(lastStep).toBeDefined()
            expect(lastStep?.Q_final).toBe(result.Q)
        })
    })

    describe("mathematical correctness", () => {
        test("satisfies dividend = divisor × quotient + remainder", () => {
            const testCases = [
                [12, 3],
                [13, 3],
                [25, 4],
                [3, 5],
                [7, 7],
                [0, 5],
                [11, 1],
                [255, 15]
            ]

            for (const [dividend, divisor] of testCases) {
                const result = division(dividend, divisor, 8)

                expect(result.error).toBeUndefined()

                const quotient = BigInt(result.quotientDecimal!)
                const remainder = BigInt(result.remainderDecimal!)

                expect(
                    BigInt(divisor) * quotient + remainder
                ).toBe(BigInt(dividend))

                expect(remainder).toBeGreaterThanOrEqual(0n)
                expect(remainder).toBeLessThan(BigInt(divisor))
            }
        })

        test("matches JavaScript division for every valid 4-bit operand pair", () => {
            const size = 4

            for (let dividend = 0; dividend <= 15; dividend++) {
                for (let divisor = 1; divisor <= 15; divisor++) {
                    const result = division(
                        dividend,
                        divisor,
                        size
                    )

                    expect(
                        result.error,
                        `Unexpected error for ${dividend} / ${divisor}`
                    ).toBeUndefined()

                    expect(
                        result.quotientDecimal,
                        `Incorrect quotient for ${dividend} / ${divisor}`
                    ).toBe(
                        Math.floor(dividend / divisor).toString()
                    )

                    expect(
                        result.remainderDecimal,
                        `Incorrect remainder for ${dividend} / ${divisor}`
                    ).toBe(
                        (dividend % divisor).toString()
                    )

                    expect(result.steps).toHaveLength(size)
                }
            }
        })
    })
})