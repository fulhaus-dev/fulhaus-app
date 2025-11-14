import { setCurrencyCodeCookie } from '$lib/server/app-currency.js';
import { json } from '@sveltejs/kit';

const VALID_CURRENCY_CODES = ['USD', 'CAD'];

export async function POST({ request, cookies }) {
	const { currencyCode } = await request.json();

	let validCurrencyCode = currencyCode;

	if (!VALID_CURRENCY_CODES.includes(validCurrencyCode)) validCurrencyCode = 'USD';

	setCurrencyCodeCookie(cookies, validCurrencyCode);

	return json({ success: true });
}
