/**
 * This function computes for the sum of two binary numbers
 * @param a the first addend
 * @param b the second addend
 * @returns the sum of the two binaries
 */
export function addition(a: string, b: string): string {
    let i = a.length - 1
    let j = b.length - 1
    let carry = 0
    let result: string[] = []

    while (i >= 0 || j >= 0) {
        // check if theres stil a digit in that place
        let x = i >= 0 ? parseInt(a[i]) : 0
        let y = j >= 0 ? parseInt(b[j]) : 0

        // add the digits together
        let sum = x + y + carry
        result.push((sum % 2).toString())
        carry = sum >= 2 ? 1 : 0

        i--
        j--
    }

    return result.reverse().join('')
}