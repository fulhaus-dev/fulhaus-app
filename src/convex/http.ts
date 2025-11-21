import { httpRouter } from 'convex/server';
import { getJwksJson } from './v1/auth/http/action';
import { uploadWorkspaceAsset } from './v1/workspace/asset/http/action';
import { streamLudwigChatResponse } from './v1/ludwig/http/action';
import { httpAction } from './_generated/server';
import { getLudwigProductRecommendationsByCategory } from './v1/product/http/action';
import { checkCors } from './middleware/cors';
import { internal } from './_generated/api';
import { PaymentMetadata } from './v1/payment/type';

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

		const reqHeaders = request.headers.get('Access-Control-Request-Headers') ?? '';

		return new Response(null, {
			headers: new Headers({
				'Access-Control-Allow-Origin': origin,
				'Access-Control-Allow-Methods': 'POST',
				'Access-Control-Allow-Headers': reqHeaders,
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

http.route({
	path: `/stripe-webhook/${process.env.STRIPE_WEBHOOK_KEY}/CAD/stripe/payment/successful`,
	method: 'POST',
	handler: httpAction(async (ctx, request) => {
		const { data } = await request.json();
		const paymentData = data?.object;

		let paymentMetadata = paymentData?.metadata as PaymentMetadata;

		if (Object.keys(paymentMetadata).length < 1)
			paymentMetadata = paymentData?.parent?.subscription_details?.metadata as PaymentMetadata;

		const stripeSubscriptionId = paymentData?.parent?.subscription_details?.subscription;

		if (paymentMetadata.type === 'cart')
			await ctx.scheduler.runAfter(0, internal.v1.order.internal.action.createOrder, {
				paymentData,
				paymentMetadata
			});

		if (paymentMetadata.type === 'credits')
			await ctx.scheduler.runAfter(0, internal.v1.workspace.plan.internal.action.updatePlan, {
				paymentData,
				paymentMetadata,
				stripeSubscriptionId
			});

		return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
	})
});

export default http;
