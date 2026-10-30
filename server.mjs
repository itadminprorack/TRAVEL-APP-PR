import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, extname, resolve, sep } from 'node:path';
const base = dirname(fileURLToPath(import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.json': 'application/json' };
const port = Number(process.env.PORT || 5173);
const server = http.createServer(async (request, response) => {
  const path = decodeURIComponent(new URL(request.url ?? '/', `http://localhost:${port}`).pathname);
  const filePath = resolve(base, '.' + (path === '/' ? '/index.html' : path));
  if (!(filePath === base || filePath.startsWith(base + sep))) { response.writeHead(403); return response.end('Forbidden'); }
  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) { response.writeHead(404); return response.end('Not found'); }
    const content = await readFile(filePath);
    response.writeHead(200, { 'Content-Type': types[extname(filePath)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(content);
  } catch { response.writeHead(404); response.end('Not found'); }
});
server.listen(port, '127.0.0.1', () => console.log(`\n  ProRack Move MVP is ready\n  Local: http://localhost:${port}\n  Press Ctrl+C to stop.\n`));
