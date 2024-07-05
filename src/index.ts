import {
	Env
} from './types';

export default {
	async fetch(request, env, ctx): Promise<Response> {

		if (request.method != 'GET') {
			return new Response('Method Not Allowed', {
				status: 405,
				headers: {
				  Allow: 'GET',
				},
			});
		}

		const url = new URL(request.url);
		const pathParts = url.pathname.split('/');
		const parentPath = `${pathParts[1]}/${pathParts[2]}`;

		if (parentPath != 'yt-fts/test_dbs'){
			return new Response('Object Not Found', { 
				status: 404 
			});
		}


		const key = `${pathParts[2]}/${pathParts[3]}`; 
		const object = await env.YT_FTS.get(key);

		if (object === null) {
			return new Response('Object Not Found', { status: 404 });
		}

		const headers = new Headers();
		object.writeHttpMetadata(headers);
		headers.set('etag', object.httpEtag);

		return new Response(object.body, {
			headers,
		});
		
	},
} satisfies ExportedHandler<Env>;
