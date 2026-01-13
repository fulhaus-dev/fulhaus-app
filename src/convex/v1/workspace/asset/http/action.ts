import { Infer } from 'convex/values';
import { Id } from '../../../../_generated/dataModel';
import { httpAction } from '../../../../_generated/server';
import httpAuthorization from '../../../../middleware/http/authorization';
import ServerError from '../../../../response/error';
import { vWorkspaceAssetType } from '../validator';
import { r2 } from '../../../../util/r2';
import { internal } from '../../../../_generated/api';

type AssetType = Infer<typeof vWorkspaceAssetType>;

const assetBucketName: Record<AssetType, string> = {
	inspo: process.env.R2_USER_INSPIRATION_IMAGE_BUCKET_NAME!,
	floorplan: process.env.R2_USER_FLOOR_PLAN_IMAGE_BUCKET_NAME!,
	spaceImage: process.env.R2_USER_SPACE_IMAGE_BUCKET_NAME!
};

const assetBucketUrl: Record<AssetType, string> = {
	inspo: process.env.R2_USER_INSPIRATION_IMAGE_BUCKET_URL!,
	floorplan: process.env.R2_USER_FLOOR_PLAN_IMAGE_BUCKET_URL!,
	spaceImage: process.env.R2_USER_SPACE_IMAGE_BUCKET_URL!
};

export const uploadWorkspaceAsset = httpAction(async (ctx, request) => {
	const apiKey = request.headers.get('x-api-key') ?? undefined;
	httpAuthorization.apiKey(apiKey);

	const workspaceId = (request.headers.get('x-api-workspace-id') ?? undefined) as
		| Id<'workspaces'>
		| undefined;
	if (!workspaceId) throw ServerError.BadRequest('Workspace ID not found.');

	const assetType = (request.headers.get('x-asset-type') ?? undefined) as AssetType | undefined;
	if (!assetType) throw ServerError.BadRequest('Asset type is missing.');

	const assetName = (request.headers.get('x-asset-name') ?? undefined) as
		| `${string}.${string}`
		| undefined;
	if (!assetName) throw ServerError.BadRequest('Asset name is missing.');

	const userId = await httpAuthorization.workspaceMemberIsAuthorizedToPerformFunction(
		ctx,
		workspaceId,
		'createDesign'
	);

	const assetBlob = await request.blob();

	const { error, data } = await r2.upload({
		bucketName: assetBucketName[assetType],
		bucketUrl: assetBucketUrl[assetType],
		name: assetName,
		fileNameWithExt: `${workspaceId}-${assetName}`,
		fileBlob: assetBlob
	});

	if (error) throw ServerError.InternalServerError(error.message);

	await ctx.runMutation(internal.v1.workspace.asset.internal.mutation.saveWorkspaceAsset, {
		type: assetType,
		workspaceId,
		createdById: userId,
		url: data.url,
		metadata: data.metadata
	});

	return new Response(JSON.stringify({ url: data.url }), { status: 200 });
});
