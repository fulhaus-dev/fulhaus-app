function base64ToUint8Array(base64: string) {
	const base64String = base64.split(',')[1] || base64;
	const binaryString = atob(base64String);

	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}

	return bytes;
}

function base64ToBlob(base64: string) {
	const base64Bytes = base64ToUint8Array(base64);

	return new Blob([base64Bytes]);
}

const file = {
	base64ToUint8Array,
	base64ToBlob
};
export default file;
