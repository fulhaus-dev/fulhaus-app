import { clearAuthCookies } from '$lib/server/authenticate';

export const POST = async ({ cookies }) => {
	clearAuthCookies(cookies);

	return new Response(JSON.stringify({ message: 'Auth cookies cleared successfully' }), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
};
