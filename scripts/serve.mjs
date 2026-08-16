// Local QA server: serves dist/ the way the production host will (directory
// index, trailing slash, the /checkout/ redirect and the case-alias rewrites)
// and runs api/form.js with a Vercel-shaped req/res so the contact forms can
// be tested end to end before deployment.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const DIST = path.join(ROOT, process.env.DIST_DIR || 'dist');
const PORT = Number(process.env.PORT || 4321);

const redirects = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/redirects.json'), 'utf8'));

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.svg': 'image/svg+xml',
  '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject', '.xml': 'application/xml',
  '.txt': 'text/plain', '.pdf': 'application/pdf',
};

// Cloudflare rewrites mailto links at its edge and decodes them with a script
// it also injects. Replaying the captured HTML locally skips that step, so the
// page would show the literal "[email protected]" placeholder. Decode it here so
// the reference matches what a visitor to the live site actually sees.
function cfDecode(html) {
  const dec = (hex) => {
    const b = Buffer.from(hex, 'hex');
    let s = '';
    for (let i = 1; i < b.length; i++) s += String.fromCharCode(b[i] ^ b[0]);
    return s;
  };
  return html
    .replace(/<a href="\/cdn-cgi\/l\/email-protection"([^>]*?)data-cfemail="([0-9a-f]+)"([^>]*)>[\s\S]*?<\/a>/g,
      (_, pre, hex, post) => `<a href="mailto:${dec(hex)}"${pre}${post}>${dec(hex)}</a>`)
    .replace(/<span[^>]*class="__cf_email__"[^>]*data-cfemail="([0-9a-f]+)"[^>]*>[\s\S]*?<\/span>/g,
      (_, hex) => dec(hex))
    .replace(/href="\/cdn-cgi\/l\/email-protection#([0-9a-f]+)"/g,
      (_, hex) => `href="mailto:${dec(hex)}"`);
}

function vercelRes(res) {
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => {
    res.setHeader('content-type', 'application/json');
    res.end(JSON.stringify(o));
    return res;
  };
  return res;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);

  // production serves these with a trailing slash (vercel.json trailingSlash)
  const apiRoute = pathname.replace(/\/$/, '');
  if (apiRoute === '/api/form' || apiRoute === '/api/order') {
    const mod = apiRoute === '/api/form' ? '../api/form.js' : '../api/order.js';
    const { default: handler } = await import(mod);
    return handler(req, vercelRes(res));
  }

  // /__live/<route> serves the captured live-site HTML for that route with its
  // absolute URLs repointed here, so the original page renders against the same
  // local copies of the assets. Used for the visual comparison when the live
  // host rate-limits automated screenshot traffic.
  if (pathname.startsWith('/__live/')) {
    const route = pathname.slice('/__live'.length);
    const slug = route === '/' ? '__home' : route.replace(/^\/|\/$/g, '').replace(/\//g, '__');
    const file = path.join(ROOT, 'scripts', 'crawl', slug + '.html');
    let html;
    try {
      html = fs.readFileSync(file, 'utf8');
    } catch {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 no capture for ' + slug + '</h1>');
    }
    const origin = 'http://localhost:' + PORT;
    html = cfDecode(html).split('https://thetubepackaging.com').join(origin);
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
    return res.end(html);
  }

  const redirect = redirects.redirects.find((r) => r.source === pathname);
  if (redirect) {
    res.writeHead(redirect.statusCode, { location: redirect.destination });
    return res.end();
  }
  const rewrite = redirects.rewrites.find((r) => r.source === pathname);
  if (rewrite) pathname = rewrite.destination;

  let file = path.join(DIST, pathname);
  if (!path.extname(file)) file = path.join(file, 'index.html');

  fs.readFile(file, (err, buf) => {
    if (err) {
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      return res.end('<h1>404</h1>');
    }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
});

server.listen(PORT, () => console.log('QA server on http://localhost:' + PORT));
