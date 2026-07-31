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
    const result: Partial<DivisionResult> = {};
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
        states.Q = '0'.repeat(size - dividend_reformat.length + 1) + dividend_reformat
        states.A = '0'.repeat(size + 1)
        states.M = '0'.repeat(size - dividend_reformat.length + 2) + divisor_reformat
        states.M_2 = twosComplement(states.M)
    }

    /*
        main algo
            1. shift [A:Q] to the left
                A_msb is discarded
                Q_msb will transfer to A_lsb
                Q will have missing lsb '_'
            2. if (A is +) A = A - M
                else A = A + M
            3. if (A is +) Q_lsb = 1
                else Q_lsb = 0
            ------ repeat from 1 by divisor.unsigned.binary.length() ------
            4. if (A is -) A = A + M

        assign the ff to DivisionResult:
            Q = Q
            R = A
        and return

        prerequisites: twosComplement.ts, addition.ts, toDecimal.ts
    */

    return {}
}