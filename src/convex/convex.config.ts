import { defineApp } from 'convex/server';
import rateLimiter from '@convex-dev/rate-limiter/convex.config';
import aggregate from '@convex-dev/aggregate/convex.config';

const app = defineApp();
app.use(rateLimiter);
app.use(aggregate, { name: 'productCategoryAggregate' });

export default app;
