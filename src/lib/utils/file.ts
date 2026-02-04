export function sanitizeFilename(name: string) {
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
