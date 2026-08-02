import { describe, expect, test } from "vitest"
import { multiplication } from "./multiplication"

describe("Signed Booth Multiplication", () => {

    describe("normal decimal multiplication", () => {

        test("multiplies two positive numbers", () => {
            const result = multiplication(27, 7, 7)

            expect(result.error).toBeUndefined()
            expect(result.productDecimal).toBe("189")
            expect(result.Product).toHaveLength(14)
        })

        test("positive × negative", () => {
            const result = multiplication(7, -3, 4)

            expect(result.error).toBeUndefined()
            expect(result.productDecimal).toBe("-21")
        })

        test("negative × positive", () => {
            const result = multiplication(-5, 6, 4)

            expect(result.error).toBeUndefined()
            expect(result.productDecimal).toBe("-30")
        })

        test("negative × negative", () => {
            const result = multiplication(-6, -3, 4)

            expect(result.error).toBeUndefined()
            expect(result.productDecimal).toBe("18")
        })

        test("multiplies by zero", () => {
            const result = multiplication(0, -7, 4)

            expect(result.error).toBeUndefined()
            expect(result.productDecimal).toBe("0")
        })

        test("multiplies by one", () => {
            const result = multiplication(1, -7, 4)

            expect(result.error).toBeUndefined()
            expect(result.productDecimal).toBe("-7")
        })

    })

    describe("binary operand support", () => {

        test("accepts signed binary operands", () => {
            const result = multiplication(
                "0111",
                "1101",
                4
            )

            expect(result.error).toBeUndefined()
            expect(result.productDecimal).toBe("-21")
        })

        test("allows surrounding spaces", () => {
            const result = multiplication(
                " 0111 ",
                " 1101 ",
                4
            )

            expect(result.error).toBeUndefined()
            expect(result.productDecimal).toBe("-21")
        })

    })

    describe("range checking", () => {

        test("handles signed 4-bit limits", () => {

            expect(
                multiplication(7,7,4).productDecimal
            ).toBe("49")

            expect(
                multiplication(-8,7,4).productDecimal
            ).toBe("-56")

            expect(
                multiplication(-8,-8,4).productDecimal
            ).toBe("64")

        })

        test("rejects operand exceeding size", () => {

            expect(
                multiplication(8,2,4).error
            ).toBeDefined()

            expect(
                multiplication(-9,2,4).error
            ).toBeDefined()

        })

    })

    describe("input validation", () => {

        test("rejects empty operands", () => {

            expect(
                multiplication("", "0011", 4).error
            ).toBe("Multiplicand and multiplier are required")

            expect(
                multiplication("0011", "", 4).error
            ).toBe("Multiplicand and multiplier are required")

        })

        test("rejects invalid multiplicand", () => {

            expect(
                multiplication("1021","0011",4).error
            ).toBe("Multiplicand must contain binary digits only")

        })

        test("rejects invalid multiplier", () => {

            expect(
                multiplication("0011","abcd",4).error
            ).toBe("Multiplier must contain binary digits only")

        })

        test("rejects decimal fractions", () => {

            expect(
                multiplication(2.5,3,4).error
            ).toBe("Operands must be finite whole numbers")

        })

        test("rejects NaN", () => {

            expect(
                multiplication(Number.NaN,3,4).error
            ).toBe("Operands must be finite whole numbers")

        })

        test("rejects mixed radix", () => {

            expect(
                multiplication(7,"0111",4).error
            ).toBe("Operands are not in the same radix")

        })

        test("rejects invalid data size", () => {

            expect(
                multiplication(7,7,1).error
            ).toBe("Data size must be an integer of at least 2 bits")

        })

    })

    describe("step recording", () => {

        test("stores initial registers", () => {

            const result = multiplication(7,-3,4)

            expect(result.initialStates).toBeDefined()

            expect(result.initialStates?.A).toHaveLength(4)
            expect(result.initialStates?.Q).toHaveLength(4)
            expect(result.initialStates?.M).toHaveLength(4)
            expect(result.initialStates?.M_2).toHaveLength(4)

        })

        test("creates one step per bit", () => {

            expect(
                multiplication(7,-3,4).steps
            ).toHaveLength(4)

            expect(
                multiplication(27,7,7).steps
            ).toHaveLength(7)

        })

        test("numbers iterations correctly", () => {

            const result = multiplication(7,-3,4)

            expect(
                result.steps?.map(s=>s.iteration)
            ).toEqual([1,2,3,4])

        })

        test("records all registers", () => {

            const result = multiplication(7,-3,4)

            for(const step of result.steps ?? []){

                expect(step.A_before).toMatch(/^[01]+$/)
                expect(step.Q_before).toMatch(/^[01]+$/)
                expect(step.Q_1_before).toMatch(/^[01]$/)

                expect(step.pair).toMatch(/^[01]{2}$/)

                expect([
                    "A = A + M",
                    "A = A - M",
                    "No Operation"
                ]).toContain(step.operation)

                expect(step.A_after_operation).toMatch(/^[01]+$/)

                expect(step.A_final).toMatch(/^[01]+$/)
                expect(step.Q_final).toMatch(/^[01]+$/)
                expect(step.Q_1_final).toMatch(/^[01]$/)

            }

        })

    })

    describe("mathematical correctness", () => {

        test("matches JavaScript multiplication for every signed 4-bit pair", () => {

            const size = 4

            for(let a=-8;a<=7;a++){

                for(let b=-8;b<=7;b++){

                    const result = multiplication(a,b,size)

                    expect(
                        result.error,
                        `${a} × ${b}`
                    ).toBeUndefined()

                    expect(
                        result.productDecimal,
                        `${a} × ${b}`
                    ).toBe((a*b).toString())

                    expect(result.steps).toHaveLength(size)

                }

            }

        })

    })

})