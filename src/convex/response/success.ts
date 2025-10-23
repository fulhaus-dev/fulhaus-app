export function SuccessData<T extends object>(data: T) {
	return {
		...data
	};
}

export function SuccessMessage(message: string) {
	return {
		message
	};
}
