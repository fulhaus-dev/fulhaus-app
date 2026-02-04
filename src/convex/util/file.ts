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

function sanitizeFilename(name: string) {
	// keep extension, sanitize base
	const parts = name.split('.');
	const ext = parts.length > 1 ? '.' + parts.pop() : '';
	const base = parts.join('.');

	const cleanBase = base
		.normalize('NFKC')
		.replace(/[\u202F\u00A0]/g, ' ') // special spaces -> normal
		.replace(/[^\x20-\x7E]/g, '') // drop non-ascii
		.trim()
		.replace(/\s+/g, '-') // spaces -> dash
		.replace(/[^a-zA-Z0-9._-]/g, '_'); // remaining unsafe -> underscore

	return `${cleanBase || 'file'}${ext || ''}`;
}

const file = {
	base64ToUint8Array,
	base64ToBlob,
	sanitizeFilename
};
export default file;
