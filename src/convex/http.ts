import { httpRouter } from 'convex/server';
import { getJwksJson } from './v1/auth/http/action';
import { uploadWorkspaceAsset } from './v1/workspace/asset/http/action';
import { streamLudwigChatResponse } from './v1/ludwig/http/action';
import { httpAction } from './_generated/server';

const http = httpRouter();

http.route({
	path: '/.well-known/jwks.json',
	method: 'GET',
	handler: getJwksJson
});

http.route({
	path: '/workspace/upload-asset',
	method: 'POST',
	handler: uploadWorkspaceAsset
});

http.route({
	path: '/ludwig/stream-chat',
	method: 'POST',
	handler: streamLudwigChatResponse
});

http.route({
	path: '/ludwig/stream-chat',
	method: 'OPTIONS',
	handler: httpAction(async (_, request) => {
		const origin = request.headers.get('Origin');

		// Log what the browser is sending vs what your env var is
		console.log(`Received Origin: ${origin}`);
		console.log(`Comparing against APP_URL: ${process.env.APP_URL}`);

		if (origin !== process.env.APP_URL) return new Response(null, { status: 204 });

		return new Response(null, {
			headers: new Headers({
				'Access-Control-Allow-Origin': process.env.APP_URL!,
				'Access-Control-Allow-Methods': 'POST',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Workspace-Id',
				'Access-Control-Max-Age': '86400'
			})
		});
	})
});

export default http;
