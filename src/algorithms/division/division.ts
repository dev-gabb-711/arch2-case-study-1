import { convertDecimal } from "../conversion/conversion"
import { twosComplement } from "../helpers/twosComplement"
import { addition } from "../helpers/addition"

export interface DivisionStates {
    A: string,      Q: string, // states shifted left for every loop
    M: string,      M_2: string // constants for A + M or A - M
}

//For the step-by step solution
export interface DivisionStep {
    iteration: number,

    A_before: string,
    Q_before: string,

    A_after_shift: string,
    Q_after_shift: string,

    operation: string,

    A_after_operation: string,
    Q0: string,

    A_final: string,
    Q_final: string
}

export interface DivisionResult {
    Q?: string, // quotient
    R?: string, // remainder

    quotientDecimal?: string,
    remainderDecimal?: string,

    initialStates?: DivisionStates,
    steps?: DivisionStep[],

    restorationPerformed?: boolean,
    A_before_restoration?: string,

    error?: string // for givens that cannot be computed successfully
}

function isSameType(a: number|string, b: number|string) {
    return (typeof a === 'number' && typeof b === 'number') || (typeof a === 'string' && typeof b === 'string')
}

export function division(dividend: number|string, divisor: number|string, size: number): DivisionResult {
    const states: Partial<DivisionStates> = {};

    // check if data size is valid
    if (!Number.isInteger(size) || size < 2) {
        return {
            error: 'Data size must be an integer of at least 2 bits'
        }
    }
    const range = 2 ** size - 1
    let state_Q = ''
    let state_M = ''
    let state_M_2 = ''

    // check if the operands are in the same radix
    if (!isSameType(dividend, divisor)) {
        return {
            error: 'Operands are not in the same radix'
        }
    }

    // if the operands are in decimal
    if (typeof dividend === 'number' && typeof divisor === 'number') {

        // check if the operands are valid whole numbers
        if (
            !Number.isFinite(dividend) ||
            !Number.isFinite(divisor) ||
            !Number.isInteger(dividend) ||
            !Number.isInteger(divisor)
        ) {
            return {
                error: 'Operands must be finite whole numbers'
            }
        }

        // check if decimal operands are within JavaScript's safe integer range
        if (
            !Number.isSafeInteger(dividend) ||
            !Number.isSafeInteger(divisor)
        ) {
            return {
                error: 'Decimal operands exceed JavaScript safe integer range'
            }
        }

        // check if the operands are negative
        if (dividend < 0 || divisor < 0) {
            return {
                error: 'Operands must be non-negative'
            }
        }

        // check for division by zero
        if (divisor === 0) {
            return {
                error: 'Division by zero is not allowed'
            }
        }
        // check if the operands is too big
        if (dividend > range || divisor > range) {
            return {
                error: 'Operands too big for data size'
            }
        }

        // convert to binary and store the states
        state_Q = convertDecimal(dividend.toString(), size).unsigned.binary!
        state_M = '0' + convertDecimal(divisor.toString(), size).unsigned.binary!
        state_M_2 = twosComplement(state_M)
    }

    // if the operands are in binary
    if (typeof dividend === 'string' && typeof divisor === 'string') {
        // remove surrounding spaces
        const dividend_clean = dividend.trim()
        const divisor_clean = divisor.trim()

        // check if either operand is empty
        if (dividend_clean === '' || divisor_clean === '') {
            return {
                error: 'Dividend and divisor are required'
            }
        }

        // check if the operands contain binary digits only
        if (!/^[01]+$/.test(dividend_clean)) {
            return {
                error: 'Dividend must contain binary digits only'
            }
        }

        if (!/^[01]+$/.test(divisor_clean)) {
            return {
                error: 'Divisor must contain binary digits only'
            }
        }

        // remove leading zeros
        const dividend_reformat =
            dividend_clean.replace(/^0+/, '') || '0'

        const divisor_reformat =
            divisor_clean.replace(/^0+/, '') || '0'

        // check for division by zero
        if (divisor_reformat === '0') {
            return {
                error: 'Division by zero is not allowed'
            }
        }

        // check if the operands are too big
        if (
            dividend_reformat.length > size ||
            divisor_reformat.length > size
        ) {
            return {
                error: 'Operands too big for data size'
            }
        }

        // reformat binary to have appropriate leading zeros
        state_Q =
            '0'.repeat(size - dividend_reformat.length) +
            dividend_reformat

        state_M =
            '0'.repeat((size + 1) - divisor_reformat.length) +
            divisor_reformat

        state_M_2 = twosComplement(state_M)
    }

    states.A = '0'.repeat(size + 1)
    states.Q = state_Q
    states.M = state_M
    states.M_2 = state_M_2

    const initialStates: DivisionStates = {
    A: states.A,
    Q: states.Q,
    M: states.M,
    M_2: states.M_2
    }

    const steps: DivisionStep[] = []

    for (let i = 0; i < size; i++) {
        const A_before = states.A
        const Q_before = states.Q
        const A_was_negative = A_before.charAt(0) === '1'
        
        let A_temp: string[] = states.A.split('')
        let Q_temp: string[] = states.Q.split('')
        let aux_carry: string = ''

        // 1. shift [A:Q] to the left
        A_temp.shift()
        aux_carry = Q_temp.shift()!
        A_temp.push(aux_carry)
        Q_temp.push('_')

        states.A = A_temp.join('')
        states.Q = Q_temp.join('')

        const A_after_shift = states.A
        const Q_after_shift = states.Q

        // 2. compute the new A state
        let operation = ''
        if (!A_was_negative) {
            operation = 'A = A - M'
            states.A = addition(states.A, states.M_2)
        }
        else {
            operation = 'A = A + M'
            states.A = addition(states.A, states.M)
        }
        const A_after_operation = states.A

        // 3. fill out Q's LSb based on A's sign
        let Q0 = ''

        if (states.A.charAt(0) === '0') {
            Q0 = '1'
            states.Q = states.Q.replace('_', '1')
        }
        else {
            Q0 = '0'
            states.Q = states.Q.replace('_', '0')
        }

        steps.push({
            iteration: i + 1,

            A_before,
            Q_before,

            A_after_shift,
            Q_after_shift,

            operation,

            A_after_operation,
            Q0,

            A_final: states.A,
            Q_final: states.Q
        })
    }

    let restorationPerformed = false
    let A_before_restoration: string | undefined

    // 4. restore if A is still negative
    if (states.A.charAt(0) === '1') {
        restorationPerformed = true
        A_before_restoration = states.A
        states.A = addition(states.A, states.M)
    }

    const quotientDecimal = BigInt(`0b${states.Q}`).toString()
    const remainderDecimal = BigInt(`0b${states.A}`).toString()

    return {
        Q: states.Q,
        R: states.A,

        quotientDecimal,
        remainderDecimal,

        initialStates,
        steps,

        restorationPerformed,
        A_before_restoration
    }
}