import { convertDecimal } from "../conversion/conversion"
import { twosComplement } from "../helpers/twosComplement"
import { addition } from "../helpers/addition"

export interface MultiplicationStates {
    A: string
    Q: string
    Q_1: string

    M: string
    M_2: string
}

export interface MultiplicationStep {
    iteration: number

    A_before: string
    Q_before: string
    Q_1_before: string

    pair: string          

    operation: string

    A_after_operation: string

    A_final: string
    Q_final: string
    Q_1_final: string
}

export interface MultiplicationResult {
    Product?: string
    productDecimal?: string

    initialStates?: MultiplicationStates
    steps?: MultiplicationStep[]

    error?: string
}

function isSameType(a: number | string, b: number | string) {
    return (
        (typeof a === "number" && typeof b === "number") ||
        (typeof a === "string" && typeof b === "string")
    )
}

export function multiplication(
    multiplicand: number | string,
    multiplier: number | string,
    size: number
): MultiplicationResult {

    const states: Partial<MultiplicationStates> = {}

    // check if data size is valid
    if (!Number.isInteger(size) || size < 2) {
        return {
            error: "Data size must be an integer of at least 2 bits"
        }
    }

   const signedMin = -(2 ** (size - 1))
  const signedMax = (2 ** (size - 1)) - 1

    let state_Q = ""
    let state_M = ""
    let state_M_2 = ""

    // check if operands are in the same radix
    if (!isSameType(multiplicand, multiplier)) {
        return {
            error: "Operands are not in the same radix"
        }
    }

    // decimal operands
    if (typeof multiplicand === "number" && typeof multiplier === "number") {

        if (
            !Number.isFinite(multiplicand) ||
            !Number.isFinite(multiplier) ||
            !Number.isInteger(multiplicand) ||
            !Number.isInteger(multiplier)
        ) {
            return {
                error: "Operands must be finite whole numbers"
            }
        }

        if (
            !Number.isSafeInteger(multiplicand) ||
            !Number.isSafeInteger(multiplier)
        ) {
            return {
                error: "Decimal operands exceed JavaScript safe integer range"
            }
        }

    

       if (
    multiplicand < signedMin ||
    multiplicand > signedMax ||
    multiplier < signedMin ||
    multiplier > signedMax
) {
    return {
        error: "Operands too big for signed data size"
    }
}

state_M =
            convertDecimal(
                multiplicand.toString(),
                size
            ).signed.binary!

        state_Q =
            convertDecimal(
                multiplier.toString(),
                size
            ).signed.binary!
            
        state_M_2 = twosComplement(state_M)
    }

    // binary operands
    if (typeof multiplicand === "string" && typeof multiplier === "string") {

        const multiplicand_clean = multiplicand.trim()
        const multiplier_clean = multiplier.trim()

        if (
            multiplicand_clean === "" ||
            multiplier_clean === ""
        ) {
            return {
                error: "Multiplicand and multiplier are required"
            }
        }

        if (!/^[01]+$/.test(multiplicand_clean)) {
            return {
                error: "Multiplicand must contain binary digits only"
            }
        }

        if (!/^[01]+$/.test(multiplier_clean)) {
            return {
                error: "Multiplier must contain binary digits only"
            }
        }

        if (
            multiplicand_clean.length > size ||
            multiplier_clean.length > size
        ) {
            return {
                error: "Operands too big for data size"
            }
        }


        const sign_M = multiplicand_clean.charAt(0)
        const sign_Q = multiplier_clean.charAt(0)

        state_M =
            sign_M.repeat(size - multiplicand_clean.length) +
            multiplicand_clean

        state_Q =
            sign_Q.repeat(size - multiplier_clean.length) +
            multiplier_clean

        state_M_2 = twosComplement(state_M)
    }
states.A = "0".repeat(size)
    states.Q = state_Q
    states.Q_1 = "0"

    states.M = state_M
    states.M_2 = state_M_2

    const initialStates: MultiplicationStates = {
        A: states.A!,
        Q: states.Q!,
        Q_1: states.Q_1!,
        M: states.M!,
        M_2: states.M_2!
    }

   
    let internal_A = "0".repeat(size + 1)
    const internal_M = state_M.charAt(0) + state_M
    const internal_M_2 = twosComplement(internal_M)

    const steps: MultiplicationStep[] = []
    for (let i = 0; i < size; i++) {

        // Slice back to original size for the test outputs
        const A_before = internal_A.slice(-size)
        const Q_before = states.Q!
        const Q_1_before = states.Q_1!
        let operation = "No Operation"
        
        const pair =
            states.Q!.charAt(size - 1) +
            states.Q_1!

        if (pair === "01") {
            operation = "A = A + M"
            // Use internal size+1 variables for addition
            internal_A = addition(internal_A, internal_M).slice(-(size + 1))
        }
        else if (pair === "10") {
            operation = "A = A - M"
            internal_A = addition(internal_A, internal_M_2).slice(-(size + 1))
        }
    
        const A_after_operation = internal_A.slice(-size)

        // Arithmetic Right Shift using the extended internal variables
        const combined: string =
            internal_A +
            states.Q! +
            states.Q_1!

        const sign: string = combined.charAt(0)

        const shifted: string =
            sign +
            combined.substring(0, combined.length - 1)
            
        // Re-assign shifted parts
        internal_A = shifted.substring(0, size + 1)
        states.Q = shifted.substring(size + 1, size * 2 + 1)
        states.Q_1 = shifted.substring(size * 2 + 1)

        const A_final = internal_A.slice(-size)
        const Q_final = states.Q!
        const Q_1_final = states.Q_1!

        steps.push({
            iteration: i + 1,

            A_before,
            Q_before,
            Q_1_before,

            pair,

            operation,

            A_after_operation,

            A_final,
            Q_final,
            Q_1_final
        })
    }

    // Recombine sliced A and Q to match the original size behavior
    const product =
        internal_A.slice(-size) +
        states.Q!

    let productDecimal = ""

    if (product.charAt(0) === "0") {
        productDecimal = BigInt("0b" + product).toString()
    }
    else {
        const magnitude = twosComplement(product)
        productDecimal = (-BigInt("0b" + magnitude)).toString()
    }

    return {
        Product: product,
        productDecimal,
        initialStates,
        steps
    }
}