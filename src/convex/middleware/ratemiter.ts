// import RateLimiter, { HOUR, MINUTE } from '@convex-dev/rate-limiter';
// import { components } from '../_generated/api';

// export const rateLimiter = new RateLimiter(components.rateLimiter, {
// 	// Per-user rate limiting for general requests
// 	userRequests: {
// 		kind: 'token bucket',
// 		rate: 1000,
// 		period: HOUR,
// 		capacity: 50,
// 		shards: 10
// 	},
// 	// Per-user burst protection
// 	userBurst: {
// 		kind: 'fixed window',
// 		rate: 30,
// 		period: MINUTE,
// 		shards: 5
// 	},
// 	// Global fallback for edge cases
// 	globalFallback: {
// 		kind: 'fixed window',
// 		rate: 10000,
// 		period: HOUR,
// 		shards: 20
// 	}
// });
