import { v, type Validator } from 'convex/values';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function vReturnedSuccessData<T extends Validator<any, any, any>>(dataValidator: T) {
	return dataValidator;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function vReturnedSuccessMessage() {
	return v.object({
		message: v.string()
	});
}
