import Compressor from 'compressorjs';

type ImageCompression = {
	imageFile: File;
	quality?: number;
	maxWidth?: number;
	maxHeight?: number;
};

function compressImageFile({
	imageFile,
	quality = 0.8,
	maxWidth = 1920,
	maxHeight = 1080
}: ImageCompression): Promise<File | undefined> {
	if (!imageFile.type.startsWith('image/')) return Promise.resolve(undefined);

	return new Promise((resolve) => {
		new Compressor(imageFile, {
			quality,
			maxWidth,
			maxHeight,
			mimeType: 'image/jpeg', // Convert to JPEG for better compression
			success(result) {
				// Convert Blob to File
				const compressedFile = new File(
					[result],
					imageFile.name.replace(/\.\w+$/, '.jpg'), // Change extension to .jpg
					{ type: 'image/jpeg' }
				);
				resolve(compressedFile);
			},
			error() {
				resolve(undefined);
			}
		});
	});
}

const compressor = {
	compressImageFile
};
export default compressor;
