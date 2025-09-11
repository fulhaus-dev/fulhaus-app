import { importPKCS8, SignJWT } from 'jose';
import { Id } from './_generated/dataModel';

export default {
	providers: [
		{
			type: 'customJwt',
			applicationID: process.env.APP_ID,
			issuer: process.env.APP_URL,
			jwks: `${process.env.CONVEX_SITE_URL}/.well-known/jwks.json`,
			algorithm: 'RS256'
		}
	]
};

class AuthJWTManager {
	private privateKey: CryptoKey | null = null;
	private readonly issuer: string;
	private readonly audience: string;
	private readonly algorithm = 'RS256';

	constructor() {
		this.issuer = process.env.APP_URL!;
		this.audience = process.env.APP_ID!;
	}

	async initialize() {
		if (!process.env.AUTH_JWT_PRIVATE_KEY)
			throw new Error('AUTH_JWT_PRIVATE_KEY environment variable is required');

		this.privateKey = await importPKCS8(
			process.env.AUTH_JWT_PRIVATE_KEY.replace(/\\n/g, '\n'),
			this.algorithm
		);
	}

	async generateToken(userId: Id<'users'>) {
		if (!this.privateKey) await this.initialize();

		const now = Math.floor(Date.now() / 1000);
		const tokenExpInMinutes = Number(process.env.AUTH_TOKEN_EXP_IN_MINUTES ?? '60');
		const payload = {
			sub: `user:${userId}`,
			iss: this.issuer,
			aud: this.audience,
			exp: now + tokenExpInMinutes * 60,
			iat: now,
			userId
		};

		const token = await new SignJWT(payload)
			.setProtectedHeader({
				alg: this.algorithm,
				typ: 'JWT',
				kid: process.env.AUTH_JWT_KEY_ID!
			})
			.sign(this.privateKey!);

		return { token, tokenExpInMinutes };
	}
}
export const authJwtManager = new AuthJWTManager();
