import Intermediary from "../defs/Intermediary.ts";

// cap.ts
// Cap precision of shown value to a certain # of digits, along with a decimal limit.

const inter: Intermediary<CapIOpts> = function (
	opt,
	data,
	_gradients,
	pipeline,
) {
	// Get data point
	const value = data[opt.fieldName];
	if (value === undefined) return;

	// Run cap
	const res = cap(value as number, opt.maxDigits, opt.maxPresc);

	// Update datafield
	pipeline.datafields.filter((v) => v.fieldName == opt.fieldName).forEach(
		(v) =>
			v.perConfig.image !== undefined
				? v.perConfig.image.presc = res
				: null,
	);
};

function cap(d: number, maxLength: number, maxDecimal: number) {
	// Return n or max precision
	function retn(n: number) {
		return n < maxDecimal ? (n >= 0 ? n : 0) : maxDecimal;
	}

	const decString = d.toString();
	const decimalAt = decString.indexOf(".");
	// No decimal, just trim to length
	if (decimalAt == -1) {
		return retn(maxLength - decString.length);
	}
	// Fractional: Just find length of integer portion
	const integer = decString.substring(0, decimalAt);
	const decMax = maxLength - integer.length;
	return retn(decMax);
}

type CapIOpts = {
	maxDigits: number;
	maxPresc: number;
	fieldName: string;
};

export type { CapIOpts };
export default inter;
