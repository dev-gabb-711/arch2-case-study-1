import type { ConversionResult } from "../conversion/conversion";

export interface DivisionStates {
    A: string,      Q: string, // states shifted left for every loop
    M: string,      M_2: string // constants for A + M or A - M
}

export interface DivisionResult {
    Q?: string, // quotient
    R?: string, // remainder
    error?: string // for givens that cannot be computed successfully
}

export function division(dividend: number|string, divisor: number|string, size: number): DivisionResult {
    /*
        before doing algo, check if:
            both dividend and divisor are unsigned
            the divisor is NOT 0

        if check is triggered, return error only in DivisionResult
    */
    
    /*
        after initial edge case test, if the givens are decimals, convert to binary
    */

    /*
        then initialize the ff states:
            A = 0s with length divisor.unsigned.binary.length() + 1
            Q = divisior.unsigned.binary
            M = dividened.unsigned.binary
            M_2 = 2's complement of M
    */

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
            4. if (A is +) A = A + M

        assign the ff to DivisionResult:
            Q = Q
            R = A
        and return

        prerequisites: twosComplement.ts, addition.ts
    */

    return {}
}