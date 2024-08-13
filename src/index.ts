import { Env } from './types';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: getCorsHeaders(),
      });
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', {
        status: 405,
        headers: getCorsHeaders()
      });
    }

    const url = new URL(request.url);
    const pathParts = url.pathname.split('/');
    const parentPath = `${pathParts[1]}/${pathParts[2]}`;

    if (parentPath !== 'yt-fts/test_dbs') {
      return new Response('Object Not Found', { 
        status: 404,
        headers: getCorsHeaders()
      });
    }

    const key = `${pathParts[2]}/${pathParts[3]}`; 
    const object = await env.YT_FTS.get(key);

    if (object === null) {
      return new Response('Object Not Found', { 
        status: 404,
        headers: getCorsHeaders()
      });
    }

    const headers = new Headers(getCorsHeaders());
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);

    return new Response(object.body, {
      headers,
    });
  },
} satisfies ExportedHandler<Env>;

function getCorsHeaders(): HeadersInit {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}