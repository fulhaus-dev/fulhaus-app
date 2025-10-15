import { defineSchema } from 'convex/server';
import { otpTable, sessionTable } from './v1/auth/table';
import { userTable } from './v1/user/table';
import { workspaceTable } from './v1/workspace/table';
import { userPermissionTable } from './v1/user/permission/table';
import { chatUiMessageTable, chatTable, chatUsageTokenTable } from './v1/chat/table';
import { workspaceAssetTable } from './v1/workspace/asset/table';
import { designTable } from './v1/design/table';
import { ludwigChatTempAssetTable } from './v1/ludwig/table';
import { productTable } from './v1/product/table';
import { productVendorTable } from './v1/product/vendor/table';
import { cartItemTable } from './v1/cart/table';
import { designTagTable } from './v1/design/tag/table';

export default defineSchema({
	otps: otpTable,
	sessions: sessionTable,
	workspaces: workspaceTable,
	users: userTable,
	userPermissions: userPermissionTable,
	chats: chatTable,
	chatUiMessages: chatUiMessageTable,
	chatUsageTokens: chatUsageTokenTable,
	workspaceAssets: workspaceAssetTable,
	designs: designTable,
	designTags: designTagTable,
	ludwigChatTempAssets: ludwigChatTempAssetTable,
	productVendors: productVendorTable,
	products: productTable,
	cartItems: cartItemTable
});
