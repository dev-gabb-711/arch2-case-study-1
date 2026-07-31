import { convertDecimal } from "../conversion/conversion"
import { twosComplement } from "../helpers/twosComplement"

export interface DivisionStates {
    A: string,      Q: string, // states shifted left for every loop
    M: string,      M_2: string // constants for A + M or A - M
}

export interface DivisionResult {
    Q?: string, // quotient
    R?: string, // remainder
    error?: string // for givens that cannot be computed successfully
}

function isSameType(a: number|string, b: number|string) {
    return (typeof a === 'number' && typeof b === 'number') || (typeof a === 'string' && typeof b === 'string')
}

export function division(dividend: number|string, divisor: number|string, size: number): DivisionResult {
    const states: Partial<DivisionStates> = {};
    const range = 2 ** (size-1) - 1

    // check if the operands are in the same radix
    if (!isSameType(dividend, divisor)) {
        return {
            error: 'Operands are not in the same radix'
        }
    }

    // if the operands are in decimal
    if (typeof dividend === 'number' && typeof divisor === 'number') {
        // check if the operands is too big
        if (dividend > range || divisor > range) {
            return {
                error: 'Operands too big for data size'
            }
        }

        // convert to binary and store the states
        states.Q = convertDecimal(dividend.toString(), size).unsigned.binary!
        states.A = '0'.repeat(size + 1)
        states.M = '0' + convertDecimal(divisor.toString(), size).unsigned.binary!
        states.M_2 = twosComplement(states.M)
    }

    if (typeof dividend === 'string' && typeof divisor === 'string') {
        // remove leading zeros
        const dividend_reformat = dividend.trim().replace(/^0+/, '') || '0';
        const divisor_reformat = divisor.trim().replace(/^0+/, '') || '0';
        
        // check if the operands is too big
        if (dividend_reformat.length > size || divisor_reformat.length > size) {
            return {
                error: 'Operands too big for data size'
            }
        }

        // reformat binary to have appropriate leading zeros
        states.Q = '0'.repeat(size - dividend_reformat.length) + dividend_reformat
        states.A = '0'.repeat(size + 1)
        states.M = '0'.repeat((size + 1) - dividend_reformat.length) + divisor_reformat
        states.M_2 = twosComplement(states.M)
    }

    for (let i = 0; i < size; i++) {
        let A_temp = states.A!.split('')
        let Q_temp = states.Q!.split('')
        let aux_carry = ''

        // 1. shift [A:Q] to the left
        A_temp.shift()
        aux_carry = Q_temp.shift()!
        A_temp.push(aux_carry)
        Q_temp.push('_')

        states.A = A_temp.join('')
        states.Q = Q_temp.join('')

        // 2. compute the new A state
        if (states.A.charAt(0) === '0') {
            states.A = addition(states.A, states.M_2, states.A.length)
        }
        else {
            states.A = addition(states.A, states.M, states.A.length)
        }

        // 3. fill out A's LSb based on A's sign
        if (states.A.charAt(0) === '0') {
            states.Q = states.Q.replace('_', '1')
        }
        else {
            states.Q = states.Q.replace('_', '0')
        }
    }

    // 4. restore if A is still negative
    if (states.A.charAt(0) === '1') {
        states.A = addition(states.A, states.M, states.A.length)
    }

    return {
        Q: states.Q,
        R: states.A
    }
}