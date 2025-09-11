import { httpRouter } from 'convex/server';
import { getJwksJson } from './v1/auth/httpAction';

const http = httpRouter();

http.route({
	path: '/.well-known/jwks.json',
	method: 'GET',
	handler: getJwksJson
});

export default http;
