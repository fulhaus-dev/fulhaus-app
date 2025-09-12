import { httpAction } from '../../../_generated/server';

export const getJwksJson = httpAction(async () => {
	const jwks = {
		keys: [
			{
				kty: 'RSA',
				use: 'sig',
				alg: 'RS256',
				kid: process.env.AUTH_JWT_KEY_ID!,
				n: process.env.AUTH_JWT_PUBLIC_KEY_N!,
				e: process.env.AUTH_JWT_PUBLIC_KEY_E!
			}
		]
	};

	return new Response(JSON.stringify(jwks), {
		status: 200,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'public, max-age=3600'
		}
	});
});
