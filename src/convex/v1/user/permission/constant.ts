import { FunctionName } from '../../../type';
import { Permission } from './type';

export const USER_PERMISSION_VALUES = [
	'pending',

	'workspace.owner',
	'workspace.admin',
	'users.admin',
	'designs.admin',
	'billing.admin',

	'users.read',
	'users.invite',
	'users.edit',
	'users.delete',

	'designs.read',
	'designs.create',
	'designs.edit',
	'designs.delete',

	'billing.read',
	'billing.edit'
] as const;

export const WORKSPACE_OWNER_PERMISSIONS: Permission[] = ['workspace.owner'] as const;

export const WORKSPACE_ADMIN_PERMISSIONS: Permission[] = ['workspace.admin'] as const;

export const WORKSPACE_USERS_ADMIN_PERMISSIONS: Permission[] = ['users.admin'] as const;

export const WORKSPACE_DESIGNS_ADMIN_PERMISSIONS: Permission[] = ['designs.admin'] as const;

export const WORKSPACE_BILLING_ADMIN_PERMISSIONS: Permission[] = ['billing.admin'] as const;

export const WORKSPACE_GLOBAL_ACCESS_PERMISSIONS = [
	...WORKSPACE_OWNER_PERMISSIONS,
	...WORKSPACE_ADMIN_PERMISSIONS
] as const;

export const permissionAccess: Record<FunctionName, Permission[]> = {
	createDesign: [
		...WORKSPACE_GLOBAL_ACCESS_PERMISSIONS,
		...WORKSPACE_DESIGNS_ADMIN_PERMISSIONS,
		'designs.create',
		'designs.edit'
	],
	getDesign: [
		...WORKSPACE_GLOBAL_ACCESS_PERMISSIONS,
		...WORKSPACE_DESIGNS_ADMIN_PERMISSIONS,
		'designs.read',
		'designs.create',
		'designs.edit'
	]
};
