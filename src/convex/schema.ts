import { defineSchema } from 'convex/server';
import { otpTable, sessionTable } from './v1/auth/table';
import { userTable } from './v1/user/table';
import { workspaceTable } from './v1/workspace/table';
import { userPermissionTable } from './v1/user/permission/table';
import { chatMessageTable, chatResponseStreamTable, chatTable } from './v1/chat/table';
import { workspaceAssetTable } from './v1/workspace/asset/table';
import { projectTable } from './v1/project/table';
import { designTable } from './v1/design/table';
import { ludwigChatTempAssetTable } from './v1/ludwig/table';
import { designProductTable } from './v1/design/product/table';
import { productTable } from './v1/product/table';
import { productVendorTable } from './v1/product/vendor/table';

export default defineSchema({
	otps: otpTable,
	sessions: sessionTable,
	workspaces: workspaceTable,
	users: userTable,
	userPermissions: userPermissionTable,
	chats: chatTable,
	chatMessages: chatMessageTable,
	chatResponseStreams: chatResponseStreamTable,
	workspaceAssets: workspaceAssetTable,
	projects: projectTable,
	designs: designTable,
	ludwigChatTempAssets: ludwigChatTempAssetTable,
	designProducts: designProductTable,
	productVendors: productVendorTable,
	products: productTable
});
