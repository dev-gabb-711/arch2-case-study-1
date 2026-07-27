export interface ConversionResult {
	input: string;
	bitSize: number;

	unsigned: {
		valid: boolean;
		binary?: string;
		error?: string;
	};

	signed: {
		valid: boolean;
		binary?: string;
		error?: string;
	}
}

export function convertDecimal(decimalInput: string, bitSize: number): ConversionResult {
	// Validate bit size
	if (!Number.isInteger(bitSize) || bitSize < 2) {
		throw new Error("Bit size must be an integer of at least 2 bits");
	}

	// Validate decimal input
	const trimmedInput = decimalInput.trim();

	// Only allow an optional leading minus sign followed by digits (using regex)
    if (!/^-?\d+$/.test(trimmedInput)) {
        throw new Error("Input must be a valid decimal integer.");
    }

	let value: bigint;

	try {
		value = BigInt(trimmedInput)
	} 
	catch {
		throw new Error("Input could not be converted into integer");
	}

	// Calculate valid ranges
	const bits = BigInt(bitSize);

	// Unsigned: 0 to 2^n - 1
	const unsignedMin = 0n;
	const unsignedMax = (2n ** bits) - 1n;

	// Signed Two's Complement: -2^(n-1) to 2^(n-1) - 1
	const signedMin = -(2n ** (bits - 1n));
	const signedMax = (2n ** (bits - 1n)) - 1n;

	// Unsigned Representation
	let unsignedResult: ConversionResult["unsigned"];

	if (value < unsignedMin || value > unsignedMax) {
		unsignedResult = {
			valid: false,
			error:
				`Value ${value} is outside the unsigned ${bitSize}-bit range` + `(${unsignedMin} to ${unsignedMax})`
		};
	}
	else {
		const binary = value.toString(2).padStart(bitSize, "0");

		unsignedResult = {
			valid: true, 
			binary,
		};
	}

	// Signed Two's Complement Representation
	let signedResult: ConversionResult["signed"];

	if (value < signedMin || value > signedMax) {
		signedResult = {
			valid: false,
			error:
				`Value ${value} is outside the signed ${bitSize}-bit range ` +
				`(${signedMin} to ${signedMax}).`,
		};
	}
	else {
		let signedValue = value;

		// For negative values, convert to equivalent unsigned value within n bits
		if (signedValue < 0n) {
			signedValue += 2n ** bits;
		}

		const binary = signedValue.toString(2).padStart(bitSize, "0");

		signedResult = {
			valid: true,
			binary,
		};
	}

	// Return complete result
	return {
		input: trimmedInput,
		bitSize,
		unsigned: unsignedResult,
		signed: signedResult,
	};
}