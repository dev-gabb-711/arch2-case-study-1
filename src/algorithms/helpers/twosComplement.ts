/**
 * This function complements a given binary to its two's complement
 * @param input the binary to be complemented
 * @returns the two's complement of the binary input
 */
export function twosComplement(input: string): string {
    const n = input.length
    let reversal = false
    const result = input.split('')

    for (let i = n; i > 0; i--) {
        // look for the 1st instance of 1
        if (!reversal && result[i - 1] === '1') {
            reversal = true
        }

        // reverse 1s and 0s when the 1st instance of 1 is found
        else if (reversal && result[i - 1] === '0') {
            result[i - 1] = '1'
        }
        else if (reversal && result[i - 1] === '1') {
            result[i - 1] = '0'
        }
    }
    
    return result.join('')
}