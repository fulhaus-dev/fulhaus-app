import { defineSchema } from 'convex/server';
import { otpTable, sessionTable } from './v1/auth/table';
import { userTable } from './v1/user/table';
import { workspaceTable } from './v1/workspace/table';
import { userPermissionTable } from './v1/user/permission/table';

export default defineSchema({
	otps: otpTable,
	sessions: sessionTable,
	workspaces: workspaceTable,
	users: userTable,
	userPermissions: userPermissionTable
});
