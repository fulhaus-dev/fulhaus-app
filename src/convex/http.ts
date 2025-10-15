import { httpRouter } from 'convex/server';
import { getJwksJson } from './v1/auth/http/action';
import { uploadWorkspaceAsset } from './v1/workspace/asset/http/action';
import { streamLudwigChatResponse } from './v1/ludwig/http/action';
import { httpAction } from './_generated/server';
import { getLudwigProductRecommendationsByCategory } from './v1/product/http/action';
import { checkCors } from './middleware/cors';

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
		const origin = checkCors(request);

		return new Response(null, {
			headers: new Headers({
				'Access-Control-Allow-Origin': origin,
				'Access-Control-Allow-Methods': 'POST',
				'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Workspace-Id',
				'Access-Control-Max-Age': '86400'
			})
		});
	})
});

http.route({
	path: '/product/get-product-recommendations',
	method: 'POST',
	handler: getLudwigProductRecommendationsByCategory
});

export default http;
