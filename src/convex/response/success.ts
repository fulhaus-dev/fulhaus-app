import { httpStatusCode } from '../constant';

export function SuccessData<T extends object>(data: T) {
	return {
		statusCode: httpStatusCode.OK,
		data
	};
}

export function SuccessMessage(message: string) {
	return {
		statusCode: httpStatusCode.OK,
		data: { message }
	};
}
