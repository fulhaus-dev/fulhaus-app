import { PUBLIC_CONVEX_URL } from '$env/static/public';
import { ConvexHttpClient } from 'convex/browser';

const convexHttpClient = new ConvexHttpClient(PUBLIC_CONVEX_URL);

export default convexHttpClient;
