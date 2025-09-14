import { PutObjectCommand } from '@aws-sdk/client-s3';
import { imageSize } from 'image-size';
import { r2Client } from '../config/cloudflare';
import { vAssetMetadata } from '../v1/workspace/asset/validator';
import { Infer } from 'convex/values';
import { asyncTryCatch } from './async';

async function upload({
	bucketName,
	name,
	fileNameWithExt,
	fileBlob,
	bucketUrl
}: {
	bucketName: string;
	name: string;
	fileNameWithExt: `${string}.${string}`;
	fileBlob: Blob;
	bucketUrl: string;
}) {
	const fileMime = fileBlob.type;

	const fileArrayBuffer = await fileBlob.arrayBuffer();
	const fileBytes = new Uint8Array(fileArrayBuffer);

	const command = new PutObjectCommand({
		Bucket: bucketName,
		Key: fileNameWithExt,
		Body: fileBytes,
		ContentType: fileMime
	});

	const { error } = await asyncTryCatch(() => r2Client.send(command));
	if (error) return { error };

	const fileUrl = `${bucketUrl}/${fileNameWithExt}`;

	const fileSize = fileBlob.size;
	let fileMetadata: Infer<typeof vAssetMetadata> = {
		image: false,
		name: name.split('.')[0],
		description: '',
		key: fileNameWithExt,
		mime: fileMime,
		size: fileSize
	};

	const isImageFile = fileMime.startsWith('image/');
	if (isImageFile) {
		const imageFileSize = imageSize(fileBytes);

		fileMetadata = {
			...fileMetadata,
			image: true,
			height: imageFileSize.width,
			width: imageFileSize.height
		};
	}

	return { data: { url: fileUrl, metadata: fileMetadata } };
}

export const r2 = {
	upload
};
