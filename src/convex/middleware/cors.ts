import ServerError from '../response/error';

export function checkCors(request: Request) {
	const origin = request.headers.get('Origin');

	const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
	if (!origin || !allowedOrigins.includes(origin))
		throw ServerError.Forbidden('Origin not allowed');

	return origin;
}
