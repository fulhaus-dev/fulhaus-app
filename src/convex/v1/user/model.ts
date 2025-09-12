import { MutationCtx, QueryCtx } from '../../_generated/server';
import { Infer } from 'convex/values';
import { vUpdateUserValidator } from './validator';
import { Id } from '../../_generated/dataModel';
import date from '../../util/date';
import workspaceModel from '../workspace/model';
import { WORKSPACE_OWNER_PERMISSIONS } from './permission/constant';
import userPermissionModel from './permission/model';

async function createUser(ctx: MutationCtx, email: string) {
	const userId = await ctx.db.insert('users', {
		email: email.toLowerCase(),
		emailVerifiedAt: date.now(),
		lastLoginAt: date.now(),
		createdAt: date.now(),
		updatedAt: date.now()
	});

	const workspaceId = await workspaceModel.createWorkspace(ctx, {
		name: 'Personal',
		userId
	});

	await updateUserById(ctx, { userId, updates: { currentWorkspaceId: workspaceId } });

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
	{ userId, updates }: { userId: Id<'users'>; updates: Infer<typeof vUpdateUserValidator> }
) {
	return await ctx.db.patch(userId, updates);
}

const userModel = {
	createUser,
	getUserById,
	getUserByEmail,
	updateUserById
};

export default userModel;
