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
import { stripeUserTable } from './v1/user/stripe/table';
import { productEmbeddingTable } from './v1/product/embedding/table';
import { productErrorLogTable } from './v1/product/error/table';
import { productCategoryStatisticTable } from './v1/product/statistics/table';
import { workspacePlanTable } from './v1/workspace/plan/table';
import { designLogTable } from './v1/design/log/table';
import { orderItemTable } from './v1/order/table';

export default defineSchema({
	otps: otpTable,
	sessions: sessionTable,
	workspaces: workspaceTable,
	users: userTable,
	stripeUsers: stripeUserTable,
	userPermissions: userPermissionTable,
	chats: chatTable,
	chatUiMessages: chatUiMessageTable,
	chatUsageTokens: chatUsageTokenTable,
	workspaceAssets: workspaceAssetTable,
	workspacePlans: workspacePlanTable,
	designs: designTable,
	designTags: designTagTable,
	designLogs: designLogTable,
	ludwigChatTempAssets: ludwigChatTempAssetTable,
	productVendors: productVendorTable,
	products: productTable,
	productEmbeddings: productEmbeddingTable,
	productErrorLogs: productErrorLogTable,
	productCategoryStatistics: productCategoryStatisticTable,
	cartItems: cartItemTable,
	orderItems: orderItemTable
});
