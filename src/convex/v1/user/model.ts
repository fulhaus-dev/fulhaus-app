import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { vUpdateUserValidator } from './validator';
import { Id } from '../../_generated/dataModel';
import date from '../../util/date';
import workspaceModel from '../workspace/model';
import { WORKSPACE_OWNER_PERMISSIONS } from './permission/constant';
import userPermissionModel from './permission/model';
import { CurrencyCode } from '../../type';
import { internal } from '../../_generated/api';
import workspacePlanModel from '../workspace/plan/model';

async function createUser(ctx: MutationCtx, args: { email: string; currencyCode: CurrencyCode }) {
	const userId = await ctx.db.insert('users', {
		email: args.email.toLowerCase(),
		emailVerifiedAt: date.now(),
		lastLoginAt: date.now(),
		updatedAt: date.now()
	});

	const workspaceId = await workspaceModel.createWorkspace(ctx, {
		name: 'Personal',
		userId,
		currencyCode: args.currencyCode
	});

	await updateUserById(ctx, {
		userId,
		currencyCode: args.currencyCode,
		updates: { currentWorkspaceId: workspaceId }
	});

	await userPermissionModel.create(ctx, {
		userId,
		workspaceId,
		permissions: [...WORKSPACE_OWNER_PERMISSIONS]
	});

	return { userId, workspaceId };
}

async function getUserById(ctx: QueryCtx, userId: Id<'users'>) {
	return await ctx.db.get(userId);
}

async function getUserByEmail(ctx: QueryCtx, email: string) {
	return await ctx.db
		.query('users')
		.withIndex('email', (q) => q.eq('email', email.toLowerCase()))
		.first();
}

async function updateUserById(
	ctx: MutationCtx,
	args: {
		userId: Id<'users'>;
		currencyCode: CurrencyCode;
		updates: Infer<typeof vUpdateUserValidator>;
	}
) {
	const { userId, currencyCode, updates } = args;

	await ctx.db.patch(userId, updates);

	const { email, fullName, phone, whatBroughtYouHere, howDidYouFindUs } = updates;

	await ctx.scheduler.runAfter(0, internal.v1.payment.internal.action.updateStripeCustomer, {
		userId,
		currencyCode,
		updates: {
			email,
			name: fullName,
			phone,
			metadata: {
				whatBroughtYouHere,
				howDidYouFindUs
			}
		}
	});
}

async function migrateUsersToStripe(ctx: MutationCtx) {
	const workspaces = await ctx.db.query('workspaces').collect();

	const workspaceOwnerUserIds = workspaces.map((workspace) => workspace.createdById);

	const users = (
		await Promise.all(
			workspaceOwnerUserIds.map((workspaceOwnerId) => getUserById(ctx, workspaceOwnerId))
		)
	).filter((user) => !!user);

	const stripeUsers = await ctx.db.query('stripeUsers').collect();
	const stripeUserIds = new Set(stripeUsers.map((su) => su.userId));
	const newUsers = users.filter((user) => !stripeUserIds.has(user._id));

	if (newUsers.length > 0) {
		const createStripeCustomerPromises = newUsers
			.map((user) => {
				const currencyCodes = workspaces.find((workspace) => workspace.createdById === user._id)
					?.currencyCodes ?? ['USD'];

				return currencyCodes.map((currencyCode) =>
					ctx.scheduler.runAfter(0, internal.v1.payment.internal.action.createStripeCustomer, {
						userId: user._id,
						currencyCode
					})
				);
			})
			.flat();
		await Promise.all(createStripeCustomerPromises);
	}

	const updateStripeCustomerPromises = users
		.map((user) => {
			const currencyCodes = workspaces.find((workspace) => workspace.createdById === user._id)
				?.currencyCodes ?? ['USD'];

			return currencyCodes.map((currencyCode) =>
				ctx.scheduler.runAfter(0, internal.v1.payment.internal.action.updateStripeCustomer, {
					userId: user._id,
					currencyCode,
					updates: {
						name: user.fullName,
						phone: user.phone,
						metadata: {
							whatBroughtYouHere: user.whatBroughtYouHere,
							howDidYouFindUs: user.howDidYouFindUs
						}
					}
				})
			);
		})
		.flat();
	await Promise.all(updateStripeCustomerPromises);

	const updateStripeCustomerWorkspacePlanPromises = users
		.map((user) => {
			const ownerWorkspace = workspaces.find((workspace) => workspace.createdById === user._id);

			return ownerWorkspace!.currencyCodes.map((currencyCode) =>
				workspacePlanModel.updateStripeUserWorkspacePlan(ctx, {
					userId: user._id,
					currencyCode,
					workspaceId: ownerWorkspace!._id
				})
			);
		})
		.flat();
	await Promise.all(updateStripeCustomerWorkspacePlanPromises);
}

const userModel = {
	createUser,
	getUserById,
	getUserByEmail,
	updateUserById,
	migrateUsersToStripe
};

export default userModel;
