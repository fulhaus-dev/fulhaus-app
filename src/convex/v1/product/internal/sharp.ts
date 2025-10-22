'use node';

import { v } from 'convex/values';
import { internalAction } from '../../../_generated/server';
import { replicate } from '../../../config/replicate';
import { r2 } from '../../../util/r2';
import { internal } from '../../../_generated/api';
// import { Jimp } from 'jimp';
import sharp from 'sharp';
import { Id } from '../../../_generated/dataModel';

export const updateProductMainImageNoBgUrls = internalAction({
	args: {
		productsImageMetadata: v.array(
			v.object({
				productId: v.id('products'),
				imageUrl: v.string()
			})
		)
	},
	handler: async (ctx, { productsImageMetadata }) => {
		const outputs = await Promise.all(
			productsImageMetadata.map((metadata) =>
				replicate.run(process.env.REMOVE_BG_MODEL as `${string}/${string}`, {
					input: {
						image: metadata.imageUrl
					}
				})
			)
		);

		const productsMainImageNoBgUrlMetadata = await Promise.all(
			outputs.map((output, index) => uploadToR2(output, productsImageMetadata[index].productId))
		);

		const productsNoBgImageMetadata = productsMainImageNoBgUrlMetadata.filter(
			(metadata) => !!metadata.mainImageNoBgUrl
		) as {
			productId: Id<'products'>;
			mainImageNoBgUrl: string;
		}[];

		await ctx.runMutation(internal.v1.product.internal.mutation.updateProductMainImageNoBgUrls, {
			productsNoBgImageMetadata
		});
	}
});

async function uploadToR2(replicateOutput: object, productId: Id<'products'>) {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const outputBlob = (await (replicateOutput as any).blob()) as Blob;
	const outputBuffer = await outputBlob.arrayBuffer();

	const trimmed = await sharp(outputBuffer).trim().toBuffer();
	const { width, height } = await sharp(trimmed).metadata();

	let resizeOptions = width >= height ? { width } : { height };

	if (width > 1080 || height > 1080)
		resizeOptions = width >= height ? { width: 1080 } : { height: 1080 };

	const pngBuffer = await sharp(trimmed)
		.resize(resizeOptions)
		.png({
			palette: true,
			colours: 256,
			compressionLevel: 9,
			dither: 1.0
		})
		.toBuffer();

	// const image = await Jimp.read(outputBuffer);
	// image.autocrop();

	// const { width, height } = image;

	// let resizeOptions = width >= height ? { w: width } : { h: height };

	// if (width > 1080 || height > 1080) resizeOptions = width >= height ? { w: 1080 } : { h: 1080 };

	// image.resize(resizeOptions);

	// const pngBuffer = await image.getBuffer('image/png');

	const resultUint8Array = new Uint8Array(pngBuffer);
	const resultBlob = new Blob([resultUint8Array], { type: 'image/png' });

	const fileName = `nbgi-${productId}`;

	const { data: uploadData } = await r2.upload({
		bucketName: process.env.R2_PRODUCT_NBG_IMAGES_BUCKET_NAME!,
		name: fileName,
		fileNameWithExt: `${fileName}.png`,
		fileBlob: resultBlob,
		bucketUrl: process.env.R2_PRODUCT_NBG_IMAGES_BUCKET_URL!
	});

	const mainImageNoBgUrl = uploadData?.url;

	return {
		productId,
		mainImageNoBgUrl
	};
}
