import type { CurrencyCode } from '$lib/types';

function toMoney(amount: number, currencyCode: CurrencyCode) {
	const hasDecimals = amount % 1 !== 0;

	const fractionDigits = hasDecimals ? 2 : 0;

	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: currencyCode,
		minimumFractionDigits: fractionDigits,
		maximumFractionDigits: fractionDigits
	}).format(amount);
}

const number = {
	toMoney
};
export default number;
