export async function onRequest(context) {
  const url = new URL(context.request.url);
  if (url.pathname.endsWith('.html') && !url.pathname.endsWith('/index.html')) {
    const rewriteUrl = new URL(url);
    rewriteUrl.pathname = url.pathname.slice(0, -5);
    const assetRes = await context.env.ASSETS.fetch(new Request(rewriteUrl.toString(), context.request));
    if (assetRes.status === 200) {
      const headers = new Headers(assetRes.headers);
      headers.set('X-Robots-Tag', 'index, follow, max-image-preview:large, max-video-preview:-1');
      return new Response(assetRes.body, {
        status: 200,
        statusText: 'OK',
        headers,
      });
    }
  }
  return context.next();
}
