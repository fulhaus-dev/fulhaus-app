import { MutationCtx } from '../../../_generated/server';

async function logProductError(
	ctx: MutationCtx,
	args: {
		message: string;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		details?: any[];
	}
) {
	return await ctx.db.insert('productErrorLogs', args);
}

const productErrorModel = {
	logProductError
};

export default productErrorModel;
