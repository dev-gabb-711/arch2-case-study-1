import { convertDecimal } from "../conversion/conversion"
import { twosComplement } from "../helpers/twosComplement"
import { addition } from "../helpers/addition"

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
        state_Q = '0'.repeat(size - dividend_reformat.length) + dividend_reformat
        state_M = '0'.repeat((size + 1) - divisor_reformat.length) + divisor_reformat
        
        state_M_2 = twosComplement(state_M)
    }

    states.A = '0'.repeat(size + 1)
    states.Q = state_Q
    states.M = state_M
    states.M_2 = state_M_2

    for (let i = 0; i < size; i++) {
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

        // 2. compute the new A state
        if (states.A.charAt(0) === '0') {
            states.A = addition(states.A, states.M_2)
        }
        else {
            states.A = addition(states.A, states.M)
        }

        // 3. fill out Q's LSb based on A's sign
        if (states.A.charAt(0) === '0') {
            states.Q = states.Q!.replace('_', '1')
        }
        else {
            states.Q = states.Q!.replace('_', '0')
        }
    }

    // 4. restore if A is still negative
    if (states.A.charAt(0) === '1') {
        states.A = addition(states.A, states.M)
    }

    return {
        Q: states.Q,
        R: states.A
    }
}