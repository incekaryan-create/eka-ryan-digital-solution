// Cloudflare Pages Function - serve background music from R2 (same-origin)
// Route: /audio/backsound.mp3  ->  streams object "backsound.mp3" from R2 bucket

export async function onRequest(context) {
  const { request, env } = context;
  const KEY = 'backsound.mp3';

  // Parse a Range header if the browser sends one (needed for seeking/streaming).
  const rangeHeader = request.headers.get('range');
  let range;
  if (rangeHeader) {
    const m = /bytes=(\d*)-(\d*)/.exec(rangeHeader);
    if (m) {
      const start = m[1] ? parseInt(m[1], 10) : 0;
      const end = m[2] ? parseInt(m[2], 10) : undefined;
      range = { offset: start, length: end !== undefined ? end - start + 1 : undefined };
    }
  }

  const object = await env.R2.get(KEY, range ? { range } : undefined);
  if (!object) {
    return new Response('Not Found', { status: 404 });
  }

  const headers = new Headers();
  headers.set('Content-Type', 'audio/mpeg');
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'public, max-age=86400');

  const total = object.size;

  if (range && object.range) {
    const { offset, length } = object.range;
    headers.set('Content-Range', `bytes ${offset}-${offset + length - 1}/${total}`);
    headers.set('Content-Length', String(length));
    return new Response(object.body, { status: 206, headers });
  }

  headers.set('Content-Length', String(total));
  return new Response(object.body, { status: 200, headers });
}
